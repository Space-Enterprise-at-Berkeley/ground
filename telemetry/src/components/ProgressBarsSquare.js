import React, { Component } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Card, CardContent, Grid, LinearProgress, Typography, useTheme } from "@material-ui/core";

import Field from "./Field";
import comms from '../api/Comms';

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

class ProgressBarsSquare extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleValueUpdate = this.handleValueUpdate.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);

    this.animationID = null;

    this.fieldTextReferences = {};
    this.fieldBarReferences = {};
    this.fieldValueUpdateFunctions = {};
    this.values = {};
    this.minValues = {};
    this.deltas = {};
    this.names = {};
    this.units = {};
    for (let field of this.props.fields) {
      this.fieldTextReferences[field.field] = React.createRef();
      this.fieldBarReferences[field.field] = React.createRef();
      this.fieldValueUpdateFunctions[field.field] = (timestamp, value) => {
        this.handleValueUpdate(timestamp, value, field.field);
      }
      this.values[field.field] = 0.0;
      this.minValues[field.field] = field.minValue;
      this.deltas[field.field] = field.delta;
      this.names[field.field] = field.name;
      this.units[field.field] = field.units;

      let stateUpdate = {};
      stateUpdate[field.field] = field.value;
      this.setState(stateUpdate);
    }
  }

  handleValueUpdate(timestamp, value, field) {
    const { modifyValue } = this.props;
    this.values[field] = modifyValue ? modifyValue(value) : value;
    if(this.animationID === null) {
      this.animationID = requestAnimationFrame(() => {
        for (let f of this.props.fields) {
          this.updateDisplay(this.values[f.field], f.field);
        }
      });
    }
  }

  updateDisplay(value, field) {
    this.animationID = null;
    let percentage = (value - this.minValues[field]) / this.deltas[field];
    this.fieldTextReferences[field].current.innerHTML = this.names[field] + " - " + percentage.toFixed(2) + "% - " + this.values[field].toFixed(this.decimals) + this.units[field];
    let stateUpdate = {};
    stateUpdate[field] = percentage;
    this.setState(stateUpdate);
    // this.fieldBarReferences[field].current.value = percentage;
    // if(this.value > this.props.threshold && this.props.threshold !== null) {
    //   this.colorRef.current.style.backgroundColor = this.props.thresholdColor;
    // } else {
    //   this.colorRef.current.style.backgroundColor = '';
    // }
  }

  componentDidMount() {
    const { fields } = this.props;
    for (let field of fields) {
      comms.addSubscriber(field.field, this.fieldValueUpdateFunctions[field.field]);
    }
  }

  componentWillUnmount() {
    const { fields } = this.props;
    for (let field of fields) {
      comms.removeSubscriber(field.field, this.fieldValueUpdateFunctions[field.field]);
    }
    cancelAnimationFrame(this.animationID);
  }

  render() {
    const { children, classes, fields } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          {
            fields.map(field => (
              <div>
                <Typography variant='h6' ref={this.fieldTextReferences[field.field]}>
                  {field.name} - - 0.0{field.units}
                </Typography>
                <LinearProgress variant="determinate" value={this.state[field.field]} ref={this.fieldBarReferences[field.field]} />
              </div>
            ))
          }
          {/* <Grid container spacing={1} className={classes.container}>
            {fields.map((obj) => (
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
            ))}
            {children}
          </Grid> */}
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(ProgressBarsSquare));
