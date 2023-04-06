import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Grid, Button, Box } from "@material-ui/core";

import comms from "../../api/Comms";
import GroupLabel from "./GroupLabel";
import OpenCloseButtonGroup from "./OpenCloseButtonGroup";


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
  }

  updateStatus(timestamp, value) {
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
    let sColor = null;
    switch (status) {
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
      <GroupLabel
        text={text}
        barColor={sColor}
      >
        <Grid item>
          <OpenCloseButtonGroup
            isOpen={openClicked}
            setClosed={this.setClosed}
            setOpen={this.setOpen}
          />
        </Grid>
      </GroupLabel>
    );
  }
}

export default withTheme(ButtonGroupRBV);
