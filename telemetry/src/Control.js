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
import ButtonGroupSingle from './components/ButtonGroupSingle';
import ButtonGroupRQD from './components/ButtonGroupRQD';
import ButtonGroupHeater from './components/ButtonGroupHeater';
import ButtonGroupHeaterCtrlLoop from './components/ButtonGroupHeaterCtrlLoop';
import BigButton from './components/BigButton';
import Procedures from './components/Procedures';
import SwitchButton from './components/SwitchButton'
import StateWindow from './components/StateWindow'
import Button4Group from './components/Button4Group';

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
    this.beginERegCharacterization = this.beginERegCharacterization.bind(this);
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

    this.beginFlowTimeout = setTimeout(comms.beginERegFlow, 4200);
  }

  abortAll() {
    comms.abortFuelInjectorEReg();
    comms.abortFuelTankEReg();
    comms.abortLoxInjectorEReg();
    comms.abortLoxTankEReg();
    comms.abortFlow();

    // comms.openloxTankVentRBV();
    // comms.openfuelTankVentRBV();
    // comms.openPurgeFlowRBV();
    // comms.openERegACCh2();
    // comms.openfuelPrechillRBV(); //TODO OPEN VENTS


    this.stopCountdown();
    clearTimeout(this.beginFlowTimeout)
  }

  beginERegCharacterization() {
    comms.diagnosticLoxInjectorEReg();
    comms.diagnosticFuelInjectorEReg();

    comms.startFlowFuelTankEReg();
    comms.startFlowLoxTankEReg();


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
              <Grid item={1} xs={4} className={classes.item}> {/*go away i dont like this line*/}


                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={() => comms.setEncoderFuelTankEReg(1000)}
                      close={comms.abortFuelTankEReg}
                      time={comms.setEncoderFuelTankEReg}
                      text='Set Fuel Tank EReg Encoder (0-1000)'
                      successText='1000'
                      failText ='0'
                      send_repl = 'SEND'
                    />
                  </Grid>

                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={() => comms.setEncoderLoxTankEReg(1000)}
                      close={comms.abortLoxTankEReg}
                      time={comms.setEncoderLoxTankEReg}
                      text='Set LOX Tank EReg Encoder (0-1000)'
                      successText='1000'
                      failText ='0'
                      send_repl = 'SEND'
                    />
                  </Grid>

                </Grid>
                <Grid container={true} spacing={1}>

                  <Grid item={1} xs={6}>
                  <ButtonGroupRBVTimed
                      open={() => comms.setEncoderFuelInjectorEReg(1000)}
                      close={comms.abortFuelInjectorEReg}
                      time={comms.setEncoderFuelInjectorEReg}
                      text='Set Fuel Injector EReg Encoder (0-1000)'
                      successText='1000'
                      failText ='0'
                      send_repl = 'SEND'
                    />
                  </Grid>

                  <Grid item={1} xs={6}>
                  <ButtonGroupRBVTimed
                      open={() => comms.setEncoderLoxInjectorEReg(1000)}
                      close={comms.abortLoxInjectorEReg}
                      time={comms.setEncoderLoxInjectorEReg}
                      text='Set LOX Injector EReg Encoder (0-1000)'
                      successText='1000'
                      failText ='0'
                      send_repl = 'SEND'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={() => comms.actuateMainValveFuelTankEReg(1)}
                      close={() => comms.actuateMainValveFuelTankEReg(0)}
                      text='Fuel Main Valve'
                      send_repl = 'SEND'
                      />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={() => comms.actuateMainValveLoxTankEReg(1)}
                      close={() => comms.actuateMainValveLoxTankEReg(0)}
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
                      open={comms.staticPressurizeFuelTankEReg}
                      close={comms.staticPressurizeLoxTankEReg}
                      text='Static Pressurize'
                      successText='Fuel EReg'
                      failText = 'LOX EReg'
                      disabled = {!this.state.flow_en}
                      noFeedback = {true}
                    />
                  </Grid>

                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={this.beginFlowAll}
                      close={this.abortAll}
                      field='__' // change this?
                      text='Begin Flow'
                      disabled = {!this.state.flow_en}
                      noFeedback = {true}
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>


                </Grid>
              </Grid>
              {/* START OF SECOND BUTTON COLUMN */}
              <Grid item={1} xs={4} className={classes.item}>
                <Grid container={true} spacing={2}>


                  <Grid item={1} xs={6}>
                  <Button4Group
                      open1={comms.diagnosticFuelTankEReg}
                      open2={comms.diagnosticLoxTankEReg}
                      open3={comms.diagnosticFuelInjectorEReg}
                      open4={comms.diagnosticLoxInjectorEReg}
                      button1Text='Fuel Tank'
                      button2Text='LOX Tank'
                      button3Text='Fuel Injector'
                      button4Text='LOX Injector'
                      text='Diagnostics'
                    />
                  </Grid>


                  <Grid item={1} xs={6}>
                  <Button4Group
                      open1={comms.zeroFuelTankEReg}
                      open2={comms.zeroLoxTankEReg}
                      open3={comms.zeroFuelInjectorEReg}
                      open4={comms.zeroLoxInjectorEReg}
                      button1Text='Fuel Tank'
                      button2Text='LOX Tank'
                      button3Text='Fuel Injector'
                      button4Text='LOX Injector'
                      text='Zero Encoders'
                    />
                  </Grid>
                </Grid>

                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.closeERegACCh3}
                      close={comms.openERegACCh3} //CHANGED BECAUSE WE"RE USING DIODES
                      time={comms.timeERegACCh3} 
                      field='ERegACCh3state'
                      text='Two Way'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.openERegACCh4}
                      close={comms.closeERegACCh4}
                      time={comms.timeERegACCh4}
                      field='ERegACCh4state'
                      text='Press Fill RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed

                      open={comms.closeERegACCh6}
                      close={comms.openERegACCh6}
                      time={comms.timeERegACCh6}
                      field='ERegACCh6state'
                      text='Lox Gems'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openERegAC24VCh0}
                      close={comms.closeERegAC24VCh0}
                      text='Igniter'
                      // disabled={!this.state.HPS_en}
                    />
                  </Grid>
                  

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

                      open={comms.closeERegACCh2}
                      close={comms.openERegACCh2}
                      time={comms.timeERegACCh2}
                      field='ERegACCh2state'
                      text='Igniter Enable Relay'
                    />
                  </Grid>

                </Grid>
                <Grid container={true} spacing={1}>
     
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBVTimed

                      open={comms.closeERegACCh5}
                      close={comms.openERegACCh5}
                      time={comms.timeERegACCh5}
                      field='ERegACCh5state'
                      text='Fuel Gems'
                    />
                  </Grid>

                  <Grid item={1} xs={12}>
                    <ButtonGroup
                        open={comms.openERegAC24VCh1}
                        close={comms.closeERegAC24VCh1}
                        field='_'
                        text='Breakwire'
                      />
                  </Grid>
                  <Grid item={1} xs={12}>
                    <ButtonGroup
                      open={comms.startOneSidedFuel}
                      close={comms.startOneSidedLOX}
                      text='Start Single Propellant Flow'
                      successText='Fuel EReg'
                      failText='LOX EReg'
                      disabled = {!this.state.flow_en}
                      noFeedback = {true}
                      />
                  </Grid>

                </Grid>
                <Grid container={true} spacing={1}>

                </Grid>



              </Grid>
              {/* START OF PROCEDURE COLUMN */}
              <Grid item={1} xs={2} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <CountdownTimer setStartCountdownCallback={this.setStartCountdownCallback} setStopCountdownCallback={this.setStopCountdownCallback}/>
                </Grid>
              </Grid>


            </Grid>
            <Grid container={true} spacing={1}>

              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupRBVTimed

                      open={comms.openERegACCh0}
                      close={comms.closeERegACCh0}
                      time={comms.timeERegACCh0}
                      field='fuelVentRBVState'
                      text='Fuel Vent RBV'
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupRBVTimed

                      open={comms.openfuelTankVentRBV}
                      close={comms.closefuelTankVentRBV}
                      time={comms.timefuelTankVentRBV}
                      field='fuelTankVentRBVState'
                      text='Press Fill RBV'
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                <Grid item>
                    <ButtonGroupRBVTimed
                      open={comms.openERegACCh1}
                      close={comms.closeERegACCh1}
                      time={comms.timeERegACCh1}
                      field='loxVentRBVState'
                      text='Lox Vent RBV'
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupRBVTimed
                      open={comms.openfuelPrechillRBV}
                      close={comms.closefuelPrechillRBV}
                      time={comms.timefuelPrechillRBV}
                      field='fuelPrechillRBVState'
                      text='Press Line Vent RBV'
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
              <Grid item>
                    <ButtonGroupSingle
                      open={this.beginERegCharacterization}
                      successText="Start"
                      text='Begin EReg Characterization'
                    />
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
