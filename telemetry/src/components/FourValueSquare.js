import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, CardContent, Grid } from '@material-ui/core';

import Field from './Field';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  container: {
    height: '100%'
  },
  item: {
    height: '50%',
    textAlign: 'center'
  }
});

class FourValueSquare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, field1, field2, field3, field4, field5, field6 } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            <Grid item xs={6} className={classes.item}>
              <Field
                name={field1.name}
                field={field1.field}
                unit={field1.unit}
                decimals={field1.decimals}
                threshold={field1.threshold}
              />
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Field
                name={field2.name}
                field={field2.field}
                unit={field2.unit}
                decimals={field2.decimals}
                threshold={field2.threshold}
              />
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Field
                name={field3.name}
                field={field3.field}
                unit={field3.unit}
                decimals={field3.decimals}
                threshold={field3.threshold}
              />
            </Grid>

            <Grid item xs={6} className={classes.item}>
              <Field
                name={field4.name}
                field={field4.field}
                unit={field4.unit}
                decimals={field4.decimals}
                threshold={field4.threshold}
              />
            </Grid>
            {/* <Grid item xs={4} className={classes.item}>
              <Field
                name={field5.name}
                field={field5.field}
                unit={field5.unit}
                decimals={field5.decimals}
                threshold={field5.threshold}
              />
            </Grid> */}
            {/* <Grid item xs={4} className={classes.item}>
              <Field
                name={field6.name}
                field={field6.field}
                unit={field6.unit}
                decimals={field6.decimals}
                threshold={field6.threshold}
              />
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(FourValueSquare));
