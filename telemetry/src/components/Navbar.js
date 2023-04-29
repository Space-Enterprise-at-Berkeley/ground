import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Tooltip, IconButton, Button } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import SettingsIcon from '@material-ui/icons/Settings';

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
    backgroundColor: '#3B7EA1 !important',
    color: '#FFFFFF !important'
  },
  disconnectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: '#FDB515 !important',
    color: '#000000 !important'
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
      boardState[boardName + ".connected"] = false;
      boardState[boardName + ".kbps"] = 0;
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
    boardState[boardName + ".connected"] = value;
    this.setState(boardState);
  }

  updateBoardKbps(timestamp, boardName, value) {
    let boardState = {};
    boardState[boardName + ".kbps"] = value;
    if (value > 0) {
      boardState[boardName + ".connected"] = true;
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
      comms.addSubscriber(boardName + ".boardConnected", this.boardConnectedCallbacks[boardName]);
      comms.addSubscriber(boardName + ".boardKbps", this.boardKbpsCallbacks[boardName]);
      comms.addSubscriber("influxState", this.updateInfluxState);
      comms.addSubscriber("influxDatabase", this.updateInfluxDatabase);
    }

    for (let boardName in this.config.boards) {
      let boardState = {};
      boardState[boardName + ".connected"] = false;
      boardState[boardName + ".kbps"] = 0;
      this.setState(boardState);
    }
  }

  componentWillUnmount() {
    for (let boardName in this.config.boards) {
      comms.removeSubscriber(boardName + ".boardConnected", this.boardConnectedCallbacks[boardName]);
      comms.removeSubscriber(boardName + ".boardKbps", this.boardKbpsCallbacks[boardName]);
    }
  }

  render() {
    const { classes,
            changeLightDark,
            openSettings } = this.props;

    return (
      <AppBar position="static" color="default" elevation={0} className={classes.bar}>
        <Toolbar variant="dense">
          <p>{"Flow Time: " + this.config.burnTime}</p>
          <div className={classes.spacer}/>
          {
            Object.keys(this.config.boards).map(boardName => (
              <Button className={this.state[boardName + ".connected"] ? classes.connectedButton : classes.disconnectedButton}>{boardName} - {Math.round(this.state[boardName + ".kbps"])}</Button>
            ))
          }
          <div className={classes.spacer}/>
          <p>
            Influx: {this.state.influxState === 0 && "Not Connected"}{this.state.influxState === 1 && this.state.influxDatabase}{this.state.influxState === 2 && "Error"}
          </p>
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
