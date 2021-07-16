import { Component } from "react";
import PropTypes from 'prop-types';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const styles = theme => ({
	feed: {
		display: "flex",
		width: "100%",
		height: "40%"
	}, 
	feedInfo: {
		width: "100%",
		height: "2.5%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly"
	}, 
	feedTitle: {
		display: "flex",
		flexDirection: "row",
		alignItem: "center",
		height: "2.5%",
		width: "100%"
	}
});

class Feed extends Component {
	constructor(props) {
		super(props);
		this.camNum = this.props.camNum;
		this.state = {
			isDark: false
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
				<Box className={classes.feedTitle}>
					<div>Feed: {`${this.camNum}`}</div>
				</Box>
				<img className={classes.feed} src={`http://10.0.0.5${this.camNum}:8080/stream`} />
				<Box className={classes.feedInfo}>
					<h4>Framerate: </h4>
					<h4>SD Card Capacity: </h4>
				</Box>
			</ThemeProvider>
		)
	}
}

Feed.propTypes = {
	classes: PropTypes.object.isRequired
  };
export default withStyles(styles)(Feed);