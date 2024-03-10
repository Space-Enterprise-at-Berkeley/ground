import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Tooltip, IconButton, Button } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import SettingsIcon from '@material-ui/icons/Settings';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen'

import comms from '../api/Comms';

const styles = theme => ({
  spacer: {
    flexGrow: 1
  },
  bar: {
    borderBottom: '0.5px solid gray'
  },
  connectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  disconnectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      influxState: 0
    };
    this.config = props.config;
    this.boardConnectedCallbacks = {};
    this.boardKbpsCallbacks = {};
    for (let boardName in this.config.boards) {
      let boardState = {};
      boardState[boardName + "Connected"] = false;
      boardState[boardName + "Kbps"] = 0;
      this.setState(boardState);
      this.boardConnectedCallbacks[boardName] = (timestamp, value) => {
        this.updateBoardConnected(timestamp, boardName, value);
      }
      this.boardKbpsCallbacks[boardName] = (timestamp, value) => {
        this.updateBoardKbps(timestamp, boardName, value);
      }
    }

    this.updateBoardConnected = this.updateBoardConnected.bind(this);
    this.updateBoardKbps = this.updateBoardKbps.bind(this);
    this.updateInfluxState = this.updateInfluxState.bind(this);
    this.updateInfluxDatabase = this.updateInfluxDatabase.bind(this);
  }

  updateBoardConnected(timestamp, boardName, value) {
    let boardState = {};
    boardState[boardName + "Connected"] = value;
    this.setState(boardState);
  }

  updateBoardKbps(timestamp, boardName, value) {
    let boardState = {};
    boardState[boardName + "Kbps"] = value;
    if (value > 0) {
      boardState[boardName + "Connected"] = true;
    }
    this.setState(boardState);
  }

  updateInfluxState(timestamp, value) {
    this.setState({influxState: value});
  }

  updateInfluxDatabase(timestamp, value) {
    this.setState({influxDatabase: value});
  }

  async componentDidMount() {
    for (let boardName in this.config.boards) {
      comms.addSubscriber(boardName + "Connected", this.boardConnectedCallbacks[boardName]);
      comms.addSubscriber(boardName + "Kbps", this.boardKbpsCallbacks[boardName]);
      comms.addSubscriber("influxState", this.updateInfluxState);
      comms.addSubscriber("influxDatabase", this.updateInfluxDatabase);
    }

    for (let boardName in this.config.boards) {
      let boardState = {};
      boardState[boardName + "Connected"] = false;
      boardState[boardName + "Kbps"] = 0;
      this.setState(boardState);
    }
  }

  componentWillUnmount() {
    for (let boardName in this.config.boards) {
      comms.removeSubscriber(boardName + "Connected", this.boardConnectedCallbacks[boardName]);
      comms.removeSubscriber(boardName + "Kbps", this.boardKbpsCallbacks[boardName]);
    }
  }

  render() {
    const { classes,
            changeLightDark,
            openSettings,
            toggleLocked,
            locked } = this.props;

    return (
      <AppBar position="static" color="default" elevation={0} className={classes.bar}>
        <Toolbar variant="dense">
          <p>{"Flow Time: " + this.config.burnTime}</p>
          <div className={classes.spacer}/>
          {
            Object.keys(this.config.boards).map(boardName => (
              <Button className={this.state[boardName + "Connected"] ? classes.connectedButton : classes.disconnectedButton}>{boardName} - {Math.round(this.state[boardName + "Kbps"])}</Button>
            ))
          }
          <div className={classes.spacer}/>
          <p>
            Influx: {this.state.influxState === 0 && "Not Connected"}{this.state.influxState === 1 && this.state.influxDatabase}{this.state.influxState === 2 && "Error"}
          </p>
          <Tooltip title='Lock/unlock'>
            <IconButton
              color="inherit"
              onClick={ toggleLocked }
            >
              {
                locked && (
                  <LockIcon />
                )
              }
              {
                !locked && (
                  <LockOpenIcon />
                )
              }
            </IconButton>
          </Tooltip>
          <Tooltip title='Toggle light/dark theme'>
            <IconButton
              color="inherit"
              onClick={ changeLightDark }
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Settings'>
            <IconButton
              color="inherit"
              onClick={ openSettings }
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withTheme(withStyles(styles)(Navbar));
