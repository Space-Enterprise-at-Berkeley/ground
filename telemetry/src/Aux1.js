import React, { Component } from "react";
import PropTypes from "prop-types";
import "@fontsource/roboto";
import {
  withStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import comms from "./api/Comms";
import Graph from "./components/Graph";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";
import SixValueSquare from "./components/SixValueSquare";
import TankHeaterSquare from "./components/TankHeaterSquare";
import MessageDisplaySquare from "./components/MessageDisplaySquare";
import RocketOrientation from "./components/RocketOrientation";
import Map from "./components/Map";

const PAGE_TITLE = "Telemetry: Aux 1";

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
    height: "50%",
  },
  navbarGrid: {
    // height: theme.spacing(2)
  },
});

class Aux1 extends Component {
  constructor(props) {
    super(props);
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

    return (
      <React.Fragment>
        <CssBaseline />
        <Box>
          <Container maxWidth="xl" className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={6} className={classes.item}>
                <SixValueSquare
                  fields={[
                    ["Altitude", "baroAltitude", "m", 2],
                    ["Ascent Speed", "ascentSpeed", "m/s", 2],
                    ["Temperature", "baroTemperature", "F", 2],
                    ["X Accel", "accelX", "g", 2],
                    ["Y Accel", "accelY", "g", 2],
                    ["Z Accel", "accelZ", "g", 2],
                  ]}
                />
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <Map fieldLat={"gpsLatitude"} fieldLong={"gpsLongitude"} />
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <SixValueSquare
                  fields={[
                    ["BBox Data Written", "dataWritten", "KB", 1, 1],
                    ["Apogee Time", "apogeeTime", "us", 0, 1],
                    ["Radio RSSI", "radioRSSI", ""],
                    ["GPS Latitude", "gpsLatitude", "", 4],
                    ["GPS Longitude", "gpsLongitude", "", 4],
                    ["GPS Sat Count", "numGpsSats", "", 1],
                  ]}
                />
              </Grid>
              <Grid item={1} xs={6} className={classes.item}>
                <RocketOrientation
                  fieldQW={"qW"}
                  fieldQX={"qX"}
                  fieldQY={"qY"}
                  fieldQZ={"qZ"}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </React.Fragment>
    );
  }
}

Aux1.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Aux1);
