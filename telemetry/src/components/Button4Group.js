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

class Button4Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: 0,
      timeField: 0, // ms
    };


    this.updateStatus = this.updateStatus.bind(this);
    this.handleTimeFieldChange = this.handleTimeFieldChange.bind(this);
    this.setOpen1 = this.setOpen1.bind(this);
    this.setOpen2 = this.setOpen2.bind(this);
    this.setOpen3 = this.setOpen3.bind(this);
    this.setOpen4 = this.setOpen4.bind(this);
  }

  updateStatus(timestamp, value) {
    this.setState({status: value});
  }

  handleTimeFieldChange(e) {
    this.setState({timeField: parseFloat(e.target.value)});
  }

  setOpen1() {
    const { open1 } = this.props;
    this.setState({openClicked: 1});
    open1();
  }

  setOpen2() {
    const { open2 } = this.props;
    this.setState({openClicked: 2});
    open2();
  }

  setOpen3() {
    const { open3 } = this.props;
    this.setState({openClicked: 3});
    open3();
  }

  setOpen4() {
    const { open4 } = this.props;
    this.setState({openClicked: 4});
    open4();
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

          <Button
              color='secondary'
              variant='outlined'
              className={openClicked==1 ? classes.closedButton : classes.closedButtonOutline}
              onClick={this.setOpen1}
              disabled={this.props.disabled || false}
              disableRipple
              size='small'
          >
            {this.props.send_repl || this.props.button1Text || "Send"} {/* jank but idk how else to do it w/o breaking existing stuff
             (or how to inline comment in this language for that matter) -->*/}
          </Button>
          {!noClose ? 
            <Button
              color='secondary'
              variant='outlined'
              className={openClicked==2 ? classes.openButton : classes.openButtonOutline}
              onClick={this.setOpen2}
              disabled={this.props.disabled || false}
              disableRipple
              size='small'
            >
              {this.props.button2Text || "Close"}
            </Button>
            :
            <></>
          }
          <Button
            color='primary'
            variant='outlined'
            className={openClicked==3 ? classes.closedButton : classes.closedButtonOutline}
            onClick={this.setOpen3}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            {this.props.button3Text || "Open"}
          </Button>


          <Button
            color='primary'
            variant='outlined'
            className={openClicked== 4  ? classes.openButton : classes.openButtonOutline}
            onClick={this.setOpen4}
            disabled={this.props.disabled || false}
            disableRipple
            size='small'
          >
            {this.props.button4Text || "Open"}
          </Button>
        </Grid>
        <Grid item>
        </Grid>
        <br></br>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(Button4Group));
