import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, useTheme } from "@material-ui/core";

import Field from "./Field";
import ButtonGroup from "./Buttons/ButtonGroup";
import ButtonGroupRBVTimed from "./Buttons/ButtonGroupRBVTimed";
import { addButtonEnabledListener, buttonAction, removeButtonEnabledListener } from "../util";
import SwitchButton from "./Buttons/SwitchButton";
import BigButton from "./Buttons/BigButton";
import comms from "../api/Comms";

const styles = (theme) => ({
  root: {
    height: "100%",
  },
  cardContent: {
    height: "100%",
    padding: "8px",
    paddingBottom: "8px !important",
  },
  container: {
    height: "100%",
  },
  item: {
    height: "50%",
    textAlign: "center",
  },
});

class LaunchButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true
    }
    this.countdown = React.createRef();
    this.beginLaunchSequence = this.beginLaunchSequence.bind(this);
    this.abortAll = this.abortAll.bind(this);
  }

  beginLaunchSequence() {
    comms.beginLaunchSequence();
  }

  abortAll() {
    comms.abortAll();
  }

  componentDidMount() {
    addButtonEnabledListener("launch", (enabled) => {
      this.setState({ disabled: !enabled });
    });
  }

  componentWillUnmount() {
    removeButtonEnabledListener("launch", (enabled) => {
      this.setState({ disabled: !enabled });
    });
  }

  render() {
    const { children, classes, fields, mode } = this.props;
    let launchText = "";
    switch (mode) {
      case 0:
        launchText = "Launch"
        break;
      case 1:
        launchText = "Burn"
        break;
      case 2:
        launchText = "Flow"
        break;
      case 3:
        launchText = "Gas Flow"
        break;
    }
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
		  <Grid item xs={12}>
			<BigButton
				disabled={this.state.disabled}
				onClick={this.beginLaunchSequence}
				text={launchText}
			/>
			</Grid>
			<Grid item xs={12}>
			<BigButton
				onClick={this.abortAll}
				text="Abort"
				isRed
			/>
			</Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(LaunchButton));
