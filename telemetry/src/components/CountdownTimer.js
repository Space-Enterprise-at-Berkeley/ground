import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, Box, CardContent, Grid, Typography, Stepper, Step, StepContent, StepLabel } from '@material-ui/core';

import Wav10 from '../media/10.wav';
import Wav9 from '../media/9.wav';
import Wav8 from '../media/8.wav';
import Wav7 from '../media/7.wav';
import Wav6 from '../media/6.wav';
import Wav5 from '../media/5.wav';
import Wav4 from '../media/4.wav';
import Wav3 from '../media/3.wav';
import Wav2 from '../media/2.wav';
import Wav1 from '../media/1.wav';
import Wav0 from '../media/0.wav';
import Updog from '../media/updog.wav';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '10%',
    marginRight: '10%'
  },
  timerBlack: {
    textAlign: 'center',
    padding: '0.5rem',
    fontSize: '2.5rem',
    color: 'black'
  },
  timerRed: {
    textAlign: 'center',
    padding: '0.5rem',
    fontSize: '2.5rem',
    color: 'red'
  },
  timerGreen: {
    textAlign: 'center',
    padding: '0.5rem',
    fontSize: '2.5rem',
    color: 'green'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  container: {
    height: '100%'
  },
  item: {
    height: '50%',
    textAlign: 'center'
  }
});

const steps = [
  {label: 'Close RBVs', time: -6.665},
  {label: 'Igniter On', time: -2.665},
  {label: 'Arm Valves', time: -0.665},
  {label: 'Open LOX', time: -0.165},
  {label: 'Open Fuel', time: 0.0},
  {label: 'Close LOX', time: 3.0},
  {label: 'Close Fuel', time: 3.1},
];

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: -10.0,
      activeStep: -1
    };

    this.startCountdown = this.startCountdown.bind(this);
    this.stopCountdown = this.stopCountdown.bind(this);
  }

  startCountdown() {
    clearInterval(this.countdownInterval);
    this.setState({timeRemaining: -10.0, activeStep: -1});
    (new Audio(Wav10)).play();
    this.countdownInterval = setInterval(() => {
      const { timeRemaining, activeStep } = this.state;
      const newTimeRemaining = timeRemaining + 0.1;
      if(10 < -newTimeRemaining && -newTimeRemaining < 10.1) {
        (new Audio(Wav10)).play();
      } else if(9 < -newTimeRemaining && -newTimeRemaining < 9.1) {
        (new Audio(Wav9)).play();
      } else if(8 < -newTimeRemaining && -newTimeRemaining < 8.1) {
      (new Audio(Wav8)).play();
      } else if(7 < -newTimeRemaining && -newTimeRemaining < 7.1) {
        (new Audio(Wav7)).play();
      } else if(6 < -newTimeRemaining && -newTimeRemaining < 6.1) {
        (new Audio(Wav6)).play();
      } else if(5 < -newTimeRemaining && -newTimeRemaining < 5.1) {
        (new Audio(Wav5)).play();
      } else if(4 < -newTimeRemaining && -newTimeRemaining < 4.1) {
        (new Audio(Wav4)).play();
      } else if(3 < -newTimeRemaining && -newTimeRemaining < 3.1) {
        (new Audio(Wav3)).play();
      } else if(2 < -newTimeRemaining && -newTimeRemaining < 2.1) {
        (new Audio(Wav2)).play();
      } else if(1 < -newTimeRemaining && -newTimeRemaining < 1.1) {
        (new Audio(Wav1)).play();
      } else if(0 < -newTimeRemaining && -newTimeRemaining < 0.1) {
        (new Audio(Updog)).play();
      }
      if(newTimeRemaining > 9.9) {
        clearInterval(this.countdownInterval);
      }
      if(steps.length > activeStep+1 && steps[activeStep+1].time <= newTimeRemaining+0.05) {
        console.log(newTimeRemaining);
        this.setState({activeStep: activeStep+1});
      }
      this.setState({timeRemaining: newTimeRemaining});
    }, 100);
  }

  stopCountdown() {
    clearInterval(this.countdownInterval);
    this.setState({timeRemaining: -10.0, activeStep: -1});
  }

  componentDidMount() {
    this.props.setStartCountdownCallback(this.startCountdown);
    this.props.setStopCountdownCallback(this.stopCountdown);
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval);
  }

  render() {
    const { classes } = this.props;
    const { timeRemaining, activeStep } = this.state;

    let countdownClass = classes.timerBlack;
    if(timeRemaining > -10.0) {
      if(timeRemaining < 0) {
        countdownClass = classes.timerRed;
      } else {
        countdownClass = classes.timerGreen;
      }
    }

    return (
      <>
        <Card className={classes.root}>
          <Typography className={countdownClass}>
            T{timeRemaining.toFixed(2)}
          </Typography>
        </Card>
        <Box className={classes.root}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label} (T{step.time})
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </>
    );
  }
}

export default withTheme(withStyles(styles)(CountdownTimer));
