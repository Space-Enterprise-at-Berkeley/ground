import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Graph from './components/Graph';
import SixValueSquare from './components/SixValueSquare';

import comms from './api/Comms';

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
    const theme = createMuiTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
          <Container className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item xs={4}>
                <SixValueSquare
                  field1={{
                    name: 'HPS',
                    field: 'HPSCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field2={{
                    name: 'LOx GEMS',
                    field: 'loxGemsCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field3={{
                    name: 'Prop GEMS',
                    field: 'propGemsCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field4={{
                    name: 'ARM',
                    field: 'lox2WayCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field5={{
                    name: 'LOx Main',
                    field: 'lox5WayCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                  field6={{
                    name: 'Prop Main',
                    field: 'prop5WayCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.1
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SixValueSquare
                  field1={{
                    name: 'HPS',
                    field: 'HPSVoltage',
                    unit: 'V',
                    decimals: 1,
                    threshold: 1.5
                  }}
                  field2={{
                    name: 'LOx GEMS',
                    field: 'loxGemsVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field3={{
                    name: 'Prop GEMS',
                    field: 'propGemsVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field4={{
                    name: 'ARM',
                    field: 'lox2WayVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field5={{
                    name: 'LOx Main',
                    field: 'lox5WayVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field6={{
                    name: 'Prop Main',
                    field: 'prop5WayVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SixValueSquare
                  field1={{
                    name: 'Pressurant Fill',
                    field: 'pressurantFillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field2={{
                    name: 'Prop Vent',
                    field: 'propaneVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field3={{
                    name: 'Prop RQD-1',
                    field: 'propaneRQD1current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field4={{
                    name: 'N2 Flow',
                    field: 'pressurantFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field5={{
                    name: 'Prop Flow',
                    field: 'propaneFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field6={{
                    name: 'Prop RQD-2',
                    field: 'propaneRQD2current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                />
              </Grid>

              <Grid item xs={4}>
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
                    name: 'HPS Supply',
                    field: 'HPSSupplyVoltage',
                    unit: 'V',
                    decimals: 0,
                    threshold: 60
                  }}
                  field4={{
                    name: '_changeme_',
                    field: '_changeme_',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field5={{
                    name: '_changeme_',
                    field: '_changeme_',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                  field6={{
                    name: '_changeme_',
                    field: '_changeme_',
                    unit: 'V',
                    decimals: 0,
                    threshold: 3
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SixValueSquare
                  field1={{
                    name: 'LOx Tank Top Heater',
                    field: 'LOxTankTopHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field2={{
                    name: 'LOx Tank Mid Heater',
                    field: 'LOxTankMidHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field3={{
                    name: 'LOx Tank Bottom Heater',
                    field: 'LOxTankBottomHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field4={{
                    name: 'Prop Tank Top Heater',
                    field: 'propTankTopHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field5={{
                    name: 'Prop Tank Mid Heater',
                    field: 'propTankMidHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                  field6={{
                    name: 'Prop Tank Bottom Heater',
                    field: 'propTankBottomHeaterCurrent',
                    unit: 'A',
                    decimals: 2,
                    threshold: 0.3
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SixValueSquare
                  field1={{
                    name: 'LOx Tank Vent',
                    field: 'LOxTankVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field2={{
                    name: 'LOx Vent',
                    field: 'LOxVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field3={{
                    name: 'LOx RQD-1',
                    field: 'LOxRQD1current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field4={{
                    name: 'Prop Tank Vent',
                    field: 'propaneTankVentRBVcurrent',
                    unit: 'A',
                    decimals: 1
                  }}
                  field5={{
                    name: 'LOx Flow',
                    field: 'LOxFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field6={{
                    name: 'LOx RQD-2',
                    field: 'LOxRQD2current',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <Graph
                  fields={
                    [
                      {
                        name: 'propaneSourceTankKg',
                        color: [255, 51, 224],
                        unit: 'KGs'
                      },
                    ]
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Graph
                  fields={
                    [
                      {
                        name: 'thrust1',
                        color: [255, 51, 224],
                        unit: 'KGs'
                      },
                      {
                        name: 'thrust2', // prop PT temp
                        color: [15, 202, 221],
                        unit: 'KGs'
                      },
                      {
                        name: 'totalThrust', // prop PT temp
                        color: [238, 154, 7],
                        unit: 'KGs'
                      },
                    ]
                  }
                />
              </Grid>
              {/* <Grid item xs={4}>

              </Grid> */}
              <Grid item xs={4}>
                <SixValueSquare
                  field1={{
                    name: 'Purge/Pre-chill Vent',
                    field: 'purgePrechillVentRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field2={{
                    name: 'Purge Flow',
                    field: 'purgeFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field3={{
                    name: 'Pre-Chill Flow',
                    field: 'prechillFlowRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field4={{
                    name: '_changeme_',
                    field: '_changeme_',
                    unit: 'A',
                    decimals: 1
                  }}
                  field5={{
                    name: 'LOx Prechill',
                    field: 'LOxPrechillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
                  }}
                  field6={{
                    name: 'Prop Prechill',
                    field: 'propanePrechillRBVcurrent',
                    unit: 'A',
                    decimals: 1,
                    threshold: 0.5
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
