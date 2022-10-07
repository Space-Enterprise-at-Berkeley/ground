import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Button, Box } from '@material-ui/core';

import comms from '../api/Comms';

const styles = theme => ({
  openButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none',
  },
  openButtonOutline: {
    color: theme.palette.success.main + ' !important',
    borderColor: theme.palette.success.main + ' !important',
    transition: 'none',
  },
  closedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important',
    transition: 'none',
  },
  closedButtonOutline: {
    color: theme.palette.error.main + ' !important',
    transition: 'none',
  },
  openStatusBox: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main
  },
  closedStatusBox: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.main
  }
});

const statusBox = {
  borderColor: 'text.secondary',
  // m: 1,
  border: 0.5,
  style: { width: '9rem', height: '1rem' },
};

class Button4Group extends Component {
  constructor(props) {
    super(props);
    this.setOpen1 = this.setOpen1.bind(this);
    this.setOpen2 = this.setOpen2.bind(this);
    this.setOpen3 = this.setOpen3.bind(this);
    this.setOpen4 = this.setOpen4.bind(this);
  }

  setOpen1() {
    const { open1 } = this.props;
    open1();
  }

  setOpen2() {
    const { open2 } = this.props;
    open2();
  }

  setOpen3() {
    const { open3 } = this.props;
    open3();
  }

  setOpen4() {
    const { open4 } = this.props;
    open4();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { classes, theme, text } = this.props;
    return (
      <Grid container spacing={1} direction="column" alignItems='center'>
        <Grid item>
          <Box component="span" display="block">{text}</Box>
        </Grid>
        {/* <Grid item>
          <Box borderRadius={4} {...statusBox} bgcolor={this.props.noFeedback ? (this.props.disabled ? theme.palette.error.main : theme.palette.warning.main) :  (open ? theme.palette.success.main : theme.palette.error.main)}/>
        </Grid> */}
        <Grid item >
          <Button
          color='secondary'
          variant='outlined'
          className={classes.openButtonOutline}
          onClick={this.setOpen1}
          disabled={this.props.disabled || false}
          disableRipple
          size='small'
          >
            {this.props.button1Text || "Close"}
          </Button>
          <Button
          color='primary'
          variant='outlined'
          className={classes.openButtonOutline}
          onClick={this.setOpen2}
          disabled={this.props.disabled || false}
          disableRipple
          size='small'
          >
            {this.props.button2Text || "Open"}
          </Button>
        </Grid>
        <br></br>
        <Grid item >
          <Button
          color='secondary'
          variant='outlined'
          className={classes.openButtonOutline}
          onClick={this.setOpen3}
          disabled={this.props.disabled || false}
          disableRipple
          size='small'
          >
            {this.props.button3Text || "Close"}
          </Button>
          <Button
          color='primary'
          variant='outlined'
          className={classes.openButtonOutline}
          onClick={this.setOpen4}
          disabled={this.props.disabled || false}
          disableRipple
          size='small'
          >
            {this.props.button4Text || "Open"}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(Button4Group));
