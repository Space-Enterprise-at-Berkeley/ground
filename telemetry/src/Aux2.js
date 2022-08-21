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
                    name: 'Igniter Arm',
                    field: 'igniterArmCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.05
                  }}
                  field3={{
                    name: 'Main Vent',
                    field: 'mainValveVentCurrent',
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
                    name: 'Igniter Voltage',
                    field: 'igniterVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field2={{
                    name: 'Breakwire',
                    field: 'breakwireVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field3={{
                    name: 'Main Vent',
                    field: 'mainValveVentVoltage',
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
                    name: 'RQD Voltage',
                    field: 'RQDVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field2={{
                    name: 'RQD Current',
                    field: 'RQDCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field3={{
                    name: 'Pressurant Fill',
                    field: 'ERegACCh3current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field4={{
                    name: 'Channel  c0',
                    field: 'acLinAct1Current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.1
                  }}
                  field5={{
                    name: 'Channel 1',
                    field: 'ERegACCh1current',
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
                        color: [59, 126, 161],
                        unit: 'pF',
                        precision: 3
                      },
                      {
                        name: 'loxCapValFiltered',
                        color: [0, 50, 98],
                        unit: 'pF',
                        precision: 3
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
                        name: 'fuelCapVal',
                        color: [253, 181, 21],
                        unit: 'pF',
                        precision: 3
                      },
                      {
                        name: 'fuelCapValFiltered',
                        color: [196, 130, 14],
                        unit: 'pF',
                        precision: 3
                      },
                    ]
                  }
                />
              </Grid>
              
              <Grid item xs={4} className={classes.item}>
                <SixValueSquare
                  field1={{
                    name: 'LOX GEMS Voltage',
                    field: 'loxGemsVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field2={{
                    name: 'LOX GEMS Current',
                    field: 'loxGemsCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field3={{
                    name: '-',
                    field: '',
                    unit: '',
                    decimals: 0,
                    threshold: 3
                  }}
                  field4={{
                    name: 'Fuel GEMS Voltage',
                    field: 'fuelGemsVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field5={{
                    name: 'Fuel GEMS Current',
                    field: 'fuelGemsCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field6={{
                    name: 'Channel 4',
                    field: 'ERegACCh4',
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
              
              <Grid item xs={8} className={classes.item}>
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
                        name: 'thrust3', // prop PT temp
                        color: [202, 15, 221],
                        unit: 'LBS'
                      },
                      {
                        name: 'thrust4', // prop PT temp
                        color: [221, 202, 15],
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
