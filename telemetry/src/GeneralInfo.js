import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    height: '100%'
  },
  row: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  button: {
    float: 'right',
    minWidth: '0px',
    zIndex: 1000
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  sizeDetector: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  textInfo: {
    // width: '50%'
  },
  centered: {
    textAlign: 'center'
  },
  item: {
    height: '50%'
  },
  red: {
    backgroundColor: 'red',
    height: '5rem',
    width: '100%'
  },
  green: {
    backgroundColor: 'green',
    height: '5rem',
    width: '100%'
  }
});

class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      altitude: 0,
      acceleration: 0,
      drogue: false,
      main: false
    };
  }

  componentDidMount() {
    this.props.addSensorListener(this.props.altitudeID, (data, timestamp) => {
      this.setState({
        altitude: data[0]
      });
    });
    this.props.addSensorListener(this.props.accelerationID, (data, timestamp) => {
      this.setState({
        acceleration: data[0]
      });
    });
    this.props.addSensorListener(this.props.parachuteID, (data, timestamp) => {
      this.setState({
        drogue: data[0] == 1,
        main: data[1] === 1
      });
    });
  }

  componentWillUnmount() {
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={3} className={classes.row}>
            <Grid item xs={6} className={classes.item}>
              <Card className={classes.textInfo}>
                <CardContent className={classes.centered}>
                  <Typography variant='h5'>Altitude</Typography>
                  <Typography variant='h4'>{this.state.altitude} m</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Card className={classes.textInfo}>
                <CardContent className={classes.centered}>
                  <Typography variant='h5'>Acceleration</Typography>
                  <Typography variant='h4'>{this.state.acceleration} m/s^2</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Card className={classes.textInfo}>
                <CardContent className={classes.centered}>
                  <Grid container spacing={3} className={classes.row}>
                    <Grid item xs={6} className={classes.item}>
                      <Typography variant='h8'>Drogue</Typography>
                      <div className={this.state.drogue ? classes.green : classes.red}>
                      </div>
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                      <Typography variant='h8'>Main</Typography>
                      <div className={this.state.main ? classes.green : classes.red}>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(GeneralInfo));
