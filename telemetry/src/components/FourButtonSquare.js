import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, useTheme } from "@material-ui/core";

import Field from "./Field";
import ButtonGroup from "./Buttons/ButtonGroup";
import ButtonGroupRBVTimed from "./Buttons/ButtonGroupRBVTimed";
import { buttonAction } from "../util";
import SwitchButton from "./Buttons/SwitchButton";
import ButtonGroupEreg from "./Buttons/ButtonGroupEreg";
import ButtonGroupEregTimed from "./Buttons/ButtonGroupEregTimed";

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

class FourButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            {
              fields.map((obj) => (
                <Grid item xs={6} className={classes.item}>
                  {
                    (() => {
                      switch (obj[1]) {
                        case null:
                          return ""
                        case "valve":
                          return (
                            <ButtonGroup
                              buttonId={obj[0]}
                              open={buttonAction(obj[4].enable)}
                              close={buttonAction(obj[4].disable)}
                              field={obj[3]}
                              text={obj[2]}
                              safe={obj[5]}
                              green={obj[6]}
                            />
                          )
                        case "timed":
                          return (
                            <ButtonGroupRBVTimed
                              buttonId={obj[0]}
                              open={buttonAction(obj[4].enable)}
                              close={buttonAction(obj[4].disable)}
                              timed_open={buttonAction(obj[4]["enable-timed"])}
                              timed_close={buttonAction(obj[4]["disable-timed"])}
                              text={obj[2]}
                              safe={obj[5]}
                              green={obj[6]}
                            />
                          )
                        case "switch":
                          return (
                            <SwitchButton
                              open={buttonAction(obj[4].enable)}
                              close={buttonAction(obj[4].disable)}
                              text={obj[2]}
                              safe={obj[5]}
                              green={obj[6]}
                            />
                          )
                        case "ereg":
                          return (
                            <ButtonGroupEreg
                              buttonId={obj[0]}
                              fuel={buttonAction(obj[4].fuel)}
                              lox={buttonAction(obj[4].lox)}
                              field={obj[3]}
                              text={obj[2]}
                              safe={obj[5]}
                              green={obj[6]}
                            />
                          )
                        case "ereg-timed":
                          return (
                            <ButtonGroupEregTimed
                              buttonId={obj[0]}
                              // open={buttonAction(obj[4].enable)}
                              // close={buttonAction(obj[4].disable)}
                              timed_fuel={buttonAction(obj[4]["fuel-timed"])}
                              timed_lox={buttonAction(obj[4]["lox-timed"])}
                              text={obj[2]}
                              safe={obj[5]}
                              green={obj[6]}
                            />
                          )
                        default:
                          return `Button type "${obj[1]}" not found`
                      }
                    })()
                  }
                </Grid>
              ))
            }
            {/* {fields.map((obj) => (
              <Grid item xs={4} className={classes.item}>
                <Field
                    field={obj[0]}
                    name={obj[1]}
                    unit={obj[2]}
                    decimals={obj[5] || 1}
                    threshold={obj[6] || null}
                    modifyValue={obj[7] || null}
                    thresholdColor={obj[8] || '#27AE60'}
                />
              </Grid>
            ))} */}
            {children}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(FourButton));
