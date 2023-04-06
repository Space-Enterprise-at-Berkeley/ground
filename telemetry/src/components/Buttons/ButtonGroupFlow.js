import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Grid, Button, Box, Typography } from "@material-ui/core";

import comms from "../../api/Comms";
import OpenCloseButtonGroup from "./OpenCloseButtonGroup";
import GroupLabel from "./GroupLabel";

class ButtonGroupFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: false,
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
  }

  updateStatus(timestamp, value) {
    if (value === 1) {
      this.props.onActuateCallback();
    }
    this.setState({ status: value });
  }

  setOpen() {
    const { open } = this.props;
    this.setState({ openClicked: true });
    open();
  }

  setClosed() {
    const { close } = this.props;
    this.setState({ openClicked: false });
    close();
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
    const { classes, theme, text } = this.props;
    const { status, openClicked } = this.state;
    return (
      <GroupLabel text={text} barColor={status ? theme.palette.success.main : theme.palette.error.main}>
        <Grid item>
          <OpenCloseButtonGroup
            isOpen={openClicked}
            setClosed={this.setClosed}
            setOpen={this.setOpen}
            disabled={this.props.disabled}
            failText={this.props.failText}
            successText={this.props.failText}
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(ButtonGroupFlow);
