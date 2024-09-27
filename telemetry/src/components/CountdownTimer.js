import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, Box, CardContent, Grid, Typography, Stepper, Step, StepContent, StepLabel } from '@material-ui/core';

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
      timeRemaining: -6.7,
      activeStep: -1
    };

    this.startCountdown = this.startCountdown.bind(this);
    this.stopCountdown = this.stopCountdown.bind(this);
  }

  startCountdown() {
    clearInterval(this.countdownInterval);
    this.setState({timeRemaining: -6.7, activeStep: -1});
    this.countdownInterval = setInterval(() => {
      const { timeRemaining, activeStep } = this.state;
      const newTimeRemaining = timeRemaining + 0.1;
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
    this.setState({timeRemaining: -6.7, activeStep: -1});
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
    if(timeRemaining > -6.7) {
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
