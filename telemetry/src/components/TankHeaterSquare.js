import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core";

import FieldHeater from "./FieldHeater";

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
    height: "33%",
    textAlign: "center",
  },
});

class TankHeaterSquare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, field1, field2, field3, field4, field5, field6 } =
      this.props;
    const fields = [field1, field2, field3, field4, field5, field6];
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            <Grid item xs={12}>
              <Typography align="center" variant="h5">
                Tank Heaters
              </Typography>
            </Grid>
            {fields.map((field) => {
              <Grid item xs={6} className={classes.item}>
                <FieldHeater
                  name={field.name}
                  field={field.field}
                  decimals={field.decimals}
                />
              </Grid>;
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(TankHeaterSquare));
