import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

import ButtonGroup from './ButtonGroup';
import TextButtonGroup from './TextButtonGroup';

import comms from './comms';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    width: '30%',
    position: 'absolute',
    top: theme.spacing(8),
    paddingTop: theme.spacing(3)
    // ,backgroundColor: theme.palette.success.main
  },
  containerR: {
    flexGrow: 1,
    width: '30%',
    position: 'absolute',
    top: theme.spacing(8),
    paddingTop: theme.spacing(3),
    left: 450
    // ,backgroundColor: theme.palette.success.main
  },
  row: {
    height: '100%'
  },
  item: {
    height: '33%',
  },
  navbarGrid: {
    // height: theme.spacing(2)
  },
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important'
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important'
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important'
  },
  openStatusBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main
  },
  closedStatusBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main
  },
  enableSwitch: {
    switchBase: {
      color: theme.palette.error.main,
      '&$checked': {
        color: theme.palette.success.main,
      },
      '&$checked + $track': {
        backgroundColor: theme.palette.success.main,
      },
    },
    checked: {},
    track: {}
  },
  switchBase: {
    color:  theme.palette.error.main,
    "&$checked": {
      color:  theme.palette.success.main
    },
    "&$checked + $track": {
      backgroundColor:  theme.palette.success.main
    }
  },
  checked: {},
  track: {}
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loxTwoWay: false,
      propTwoWay: false,
      loxFiveWay: false,
      propFiveWay: false,
      loxGems: false,
      propGems: false,
      HPS: false,
      HPS_en: false,
      isDark: false
    }
  }

  makeSend = (id) => {
    return async (open) => {
      await comms.sendPacket(id, open ? [1] : [0]);
    };
  }

  makeSendArg = (id) => {
    return async (arg) => {
      await comms.sendPacket(id, [arg]);
    };
  }

  componentDidMount() {
    comms.valveListen(states => {
      this.setState(states);
    });
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
            <Grid container spacing={3} className={classes.row}>
              <ButtonGroup
                text='High Pressure Solenoid'
                width={0.5}
                send={this.makeSend(26)}
                open={this.state.HPS}
                disabled={!this.state.HPS_en}
              />
              <Grid item container spacing={1} direction="column" alignItems='center' xs={6}>
                <Grid item>
                  <Box component="span" display="block">Pressurant Enabled</Box>
                </Grid>
                <Grid item>
                  <Switch
                   focusVisibleClassName={classes.focusVisible}
                   disableRipple
                   classes={{
                     switchBase: classes.switchBase,
                     track: classes.track,
                     checked: classes.checked
                   }}
                   onChange={e => {this.setState({HPS_en: e.target.checked}); console.log(this.state)} }
                 />
                </Grid>
              </Grid>
              <ButtonGroup
                text='LOX GEMS'
                width={0.5}
                send={this.makeSend(22)}
                open={this.state.loxGems}
              />
              <ButtonGroup
                text='Propane GEMS'
                width={0.5}
                send={this.makeSend(25)}
                open={this.state.propGems}
              />
              <ButtonGroup
                text='Arm Main Valves'
                width={1}
                send={this.makeSend(20)}
                open={this.state.loxTwoWay}
              />
              <ButtonGroup
                text='LOX Main Valves'
                width={0.5}
                send={this.makeSend(21)}
                open={this.state.loxFiveWay}
              />
              <ButtonGroup
                text='Prop Main Valves'
                width={0.5}
                send={this.makeSend(24)}
                open={this.state.propFiveWay}
              />
              <ButtonGroup
                text='Begin Flow'
                width={0.5}
                send={this.makeSend(29)}
                open={this.state.propFiveWay}
              />
              <ButtonGroup
                text='Begin LOX Flow'
                width={0.5}
                send={this.makeSend(30)}
                open={this.state.propFiveWay}
              />
            </Grid>
          </Container>
        </Box>
        <Box>
          <Container maxWidth='xl' className={classes.containerR}>
            <Grid container spacing={3} className={classes.row}>
              <TextButtonGroup
                text='LOX PT Heater'
                width={0.5}
                send={this.makeSendArg(40)}
              />
              <TextButtonGroup
                text='LOX GEMS Heater'
                width={0.5}
                send={this.makeSendArg(41)}
              />
              <ButtonGroup
                text='LOX GEMS'
                width={0.5}
                send={this.makeSend(22)}
                open={this.state.loxGems}
                successText={"Enable"}
                failText={"Disabl"}
              />
              <ButtonGroup
                text='Propane GEMS'
                width={0.5}
                send={this.makeSend(25)}
                open={this.state.propGems}
              />

            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(App);
