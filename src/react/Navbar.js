import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Brightness4Icon from '@material-ui/icons/Brightness4';

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  themeButton: {
    marginLeft: theme.spacing(2)
  },
  select: {
    marginLeft: theme.spacing(2)
  },
  connectedButton: {
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  disconnectedButton: {
    backgroundColor: theme.palette.error.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
  paper: {
    paddingTop: theme.spacing(0.8),
    paddingBottom: theme.spacing(0.8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandwidth: 0,
      time: 0
    };
  }
  componentDidMount() {
    this.props.addBandwidthListener(bandwidth => {
      this.setState({
        bandwidth
      });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar position='static' color='default'>
        <Toolbar>
          <div className={classes.grow}></div>
          <Button className={classes.paper}>
            RX {Math.round(this.state.bandwidth * 100 / this.props.baud)}%
          </Button>
          <Button
            color='primary'
            variant='contained'
            disableElevation
            onClick={this.props.connect}
            disabled={this.props.portOpened}
            className={this.props.portOpened ? (this.props.connected ? classes.connectedButton : classes.disconnectedButton) : undefined}
            // style={{backgroundColor: this.props.portOpened ? (this.props.connected ? '' : 'Red') : undefined}}
          >
            {this.props.portOpened ? (this.props.connected ? 'Connected' : 'Disconnected') : 'Connect'}
          </Button>
          <Select className={classes.select} value={this.props.port} onChange={e => this.props.selectPort(parseInt(e.target.value))} disabled={this.props.portOpened}>
            {this.props.ports.map((p, i) => (
              <MenuItem value={i} key={i}>{p.path} - {p.manufacturer}</MenuItem>
            ))}
          </Select>
          <Tooltip title='Toggle light/dark theme'>
            <IconButton
              className={classes.themeButton}
              color="inherit"
              onClick={e => this.props.onThemeChange(!this.props.isDark)}
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withTheme(withStyles(styles)(Navbar));
