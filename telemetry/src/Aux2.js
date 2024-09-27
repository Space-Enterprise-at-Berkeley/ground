import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Graph from './components/Graph';
import SixValueSquare from './components/SixValueSquare';

import comms from './api/Comms';

const PAGE_TITLE = "Telemetry: Aux #2"

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    height: '100vh',
    padding: theme.spacing(1)
  },
  row: {
    height: '100%',
  },
  item: {
    height: '33%'
  },
  itemBig: {
    height: '33%'
  },
  twoThirds: {
    height: '100%'
  },
  oneThird: {
    height: '100%'
  }
});

class Aux2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
    };

    this.handleDarkMode = this.handleDarkMode.bind(this);
  }

  handleDarkMode(isDark) {
    this.setState({ isDark });
  }

  componentDidMount() {
    document.title = PAGE_TITLE;
    comms.connect();
    comms.addDarkModeListener(this.handleDarkMode);
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.removeDarkModeListener(this.handleDarkMode);
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
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              
              {/* START OF ROW 1 */}
              <Grid item xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'Igniter Current',
                    field: 'igniterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field2={{
                    name: 'Igniter Voltage',
                    field: 'igniterVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field3={{
                    name: 'LED2',
                    field: 'led2Current',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field4={{
                    name: 'ARM',
                    field: 'armValveCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field5={{
                    name: 'LOX Main',
                    field: 'loxMainValveCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field6={{
                    name: 'Fuel Main',
                    field: 'fuelMainValveCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: '_',
                    field: '',
                    unit: '',
                    decimals: 0,
                  }}
                  field2={{
                    name: 'Breakwire',
                    field: 'breakwireVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field3={{
                    name: 'LED2',
                    field: 'led2Voltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field4={{
                    name: 'ARM',
                    field: 'armValveVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field5={{
                    name: 'LOX Main',
                    field: 'loxMainValveVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field6={{
                    name: 'Fuel Main',
                    field: 'fuelMainValveVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'LOx Tank Vent',
                    field: 'loxTankVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field2={{
                    name: 'Fuel Tank Vent',
                    field: 'fuelTankVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field3={{
                    name: 'Pressurant Fill',
                    field: 'pressurantFillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field4={{
                    name: 'LOX Fill',
                    field: 'loxFillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field5={{
                    name: 'Fuel Fill',
                    field: 'fuelFillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field6={{
                    name: 'Pressurant Flow',
                    field: 'pressurantFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                />
              </Grid>

              {/* START OF ROW 2 */}

              <Grid item xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'loxCapVal',
                        color: [70, 1, 155],
                        unit: 'pF',
                        precision: 3
                      }
                    ]
                  }
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelCapVal',
                        color: [56, 44, 30],
                        unit: 'pF',
                        precision: 3
                      }
                    ]
                  }
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'Purge/Pre-chill Vent',
                    field: 'purgePrechillVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field2={{
                    name: 'Purge Flow',
                    field: 'purgeFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field3={{
                    name: 'Pre-Chill Flow',
                    field: 'prechillFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field4={{
                    name: '_',
                    field: '',
                    unit: '',
                    decimals: 0
                  }}
                  field5={{
                    name: 'LOX Prechill',
                    field: 'loxPrechillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field6={{
                    name: 'Fuel Prechill',
                    field: 'fuelPrechillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                />
              </Grid>

              {/* START OF ROW 3 */}

              {/* <Grid item xs={4}>
                {/* Empty Slot
              </Grid> */}

              <Grid item xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fastThrust1',
                        color: [255, 51, 224],
                        unit: 'KGs'
                      },
                      {
                        name: 'fastThrust2', // prop PT temp
                        color: [15, 202, 221],
                        unit: 'KGs'
                      },
                      {
                        name: 'newLoadCellTotal', // prop PT temp
                        color: [238, 154, 7],
                        unit: 'KGs'
                      },
                    ]
                  }
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'thrust1',
                        color: [255, 51, 224],
                        unit: 'LBS'
                      },
                      {
                        name: 'thrust2', // prop PT temp
                        color: [15, 202, 221],
                        unit: 'LBS'
                      },
                      {
                        name: 'totalThrust', // prop PT temp
                        color: [238, 154, 7],
                        unit: 'LBS'
                      },
                    ]
                  }
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'LOX Tank Top Heater',
                    field: 'loxTankTopHtrCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field2={{
                    name: 'LOX Tank Mid Heater',
                    field: 'loxTankMidHtrCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field3={{
                    name: 'LOX Tank Bottom Heater',
                    field: 'loxTankBottomHtrCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field4={{
                    name: 'Fuel Tank Top Heater',
                    field: 'fuelTankTopHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field5={{
                    name: 'Fuel Tank Mid Heater',
                    field: 'fuelTankMidHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field6={{
                    name: 'Fuel Tank Bottom Heater',
                    field: 'fuelTankBottomHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Aux2.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Aux2);
