import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
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
  }

  handleDarkMode(isDark) {
    this.setState({ isDark });
  }

  playUpdog() {
    (new Audio(UpdogWav)).play();
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
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              {/* START OF FIRST BUTTON COLUMN */}
              <Grid item={1} xs={4} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openHPS}
                      close={comms.closeHPS}
                      field='HPS'
                      text='Pressurant'
                      disabled={!this.state.HPS_en}
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <SwitchButton
                      text='Pressurant Enable'
                      open={comms.enableHPS}
                      close={comms.disableHPS}
                      field='HPSEnable'
                      change={e => {this.setState({HPS_en: e.target.checked});} }
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openLoxGems}
                      close={comms.closeLoxGems}
                      field='loxGems'
                      text='LOX GEMS'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openPropGems}
                      close={comms.closePropGems}
                      field='propGems'
                      text='Prop GEMS'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroup
                      open={comms.openLox2Way}
                      close={comms.closeLox2Way}
                      field='lox2Way'
                      text='Arm Main Valves'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openLox5Way}
                      close={comms.closeLox5Way}
                      field='lox5Way'
                      text='LOX Main'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroup
                      open={comms.openProp5Way}
                      close={comms.closeProp5Way}
                      field='prop5Way'
                      text='Prop Main'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupFlow
                      open={comms.extendIgniterInserter}
                      close={comms.retractIgniterInserter}
                      field='igniterInserterState' // change this?
                      text='Igniter Inserter'
                      successText='Extend'
                      failText='Retract'
                    />
                  </Grid>
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
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupFlow
                      open={comms.beginFlowAll}
                      close={comms.endFlow}
                      field='flowState' // change this?
                      text='Begin Flow'
                      disabled={!this.state.HPS_en}
                    />
                  </Grid>
                </Grid>
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
                      open={comms.openLOxPrechillRBV}
                      close={comms.closeLOxPrechillRBV}
                      time={comms.timeLOxPrechillRBV}
                      field='LOxPrechillRBVstate'
                      text='LOx Prechill RBV'
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
                      open={comms.openPropanePrechillRBV}
                      close={comms.closePropanePrechillRBV}
                      time={comms.timePropanePrechillRBV}
                      field='propanePrechillRBVstate'
                      text='Propane Prechill RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <ButtonGroupRBVTimed
                      open={comms.openPurgePrechillVentRBV}
                      close={comms.closePurgePrechillVentRBV}
                      time={comms.timePurgePrechillVentRBV}
                      field='purgePrechillVentRBVstate'
                      text='Purge Prechill Vent RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <BigButton
                      onClick={comms.abort}
                      text='Abort'
                      isRed
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <BigButton
                      onClick={comms.hold}
                      text='Hold'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={12}>
                    <StateWindow
                      onUpdate={comms.setProcedureState}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* START OF THIRD BUTTON COLUMN */}
              <Grid item={1} xs={4} className={classes.item}>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPressurantFillRBV}
                      close={comms.closePressurantFillRBV}
                      time={comms.timePressurantFillRBV}
                      field='pressurantFillRBVstate'
                      text='N2 Fill RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPressurantFlowRBV}
                      close={comms.closePressurantFlowRBV}
                      time={comms.timePressurantFlowRBV}
                      field='pressurantFlowRBVstate'
                      text='Pressurant Flow RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openLOxTankVentRBV}
                      close={comms.closeLOxTankVentRBV}
                      time={comms.timeLOxTankVentRBV}
                      field='LOxTankVentRBVstate'
                      text='LOX Tank Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openLOxFlowRBV}
                      close={comms.closeLOxFlowRBV}
                      time={comms.timeLOxFlowRBV}
                      field='LOxFlowRBVstate'
                      text='LOX Flow RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
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
                  </Grid>
                </Grid>

                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPropaneTankVentRBV}
                      close={comms.closePropaneTankVentRBV}
                      time={comms.timePropaneTankVentRBV}
                      field='propaneTankVentRBVstate'
                      text='Prop Tank Vent RBV'
                    />
                  </Grid>
                  <Grid item={1} xs={6}>
                    <ButtonGroupRBVTimed
                      open={comms.openPropaneFlowRBV}
                      close={comms.closePropaneFlowRBV}
                      time={comms.timePropaneFlowRBV}
                      field='propaneFlowRBVstate'
                      text='Prop Flow RBV'
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={1}>
                  <Grid item={1} xs={6}>
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
                  </Grid>
                </Grid>
              </Grid>
              {/* START OF PROCEDURE COLUMN */}
              {/* <Grid item={1} xs={3} className={classes.item}>
                <Procedures />
              </Grid> */}
            </Grid>
            <Grid container={true} spacing={1}>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Tank Top Heater'
                      sendDuty={comms.setLOxTankTopHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Tank Middle Heater'
                      sendDuty={comms.setLOxTankMidHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='LOx Tank Bottom Heater'
                      sendDuty={comms.setLOxTankBottomHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Tank Top Heater'
                      sendDuty={comms.setPropTankTopHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Tank Middle Heater'
                      sendDuty={comms.setPropTankMidHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeater
                      text='Propane Tank Bottom Heater'
                      sendDuty={comms.setPropTankBottomHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='LOx PT Heater'
                      sendDuty={comms.setLoxPTHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='LOx GEMs Heater'
                      sendDuty={comms.setLoxGemsHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='LOx Injector PT Heater'
                      sendDuty={comms.setLoxInjectorHeater}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={1} xs={3} className={classes.item}>
                <Grid container spacing={1} direction='column'>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='Propane PT Heater'
                      sendDuty={comms.setPropPTHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='Propane GEMs Heater'
                      sendDuty={comms.setPropGemsHeater}
                    />
                  </Grid>
                  <Grid item>
                    <ButtonGroupHeaterCtrlLoop
                      text='Propane Injector PT Heater'
                      sendDuty={comms.setPropInjectorHeater}
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
