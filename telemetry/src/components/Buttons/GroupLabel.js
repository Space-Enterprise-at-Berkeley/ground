import React, { Component } from "react";
import { withTheme } from "@material-ui/core/styles";
import {Grid, Typography, Box, Switch} from '@material-ui/core'

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
              height: "1rem",
              borderRadius: "1rem",
            }}
          />
        </Grid>
        {safe &&
          <Switch
            // focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
              // switchBase: classes.switchBase,
              // track: classes.track,
              // checked: classes.checked
            }}
            onChange={this.stateChange}
            ref={this.switchRef}
            checked={this.state.checked}
          />
        }
        {children}
      </Grid>
    );
  }
}

export default withTheme(GroupLabel);
