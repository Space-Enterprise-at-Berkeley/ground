import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Graph from './components/Graph';
import SixValueSquare from './components/SixValueSquare';
import FourValueSquare from './components/FourValueSquare';

import comms from './api/Comms';

const PAGE_TITLE = "Telemetry: Aux #1"

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

class Aux1 extends Component {
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
                <SixValueSquare
                  field1={{
                    name: 'Fuel Tank Vent RBV',
                    field: 'ERegACCh0voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5

                  }}
                  field4={{
                    name: 'Fuel Tank Vent RBV',
                    field: 'ERegACCh0current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field2={{
                    name: 'LOX Tank Vent',
                    field: 'ERegACCh1voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field5={{
                    name: 'LOX Tank Vent',
                    field: 'ERegACCh1current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1

                  }}
                  field3={{
                    name: 'Igniter Enable Relay',
                    field: 'ERegACCh2voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field6={{
                    name: 'Igniter Enable Relay',
                    field: 'ERegACCh2current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: '2 Way',
                    field: 'ERegACCh3voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field2={{
                    name: 'Fuel Gems',
                    field: 'ERegACCh5voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field3={{
                    name: 'LOX Gems',
                    field: 'ERegACCh6voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field4={{
                    name: '2 Way',
                    field: 'ERegACCh3current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                  field5={{
                    name: 'Fuel Gems',
                    field: 'ERegACCh5current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                  field6={{
                    name: 'LOX Gems',
                    field: 'ERegACCh6current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                />
              </Grid> 
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'Igniter',
                    field: 'acHeater3Voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field2={{
                    name: 'Breakwire',
                    field: 'acHeater4Voltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field3={{
                    name: 'Propane Fill',
                    field: 'loxTankVentRBVvoltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field4={{
                    name: 'Igniter',
                    field: 'acHeater3Current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                  field5={{
                    name: 'Breakwire',
                    field: 'acHeater4Current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                  field6={{
                    name: 'Propane Fill', //AC2 Lin Act 1
                    field: 'loxTankVentRBVcurrent', 
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                />
              </Grid> 
              <Grid item={1} xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'Press Fill',
                    field: 'fuelTankVentRBVvoltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field2={{
                    name: 'Press Line Vent',
                    field: 'fuelPrechillRBVvoltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field3={{
                    name: 'LOX Fill RBV',
                    field: 'purgeFlowRBVvoltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 5
                  }}
                  field4={{
                    name: 'Press Fill',
                    field: 'fuelTankVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                  field5={{
                    name: 'Press Line Vent',
                    field: 'fuelPrechillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                  field6={{
                    name: 'LOX Fill RBV', //AC2 Lin Act 1
                    field: 'purgeFlowRBVcurrent', 
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.05
                  }}
                />
              </Grid> 
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelCapFill', // lox PT temp
                        displayname: 'fuelCapFill',
                        color: [123, 35, 162],
                        unit: 'pF'
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
                        name: 'TC0', // lox PT temp
                        displayname: 'TC 0',
                        color: [123, 35, 162],
                        unit: '°C'
                      },
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'TC1', // engine temp 1
                        color: [221, 0, 0],
                        unit: '°C'
                      },
                      {
                        name: 'TC2', // engine temp 2
                        color: [0, 127, 254],
                        unit: '°C'
                      },
                      {
                        name: 'TC3', // engine temp 3
                        color: [0, 187, 0],
                        unit: '°C'
                      },
                      {
                        name: 'TC4', // engine temp 3
                        color: [245, 185, 66],
                        unit: '°C'
                      },
                    ]
                  }
                />
              </Grid>

              <Grid item={1} xs={6} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'LC1', // engine temp 1
                        color: [221, 0, 0],
                        unit: 'kg'
                      },
                      {
                        name: 'LC2', // engine temp 2
                        color: [0, 127, 254],
                        unit: 'kg'
                      },
                      {
                        name: 'LCsum',
                        displayname: 'Sum',
                        color: [41, 171, 76],
                        unit: 'kg',
                      }

                    ]
                  }
                />
              </Grid>

              
              {/* <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxTankPTTemp', // lox PT temp
                        color: [123, 35, 162],
                        unit: 'degC'
                      },
                      // {
                      //   name: 'loxGemsTemp', // lox gems temp
                      //   color: [0, 126, 254],
                      //   unit: 'degC'
                      // },
                    ]
                  }
                />
              </Grid> */}
              {/* <Grid item={1} xs={8} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'engineTop4TC', // engine temp 1
                        color: [221, 0, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'engineBottom3TC', // engine temp 2
                        color: [0, 127, 254],
                        unit: 'degC'
                      },
                      {
                        name: 'engineBottom4TC', // engine temp 3
                        color: [0, 187, 0],
                        unit: 'degC'
                      },
                      {
                        name: 'propTankTC', // engine temp 3
                        color: [245, 185, 66],
                        unit: 'degC'
                      },
                    ]
                  }
                />
              </Grid> */}
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Aux1.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Aux1);
