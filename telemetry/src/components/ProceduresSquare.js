import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, Typography, useTheme } from "@material-ui/core";

import Field from "./Field";

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

class ProceduresSquare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    }

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, true);
  }

  handleKeyPress(e) {
    let keycode = e.keyCode;
    if (keycode === 39) {
      this.setState({step: this.state.step + 1});
    }
    else if (keycode === 37) {
      this.setState({step: this.state.step - 1});
    }
  }

  render() {
    const { classes, steps } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            {
              steps.map((e, i) => (
                <Grid item spacing={1} xs={12}>
                  <Typography variant={(((this.state.step % steps.length) + steps.length) % steps.length) == i ? 'h2' : 'h6'} block>
                    {e}
                  </Typography>
                </Grid>
              ))
            }
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(ProceduresSquare));
