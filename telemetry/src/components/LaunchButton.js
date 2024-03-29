import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from "@material-ui/core";

import { addButtonEnabledListener, removeButtonEnabledListener } from "../util";
import BigButton from "./Buttons/BigButton";
import comms from "../api/Comms";
import SquareControls from "./SquareControls";

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
      ipaDisabled: true,
      nosDisabled: true
    }
    this.countdown = React.createRef();
    this.beginLaunchSequence = this.beginLaunchSequence.bind(this);
    this.abortAll = this.abortAll.bind(this);
  }

  beginLaunchSequence() {
    comms.beginLaunchSequence(!this.state.ipaDisabled, !this.state.nosDisabled);
  }

  abortAll() {
    comms.abortAll();
  }

  componentDidMount() {
    // addButtonEnabledListener("launch", (enabled) => {
    //   this.setState({ disabled: !enabled });
    // });

    // launch should be enabled if either "nitrouslaunchenable" or "ipalaunchenable" is enabled
    addButtonEnabledListener("nitrousEnable", (enabled) => {
      this.setState({ nosDisabled: !enabled });
    });
    addButtonEnabledListener("ipaEnable", (enabled) => {
      this.setState({ ipaDisabled: !enabled });
    });
  }

  componentWillUnmount() {
    // removeButtonEnabledListener("launch", (enabled) => {
    //   this.setState({ disabled: !enabled });
    // });

    // launch should be disabled if neither "nitrouslaunchenable" nor "ipalaunchenable" is enabled
    removeButtonEnabledListener("nitrousEnable", (enabled) => {
      this.setState({ nosDisabled: !enabled });
    });
    removeButtonEnabledListener("ipaEnable", (enabled) => {
      this.setState({ ipaDisabled: !enabled });
    });
  }

  render() {
    const { classes, mode } = this.props;
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
        launchText = "Flow (With Igniter)"
        break;
      case 4:
        launchText = "Gas Flow"
        break;
      default:
        launchText = "Unknown Mode"
        break;
    }
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <SquareControls reset={this.props.reset} locked={this.props.locked} />
          <Grid container spacing={1} className={classes.container}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <BigButton
                disabled={this.state.ipaDisabled && this.state.nosDisabled}
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
