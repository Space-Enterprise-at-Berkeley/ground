import React, { Component } from "react";
import PropTypes from "prop-types";
import "@fontsource/roboto";
import {
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import comms from "./api/Comms";
import ButtonGroup from "./components/Buttons/ButtonGroup";
import ButtonGroupFlow from "./components/Buttons/ButtonGroupFlow";
import ButtonGroupRBV from "./components/Buttons/ButtonGroupRBV";
import ButtonGroupRBVTimed from "./components/Buttons/ButtonGroupRBVTimed";
import ButtonGroupRQD from "./components/Buttons/ButtonGroupRQD";
import ButtonGroupHeater from "./components/Buttons/ButtonGroupHeater";
import ButtonGroupHeaterCtrlLoop from "./components/Buttons/ButtonGroupHeaterCtrlLoop";
import BigButton from "./components/Buttons/BigButton";
import Procedures from "./components/Procedures";
import SwitchButton from "./components/Buttons/SwitchButton";
import StateWindow from "./components/StateWindow";

import UpdogWav from "./media/updog.wav";
import CountdownTimer from "./components/CountdownTimer";

const PAGE_TITLE = "Telemetry: Controls";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    flexGrow: 1,
    height: "100vh",
    position: "absolute",
    padding: theme.spacing(1),
  },
  row: {
    height: '100%',
    borderBottom: "0.5px solid",
    borderColor: theme.palette.text.primary,
  },
  item: {
    height: "100%",
    padding: theme.spacing(1),
  },
});

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
      HPS_en: false,
    };

    this.playUpdog = this.playUpdog.bind(this);
    this.beginFlowAll = this.beginFlowAll.bind(this);
    this.abortAll = this.abortAll.bind(this);
    this.setStartCountdownCallback = this.setStartCountdownCallback.bind(this);
    this.setStopCountdownCallback = this.setStopCountdownCallback.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.stopCountdown = this.stopCountdown.bind(this);
  }

  playUpdog() {
    new Audio(UpdogWav).play();
  }

  beginFlowAll() {
    this.startCountdown();
    // comms.closeloxTankVentRBV();
    // comms.closefuelTankVentRBV();
    // comms.closeloxPrechillRBV();
    // comms.closefuelPrechillRBV();
    // comms.closePurgeFlowRBV();

    this.sendFlowTimeout = setTimeout(comms.beginFlow, 4000);
  }

  abortAll() {
    comms.abort();

    // comms.openloxTankVentRBV();
    // comms.openfuelTankVentRBV();
    // comms.openPurgeFlowRBV();
    // comms.openloxPrechillRBV();
    // comms.openfuelPrechillRBV();
    clearTimeout(this.sendFlowTimeout);
    this.stopCountdown();
  }

  setStartCountdownCallback(callback) {
    this.startCountdownCallback = callback;
  }

  setStopCountdownCallback(callback) {
    this.stopCountdownCallback = callback;
  }

  startCountdown() {
    this.startCountdownCallback();
  }

  stopCountdown() {
    this.stopCountdownCallback();
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
    const theme = createTheme({
      palette: {
        type: this.state.isDark ? "dark" : "light",
      },
    });

    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid container className={classes.row}>
          {/* START OF FIRST BUTTON COLUMN */}
          <Grid container columns={2} xs={4} className={classes.item}>
            <Grid item xs={6}>
              <ButtonGroupRBVTimed
                open={comms.openPressurantFlowRBV}
                close={comms.closePressurantFlowRBV}
                time={comms.timePressurantFlowRBV}
                field="pressurantFlowRBVstate"
                text="Pressurant Flow RBV"
                disabled={!this.state.HPS_en}
              />
            </Grid>
            <Grid item xs={6}>
              <SwitchButton
                text="Pressurant Enable"
                open={comms.doNothing}
                close={comms.doNothing}
                field="HPSEnable"
                change={(e) => {
                  this.setState({ HPS_en: e.target.checked });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <ButtonGroup
                open={comms.openloxGemsValve}
                close={comms.closeloxGemsValve}
                field="loxGemsValveState"
                text="LOX Gems Valve"
              />
            </Grid>
            {/* <Grid item>
                    <ButtonGroup
                      open={comms.startToggleLoxGemsValve}
                      close={comms.stopToggleLoxGemsValve}
                      field='loxGemsValveState'
                      text='Toggle LOX Gems Valve'
                    />
                  </Grid> */}
            <Grid item xs={6}>
              <ButtonGroup
                open={comms.openfuelGemsValve}
                close={comms.closefuelGemsValve}
                field="fuelGemsValveState"
                text="Fuel Gems Valve"
              />
            </Grid>
            {/* <Grid item>
                    <ButtonGroup
                      open={comms.startToggleFuelGemsValve}
                      close={comms.stopToggleFuelGemsValve}
                      field='fuelGemsValveState'
                      text='Toggle Fuel Gems Valve'
                    />
                  </Grid> */}
            <Grid item xs={6}>
              <ButtonGroup
                open={comms.openarmValve}
                close={comms.closearmValve}
                field="armValveState"
                text="Arm Main Valves"
              />
            </Grid>
            {/* <Grid item xs={6}>
                    <ButtonGroup
                      open={() => {
                        comms.openloxMainValve()
                        comms.openfuelMainValve()
                      }}
                      close={() => {
                        comms.closeloxMainValve()
                        comms.closefuelMainValve()
                      }}
                      field='loxMainValveState'
                      text='Both Valves'
                    />
                  </Grid> */}
              <Grid item xs={6}>
                <ButtonGroup
                  open={comms.openMainValveVent}
                  close={comms.closeMainValveVent}
                  field="mainValveVentState"
                  text="Main Valve Vent"
                />
              </Grid>
              <Grid item xs={6}>
                <ButtonGroup
                  open={comms.openloxMainValve}
                  close={comms.closeloxMainValve}
                  field="loxMainValveState"
                  text="LOX Main"
                />
              </Grid>
              <Grid item xs={6}>
                <ButtonGroup
                  open={comms.openfuelMainValve}
                  close={comms.closefuelMainValve}
                  field="fuelMainValveState"
                  text="Fuel Main"
                />
              </Grid>
              {/* <Grid item xs={6}>
                    <ButtonGroup
                      open={comms.openMainValveVent}
                      close={comms.closeMainValveVent}
                      field='mainValveVentState'
                      text='Main Valve Vent'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ButtonGroup
                      open={comms.openPressRQD}
                      close={comms.closePressRQD}
                      field='pressRQDState'
                      text='Press RQD'
                    />
                  </Grid> */}
            <Grid item xs={6}>
              <ButtonGroupFlow
                open={comms.activateIgniter}
                close={comms.deactivateIgniter}
                field="igniterState"
                text="Igniter"
                successText="Activate"
                failText="Deactivate"
                onActuateCallback={this.playUpdog}
              />
            </Grid>
            {/* <Grid item xs={6}>
                    <ButtonGroupFlow
                      open={this.beginFlowAll}
                      close={this.abortAll}
                      field='__' // change this?
                      text='Begin Flow'
                    />
                  </Grid> */}
              <Grid item xs={6}>
                <SwitchButton
                  open={comms.enableIgniter}
                  close={comms.disableIgniter}
                  field="igniterEnableState"
                  text="Igniter Enable"
                />
              </Grid>
            </Grid>

            {/* START OF SECOND BUTTON COLUMN */}
            <Grid container xs={6} className={classes.item}>
              <Grid item xs={4}>
                <ButtonGroupRBVTimed
                  open={comms.openPressurantFillRBV}
                  close={comms.closePressurantFillRBV}
                  time={comms.timePressurantFillRBV}
                  field="pressurantFillRBVstate"
                  text="N2 Fill RBV"
                />
              </Grid>
              <Grid item xs={4}>
                <ButtonGroupRBVTimed
                  open={comms.openPressurantFillVentRBV}
                  close={comms.closePressurantFillVentRBV}
                  time={comms.timePressurantFillVentRBV}
                  field="pressurantFillVentRBVstate"
                  text="N2 Fill Vent"
                />
              </Grid>
              <Grid item xs={4}>
                <ButtonGroup
                  open={comms.openPressRQD}
                  close={comms.closePressRQD}
                  field="pressRQDState"
                  text="N2 RQD"
                />
              </Grid>
              <Grid item xs={4}>
                <ButtonGroupRBVTimed
                  open={comms.openloxFillRBV}
                  close={comms.closeloxFillRBV}
                  time={comms.timeloxFillRBV}
                  field="loxFillRBVstate"
                  text="LOX Fill RBV"
                />
              </Grid>
              <Grid item xs={4}>
                <ButtonGroupRBVTimed
                  open={comms.openfuelFillRBV}
                  close={comms.closefuelFillRBV}
                  time={comms.timefuelFillRBV}
                  field="fuelFillRBVstate"
                  text="Fuel Fill RBV"
                />
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                {/* <ButtonGroup
                  open={comms.openMainValvePurge}
                  close={comms.closeMainValvePurge}
                  field="mainValvePurgeState"
                  text="N2 Purge"
                /> */}
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={6}>
                <SwitchButton
                  open={comms.enableFlightMode}
                  close={comms.disableFlightMode}
                  field="_"
                  text="Flight Mode"
                />
              </Grid>
              <Grid item xs={4}>
                <SwitchButton
                  open={comms.enablelaunchMode}
                  close={comms.disablelaunchMode}
                  field="flightEnable"
                  text="Launch Enable"
                />
              </Grid>
              <Grid item xs={12}>
                <BigButton
                  // onClick ?
                  text="Launch"
                />
              </Grid>
              <Grid item xs={12}>
                <BigButton
                  onClick={() => {
                    comms.abort();
                  }}
                  text="Abort"
                  isRed
                />
              </Grid>
              {/* <Grid item xs={6}>
                    <SwitchButton
                      open={comms.enableIgniter}
                      close={comms.disableIgniter}
                      field='_'
                      text='Igniter Enable'
                    />
                  </Grid> */}
            {/* <Grid item xs={12}>
                    <StateWindow
                      onUpdate={comms.setProcedureState}
                      onState0Enter={comms.startCheckout}
                      onState0Exit={comms.endCheckout}
                    />
                  </Grid> */}
            {/* <Grid item xs={12}>
                    <SwitchButton
                        open={comms.enableFlightMode}
                        close={comms.disableFlightMode}
                        field='_'
                        text='Flight Mode' 
                      />
                  </Grid> */}
          </Grid>

          {/* START OF PROCEDURE COLUMN */}
          <Grid item xs={2} className={classes.item}>
            <Grid container={true} spacing>
              <CountdownTimer
                setStartCountdownCallback={this.setStartCountdownCallback}
                setStopCountdownCallback={this.setStopCountdownCallback}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Control.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Control);
