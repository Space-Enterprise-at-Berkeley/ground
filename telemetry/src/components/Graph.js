import React, { Component } from 'react';
import { WebglPlot, WebglLine, ColorRGBA } from 'webgl-plot';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, CardContent } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  button: {
    float: 'right',
    minWidth: '0px',
    zIndex: 1000
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  sizeDetector: {
    position: 'relative',
    width: '100%',
    height: '90%'
  },
  legend: {

  },
  scaleContainer: {
    height: '100%'
  }
});

const anchor = Date.now();

class Graph extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.sizeDetectorRef = React.createRef();
    this.legendRefs = this.props.fields.map(f => React.createRef());
    this.webglp = null;
    this.animationID = null;
    this.window = 30 * 1000; // 30 seconds
    this.numFields = this.props.fields.length;

    this.values = [];
    this.lengths = [];
    this.buffer = [];
    this.bufferIdx = [];
    this.lines = [];
    this.lastUpdate = Date.now();
    this.subscribers = [];

    this.createUpdateHandler = this.createUpdateHandler.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.updateGraphWait = this.updateGraphWait.bind(this);
  }

  createUpdateHandler(index) {
    return (timestamp, value) => {
      const buff = this.buffer[index];
      let buffIdx = this.bufferIdx[index];
      if(buffIdx > 0 && timestamp - anchor - buff[buffIdx-2] < 24) return;
      buff[buffIdx] = timestamp - anchor;
      buffIdx ++;
      buff[buffIdx] = value;
      buffIdx++;
      this.bufferIdx[index] = buffIdx;
    }
  }

  updateGraphWait() {
    this.animationID = requestAnimationFrame(this.updateGraph);
  }

  updateGraph() {
    const now = Date.now() - anchor;
    const cutoff = now - this.window;
    let minValue = Number.MAX_VALUE;
    let maxValue = -Number.MAX_VALUE;

    for(let f = 0; f < this.numFields; f++) {
      const vArray = this.values[f];
      let vLen = this.lengths[f];
      let cutIndex = 0;
      for(let i = 0; i < vLen; i+=2) {
        if(vArray[i] >= cutoff) {
          cutIndex = i;
          break;
        }
      }
      if(cutIndex > 0) {
        vArray.copyWithin(0, cutIndex, vLen);
        vLen -= cutIndex;
      }

      const buff = this.buffer[f];
      let buffIdx = this.bufferIdx[f];
      if(buffIdx > 0) {
        vArray.set(buff, vLen);
        vLen += buffIdx;
        this.bufferIdx[f] = 0;
        this.legendRefs[f].current.innerHTML = `(${vArray[vLen-1].toFixed(this.props.fields[f].precision || 1)}`;
      }

      for(let i = 0; i < vLen; i+=2) {
        const value = vArray[i+1];
        minValue = (value < minValue) ? value : minValue;
        maxValue = (value > maxValue) ? value : maxValue;
      }
      this.lengths[f] = vLen;
    }

    if(maxValue - minValue < 0.2){
      maxValue += 0.1
      minValue -= 0.1
    }

    for(let f = 0; f < this.lines.length; f++) {
      const l = this.lines[f];
      l.scaleY = 2.0 / (maxValue - minValue);
      l.offsetY = -minValue * l.scaleY - 1;
      l.offsetX = -(cutoff / (this.window / 2)) - 1;
      // console.log(l.offsetX + " : " + cutoff);
      // l.offsetX = -1;
      const len = this.lengths[f] / 2;
      l.numPoints = len;
      l.webglNumPoints = len;
    }
    this.animationID = requestAnimationFrame(this.updateGraphWait);

    this.webglp.update();
  }

  componentDidMount() {
    const width = this.sizeDetectorRef.current.clientWidth;
    const height = this.sizeDetectorRef.current.clientHeight;
    this.canvasRef.current.width = width * window.devicePixelRatio;
    this.canvasRef.current.height = height * window.devicePixelRatio;

    this.webglp = new WebglPlot(this.canvasRef.current);

    for(let i = 0; i < this.numFields; i++) {
      const field = this.props.fields[i];
      const fArray = new Float32Array(this.window);
      this.values.push(fArray);
      this.lengths.push(2);
      this.buffer.push(new Float32Array(20));
      this.bufferIdx.push(0);

      const newLine = new WebglLine(new ColorRGBA(...field.color.map(c => c / 256), 1), 0);
      newLine.xy = fArray;
      newLine.offsetX = -1;
      newLine.scaleX = 2.0/this.window;
      this.lines.push(newLine);
      this.webglp.addLine(newLine);
      const subscriber = this.createUpdateHandler(i);
      this.subscribers.push(subscriber);
      comms.addSubscriber(field.name, subscriber);
    }

    this.updateGraph();
  }

  componentWillUnmount() {
    for(let i = 0; i < this.numFields; i++) {
      const field = this.props.fields[i];
      comms.removeSubscriber(field.name, this.subscribers[i]);
    }
    cancelAnimationFrame(this.animationID);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <table className={classes.legend}>
            <tbody>
              <tr>
                {
                  this.props.fields.map((f, i) => (
                    <React.Fragment key={i}>
                      <td style={{backgroundColor: `rgb(${f.color[0]},${f.color[1]},${f.color[2]})`, width: '30px', height: '100%'}}/>
                      <td style={{fontSize: '0.75rem'}}>
                        {f.name}
                      </td>
                      <td ref={this.legendRefs[i]} style={{fontSize: '0.75rem'}}>
                        (0.0
                      </td>
                      <td style={{width: '2.5rem', fontSize: '0.75rem'}}>{f.unit})</td>
                    </React.Fragment>
                  ))
                }
              </tr>
            </tbody>
          </table>
          <div ref={this.sizeDetectorRef} className={classes.sizeDetector}>
            <canvas ref={this.canvasRef} className={classes.canvas}/>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(Graph));
