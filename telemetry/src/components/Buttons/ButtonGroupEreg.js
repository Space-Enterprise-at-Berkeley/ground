import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Grid, Button, Box } from "@material-ui/core";

import comms from "../../api/Comms";
import GroupLabel from "./GroupLabel";
import OpenCloseButtonGroup from "./OpenCloseButtonGroup";


class ButtonGroupEreg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      openClicked: false,
      disabled: this.props.safe
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setClosed = this.setClosed.bind(this);
    this.setDisabled = this.setDisabled.bind(this);
  }

  updateStatus(timestamp, value) {
    this.setState({ status: value });
  }

  setOpen() {
    const { fuel } = this.props;
    this.setState({ openClicked: true });
    fuel();
  }

  setClosed() {
    const { lox } = this.props;
    this.setState({ openClicked: false });
    lox();
  }

  componentDidMount() {
    const { field } = this.props;
    comms.addSubscriber(field, this.updateStatus);
  }

  componentWillUnmount() {
    const { field } = this.props;
    comms.removeSubscriber(field, this.updateStatus);
  }

  setDisabled(enabled) {
    this.setState({ disabled: !enabled });
  }

  render() {
    const { classes, theme, text, safe, green } = this.props;
    const { status, openClicked, disabled } = this.state;
    let sColor = theme.palette.error.main;
    if (green.includes(status)) {
      sColor = theme.palette.success.main;
    }
    return (
      <GroupLabel
        text={text}
        barColor={sColor}
        safe={safe} classes={classes} changeState={this.setDisabled}
      >
        <Grid item>
          <OpenCloseButtonGroup
            isOpen={openClicked}
            setClosed={this.setClosed}
            setOpen={this.setOpen}
            disabled={disabled}
            ereg
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(ButtonGroupEreg);
