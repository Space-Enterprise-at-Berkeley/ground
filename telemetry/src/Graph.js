import React, { Component } from 'react';
import moment from 'moment';

import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
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
  },
  button: {
    float: 'right',
    minWidth: '0px',
    zIndex: 1000
  },
  canvas: {
    position: 'absolute'
  }
});

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldScale: false,
      showSettings: false,
      window: this.props.defaultWindow
    };
    this.canvas = React.createRef();
    this.lastUpdate = Date.now();
  }
  makeListener = (sensor, i) => {
    let values = [];
    return (data, timestamp) => {
      const buffer = this.chart.data.datasets[i].data;
      let newValue = data[sensor.index];
      if(buffer.length > 0) {
        if(timestamp.diff(buffer[0].x, 'seconds', true) > this.state.window) {
          buffer.shift();
        }
      } else {
        buffer.push({
          x: timestamp,
          y: newValue
        });
      }
      // console.log(newValue);
      if(isNaN(newValue)) {
        return;
      }
      if(values.length >= 4) {
        values = [];
        values.push(newValue);
        buffer.push({
          x: timestamp,
          y: newValue
        });
      } else {
        values.push(newValue);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const ave = values.reduce((prev, curr) => prev + curr) / values.length;
        // console.log(min);
        if(ave - min > max - ave) {
          // use min
          buffer[buffer.length-1].y = min;
        } else {
          // use max
          buffer[buffer.length-1].y = max;
        }
        buffer[buffer.length-1].x = timestamp;
      }
      this.chart.options.scales.xAxes[0].ticks.min = buffer[buffer.length-1].x.clone().subtract(this.state.window, 'seconds');
      this.chart.options.scales.xAxes[0].ticks.max = buffer[buffer.length-1].x;

      const latest = (Math.round(newValue * 10) / 10).toString().split('.');
      if(!latest[1]) {
        latest[1] = '0';
      }
      this.chart.data.datasets[i].label = `${sensor.label} (${latest[0]}.${latest[1]} ${sensor.unit})`;
      // console.log(buffer);
      if(Date.now() - this.lastUpdate > 100.0) {
        this.chart.update();
        this.lastUpdate = Date.now();
      }
    }
  }
  componentDidMount() {
    this.webglp = new WebGLPlot(this.canvas.current);
    const numX = 1000;

    const line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
    webglp.addLine(line);

    line.lineSpaceX(-1, 2 / numX);

    requestAnimationFrame()

    this.props.sensors.forEach((v, i) => {
      this.props.addSensorListener(v.idx, this.makeListener(v, i));
    });
  }
  // componentDidUpdate(prevProps, prevState) {
  //   // update graph colors
  //   this.chart.options.legend.labels.fontColor = this.props.theme.palette.text.primary;
  //   this.chart.options.scales.yAxes[0].ticks.fontColor = this.props.theme.palette.text.secondary;
  //   this.chart.options.scales.yAxes[0].gridLines.color = this.props.theme.palette.action.selected;
  //   this.chart.options.scales.yAxes[0].gridLines.zeroLineColor = this.props.theme.palette.action.disabledBackground;

  //   this.chart.options.scales.yAxes[0].ticks.suggestedMin = (this.state.shouldScale?0:undefined);
  //   this.chart.options.scales.yAxes[0].ticks.suggestedMax = (this.state.shouldScale?this.props.max:undefined);

  //   this.chart.options.scales.xAxes[0].ticks.min = moment(this.chart.options.scales.xAxes[0].ticks.max).clone().subtract(this.state.window, 'seconds');
  // }
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Button className={classes.button} size='small' disableElevation onClick={e => this.setState({showSettings: true})}>
            <SettingsIcon/>
          </Button>
          <canvas ref={this.canvas} className={classes.canvas}/>
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

export default withTheme(withStyles(styles)(Graph));
