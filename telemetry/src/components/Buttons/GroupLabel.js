import React, { Component } from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import {Grid, Typography, Box, Switch} from '@material-ui/core'

const styles = theme => ({
  switchBase: {
    color:  theme.palette.error.main,
    "&$checked": {
      color:  theme.palette.success.main
    },
    "&$checked + $track": {
      backgroundColor:  theme.palette.success.main
    }
  },
  checked: {},
  track: {}
});

export class GroupLabel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      checked: false
    }
    this.switchRef = React.createRef();
    this.timeoutId = null;
    this.stateChange = (_, e) => {
      this.setState({checked: e});
      this.props.changeState(e);
      // if (e) {
      //   this.timeoutId = setTimeout(() => {
      //     console.log(1);
      //     console.log(this.switchRef);
      //     this.setState({checked: false});
      //     this.stateChange(null, false);
      //   }, 5000)
      // }
      // else {
      //   clearTimeout(this.timeoutId);
      // }
    }
  }

  render() {
    const {children, text, barColor, safe, classes} = this.props;
    return (
      <Grid container spacing={1} direction="column" alignItems="center">
        <Grid item>
          <Typography variant="subtitle1" component="span" display="block">
            {text}
          </Typography>
        </Grid>
        <Grid item>
          <Box
            bgcolor={barColor}
            sx={{
              border: "1 solid transparent",
              width: "9rem",
              height: "0.5rem",
              borderRadius: "0.5rem",
            }}
          />
        </Grid>
        {safe &&
          <Switch
            disableRipple
            onChange={this.stateChange}
            classes={{
              switchBase: classes.switchBase,
              track: classes.track,
              checked: classes.checked
            }}
            ref={this.switchRef}
            checked={this.state.checked}
          />
        }
        {children}
      </Grid>
    );
  }
}

export default withTheme(withStyles(styles)(GroupLabel));
