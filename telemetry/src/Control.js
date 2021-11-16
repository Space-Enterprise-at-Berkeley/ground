import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import comms from './api/Comms';
import ButtonGroup from './components/ButtonGroup';
import ButtonGroupFlow from './components/ButtonGroupFlow';
import ButtonGroupRBV from './components/ButtonGroupRBV';
import ButtonGroupRBVTimed from './components/ButtonGroupRBVTimed';
import ButtonGroupRQD from './components/ButtonGroupRQD';
import ButtonGroupHeater from './components/ButtonGroupHeater';
import ButtonGroupHeaterCtrlLoop from './components/ButtonGroupHeaterCtrlLoop';
import BigButton from './components/BigButton';
import Procedures from './components/Procedures';
import SwitchButton from './components/SwitchButton'
import StateWindow from './components/StateWindow'

import UpdogWav from './media/updog.wav';
import CountdownTimer from './components/CountdownTimer';

const PAGE_TITLE = "Telemetry: Controls"

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
    // height: '100%'
    borderBottom: '0.5px solid',
    borderColor: theme.palette.text.primary
  },
  item: {
    height: '100%'
  },
});

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
      HPS_en: false
    };

    this.handleDarkMode = this.handleDarkMode.bind(this);
    this.playUpdog = this.playUpdog.bind(this);
    this.setStartCountdownCallback = this.setStartCountdownCallback.bind(this);
    this.setStopCountdownCallback = this.setStopCountdownCallback.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.stopCountdown = this.stopCountdown.bind(this);
  }

  handleDarkMode(isDark) {
    this.setState({ isDark });
  }

  playUpdog() {
    (new Audio(UpdogWav)).play();
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
              {/* START OF FIRST BUTTON COLUMN */}
              <Grid item={1} xs={4} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPressurantFlowRBV}
                      close={comms.closePressurantFlowRBV}
                      time={comms.timePressurantFlowRBV}
                      field='pressurantFlowRBVstate'
                      text='Pressurant Flow RBV'
                      disabled={!this.state.HPS_en}
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <SwitchButton
                      text='Pressurant Enable'
                      open={comms.doNothing}
                      close={comms.doNothing}
                      field='HPSEnable'
                      change={e => {this.setState({HPS_en: e.target.checked});} }
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openloxTankVentRBV}
                      close={comms.closeloxTankVentRBV}
                      time={comms.timeloxTankVentRBV}
                      field='loxTankVentRBVstate'
                      text='LOX Tank Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openfuelTankVentRBV}
                      close={comms.closefuelTankVentRBV}
                      time={comms.timefuelTankVentRBV}
                      field='fuelTankVentRBVstate'
                      text='Fuel Tank Vent RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openarmValve}
                      close={comms.closearmValve}
                      field='armValve'
                      text='Arm Main Valves'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={() => {
                        comms.openloxMainValve()
                        comms.openfuelMainValve()
                      }}
                      close={() => {
                        comms.closeloxMainValve()
                        comms.closefuelMainValve()
                      }}
                      field='loxMainValve'
                      text='Both Valves'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openloxMainValve}
                      close={comms.closeloxMainValve}
                      field='loxMainValve'
                      text='LOX Main'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openfuelMainValve}
                      close={comms.closefuelMainValve}
                      field='fuelMainValve'
                      text='Prop Main'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupFlow
                      open={comms.extendIgniterInserter}
                      close={comms.retractIgniterInserter}
                      field='igniterInserterState' // change this?
                      text='Igniter Inserter'
                      successText='Extend'
                      failText='Retract'
                    />
                  </Grid> */}
                  <Grid item={1} xs={6}>
                    <ButtonGroupFlow
                      open={comms.activateIgniter}
                      close={comms.deactivateIgniter}
                      field='igniter'
                      text='Igniter'
                      successText='Activate'
                      failText='Deactivate'
                      onActuateCallback={this.playUpdog}
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupFlow
                      open={() => { comms.beginFlowAll(); this.startCountdown() }}
                      close={() => { comms.endFlow(); this.stopCountdown(); }}
                      field='flowState' // change this?
                      text='Begin Flow'
                    />
                  </Grid>
                </Grid>
                {/* <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupFlow
                      open={comms.beginFlowAll}
                      close={comms.endFlow}
                      field='flowState' // change this?
                      text='Begin Flow'
                      disabled={!this.state.HPS_en}
                    />
                  </Grid>
                </Grid> */}
              </Grid>
              {/* START OF SECOND BUTTON COLUMN */}
              <Grid item={1} xs={4} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPurgeFlowRBV}
                      close={comms.closePurgeFlowRBV}
                      time={comms.timePurgeFlowRBV}
                      field='purgeFlowRBVstate'
                      text='Purge Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openloxPrechillRBV}
                      close={comms.closeloxPrechillRBV}
                      time={comms.timeloxPrechillRBV}
                      field='loxPrechillRBVstate'
                      text='LOX Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPrechillFlowRBV}
                      close={comms.closePrechillFlowRBV}
                      time={comms.timePrechillFlowRBV}
                      field='prechillFlowRBVstate'
                      text='Prechill Flow RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openfuelPrechillRBV}
                      close={comms.closefuelPrechillRBV}
                      time={comms.timefuelPrechillRBV}
                      field='fuelPrechillRBVstate'
                      text='Fuel Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPurgePrechillVentRBV}
                      close={comms.closePurgePrechillVentRBV}
                      time={comms.setLoxCapBase}
                      field='purgePrechillVentRBVstate'
                      text='Lox Base Cap'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPurgePrechillVentRBV}
                      close={comms.closePurgePrechillVentRBV}
                      time={comms.setFuelCapBase}
                      field='purgePrechillVentRBVstate'
                      text='Fuel Base Cap'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <BigButton
                      onClick={() => {comms.abort(); this.stopCountdown()}}
                      text='Abort'
                      isRed
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={12}>
                    <BigButton
                      onClick={comms.hold}
                      text='Hold'
                    />
                  </Grid> */}
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <StateWindow
                      onUpdate={comms.setProcedureState}
                      onState0Enter={comms.startCheckout}
                      onState0Exit={comms.endCheckout}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* START OF THIRD BUTTON COLUMN */}
              <Grid item={1} xs={2} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBVTimed
                      open={comms.openPressurantFillRBV}
                      close={comms.closePressurantFillRBV}
                      time={comms.timePressurantFillRBV}
                      field='pressurantFillRBVstate'
                      text='N2 Fill RBV'
                    />
                  </Grid>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPressurantFlowRBV}
                      close={comms.closePressurantFlowRBV}
                      time={comms.timePressurantFlowRBV}
                      field='pressurantFlowRBVstate'
                      text='Pressurant Flow RBV'
                    />
                  </Grid> */}
                </Grid>
                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openloxTankVentRBV}
                      close={comms.closeloxTankVentRBV}
                      time={comms.timeloxTankVentRBV}
                      field='loxTankVentRBVstate'
                      text='LOX Tank Vent RBV'
                    />
                  </Grid> */}
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBVTimed
                      open={comms.openloxFillRBV}
                      close={comms.closeloxFillRBV}
                      time={comms.timeloxFillRBV}
                      field='loxFillRBVstate'
                      text='LOX Fill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openLOxVentRBV}
                      close={comms.closeLOxVentRBV}
                      time={comms.timeLOxVentRBV}
                      field='LOxVentRBVstate'
                      text='LOX Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openLOxRQD}
                      close={comms.closeLOxRQD}
                      time={comms.timeLOxRQD}
                      field='LOxRQD1state'
                      text='LOX RQD'
                      noClose
                    />
                  </Grid> */}
                </Grid>

                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openfuelTankVentRBV}
                      close={comms.closefuelTankVentRBV}
                      time={comms.timefuelTankVentRBV}
                      field='fuelTankVentRBVstate'
                      text='Prop Tank Vent RBV'
                    />
                  </Grid> */}
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBVTimed
                      open={comms.openfuelFillRBV}
                      close={comms.closefuelFillRBV}
                      time={comms.timefuelFillRBV}
                      field='fuelFillRBVstate'
                      text='Fuel Fill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <SwitchButton
                      open={comms.enableThermocoupleRead}
                      close={comms.disableThermocoupleRead}
                      field='thermocoupleReadEnable'
                      text='Thermocouple Read'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPropaneVentRBV}
                      close={comms.closePropaneVentRBV}
                      time={comms.timePropaneVentRBV}
                      field='propaneVentRBVstate'
                      text='Prop Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPropaneRQD}
                      close={comms.closePropaneRQD}
                      time={comms.timePropaneRQD}
                      field='PropaneRQD1state'
                      text='Propane RQD'
                      noClose
                    />
                  </Grid> */}
                </Grid>
              </Grid>
              {/* START OF PROCEDURE COLUMN */}
              <Grid item={1} xs={2} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <CountdownTimer setStartCountdownCallback={this.setStartCountdownCallback} setStopCountdownCallback={this.setStopCountdownCallback}/>
                </Grid>
              </Grid>

              {/* <Grid item={1} xs={3} className={classes.item}>
                <Procedures />
              </Grid> */}
            </Grid>
            <Grid container={true} spacing={1}>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOX Tank Top Heater'
                      sendDuty={comms.setloxTankTopHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOX Tank Middle Heater'
                      sendDuty={comms.setloxTankMidHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOX Tank Bottom Heater'
                      sendDuty={comms.setloxTankBottomHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Fuel Tank Top Heater'
                      sendDuty={comms.setfuelTankTopHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Fuel Tank Middle Heater'
                      sendDuty={comms.setfuelTankMidHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Fuel Tank Bottom Heater'
                      sendDuty={comms.setfuelTankBottomHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='LOX Tank PT Heater'
                      sendDuty={comms.setloxTankPTHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='LOX Injector PT Heater'
                      sendDuty={comms.setloxInjectorPTHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='Fuel Tank PT Heater'
                      sendDuty={comms.setfuelTankPTHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='Fuel Injector PT Heater'
                      sendDuty={comms.setfuelInjectorPTHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Control.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Control);
