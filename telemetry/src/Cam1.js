import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@fontsource/roboto';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container, Grid } from '@material-ui/core';

import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import PlayPauseStopToggleBtn from './components/PlayPauseStopToggleBtn';
import CapacityBar from './components/CapacityBar';

import comms from './api/Comms';

const styles = theme => ({
	root: {
		height: "100vh"
	},
	header: {
		height: "5vh"
	},	
	camLayout: {
		height: "95vh"
	},
	feedGrid: {
		height: "90vh"
	},
	feedCtrl: {
		height: "5vh"
	},
	flexCenter: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
  		alignItems: "center"
	}, 
	capBar: {
		width: "50%",
		marginLeft: "1rem"
	}
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
				<div className={classes.header}>
					<Settings open={this.state.showSettings} closeSettings={this.closeSettings} />
					<Navbar changeLightDark={this.changeLightDark} openSettings={this.openSettings} />
				</div>
				
				<Box className={classes.camLayout}>
					<Grid container className={classes.feedGrid}>
						<Grid item xs={6}>
							<Feed camNum={1}/>
							<Feed camNum={3}/>
						</Grid>
						<Grid item xs={6}>
							<Feed camNum={2}/>
							<Feed camNum={4}/>
						</Grid>
					</Grid>
					<Grid container className={classes.feedCtrl} >
						<Grid item xs={5} className={classes.flexCenter}></Grid>
						<Grid item xs={2} className={classes.flexCenter}><PlayPauseStopToggleBtn /> </Grid>
						<Grid item xs={5} className={classes.flexCenter}>
							<p>GS Capacity: </p>
							<div className={classes.capBar}>
								<CapacityBar />
							</div>
						</Grid>
					</Grid>
				</Box>
			</Box>
      	</ThemeProvider>
    );
  }
}

Cam1.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Cam1);
