import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid, Button, Box } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

import comms from '../../api/Comms';
import GroupLabel from './GroupLabel';
import { buttonAction } from '../../util';

const styles = theme => ({
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

const statusBox = {
  borderColor: 'text.secondary',
  border: 0.5,
  style: { width: '9rem', height: '1rem' },
};

class ButtonGroupRBV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: false,
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  updateStatus(timestamp, value) {
    this.setState({status: value});
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

  changeState(e) {
    // For backend
    const {open, close, change = () => {}} = this.props;
    if (this.state.openClicked) {
      this.updateStatus(0, 0);
      this.setState({openClicked: false});
      close();
    } else {
      this.updateStatus(0, 1);
      this.setState({openClicked: true});
      open();
    }
    // For frontend
    change(e)
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateStatus);
    setTimeout(this.setClosed, 10);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateStatus);
  }

  render() {
    const { classes, theme, text } = this.props;
    const { status, openClicked } = this.state;
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
      <GroupLabel text={text} barColor={status ? theme.palette.success.main : theme.palette.error.main}>
        <Grid item>
          <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
              switchBase: classes.switchBase,
              track: classes.track,
              checked: classes.checked
            }}
            onChange={this.changeState}
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(withStyles(styles)(ButtonGroupRBV));
