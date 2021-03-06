import React, { Component } from 'react';
import moment from 'moment';

import WebGLPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';

import SettingsIcon from '@material-ui/icons/Settings';

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

  }
});

class NewGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldScale: false,
      showSettings: false,
      window: this.props.defaultWindow
    };
    this.legendRefs = this.props.sensors.map(s => React.createRef());

    this.canvas = React.createRef();
    this.sizeDetector = React.createRef();
    this.lastUpdate = Date.now();

    console.log("constructing graph");
  }

  componentDidMount() {
    const width = this.sizeDetector.current.clientWidth;
    const height = this.sizeDetector.current.clientHeight;
    this.canvas.current.width = width * window.devicePixelRatio;
    this.canvas.current.height = height * window.devicePixelRatio;

    this.webglp = new WebGLPlot(this.canvas.current);

    const lines = []; // new WebglLine(new ColorRGBA(1, 0, 0, 1), 0);
    // line.offsetX = 0.5;
    // this.webglp.addLine(line);

    let buffer = [];

    let values = [];
    let yValues = [];
    let moments = [];

    this.props.sensors.forEach((v, i) => {
      buffer.push([]);
      values.push([]);
      yValues.push([]);
      moments.push([]);
      lines.push(new WebglLine(new ColorRGBA(...v.color.map(c => c / 256), 1), 0));
      lines[i].offsetX = -1;
      this.webglp.addLine(lines[i]);
      this.props.addSensorListener(v.idx, (data, timestamp) => {
        if(isNaN(data[v.index])) return;
        this.legendRefs[i].current.innerHTML = `(${Math.floor(data[v.index])}.${Math.round((data[v.index] * 10) % 10)}`;
        buffer[i].push([timestamp, data[v.index]]);
      });
    });
    let lastUpdate = null;
    
    const renderPlot = () => {
      const now = moment();
      for(let s = 0; s < buffer.length; s++) {
        for(let i = 0; i < moments[s].length; i++) {
          if(now.diff(moments[s][i], 'seconds', true) > this.state.window) {
            moments[s].splice(i, 1);
            values[s].splice(i*2, 2);
            yValues[s].splice(i, 1);
            i--;
          } else {
            break;
          }
        }

        const diff = now.diff(lastUpdate || now, 'seconds', true);
        for(let i = 0; i < values[s].length / 2; i++) {
          values[s][i*2] = (values[s][i*2] - diff);
        }
        if(buffer[s].length > 0) {
          buffer[s].forEach(v => {
            moments[s].push(v[0]);
            yValues[s].push(v[1]);
            values[s].push(this.state.window - now.diff(v[0], 'seconds', true));
            values[s].push(v[1]);
          });
          buffer[s] = [];
        }
      }
      lastUpdate = now;
      
      const minValue = Math.min.apply(null, yValues.map(v => Math.min.apply(null, v)));
      const maxValue = Math.max.apply(null, yValues.map(v => Math.max.apply(null, v)));
      lines.forEach((l, i) => {
        l.scaleY = 2.0 / (maxValue - minValue);
        l.offsetY = -minValue * l.scaleY - 1 || 0;
        l.scaleX = 2.0/this.state.window;
        l.numPoints = values[i].length/2;
        l.webglNumPoints = values[i].length/2;
        l.xy = Float32Array.from(values[i]);
      });
      this.animationId = requestAnimationFrame(renderPlot);
      
      this.webglp.update();
    }
    cancelAnimationFrame(this.animationId);
    this.animationId = requestAnimationFrame(renderPlot);


  }
  componentWillUnmount() {
    console.log('unmount');
    window.removeEventListener('resize', this.resizer);
    cancelAnimationFrame(this.animationId);
  }
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Button className={classes.button} size='small' disableElevation onClick={e => this.setState({showSettings: true})}>
            <SettingsIcon/>
          </Button>
          <table className={classes.legend}>
            <tbody>
              <tr>
                {
                  this.props.sensors.map((s, i) => (
                    <>
                      <td style={{backgroundColor: `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`, width: '30px', height: '100%'}}/>
                      <td style={{fontSize: '0.75rem'}}>
                        {s.label}
                      </td>
                      <td ref={this.legendRefs[i]} style={{fontSize: '0.75rem'}}>
                        (0.0
                      </td>
                      <td style={{width: '2.5rem', fontSize: '0.75rem'}}>{s.unit})</td>
                    </>
                  ))
                }
              </tr>
            </tbody>
          </table>
          <div ref={this.sizeDetector} className={classes.sizeDetector}>
            <canvas ref={this.canvas} className={classes.canvas}/>
          </div>
          <Dialog open={this.state.showSettings} onClose={() => this.setState({showSettings: false})} disablePortal fullWidth>
          <DialogTitle>Graph settings for {this.props.title}</DialogTitle>
            <DialogContent>
              <FormGroup>
                <Typography>
                  Display static scales
                </Typography>
                <Switch onChange={e => this.setState({shouldScale: e.target.checked})} checked={this.state.shouldScale}/>
                <Typography>
                  Time interval
                </Typography>
                <Slider step={1} min={1} max={300} valueLabelDisplay="auto" value={this.state.window} onChange={(e, v) => this.setState({window: v})}/>
              </FormGroup>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(NewGraph));
