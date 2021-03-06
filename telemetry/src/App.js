import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'fontsource-roboto';
import './App.css';

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import comms from './comms';

import Navbar from './Navbar';
import NewGraph from './NewGraph';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    // height: '100%'
    position: 'absolute',
    top: theme.spacing(8),
    bottom: '0px',
    paddingTop: theme.spacing(3)
  },
  row: {
    height: '100%'
  },
  item: {
    height: '50%'
  },
  navbarGrid: {
    // height: theme.spacing(2)
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <>
      {value === index ? <>{children}</> : <></>}
    </>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      connected: false,
      selectedDb: null,
      port: 0,
      ports: [],
      baud: 57600,
      portOpened: false,
      recording: false,
      tab: 0
    };
    this.sensorListeners = [];
    this.bandwidthListeners = [];
  }
  componentDidMount = async () => {
    const connected = await comms.getConnected();
    const selectedDb = await comms.getSelectedInfluxDB();
    const ports = await comms.listPorts();
    const port = await comms.getPort();
    this.setState({
      connected,
      selectedDb,
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
    }
    return success; // maybe put this in the state?
  }
  selectDb = async db => {
    await comms.setInfluxDB(db);
    this.setState({
      selectedDb: db
    });
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
        <Box>
          <Navbar
            onThemeChange={isDark => this.setState({ isDark })}
            isDark={this.state.isDark}
            connect={this.connect}
            selectedDb={this.state.selectedDb}
            selectDb={this.selectDb}
            port={this.state.port}
            ports={this.state.ports}
            selectPort={port => this.setState({ port })}
            baud={this.state.baud}
            setBaud={baud => this.setState({ baud })}
            connected={this.state.connected}
            portOpened={this.state.portOpened}
            addBandwidthListener={this.addBandwidthListener}
            recording={this.state.recording}
            startRecording={async (name) => {
              await comms.startRecording(name);
              this.setState({recording: true});
            }}
            stopRecording={async () => {
              await comms.stopRecording();
              this.setState({recording: false});
            }}
            tab={this.state.tab}
            setTab={(nv) => this.setState({tab: nv})}
          />
          <Container maxWidth='xl' className={classes.container}>
            <Grid container spacing={3} className={classes.row}>
              <Grid item xs={6} className={classes.item}>
                <NewGraph
                  sensors={
                    [{
                      label: 'LOX TANK',
                      unit: 'PSI',
                      idx: 0,
                      index: 0,
                      color: [123, 35, 162]
                    },
                    {
                      label: 'PROP TANK',
                      unit: 'PSI',
                      idx: 1,
                      index: 0,
                      color: [211, 47, 47]
                    }
                  ]
                  }
                  max={600}
                  defaultWindow={90}
                  interval={80}
                  title='Tank Pressures and Domes'
                  addSensorListener={this.addSensorListener}
                />
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <NewGraph
                  sensors={
                    [{
                      label: 'LOX INJECTOR',
                      unit: 'PSI',
                      idx: 2,
                      index: 0,
                      color: [56, 152, 60]
                    },{
                      label: 'PROP INJECTOR',
                      unit: 'PSI',
                      idx: 3,
                      index: 0,
                      color: [25, 118, 210]
                    }]
                  }
                  max={600}
                  defaultWindow={90}
                  interval={80}
                  title='Injector Pressures'
                  addSensorListener={this.addSensorListener}
                />
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <NewGraph
                  sensors={
                    [{
                      label: 'PRESSURANT',
                      unit: 'PSI',
                      idx: 6,
                      index: 0,
                      color: [245, 124, 0]
                    },{
                      label: 'LOX DOME',
                      unit: 'PSI',
                      idx: 4,
                      index: 0,
                      color: [36, 113, 163]
                    },{
                      label: 'PROP DOME',
                      unit: 'PSI',
                      idx: 5,
                      index: 0,
                      color: [176, 58, 46]
                    }]
                  }
                  max={4800}
                  defaultWindow={90}
                  interval={80}
                  title='High Pressure'
                  addSensorListener={this.addSensorListener}
                />
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <NewGraph
                  sensors={
                    [{
                      label: 'BATTERY',
                      unit: 'Volts',
                      idx: 7,
                      index: 0,
                      color: [0, 121, 107]
                    },
                    {
                      label: 'AMPS',
                      unit: 'Amps',
                      idx: 7,
                      index: 2,
                      color: [251, 192, 45]
                    }]
                  }
                  max={24}
                  defaultWindow={90}
                  interval={150}
                  title='Power'
                  addSensorListener={this.addSensorListener}
                />
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <NewGraph
                  sensors={
                    [{
                      label: 'CRYO LOX TANK',
                      unit: 'degC',
                      idx: 10,
                      index: 0,
                      color: [0, 121, 107]
                    },
                    {
                      label: 'CRYO LOX GEMS',
                      unit: 'degC',
                      idx: 10,
                      index: 3,
                      color: [251, 192, 45]
                    }]
                  }
                  max={24}
                  defaultWindow={90}
                  interval={150}
                  title='LOX TCS'
                  addSensorListener={this.addSensorListener}
                />
              </Grid>
              <Grid item xs={6} className={classes.item}>
                <NewGraph
                  sensors={
                    [{
                      label: 'LOX GEMS HEATER',
                      unit: 'Volts',
                      idx: 9,
                      index: 0,
                      color: [0, 121, 107]
                    },
                    {
                      label: 'FITTING TREE HEATER',
                      unit: 'Volts',
                      idx: 8,
                      index: 0,
                      color: [251, 192, 45]
                    }]
                  }
                  max={24}
                  defaultWindow={90}
                  interval={150}
                  title='LOX TCS'
                  addSensorListener={this.addSensorListener}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(App);
