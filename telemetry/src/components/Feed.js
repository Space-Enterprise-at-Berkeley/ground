import { Component } from "react";
import PropTypes from 'prop-types';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Container } from '@material-ui/core';
import CapacityBar from './CapacityBar';

const styles = theme => ({
	feedCont: { 
		height: "45vh"
	},
	feed: {
		display: "flex",
		width: "100%",
		height: "40vh"
	}, 
	feedInfo: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		height: "2.5vh"
	}, 
	feedTitle: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		padding: "0.5rem",
		height: "2.5vh"
	},
	noMargin: {
		margin: "0px",
		padding: "0px"
	}, 
	capContainer: {
		display: "flex",
		flexDirection: "row",
		width: '50%',
		alignItems: "center",
		justifyContent: "center"
	},
	capBar: {
		width: "50%",
		marginLeft: "1rem"
	}

});

class Feed extends Component {
	constructor(props) {
		super(props);
		this.camNum = this.props.camNum;
		this.state = {
			isDark: false,
			framerate: 0
		}
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
				<div className={classes.feedCont}>
					<div className={classes.feedTitle}>
						<h4 className={classes.noMargin}>Feed: {`${this.camNum}`}</h4>
					</div>
					<img className={classes.feed} src={`http://10.0.0.5${this.camNum}:8080/stream`} alt="" />
					<div className={classes.feedInfo}>
						<p>Framerate: {this.state.framerate} fps </p>
						<div className={classes.capContainer}> 
							<p className={classes.noMargin}>SD Card Capacity: </p>
							<div className={classes.capBar}>
								<CapacityBar />
							</div>
						</div>
					</div>
				</div>
			</ThemeProvider>
		)
	}
}

Feed.propTypes = {
	classes: PropTypes.object.isRequired
  };
export default withStyles(styles)(Feed);