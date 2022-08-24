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
    height: '33%'
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
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_FUEL_HP_PT',
                        displayname: 'Fuel Pressurant PT',
                        color: [255,0,0],
                        unit: 'PSI'
                      },
                      {
                        name: 'EREG_LOX_HP_PT',
                        displayname: 'LOX Pressurant PT',
                        color: [0,0,255],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_FUEL_LP_PT',
                        displayname: 'Fuel Tank PT',
                        color: [0, 126, 254],
                        unit: 'PSI'
                      },
                      {
                        name: 'EREG_FUEL_PRESSURE_SETPOINT',
                        displayname: 'Fuel Tank Setpoint',
                        color: [80, 219, 38],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_LOX_LP_PT',
                        displayname: 'LOX Tank PT',
                        color: [236, 38, 78],
                        unit: 'PSI',
                      },
                      {
                        name: 'EREG_LOX_PRESSURE_SETPOINT',
                        displayname: 'LOX Tank Setpoint',
                        color: [0, 196, 236],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'Fuel Flow Pressure',
                    field: 'FUEL_PRESSURE_SETPOINT',
                    decimals: 0
                  }}
                  field2={{
                    name: 'LOX Flow Pressure',
                    field: 'LOX_PRESSURE_SETPOINT',
                    decimals: 0
                  }}
                  field3={{
                    name: 'Flow State',
                    field: 'flowState',
                    decimals: 0
                  }}
                  field4={{
                    name: 'Fuel Burntime',
                    field: 'FUEL_burn_duration',
                    decimals: 1
                  }}
                  field5={{
                    name: 'LOX Burntime',
                    field: 'LOX_burn_duration',
                    decimals: 1
                  }}
                  field6={{
                    name: 'Igniter Voltage',
                    field: 'acHeater3Voltage',
                    decimals: 1
                  }}
                />
              </Grid>
              
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_FUEL_ENCODER_ANGLE',
                        color: [221, 0, 0],
                        unit: 'Ticks',
                        displayname: 'Fuel Encoder Angle'
                      },
                      {
                        name: 'EREG_FUEL_ANGLE_SETPOINT',
                        color: [0,0,221],
                        unit: 'Ticks',
                        displayname: 'Fuel Angle Setpoint'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_LOX_ENCODER_ANGLE',
                        color: [148, 42, 235],
                        unit: 'Ticks',
                        displayname: 'LOX Encoder Angle'
                      },
                      {
                        name: 'EREG_LOX_ANGLE_SETPOINT',
                        color: [27, 102, 101],
                        unit: 'Ticks',
                        displayname: "LOX Encoder Setpoint"
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <MessageDisplaySquare/>
                {/* <Graph
                  fields={
                    [
                      {
                        name: 'loxGemsPT',
                        color: [0, 126, 254],
                        unit: 'psi'
                      },
                      {
                        name: 'propGemsPT',
                        color: [0, 187, 0],
                        unit: 'psi'
                      },
                    ]
                  }
                /> */}
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_FUEL_INJECTOR_PT',
                        color: [255, 51, 224],
                        unit: 'PSI',
                        displayname: 'Fuel Injector PT'
                      },
                      {
                        name: 'EREG_LOX_INJECTOR_PT', // prop PT temp
                        color: [15, 202, 221],
                        unit: 'PSI',
                        displayname: 'LOX Injector PT'
                      },

                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'EREG_FUEL_MOTOR_POWER',
                        displayname: 'Fuel Motor Power',
                        color: [0, 126, 254],
                        unit: 'yes'
                      },
                      {
                        name: 'EREG_LOX_MOTOR_POWER',
                        displayname: 'LOX Motor Power',
                        color: [0, 187, 0],
                        unit: 'yes'
                      },


                      // {
                      //   name: 'engineTC4',
                      //   color: [0, 126, 254],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC5',
                      //   color: [0, 187, 0],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC6',
                      //   color: [123, 35, 162],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC7',
                      //   color: [35, 123, 162],
                      //   unit: 'ºC'
                      // },

                      // {
                      //   name: 'engineTC8',
                      //   color: [0, 126, 254],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC9',
                      //   color: [0, 187, 0],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC10',
                      //   color: [123, 35, 162],
                      //   unit: 'ºC'
                      // },
                      // {
                      //   name: 'engineTC11',
                      //   color: [35, 123, 162],
                      //   unit: 'ºC'
                      // },
                    ]
                  }
                />
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
