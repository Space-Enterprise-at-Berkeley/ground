import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Tooltip, IconButton, Button } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import SettingsIcon from '@material-ui/icons/Settings';

import comms from '../api/Comms';

const styles = theme => ({
  spacer: {
    flexGrow: 1
  },
  bar: {
    borderBottom: '0.5px solid gray'
  },
  connectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  disconnectedButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flightConnected: false,
      EReg1Connected: false,
      EReg2Connected: false,
      EReg3Connected: false,
      EReg4Connected: false,
      daq1Connected: false,
      daq2Connected: false,
      daq3Connected: false,
      daq4Connected: false,
      actCtrlr1Connected: false,
      actCtrlr2Connected: false,

      flightKbps: 0,
      EReg1kbps: 0,
      EReg2kbps: 0,
      EReg3kbps: 0,
      EReg4kbps: 0,
      daq1Kbps: 0,
      daq2Kbps: 0,
      daq3Kbps: 0,
      daq4Kbps: 0,
      actCtrlr1Kbps: 0,
      actCtrlr2Kbps: 0,
    };

    this.updateFlightConnected = this.updateFlightConnected.bind(this);
    this.updateEReg1Connected = this.updateEReg1Connected.bind(this);
    this.updateEReg2Connected = this.updateEReg2Connected.bind(this);
    this.updateEReg3Connected = this.updateEReg3Connected.bind(this);
    this.updateEReg4Connected = this.updateEReg4Connected.bind(this);
    this.updateDaq1Connected = this.updateDaq1Connected.bind(this);
    this.updateDaq2Connected = this.updateDaq2Connected.bind(this);
    this.updateDaq3Connected = this.updateDaq3Connected.bind(this);
    this.updateDaq4Connected = this.updateDaq4Connected.bind(this);
    this.updateActCtrlr1Connected = this.updateActCtrlr1Connected.bind(this);
    this.updateActCtrlr2Connected = this.updateActCtrlr2Connected.bind(this);

    this.updateFlightKbps = this.updateFlightKbps.bind(this);
    this.updateEReg1kbps = this.updateEReg1kbps.bind(this);
    this.updateEReg2kbps = this.updateEReg2kbps.bind(this);
    this.updateEReg3kbps = this.updateEReg3kbps.bind(this);
    this.updateEReg4kbps = this.updateEReg4kbps.bind(this);
    this.updateDaq1Kbps = this.updateDaq1Kbps.bind(this);
    this.updateDaq2Kbps = this.updateDaq2Kbps.bind(this);
    this.updateDaq3Kbps = this.updateDaq3Kbps.bind(this);
    this.updateDaq4Kbps = this.updateDaq4Kbps.bind(this);
    this.updateActCtrlr1Kbps = this.updateActCtrlr1Kbps.bind(this);
    this.updateActCtrlr2Kbps = this.updateActCtrlr2Kbps.bind(this);
  }

  updateFlightConnected(timestamp, value) { this.setState({ flightConnected: value }); }
  updateEReg1Connected(timestamp, value) {this.setState({EReg1Connected: value}); }
  updateEReg2Connected(timestamp, value) {this.setState({EReg2Connected: value}); }
  updateEReg3Connected(timestamp, value) {this.setState({EReg3Connected: value}); }
  updateEReg4Connected(timestamp, value) {this.setState({EReg4Connected: value}); }
  updateDaq1Connected(timestamp, value) { this.setState({ daq1Connected: value }); }
  updateDaq2Connected(timestamp, value) { this.setState({ daq2Connected: value }); }
  updateDaq3Connected(timestamp, value) { this.setState({ daq3Connected: value }); }
  updateDaq4Connected(timestamp, value) { this.setState({ daq4Connected: value }); }
  updateActCtrlr1Connected(timestamp, value) { this.setState({ actCtrlr1Connected: value }); }
  updateActCtrlr2Connected(timestamp, value) { this.setState({ actCtrlr2Connected: value }); }

  updateFlightKbps(timestamp, value) { this.setState({ flightKbps: value }); }
  updateEReg1kbps(timestamp, value) { this.setState({ EReg1kbps: value}); }
  updateEReg2kbps(timestamp, value) { this.setState({ EReg2kbps: value}); }
  updateEReg3kbps(timestamp, value) { this.setState({ EReg3kbps: value}); }
  updateEReg4kbps(timestamp, value) { this.setState({ EReg4kbps: value}); }
  updateDaq1Kbps(timestamp, value) { this.setState({ daq1Kbps: value }); }
  updateDaq2Kbps(timestamp, value) { this.setState({ daq2Kbps: value }); }
  updateDaq3Kbps(timestamp, value) { this.setState({ daq3Kbps: value }); }
  updateDaq4Kbps(timestamp, value) { this.setState({ daq4Kbps: value }); }
  updateActCtrlr1Kbps(timestamp, value) { this.setState({ actCtrlr1Kbps: value }); }
  updateActCtrlr2Kbps(timestamp, value) { this.setState({ actCtrlr2Kbps: value }); }

  async componentDidMount() {
    comms.addSubscriber('flightConnected', this.updateFlightConnected);
    comms.addSubscriber('EReg1Connected', this.updateEReg1Connected);
    comms.addSubscriber('EReg2Connected', this.updateEReg2Connected);
    comms.addSubscriber('EReg3Connected', this.updateEReg3Connected);
    comms.addSubscriber('EReg4Connected', this.updateEReg4Connected);
    comms.addSubscriber('daq1Connected', this.updateDaq1Connected);
    comms.addSubscriber('daq2Connected', this.updateDaq2Connected);
    comms.addSubscriber('daq3Connected', this.updateDaq3Connected);
    comms.addSubscriber('daq4Connected', this.updateDaq4Connected);
    comms.addSubscriber('actCtrlr1Connected', this.updateActCtrlr1Connected);
    comms.addSubscriber('actCtrlr2Connected', this.updateActCtrlr2Connected);

    comms.addSubscriber('flightKbps', this.updateFlightKbps);
    comms.addSubscriber('EReg1kbps', this.updateEReg1kbps);
    comms.addSubscriber('EReg2kbps', this.updateEReg2kbps);
    comms.addSubscriber('EReg3kbps', this.updateEReg3kbps);
    comms.addSubscriber('EReg4kbps', this.updateEReg4kbps);
    comms.addSubscriber('daq1Kbps', this.updateDaq1Kbps);
    comms.addSubscriber('daq2Kbps', this.updateDaq2Kbps);
    comms.addSubscriber('daq3Kbps', this.updateDaq3Kbps);
    comms.addSubscriber('daq4Kbps', this.updateDaq4Kbps);
    comms.addSubscriber('actCtrlr1Kbps', this.updateActCtrlr1Kbps);
    comms.addSubscriber('actCtrlr2Kbps', this.updateActCtrlr2Kbps);

    this.setState({
      flightConnected: false,
      EReg1Connected: false,
      EReg2Connected: false,
      EReg3Connected: false,
      EReg4Connected: false,
      daq1Connected: false,
      actCtrlr1Connected: false,
      actCtrlr2Connected: false,
    });
  }

  componentWillUnmount() {
    comms.removeSubscriber('flightConnected', this.updateFlightConnected);
    comms.removeSubscriber('EReg1Connected', this.updateEReg1Connected);
    comms.removeSubscriber('EReg2Connected', this.updateEReg2Connected);
    comms.removeSubscriber('EReg3Connected', this.updateEReg3Connected);
    comms.removeSubscriber('EReg4Connected', this.updateEReg4Connected);
    comms.removeSubscriber('daq1Connected', this.updateDaq1Connected);
    comms.removeSubscriber('daq2Connected', this.updateDaq2Connected);
    comms.removeSubscriber('daq3Connected', this.updateDaq3Connected);
    comms.removeSubscriber('daq4Connected', this.updateDaq4Connected);
    comms.removeSubscriber('actCtrlr1Connected', this.updateActCtrlr1Connected);
    comms.removeSubscriber('actCtrlr2Connected', this.updateActCtrlr2Connected);

    comms.removeSubscriber('flightKbps', this.updateFlightKbps);
    comms.removeSubscriber('EReg1kbps', this.updateEReg1kbps);
    comms.removeSubscriber('EReg2kbps', this.updateEReg2kbps);
    comms.removeSubscriber('EReg3kbps', this.updateEReg3kbps);
    comms.removeSubscriber('EReg4kbps', this.updateEReg4kbps);
    comms.removeSubscriber('daq1Kbps', this.updateDaq1Kbps);
    comms.removeSubscriber('daq2Kbps', this.updateDaq2Kbps);
    comms.removeSubscriber('daq3Kbps', this.updateDaq3Kbps);
    comms.removeSubscriber('daq4Kbps', this.updateDaq4Kbps);
    comms.removeSubscriber('actCtrlr1Kbps', this.updateActCtrlr1Kbps);
    comms.removeSubscriber('actCtrlr2Kbps', this.updateActCtrlr2Kbps);
  }

  render() {
    const { classes,
            changeLightDark,
            openSettings } = this.props;

    const { flightConnected,
            EReg1Connected,
            EReg2Connected,
            EReg3Connected,
            EReg4Connected,
            daq1Connected,
            daq2Connected,
            daq3Connected,
            daq4Connected,
            actCtrlr1Connected,
            actCtrlr2Connected,
            flightKbps,
            EReg1kbps,
            EReg2kbps,
            EReg3kbps,
            EReg4kbps,
            daq1Kbps,
            daq2Kbps,
            daq3Kbps,
            daq4Kbps,
            actCtrlr1Kbps,
            actCtrlr2Kbps } = this.state;

    return (
      <AppBar position="static" color="default" elevation={0} className={classes.bar}>
        <Toolbar variant="dense">
          <div className={classes.spacer}/>
          {/* <Button className={flightConnected ? classes.connectedButton : classes.disconnectedButton}>Flight - {flightKbps} kbps</Button> */}
          <Button className={EReg1kbps > 0 ? classes.connectedButton : classes.disconnectedButton}> Fuel Tank EReg - {EReg1kbps} kbps</Button>
          <Button className={EReg2kbps > 0 ? classes.connectedButton : classes.disconnectedButton}>LOX Tank EReg - {EReg2kbps} kbps</Button>
          <Button className={EReg3kbps > 0 ? classes.connectedButton : classes.disconnectedButton}>Fuel Inj EReg - {EReg3kbps} kbps</Button>
          <Button className={EReg4kbps > 0 ? classes.connectedButton : classes.disconnectedButton}>LOX Inj EReg - {EReg4kbps} kbps</Button>
          {/* <Button className={daq1Connected ? classes.connectedButton : classes.disconnectedButton}>DAQ1 - {daq1Kbps} kbps</Button> */}
          {/* <Button className={daq2Connected ? classes.connectedButton : classes.disconnectedButton}>DAQ2 - {daq2Kbps} kbps</Button> */}
          {/* <Button className={daq3Connected ? classes.connectedButton : classes.disconnectedButton}>DAQ3 - {daq3Kbps} kbps</Button> */}
          {/* <Button className={daq4Connected ? classes.connectedButton : classes.disconnectedButton}>DAQ4 - {daq4Kbps} kbps</Button> */}
          <Button className={actCtrlr1Kbps > 0 ? classes.connectedButton : classes.disconnectedButton}>ActCtrlr1 - {actCtrlr1Kbps} kbps</Button>
          {/* <Button className={actCtrlr2Connected ? classes.connectedButton : classes.disconnectedButton}>ActCtrlr2 - {actCtrlr2Kbps} kbps</Button> */}
          <div className={classes.spacer}/>
          <Tooltip title='Toggle light/dark theme'>
            <IconButton
              color="inherit"
              onClick={ changeLightDark }
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Settings'>
            <IconButton
              color="inherit"
              onClick={ openSettings }
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withTheme(withStyles(styles)(Navbar));
