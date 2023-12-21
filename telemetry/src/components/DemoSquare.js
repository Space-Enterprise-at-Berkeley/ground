import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, LinearProgress, Typography, useTheme } from "@material-ui/core";

import Field from "./Field";
import comms from '../api/Comms';
import SquareControls from "./SquareControls";
import ButtonGroup from "./Buttons/ButtonGroup";
import { buttonAction } from "../util";

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

class DemoSquare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value1: 0,
      value2: 0,
      sum: 0
    };

    this.fieldValueUpdateFunction1 = this.fieldValueUpdateFunction1.bind(this);
    this.fieldValueUpdateFunction2 = this.fieldValueUpdateFunction2.bind(this);

    this.animationID = null;

    
  }

  fieldValueUpdateFunction1(timestamp, value) {
    this.setState({
      value1: value,
      sum: value + this.state.value2
    });
  }

  fieldValueUpdateFunction2(timestamp, value) {
    this.setState({
      value2: value,
      sum: value + this.state.value1
    });
  }

  componentDidMount() {
    const { field1, field2 } = this.props;
    comms.addSubscriber(field1, this.fieldValueUpdateFunction1);
    comms.addSubscriber(field2, this.fieldValueUpdateFunction2);
  }

  componentWillUnmount() {
    const { field1, field2 } = this.props;
    comms.removeSubscriber(field1, this.fieldValueUpdateFunction1);
    comms.removeSubscriber(field2, this.fieldValueUpdateFunction2);
    cancelAnimationFrame(this.animationID);
  }

  render() {
    const { children, classes, field1, name1, field2, name2 } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <SquareControls reset={this.props.reset} locked={this.props.locked} />
          <Grid container spacing={1} className={classes.container}>
            <Grid item xs={4} className={classes.item}>
              <Field
                field={field1}
                name={name1}
                unit={""}
                decimals={1}
                threshold={null}
                modifyValue={null}
                thresholdColor={'#27AE60'}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <Field
                field={field2}
                name={name2}
                unit={""}
                decimals={1}
                threshold={null}
                modifyValue={null}
                thresholdColor={'#27AE60'}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <Typography variant='h6'>
                Sum
              </Typography>
              <Typography variant='h3' className={classes.value}>
                {this.state.sum}
              </Typography>
            </Grid>
            <Grid item xs={4} className={classes.item}>
            <ButtonGroup
              buttonId={""}
              open={
                () => {buttonAction(
                    {
                      "type": "signal-timed",
                      "board": "tc1",
                      "packet": 100
                    }
                  )(this.state.sum)
                }
              }
              close={
                () => {buttonAction(
                    {
                      "type": "signal-timed",
                      "board": "tc1",
                      "packet": 100
                    }
                  )(this.state.sum)
                }
              }
              field={""}
              text={"Send"}
              safe={false}
              green={[]}
            />
            </Grid>
          </Grid>
          {/* {
            fields.map(field => (
              <div>
                <Typography variant='h6' ref={this.fieldTextReferences[field.field]}>
                  {field.name} - - 0.0{field.units}
                </Typography>
                <LinearProgress variant="determinate" value={this.state[field.field]} ref={this.fieldBarReferences[field.field]} />
              </div>
            ))
          } */}
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(DemoSquare));
