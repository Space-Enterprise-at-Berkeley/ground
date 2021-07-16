import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Feed from './components/Feed';

import comms from './api/Comms';

const styles = theme => ({

});

class Cam1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
      showSettings: false,
    };

    this.changeLightDark = this.changeLightDark.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeLightDark() {
    comms.setDarkMode(!this.state.isDark);
    this.setState({ isDark: !this.state.isDark });
  }

  openSettings() {
    this.setState({ showSettings: true });
  }

  closeSettings() {
    this.setState({ showSettings: false });
  }

  componentDidMount() {
    comms.connect();
  }

  componentWillUnmount() {
    // make sure that when there's a hot reload, we disconnect comms before its connected again
    comms.destroy();
  }

  render() {
    const { classes } = this.props;
    const theme = createMuiTheme({
      palette: {
        type: this.state.isDark ? 'dark' : 'light'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box className={classes.root}>
          <Settings open={this.state.showSettings} closeSettings={this.closeSettings}/>
          <Navbar
            changeLightDark={this.changeLightDark}
            openSettings={this.openSettings}
          />
			<Grid container>
				<Grid container item className={classes.feedGrid} xs={10} spacing={2}>
					<Grid item xs={6} spacing={2}>
						<Feed camNum={3}/>
						<Feed camNum={3}/>
					</Grid>
					<Grid item xs={6}>
						<Feed camNum={3}/>
						<Feed camNum={3}/>
					</Grid>
				</Grid>
				<Grid container item className={classes.feedCtrl} xs={2}>
					<h3>
						Play Button
					</h3>
				</Grid>
			</Grid>
        </Box>
      </ThemeProvider>
    );
  }
}

Cam1.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Cam1);
