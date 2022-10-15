import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import comms from './api/Comms';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import SixValueSquare from './components/SixValueSquare';
import TankHeaterSquare from './components/TankHeaterSquare';
import MessageDisplaySquare from "./components/MessageDisplaySquare";
import RocketOrientation from "./components/RocketOrientation";
import Map from "./components/Map";

const PAGE_TITLE = "Telemetry: Main"

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    position: 'absolute',
    top: theme.spacing(6),
    // height: '100vh',
    bottom: '0px',
    padding: theme.spacing(1)
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

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
    };

    this.changeLightDark = this.changeLightDark.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeLightDark() {
    comms.setDarkMode(!this.state.isDark);
    this.setState({ isDark: !this.state.isDark });
  }

  openSettings() {
    this.setState({ showSettings: true });
  }

  closeSettings() {
    this.setState({ showSettings: false });
  }

  componentDidMount() {
    document.title = PAGE_TITLE;
    comms.connect();
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
  }

  render() {
    const { classes } = this.props;
    const theme = createTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
          <Settings open={this.state.showSettings} closeSettings={this.closeSettings}/>
          <Navbar
            changeLightDark={this.changeLightDark}
            openSettings={this.openSettings}
          />
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={6} className={classes.item}>
              <SixValueSquare
                  field1={{
                    name: 'Altitude',
                    field: 'baroAltitude',
                    unit: 'm',
                    decimals: 2,
                  }}
                  field2={{
                    name: 'Ascent Speed',
                    field: 'ascentSpeed',
                    unit: 'm/s',
                    decimals: 2
                  }}
                  field3={{
                    name: 'Temperature',
                    field: 'baroTemperature',
                    unit: 'C',
                    decimals: 2
                  }}
                  field4={{
                    name: 'X Accel',
                    field: 'accelX',
                    unit: 'g',
                    decimals: 2
                  }}
                  field5={{
                    name: 'Y Accel',
                    field: 'accelY',
                    unit: 'g',
                    decimals: 2
                  }}
                  field6={{
                    name: 'Z Accel',
                    field: 'accelZ',
                    unit: 'g',
                    decimals: 2
                  }}
                />
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <Map fieldLat={"gpsLatitude"} fieldLong={"gpsLongitude"}/>
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'BBox Data Written',
                    field: 'dataWritten',
                    unit: 'KB',
                    decimals: 1,
                  }}
                  field2={{
                    name: 'Apogee Time',
                    field: 'apogeeTime',
                    unit: 'uS',
                    decimals: 0,
                    threshold: 1
                  }}
                  field3={{
                    name: 'Radio RSSI',
                    field: 'radioRSSI',
                    unit: ''
                  }}
                  field4={{
                    name: 'GPS Latitude',
                    field: 'gpsLatitude',
                    unit: '',
                    decimals: 2,
                  }}
                  field5={{
                    name: 'GPS Longitude',
                    field: 'gpsLongitude',
                    unit: '',
                    decimals: 2,
                  }}
                  field6={{
                    name: 'GPS Sat Count',
                    field: 'gpsSatCount',
                    unit: '',
                    decimals: 1,
                  }}
                />
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <RocketOrientation fieldQW={"qW"} fieldQX={"qX"} fieldQY={"qY"} fieldQZ={"qZ"}/>
                {/* <SixValueSquare
                  field1={{
                    name: 'GPS altitude',
                    field: 'gpsAltitude',
                    unit: 'm',
                    decimals: 2,
                  }}
                  field2={{
                    name: 'GPS speed',
                    field: 'gpsSpeed',
                    unit: 'm/s',
                    decimals: 2,
                  }}
                  field3={{
                    name: 'GPS SIV',
                    field: 'numGpsSats',
                    unit: '',
                    decimals: 0,
                    threshold: 0.5,
                  }}
                  field4={{
                    name: 'Gyro X',
                    field: 'gx',
                    unit: '',
                    decimals: 2
                  }}
                  field5={{
                    name: 'Gyro Y',
                    field: 'gy',
                    unit: '',
                    decimals: 2
                  }}
                  field6={{
                    name: 'Gyro Z',
                    field: 'gz',
                    unit: '',
                    decimals: 2
                  }}
                /> */}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Main);