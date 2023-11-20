import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid } from "@material-ui/core";

import ButtonGroup from "./Buttons/ButtonGroup";
import ButtonGroupRBVTimed from "./Buttons/ButtonGroupRBVTimed";
import { buttonAction } from "../util";
import SwitchButton from "./Buttons/SwitchButton";
import ButtonGroupEreg from "./Buttons/ButtonGroupEreg";
import ButtonGroupEregTimed from "./Buttons/ButtonGroupEregTimed";
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

class FourButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <SquareControls reset={this.props.reset} locked={this.props.locked} />
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
                              keyEnable={obj[7]}
                              keyDisable={obj[8]}
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
            {children}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(FourButton));
