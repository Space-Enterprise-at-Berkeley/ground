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
      HPS_en: false,
      flow_en: false
    };

    this.handleDarkMode = this.handleDarkMode.bind(this);
    this.playUpdog = this.playUpdog.bind(this);
    this.beginFlowAll = this.beginFlowAll.bind(this);
    this.abortAll = this.abortAll.bind(this);
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

  beginFlowAll() {
    this.startCountdown();
    // comms.closeloxTankVentRBV();
    // comms.closefuelTankVentRBV();
    // comms.closeERegACCh2();
    // comms.closefuelPrechillRBV();
    // comms.closePurgeFlowRBV(); //TODO change mappings to close packets automatically for EReg

    setTimeout(comms.beginERegFlow, 4000);
  }

  abortAll() {
    comms.abortEReg();

    // comms.openloxTankVentRBV();
    // comms.openfuelTankVentRBV();
    // comms.openPurgeFlowRBV();
    // comms.openERegACCh2();
    // comms.openfuelPrechillRBV(); //TODO OPEN VENTS


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
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openERegAC24VCh0}
                      close={comms.closeERegAC24VCh0}
                      text='24VChan0'
                      // disabled={!this.state.HPS_en}
                    />
                  </Grid> */}

                  </Grid>
                  {/* <Grid item={1} xs={6}>
                    <SwitchButton
                        open={comms.openERegAC24VCh1}
                        close={comms.closeERegAC24VCh1}
                        field='_'
                        text='24VChan1'
                        change={e => {this.setState({HPS_en: e.target.checked});} }
                      />
                </Grid> */}
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={() => comms.setFuelERegEncoder(1000)}
                      close={() => comms.setFuelERegEncoder(0)}
                      time={comms.setFuelERegEncoder}
                      text='Set Fuel EReg Encoder (0-1000)'
                      successText='1000'
                      failText ='0'
                      send_repl = 'SEND'
                    />
                  </Grid>

                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={() => comms.setLOXERegEncoder(1000)}
                      close={() => comms.setLOXERegEncoder(0)}
                      time={comms.setLOXERegEncoder}
                      text='Set LOX EReg Encoder (0-1000)'
                      successText='1000'
                      failText ='0'
                      send_repl = 'SEND'
                    />
                  </Grid>

                </Grid>
                <Grid container={true} spacing={1}>
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openarmValve}
                      close={comms.closearmValve}
                      field='armValveState'
                      text='Arm Main Valves'
                    />
                  </Grid> */}
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.zeroERegFuelEncoder}
                      close={comms.zeroERegLOXEncoder}
                      text='Zero Encoder'
                      successText='Fuel EReg'
                      failText='LOX EReg'
                    />
                  </Grid>

                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.sendFuelERegDiag}
                      close={comms.sendLOXERegDiag}
                      text='Run Diagnostic'
                      successText='Fuel EReg'
                      failText='LOX EReg'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={() => comms.actuateFuelERegMainValve(1)}
                      close={() => comms.actuateFuelERegMainValve(0)}
                      text='Fuel Main Valve'
                      send_repl = 'SEND'
                      />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={() => comms.actuateLOXERegMainValve(1)}
                      close={() => comms.actuateLOXERegMainValve(0)}
                      text='LOX Main Valve'
                      send_repl = 'SEND'
                      />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                <Grid item={1} xs={6}>
                    <SwitchButton
                      open={comms.doNothing}
                      close={comms.doNothing}
                      text='Enable Static Press & Flow'
                      change={e => {this.setState({flow_en: e.target.checked});}}
                      />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.pressERegFuelStatic}
                      close={comms.pressERegLOXStatic}
                      text='Static Pressurize'
                      successText='Fuel EReg'
                      failText = 'LOX EReg'
                      disabled = {!this.state.flow_en}
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.startOneSidedFuel}
                      close={comms.startOneSidedLOX}
                      text='Start Single Propellant Flow'
                      successText='Fuel EReg'
                      failText='LOX EReg'
                      disabled = {!this.state.flow_en}
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupFlow
                      open={this.beginFlowAll}
                      close={this.abortAll}
                      field='__' // change this?
                      text='Begin Flow'
                      disabled = {!this.state.flow_en}
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
                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupFlow
                      open={comms.activateIgniter}
                      close={comms.deactivateIgniter}
                      field='igniterState'
                      text='Igniter'
                      successText='Activate'
                      failText='Deactivate'
                      onActuateCallback={this.playUpdog}
                    />
                  </Grid> */}

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
                      open={comms.openERegACCh0}
                      close={comms.closeERegACCh0}
                      time={comms.timeERegACCh0}
                      field='ERegACCh0state'
                      text='RBV Channel 0'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openERegACCh1}
                      close={comms.closeERegACCh1}
                      time={comms.timeERegACCh1}
                      field='ERegACCh1state'
                      text='RBV Channel 1'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.openERegACCh3}
                      close={comms.closeERegACCh3}
                      time={comms.timeERegACCh3}
                      field='ERegACCh3state'
                      text='RBV Channel 3'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.openERegACCh4}
                      close={comms.closeERegACCh4}
                      time={comms.timeERegACCh4}
                      field='ERegACCh4state'
                      text='RBV Channel 4'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.openERegACCh6}
                      close={comms.closeERegACCh6}
                      time={comms.timeERegACCh6}
                      field='ERegACCh6state'
                      text='RBV Channel 6'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openERegAC24VCh0}
                      close={comms.closeERegAC24VCh0}
                      text='24VChan0'
                      // disabled={!this.state.HPS_en}
                    />
                  </Grid>
                  

                  {/* <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.openERegACCh6}
                      close={comms.closeERegACCh6}
                      time={comms.timeERegACCh6}
                      field='ERegACCh6state'
                      text='Channel 6'
                    />
                  </Grid> */}
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <BigButton
                      onClick={() => {this.abortAll()}}
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

                      open={comms.openERegACCh2}
                      close={comms.closeERegACCh2}
                      time={comms.timeERegACCh2}
                      field='ERegACCh2state'
                      text='RBV Channel 2'
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

                      open={comms.openERegACCh5}
                      close={comms.closeERegACCh5}
                      time={comms.timeERegACCh5}
                      field='ERegACCh5state'
                      text='RBV Channel 5'
                    />
                  </Grid>

                  <Grid item={1} xs={12}>
                    <ButtonGroup
                        open={comms.openERegAC24VCh1}
                        close={comms.closeERegAC24VCh1}
                        field='_'
                        text='24VChan1'
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

                {/* <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openfuelTankVentRBV}
                      close={comms.closefuelTankVentRBV}
                      time={comms.timefuelTankVentRBV}
                      field='fuelTankVentRBVstate'
                      text='Prop Tank Vent RBV'
                    />
                  </Grid> */}
                  {/* <Grid item={1} xs={12}>
                    <ButtonGroupRBVTimed
                    open={comms.openPrechillFlowRBV}
                    close={comms.closePrechillFlowRBV}
                    time={comms.timePrechillFlowRBV}
                    field='prechillFlowRBVstate'
                    text='Prechill Flow RBV'
                    />
                  </Grid>
                </Grid> */}
                {/* <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <SwitchButton
                      open={comms.enableFastRead}
                      close={comms.disableFastRead}
                      field='_'
                      text='Fast Read Rate'
                    />
                  </Grid>
                </Grid> */}
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
              {/* <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOX Tank Top Heater'
                      activate={comms.activateLoxTankTopHtr}
                      deactivate={comms.deactivateLoxTankTopHtr}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOX Tank Middle Heater'
                      activate={comms.activateLoxTankMidHtr}
                      deactivate={comms.deactivateLoxTankMidHtr}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOX Tank Bottom Heater'
                      activate={comms.activateLoxTankBottomHtr}
                      deactivate={comms.deactivateLoxTankBottomHtr}
                    />
                  </Grid>
                </Grid>
              </Grid> */}
              {/* <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroup
                      open={comms.openloxGemsValve}
                      close={comms.closeloxGemsValve}
                      field='loxGemsValveState'
                      text='LOX Gems Valve'
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroup
                      open={comms.startToggleLoxGemsValve}
                      close={comms.stopToggleLoxGemsValve}
                      field='loxGemsValveState'
                      text='Toggle LOX Gems Valve'
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroup
                      open={comms.openfuelGemsValve}
                      close={comms.closefuelGemsValve}
                      field='fuelGemsValveState'
                      text='Fuel Gems Valve'
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroup
                      open={comms.startToggleFuelGemsValve}
                      close={comms.stopToggleFuelGemsValve}
                      field='fuelGemsValveState'
                      text='Toggle Fuel Gems Valve'
                    />
                  </Grid>
                </Grid>
              </Grid> */}
              {/* <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroup
                      open={comms.activateLoxTankMidHtr}
                      close={comms.deactivateLoxTankMidHtr}
                      text='Main Valve Vent'
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroup
                      open={comms.activateLoxTankBottomHtr}
                      close={comms.deactivateLoxTankBottomHtr}
                      text='RQD'
                    />
                  </Grid>
                </Grid>
              </Grid> */}
              <Grid item={1} xs={3} className={classes.item}>
                
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
