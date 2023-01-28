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
                    key={obj[0]}
                    name={obj[0]}
                    type={obj[1]}
                    board={obj[2]}
                    number={obj[3] || 0}
                    unit={obj[4] || ""}
                    decimals={obj[5] || 1}
                    threshold={obj[6] || null}
                    modifyValue={obj[7] || null}
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
