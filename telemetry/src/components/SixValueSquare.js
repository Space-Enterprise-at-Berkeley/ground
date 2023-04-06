import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, useTheme } from "@material-ui/core";

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

function getFunction(id) {
  switch (id) {
    case "none":
      return v => v;
    case "plusOne":
      let plusOne = function(v) {
        return v + 1;
      }
      return plusOne;
    case "roc":
      let roc = function(v, ts) {
        console.log(roc.history);
        let diff = v - roc.last;
        let timeDiff = ts - roc.lastTime;
        roc.last = v;
        roc.lastTime = ts;
        roc.history.push(diff);
        roc.times.push(timeDiff);
        if (roc.history.length > 10) {
          roc.history.shift();
          roc.times.shift();
        }
        let sum = 0;
        for (let i = 0; i < roc.history.length; i ++) {
          sum += roc.history[i] * 1000 / roc.times[i];
        }
        return sum / roc.history.length;
      }
      roc.last = 0;
      roc.lastTime = 0;
      roc.history = [];
      roc.times = [];
      return roc;
  }
}

class SixValueSquare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            {fields.map((obj) => (
              <Grid item xs={4} className={classes.item}>
                <Field
                    field={obj[0]}
                    name={obj[1]}
                    unit={obj[2]}
                    decimals={obj[5] || 1}
                    threshold={obj[6] || null}
                    modifyValue={obj[7] ? getFunction(obj[7]) : null}
                    thresholdColor={obj[8] || '#27AE60'}
                />
              </Grid>
            ))}
            {children}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(SixValueSquare));
