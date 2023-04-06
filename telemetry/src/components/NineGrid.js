import React, { Component } from "react";
import PropTypes from "prop-types";
import "@fontsource/roboto";
import {
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Box, Container, Grid, Typography} from "@material-ui/core";

import Graph from "./Graph";
import SixValueSquare from "./SixValueSquare";

import comms from "../api/Comms";
import MessageDisplaySquare from "./MessageDisplaySquare";
import Field from "./Field";
import ErrorSquare from "./ErrorSquare";
import FourButtonSquare from "./FourButtonSquare";
import LaunchButton from "./LaunchButton";
import ProgressBarsSquare from "./ProgressBarsSquare";

// const fields = [
//   [
//     {
//       name: "pressurantPT",
//       color: [70, 1, 155],
//       unit: "PSI",
//     },
//   ],
//   [
//     {
//       name: "loxTankPT",
//       color: [0, 126, 254],
//       unit: "PSI",
//     },
//   ],
//   [
//     {
//       name: "fuelTankPT",
//       color: [0, 187, 0],
//       unit: "PSI",
//     },
//   ],
//   [
//     {
//       name: "loxInjectorPT",
//       color: [221, 0, 0],
//       unit: "PSI",
//     },
//     {
//       name: "fuelInjectorPT",
//       color: [70, 1, 155],
//       unit: "PSI",
//     },
//   ],
//   [
//     {
//       name: "loxCapVal",
//       color: [59, 126, 161],
//       unit: "pF",
//       precision: 3,
//     },
//     {
//       name: "loxCapValFiltered",
//       color: [0, 50, 98],
//       unit: "pF",
//       precision: 3,
//     },
    
//   ],
//   [
//     {
//       name: "fuelCapVal",
//       color: [253, 181, 21],
//       unit: "pF",
//       precision: 3,
//     },
//     {
//       name: "fuelCapValFiltered",
//       color: [196, 130, 14],
//       unit: "pF",
//       precision: 3,
//       },
//   ],
// ];

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    flexGrow: 1,
    position: "absolute",
    top: theme.spacing(6),
    bottom: "0px",
    padding: theme.spacing(1),
  },
  row: {
    height: "100%",
  },
  item: {
    height: "33%",
  }
});

class NineGrid extends Component {
  constructor(props) {
    super(props);
    this.windowConfig = props.windowConfig;
    this.config = props.config;
    // this.lastPressRocValue = 0;
    // this.lastPressRocTime = window.performance.now();
    // this.rocValues = [];

    // this.calcPressRoc = this.calcPressRoc.bind(this);
  }

  // calcPressRoc(value) {
    
  //   const currentPressRocTime = window.performance.now();
  //   const delta_press_roc = (value - this.lastPressRocValue) * 1000.0 / (currentPressRocTime - this.lastPressRocTime);
    
  //   this.rocValues.unshift(delta_press_roc);
  //   if (this.rocValues.length > 30) {
  //     this.rocValues.pop();
  //   }
  //   this.lastPressRocTime = currentPressRocTime;
  //   this.lastPressRocValue = value;

  //   let sum = 0;
  //   for (let rocVal of this.rocValues) {
  //     sum += Number(rocVal);
  //   }
  //   return sum / this.rocValues.length;
  // }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={1} className={classes.row}>
            {
              this.windowConfig.slots.map(field => (
                <Grid item={1} xs={4} className={classes.item}>
                  {
                    (() => {
                      switch (field.type) {
                        case "logs":
                          return (
                            <MessageDisplaySquare />
                          )
                        case "six-square":
                          return (
                            <SixValueSquare fields={
                              field.values.map(value => [
                                value.field,
                                value.name,
                                value.units,
                                null,
                                null,
                                null,
                                null,
                                value.func
                              ])}
                            />
                          )
                        case "graph":
                          return (
                            <Graph fields={
                              field.values.map(value => ({
                                field: value.field,
                                name: value.name,
                                color: value.color,
                                unit: value.units
                              }))}
                            />
                          )
                        case "four-button":
                          return (
                            <FourButtonSquare fields={
                              field.buttons.map(value => [
                                value.id,
                                value.type,
                                value.name,
                                value.field,
                                value.actions,
                                value.safe || false,
                                value.green || []
                              ])}
                            />
                          )
                        case "launch":
                          return (
                            <LaunchButton mode={this.config.mode} />
                          )
                        case "progress":
                          return (
                            <ProgressBarsSquare fields={
                              field.values.map(value => ({
                                field: value.field,
                                name: value.name,
                                units: value.units,
                                color: value.color,
                                minValue: value.minValue,
                                delta: value.delta
                              }))}
                            />
                          )
                        default:
                          return (
                            <ErrorSquare error={`Field type "${field.type}" not found`} />
                          )
                      }
                    })()
                  }
                </Grid>
              ))
            }
            {/* {fields.slice(0, 3).map((field) => (
              <Grid item={1} xs={4} className={classes.item}>
                <Graph fields={field} />
              </Grid>
            ))}

            <Grid item={1} xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["LOX DOME", "loxDomePT", "PSI"],
                  ["RQD Pressure", "rqdPT", "PSI"],
                  ["Purge Bottle", "purgePT", "PSI"],
                  ["Fuel DOME", "fuelDomePT", "PSI"],
                  ["PressPT ROC", "pressurantPT", "PSI/S", 1, 35, this.calcPressRoc, '#E25241'],
                  ["Main Valve PT", "mainValvePT", "PSI"],
                ]}
              />
            </Grid>

            <Grid item={1} xs={4} className={classes.item}>
              <SixValueSquare
                fields={[
                  ["Burn Time", "autoBurnTime", "us", 2],
                  ["LOx Lead", "autoLoxLead", "us", 2],
                  ["Igniter Abort Enable", "autoIgniterAbortEnabled", "", 0, 1],
                  ["Breakwire Abort Enable", "autoBreakwireAbortEnabled", "", 0, 1],
                ]}
              />
            </Grid>

            {fields.slice(3, 6).map((field) => (
              <Grid item={1} xs={4} className={classes.item}>
                <Graph fields={field} />
              </Grid>
            ))}

            
            {fields.slice(6).map((field) => (
              <Grid item={1} xs={4} className={classes.item}>
                <Graph fields={field} />
              </Grid>
            ))}

            <Grid item={1} xs={4} className={classes.item}>
              <MessageDisplaySquare />
            </Grid> */}

          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

// NineGrid.propTypes = {
//   classes: PropTypes.object.isRequired,
// };
export default withStyles(styles)(NineGrid);
