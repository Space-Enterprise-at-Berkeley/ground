import React, { Component } from "react";
import PropTypes from "prop-types";
import "@fontsource/roboto";
import {
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box, Container, Grid } from "@material-ui/core";

import Graph from "./components/Graph";
import SixValueSquare from "./components/SixValueSquare";

import comms from "./api/Comms";
import MessageDisplaySquare from "./components/MessageDisplaySquare";

const PAGE_TITLE = "Telemetry: Aux #2";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    flexGrow: 1,
    position: "absolute",
    top: theme.spacing(6),
    // height: '100vh',
    bottom: "0px",
    padding: theme.spacing(1),
  },
  row: {
    height: "100%",
  },
  item: {
    height: "33%",
  },
  navbarGrid: {
    // height: theme.spacing(2)
  },
});


class Aux2 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = PAGE_TITLE;
    comms.connect();
    // comms.addDarkModeListener(this.handleDarkMode);
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    // comms.removeDarkModeListener(this.handleDarkMode);
    comms.destroy();
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={1} className={classes.row}>
            {/* START OF ROW 1 */}
            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Igniter Voltage", "igniterVoltage", "V", 0, 3],
                  ["Igniter Arm Voltage", "igniterEnableVoltage", "V", 0, 3],
                  ["Main Arm Voltage", "armValveVoltage", "V", 0, 3],
                  ["Igniter Current", "igniterCurrent", "A", 2, 0.1],
                  ["Igniter Arm Current", "igniterEnableCurrent", "A", 2, 0.05],
                  ["Arm Valve Current", "armValveCurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Main Vent", "mainValveVentVoltage", "V", 0, 3],
                  ["LOX Main", "loxMainValveVoltage", "V", 0, 3],
                  ["Fuel Main", "fuelMainValveVoltage", "V", 0, 3],
                  ["Main Vent", "mainValveVentCurrent", "A", 2, 0.1],
                  ["LOX Main", "loxMainValveCurrent", "A", 2, 0.1],
                  ["Fuel Main", "fuelMainValveCurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["LOX GEMS Continuity", "loxGemsVoltage", "V", 0, 3],
                  ["Fuel GEMS Continuity", "fuelGemsVoltage", "V", 0, 3],
                  ["Press Flow Continuity", "pressurantFlowRBVvoltage", "V", 0, 3],
                  ["LOX GEMS Current", "loxGemsCurrent", "A", 2, 0.1],
                  ["Fuel Gems Current", "fuelGemsCurrent", "A", 2, 0.1],
                  ["Press Flow Current", "pressurantFlowRBVcurrent", "A", 2, 0.05],
                ]}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Breakwire Voltage", "breakwireVoltage", "V", 0, 3],
                  ["RQD Voltage", "RQDVoltage", "V", 0, 3],
                  ["Press Fill Voltage", "pressurantFillRBVvoltage", "V", 0, 3],
                  ["Breakwire Current", "breakwireCurrent", "A", 2, 0.1],
                  ["RQD Current", "RQDCurrent", "A", 2, 0.1],
                  [
                    "Press Fill Current",
                    "pressurantFillRBVcurrent",
                    "A",
                    2,
                    0.1,
                  ],
                ]}
              />
            </Grid>

            {/* START OF ROW 2 */}

            <Grid item xs={4} className={classes.item}>
              <Graph fields={[
                  { name: "fuelDSideTC", color: [252, 186, 3], unit: "ºC", }, //fuel side, dometc0
                  { name: "fuelDTopTC", color: [13, 255, 158], unit: "ºC", }, // fuel top, dometc1
                  { name: "loxDSideTC", color: [22, 131, 240], unit: "ºC", }, // lox side, dometc3
                  { name: "loxDTopTC", color: [255, 0, 174], unit: "ºC", } // lox top, dometc2
                  , ]}>  
                </Graph>
            </Grid>


            {/* START OF ROW 3 */}

            <Grid item xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["LOx Dome Heater Current", "loxDomeHeaterCurrent", "A", 2, 0.1], 
                  ["Fuel Dome Heater Current", "fuelDomeHeaterCurrent", "A", 2, 0.1],
                  ["Flight Mode Enabled", "flightEnable", ""],
                  ["LOX Fill Current", "loxFillRBVcurrent", "A", 2, 0.1],
                  ["Fuel Fill Current", "fuelFillRBVcurrent", "A", 2, 0.1],
                  ["Press Fill Vent Current", "pressurantFillVentRBVcurrent", "A", 2, 0.1],
                ]}
              />
            </Grid>
            
            <Grid xs={4} className={classes.item}>
              <Graph fields={
                [ { name: "loxDomeTC", color: [0, 126, 254], unit: "ºC", },
                  { name: "TC1", color: [0, 187, 0], unit: "ºC", }, 
                  { name: "TC2", color: [123, 35, 162], unit: "ºC", },
                  { name: "TC3", color: [35, 123, 162], unit: "ºC", } ]}> 
              </Graph>
            </Grid>
            
            <Grid item xs={4} className={classes.item}>
              <Graph fields={
                [ { name: "thrust0", color: [255, 51, 224], unit: "LBS", },
                { name: "thrust1", color: [15, 202, 221], unit: "LBS", }, 
                { name: "thrust2", color: [202, 15, 221], unit: "LBS", },
                { name: "totalThrust", color: [238, 154, 7], unit: "LBS", } ]}> 
              </Graph>
            </Grid>

            <Grid item xs={4} className={classes.item}>
              <MessageDisplaySquare />
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

Aux2.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Aux2);
