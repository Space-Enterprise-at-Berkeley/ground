import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  themeButton: {
    marginLeft: theme.spacing(2)
  },
  select: {
    marginLeft: theme.spacing(2)
  },
  connectedButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  disconnectedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  display: {
    paddingTop: theme.spacing(0.8),
    paddingBottom: theme.spacing(0.8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandwidth: 0,
      time: 0,
      recordingFilled: true,
      name: '',
      dbName: '',
      voltage: 0,
      current: 0
    };
    this.recordingInterval = null;
  }
  componentDidMount() {
    this.setState({dbName: this.props.selectedDb?this.props.selectedDb:''});
    this.props.addBandwidthListener(bandwidth => {
      this.setState({
        bandwidth
      });
    });
    this.props.addSensorListener(this.props.battID, (data, timestamp) => {
      this.setState({
        voltage: data[0],
        current: data[2]
      });
    });
  }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log('update')
  //   if(prevProps.recording !== this.props.recording) {
  //     if(this.props.recording) {
  //       this.recordingInterval = setInterval(() => {
  //         console.log('here')
  //         this.setState({recordingFilled: !this.state.recordingFilled});
  //       }, 1000);
  //     } else {
  //       clearInterval(this.recordingInterval);
  //       this.recordingInterval = null;
  //       this.setState({recordingFilled: true});
  //     }
  //   }
  // }
  render() {
    const { classes } = this.props;
    return (
      <AppBar position='static' color='default'>
        <Toolbar>
          <div className={classes.grow}></div>
          <Button className={classes.display}>
            {this.state.voltage} V
          </Button>
          <Button className={classes.display}>
            {this.state.current} A
          </Button>
          <TextField label='database name' value={this.state.dbName} onChange={e => this.setState({dbName: e.target.value})} disabled={this.props.selectedDb}/>
          <Button color='primary' variant='contained' disableElevation onClick={e => this.props.selectDb(this.state.dbName)} disabled={this.props.selectedDb}>
            Set DB
          </Button>
          <TextField label='recording name' value={this.state.name} onChange={e => this.setState({name: e.target.value})} disabled={this.props.recording}/>
          <Tooltip title={this.props.recording?'Stop recording':'Start recording'}>
            <IconButton
              className={classes.themeButton}
              color="inherit"
              onClick={e => (this.props.recording?this.props.stopRecording():this.props.startRecording(this.state.name))}
            >
              {this.state.recordingFilled?<GpsFixedIcon />:<GpsNotFixedIcon/>}
            </IconButton>
          </Tooltip>
          <Button className={classes.display}>
            RX {Math.round(this.state.bandwidth * 100 / this.props.baud)}%
          </Button>
          <Button
            color='primary'
            variant='contained'
            disableElevation
            onClick={this.props.connect}
            disabled={this.props.portOpened}
            className={this.props.portOpened ? (this.props.connected ? classes.connectedButton : classes.disconnectedButton) : undefined}
            // style={{backgroundColor: this.props.portOpened ? (this.props.connected ? '' : 'Red') : undefined}}
          >
            {this.props.portOpened ? (this.props.connected ? `Connected` : `Disconnected`) : 'Connect'}
          </Button>
          <Select className={classes.select} value={this.props.port} onChange={e => this.props.selectPort(parseInt(e.target.value))} disabled={this.props.portOpened}>
            {this.props.ports.map((p, i) => (
              <MenuItem value={i} key={i}>{p.path} - {p.manufacturer}</MenuItem>
            ))}
          </Select>
          <Tooltip title='Toggle light/dark theme'>
            <IconButton
              className={classes.themeButton}
              color="inherit"
              onClick={e => this.props.onThemeChange(!this.props.isDark)}
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withTheme(withStyles(styles)(Navbar));
