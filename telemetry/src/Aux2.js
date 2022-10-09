import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import comms from './api/Comms';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import SixValueSquare from './components/SixValueSquare';
import FourValueSquare from './components/FourValueSquare';
import TankHeaterSquare from './components/TankHeaterSquare';
import MessageDisplaySquare from "./components/MessageDisplaySquare";

const PAGE_TITLE = "Telemetry: Main"

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  container: {
    flexGrow: 1,
    position: 'absolute',
    top: theme.spacing(6),
    // height: '100vh',
    bottom: '0px',
    padding: theme.spacing(1)
  },
  row: {
    height: '100%'
  },
  item: {
    height: '33%'
  },
  navbarGrid: {
    // height: theme.spacing(2)
  }
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
    };

    this.changeLightDark = this.changeLightDark.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeLightDark() {
    comms.setDarkMode(!this.state.isDark);
    this.setState({ isDark: !this.state.isDark });
  }

  openSettings() {
    this.setState({ showSettings: true });
  }

  closeSettings() {
    this.setState({ showSettings: false });
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
    const theme = createTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box>
          <Settings open={this.state.showSettings} closeSettings={this.closeSettings}/>
          <Navbar
            changeLightDark={this.changeLightDark}
            openSettings={this.openSettings}
          />
          <Container maxWidth='xl' className={classes.container}>
            <Grid container={true} spacing={1} className={classes.row}>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelTankERegHPT',
                        displayname: 'Fuel Pressurant PT',
                        color: [255,0,0],
                        unit: 'PSI'
                      },
                      {
                        name: 'LoxTankERegHPT',
                        displayname: 'Lox Pressurant PT',
                        color: [0,255,0],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelTankERegLPT',
                        displayname: 'Fuel Tank PT',
                        color: [255, 144, 59],
                        unit: 'PSI'
                      },
                      {
                        name: 'fuelTankERegPressureSetpoint',
                        displayname: 'Fuel Tank Setpoint',
                        color: [13, 6, 0],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'fuelTankERegEncoderAngle',
                        color: [255, 144, 59],
                        unit: 'Ticks',
                        displayname: 'Fuel Enc Angle'
                      },
                      {
                        name: 'fuelTankERegAngleSetPoint',
                        color: [13, 6, 0],
                        unit: 'Ticks',
                        displayname: 'Fuel Enc Setpoint'
                      }
                    ]
                  }
                />
              </Grid>

              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'LoxTankERegLPT',
                        displayname: 'LOX Tank PT',
                        color: [255, 115, 239],
                        unit: 'PSI',
                      },
                      {
                        name: 'LoxTankERegPressureSetpoint',
                        displayname: 'LOX Tank Setpoint',
                        color: [4, 0, 255],
                        unit: 'PSI'
                      }
                    ]
                  }
                />
              </Grid>

              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'FuelInjectorERegLPT',
                        color: [145, 33, 255],
                        unit: 'PSI',
                        displayname: 'Fuel Injector PT'
                      },
                      {
                        name: 'FuelInjectorERegPressureSetpoint',
                        color: [247, 84, 84],
                        unit: 'PSI',
                        displayname: 'Fuel Injector Setpoint'
                      },

                    ]
                  }
                />
              </Grid>


              
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'LoxInjectorERegLPT',
                        color: [0, 126, 254],
                        unit: 'PSI',
                        displayname: 'LOX Injector PT'
                      },
                      {
                        name: 'LoxInjectorERegPressureSetpoint',
                        color: [0, 187, 0],
                        unit: 'PSI',
                        displayname: 'LOX Injector Setpoint'
                      },
                    ]
                  }
                />
              </Grid>

              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'LoxTankERegEncoderAngle',
                        color: [255, 115, 239],
                        unit: 'Ticks',
                        displayname: 'LOX Enc Tank Angle'
                      },
                      {
                        name: 'LoxTankERegAngleSetPoint',
                        color: [4, 0, 255],
                        unit: 'Ticks',
                        displayname: "LOX Enc Tank Setpoint"
                      }
                    ]
                  }
                />
              </Grid>
              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'FuelInjectorERegEncoderAngle',
                        color: [145, 33, 255],
                        unit: 'Ticks',
                        displayname: 'Fuel Injector Enc Angle'
                      },
                      {
                        name: 'FuelInjectorERegAngleSetPoint',
                        color: [247, 84, 84],
                        unit: 'Ticks',
                        displayname: 'Fuel Injector Enc Setpoint'
                      },

                    ]
                  }
                />
              </Grid>

              <Grid item={1} xs={4} className={classes.item}>
                <Graph
                  fields={
                    [
                      {
                        name: 'LoxInjectorERegEncoderAngle',
                        displayname: 'LOX Injector Enc Angle',
                        color: [0, 126, 254],
                        unit: 'Ticks'
                      },
                      {
                        name: 'LoxInjectorERegAngleSetPoint',
                        displayname: 'LOX Injector Enc Setpoint',
                        color: [0, 187, 0],
                        unit: 'Ticks'
                      },
                    ]
                  }
                />
              </Grid>

              
              


              
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Main);
