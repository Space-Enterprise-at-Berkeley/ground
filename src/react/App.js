import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'fontsource-roboto';
import './App.css';

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import comms from './comms';

import Navbar from './Navbar';
import Graph from './Graph';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    height: '100%'
  },
  row: {
    height: '100%'
  },
  item: {
    height: '50%'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      connected: false,
      port: 0,
      ports: [],
      baud: 57600,
      portOpened: false
    };
    this.sensorListeners = [];
    this.bandwidthListeners = [];
  }
  componentDidMount = async () => {
    const connected = await comms.getConnected();
    const ports = await comms.listPorts();
    const port = await comms.getPort();
    this.setState({
      connected,
      port: port ? ports.findIndex(p => p.path === port.path) : 0,
      ports,
      portOpened: !!port
    });
    comms.connListen(connected => {
      this.setState({ connected });
    });
    comms.sensorListen(payload => {
      this.sensorListeners.filter(v => v.idx === payload.idx).forEach(v => {
        v.handler(payload.values, moment(payload.timestamp));
      });
    });
    comms.bandwidthListen(payload => {
      this.bandwidthListeners.forEach(b => {
        b(payload);
      });
    });
    if(!port) {
      this.portInterval = window.setInterval(async () => {
        const ports = await comms.listPorts();
        this.setState({ ports });
      }, 2000);
    }
  }
  addSensorListener = (idx, handler) => {
    this.sensorListeners.push({
      idx,
      handler
    });
  }
  addBandwidthListener = handler => {
    this.bandwidthListeners.push(handler);
  }
  connect = async () => {
    const success = await comms.selectPort(this.state.ports[this.state.port], this.state.baud);
    if(success) {
      this.setState({
        portOpened: true
      });
      window.clearInterval(this.portInterval);
    }
    return success; // maybe put this in the state?
  }
  render() {
    const { classes } = this.props;
    const theme = createMuiTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Grid container className={classes.root} justify='space-around'>
          <Grid item xs={12}>
            <Navbar
              onThemeChange={isDark => this.setState({ isDark })}
              isDark={this.state.isDark}
              connect={this.connect}
              port={this.state.port}
              ports={this.state.ports}
              selectPort={port => this.setState({ port })}
              baud={this.state.baud}
              setBaud={baud => this.setState({ baud })}
              connected={this.state.connected}
              portOpened={this.state.portOpened}
              addBandwidthListener={this.addBandwidthListener}
            />
          </Grid>
          <Grid item xs={12}>
            <Container maxWidth='xl' className={classes.container}>
              <Grid container spacing={3} className={classes.row}>
                <Grid item xs={6} className={classes.item}>
                  <Graph
                    sensors={
                      [{
                        label: 'LOX TANK',
                        idx: 0,
                        index: 0,
                        color: '#7b1fa2'
                      },{
                        label: 'PROP TANK',
                        idx: 1,
                        index: 0,
                        color: '#d32f2f'
                      }]
                    }
                    max={600}
                    window={90}
                    interval={80}
                    label='Pressures'
                    addSensorListener={this.addSensorListener}
                  />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                  <Graph
                    sensors={
                      [{
                        label: 'LOX INJECTOR',
                        idx: 2,
                        index: 0,
                        color: '#388e3c'
                      },{
                        label: 'PROP INJECTOR',
                        idx: 3,
                        index: 0,
                        color: '#1976d2'
                      }]
                    }
                    max={600}
                    window={90}
                    interval={80}
                    label='Pressures'
                    addSensorListener={this.addSensorListener}
                  />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                  <Graph
                    sensors={
                      [{
                        label: 'PRESSURANT',
                        idx: 4,
                        index: 0,
                        color: '#f57c00'
                      }]
                    }
                    max={0}
                    window={90}
                    interval={80}
                    label='Pressures'
                    addSensorListener={this.addSensorListener}
                  />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                  <Graph
                    sensors={
                      [{
                        label: 'BATTERY',
                        idx: 5,
                        index: 0,
                        color: '#00796b'
                      },
                      {
                        label: 'POWER',
                        idx: 5,
                        index: 1,
                        color: '#fbc02d'
                      }]
                    }
                    max={24}
                    window={90}
                    interval={150}
                    label='Power'
                    addSensorListener={this.addSensorListener}
                  />
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(App);
