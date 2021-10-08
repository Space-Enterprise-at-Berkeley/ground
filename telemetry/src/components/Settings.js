import React, { Component } from 'react';
import { withTheme, withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContent, DialogActions, Button, Typography, TextField, Select, MenuItem } from '@material-ui/core';
import Comms from '../api/Comms';

const styles = theme => ({
  head: {
    // display: 'inline',
    // borderBottom: '0.5px solid gray'
  },
  fields: {
    marginTop: '1rem',
    marginRight: '1rem',
    width: '18ch',
  },
  connectButton: {
    marginTop: theme.spacing(2)
  },
  connectedButton: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.success.main + ' !important',
    color: theme.palette.text.primary + ' !important'
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      influxHost: '',
      influxPort: 443,
      influxProtocol: 'https',
      influxUsername: '',
      influxPassword: '',
      influxConnecting: false,
      influxDatabase: '',
      influxDatabaseList: [],
    };

    this.updateInfluxHost = this.updateInfluxHost.bind(this);
    this.updateInfluxPort = this.updateInfluxPort.bind(this);
    this.updateInfluxProtocol = this.updateInfluxProtocol.bind(this);
    this.updateInfluxUsername = this.updateInfluxUsername.bind(this);
    this.updateInfluxPassword = this.updateInfluxPassword.bind(this);
    this.updateInfluxDatabase = this.updateInfluxDatabase.bind(this);

    this.connectToInflux = this.connectToInflux.bind(this);
    this.setInfluxDatabase = this.setInfluxDatabase.bind(this);
  }

  updateInfluxHost(e) { this.setState({ influxHost: e.target.value }); }
  updateInfluxPort(e) { this.setState({ influxPort: parseInt(e.target.value) }); }
  updateInfluxProtocol(e) { this.setState({ influxProtocol: e.target.value }); }
  updateInfluxUsername(e) { this.setState({ influxUsername: e.target.value }); }
  updateInfluxPassword(e) { this.setState({ influxPassword: e.target.value }); }
  updateInfluxDatabase(e) { this.setState({ influxDatabase: e.target.value }); }

  async connectToInflux() {
    this.setState({ influxConnecting: true });
    const { influxHost,
            influxPort,
            influxProtocol,
            influxUsername,
            influxPassword } = this.state;
    await Comms.connectInflux(influxHost,
                              influxPort,
                              influxProtocol,
                              influxUsername,
                              influxPassword);
    const databases = await Comms.getDatabases();
    this.setState({ influxDatabase: databases[0], influxDatabaseList: databases, influxConnecting: false });
  }

  async setInfluxDatabase() {
    const { influxDatabase } = this.state;
    await Comms.setDatabase(influxDatabase);
    // Initialize Procedures. Done here since selecting databse is last step before data is recorded
    // TODO: Maybe move this somewhere else, or rename function
    await Comms.setProcedureState(0);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { classes, open, closeSettings } = this.props;
    const { influxHost,
            influxPort,
            influxProtocol,
            influxUsername,
            influxPassword,
            influxConnecting,
            influxDatabase,
            influxDatabaseList } = this.state;
    const influxConnected = influxDatabaseList.length > 0;
    return (
      <Dialog open={ open } onClose={ closeSettings }>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography variant='subtitle1' className={ classes.head }>Influx Connection</Typography>
          <form noValidate>
            <div>
              <TextField
                label='influx host'
                value={ influxHost }
                onChange={ this.updateInfluxHost }
                className={ classes.fields }
              />
              <TextField
                label='influx port'
                type='number'
                value={ influxPort }
                onChange={ this.updateInfluxPort }
                className={ classes.fields }
              />
              <Select
                label='influx protocol'
                value={ influxProtocol }
                onChange={ this.updateInfluxProtocol }
                className={ classes.fields }
              >
                <MenuItem value='https'>https</MenuItem>
                <MenuItem value='http'>http</MenuItem>
              </Select>
            </div>
            <div>
              <TextField
                label='influx username'
                value={ influxUsername }
                onChange={ this.updateInfluxUsername }
                className={ classes.fields }
              />
              <TextField
                label='influx password'
                type='password'
                value={ influxPassword }
                onChange={ this.updateInfluxPassword }
                className={ classes.fields }
              />
            </div>
            <div>
              <Button onClick={ this.connectToInflux } color='primary' variant='contained' className={ influxConnected ? classes.connectedButton : classes.connectButton } disabled={ influxConnecting || influxConnected }>
                { influxConnected ? 'Connected' : 'Connect to Influx' }
              </Button>
            </div>
          </form>
          <form noValidate>
            <div>
              <Select
                label='influx database'
                value={ influxDatabase }
                onChange={ this.updateInfluxDatabase }
                className={ classes.fields }
              >
                {influxDatabaseList.map(db => (
                  <MenuItem key={db} value={db}>{db}</MenuItem>
                ))}
              </Select>
              <Button onClick={ this.setInfluxDatabase } color='primary' variant='contained' disabled={ !influxConnected }>Select DB</Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={ closeSettings } color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withTheme(withStyles(styles)(Settings));
