import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Button, Box, TextField } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  spacer: {
    flexGrow: 1
  },
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none'
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none'
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    transition: 'none'
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important',
    transition: 'none'
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
  txtField: {
    width: '4rem'
  }
});

const statusBox = {
  borderColor: 'text.secondary',
  border: 0.5,
  style: { width: '9rem', height: '1rem', marginLeft: 'auto', marginRight: 'auto' },
};

class ButtonGroupRBVTimed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: false,
      timeField: 0, // ms
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.handleTimeFieldChange = this.handleTimeFieldChange.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
    this.setTime = this.setTime.bind(this);
  }

  updateStatus(timestamp, value) {
    this.setState({status: value});
  }

  handleTimeFieldChange(e) {
    this.setState({timeField: parseFloat(e.target.value)});
  }

  setOpen() {
    const { open } = this.props;
    this.setState({openClicked: true});
    open();
  }

  setClosed() {
    const { close } = this.props;
    this.setState({openClicked: false});
    close();
  }

  setTime() {
    const { timeField } = this.state;
    const { time } = this.props;
    time(timeField);
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateStatus);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateStatus);
  }

  render() {
    const { classes, theme, text, noClose } = this.props;
    const { status, openClicked, timeField } = this.state;
    let sColor = null;
    switch(status) {
      case 0:
        sColor = theme.palette.error.main;
        break;
      case 1:
        sColor = theme.palette.success.main;
        break;
      case 2:
        sColor = theme.palette.warning.main;
        break;
    }
    return (
      <Grid container spacing={1} alignItems='center' direction="column" style={{textAlign: 'center'}}>
        <Grid item xs={12}>
          <Box component="span" display="block">{text}</Box>
        </Grid>
        <Grid item xs={12}>
          <Box borderRadius={4} {...statusBox} bgcolor={sColor}/>
        </Grid>
        <Grid item>
          <TextField
            type='number'
            step={10}
            value={timeField}
            onChange={this.handleTimeFieldChange}
            className={classes.txtField}
            inputProps={{
              step: 0.001
            }}
          />
          <Button
            color='primary'
            variant='contained'
            onClick={this.setTime}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            {this.props.failText || "Send"}
          </Button>
          {!noClose ? 
            <Button
              color='secondary'
              variant='outlined'
              className={!openClicked ? classes.closedButton : classes.closedButtonOutline}
              onClick={this.setClosed}
              disabled={this.props.disabled || false}
              disableRipple
              size='small'
            >
              {this.props.failText || "Close"}
            </Button>
            :
            <></>
          }
          <Button
            color='primary'
            variant='outlined'
            className={openClicked ? classes.openButton : classes.openButtonOutline}
            onClick={this.setOpen}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            {this.props.successText || "Open"}
          </Button>
        </Grid>
        <Grid item>
        </Grid>
        {/* <Grid item >
          <TextField
            type='number'
            label='ms'
            value={timeField}
            onChange={this.handleTimeFieldChange}
          />
          <Button
            color='primary'
            variant='outlined'
            onClick={this.setOpen}
            disabled={this.props.disabled || false}
          >
            {this.props.successText || "Send"}
          </Button>
          <Button
          color='secondary'
          variant='outlined'
          className={!openClicked ? classes.closedButton : classes.closedButtonOutline}
          onClick={this.setClosed}
          disabled={this.props.disabled || false}
          >
            {this.props.failText || "Close"}
          </Button>
          <Button
          color='primary'
          variant='outlined'
          className={openClicked ? classes.openButton : classes.openButtonOutline}
          onClick={this.setOpen}
          disabled={this.props.disabled || false}
          >
            {this.props.successText || "Open"}
          </Button>
        </Grid> */}
        <br></br>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroupRBVTimed));
