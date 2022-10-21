const { ipcMain, TouchBar } = require('electron');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV3 = require('./Boards/FlightV3');
const Ground = require('./Boards/Ground');
const DAQ = require('./Boards/DAQ');
const ActuatorController = require('./Boards/ActuatorController');
const InfluxDB = require('./InfluxDB');

let lastThrust12 = 0.0;
let lastThrust34 = 0.0;

class App {
  constructor() {
    this.webContents = [];
    // this.state = new State(model);
    this.state = new State({});
    this.influxDB = new InfluxDB();
    this.commandFuncs = {};

    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.handleSendCustomMessage = this.handleSendCustomMessage.bind(this)
    this.addBackendFunc = this.addBackendFunc.bind(this);
  }

  /**
   * Separate init function from constructor to ensure WebContents are present before accepting IPC invocations
   */
  initApp() {
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);

    this.flightComputer = new FlightV3(this.port,
      '10.0.0.42',
      {
        firmwareCommitHash: 'flightCommitHash',

        // supplyVoltage: 'flightSupplyVoltage',
        // supplyCurrent: 'flightSupplyCurrent',
        // supplyPower: 'flightSupplyPower',

        // supply12Voltage: 'flightSupply12Voltage',
        // supply12Current: 'flightSupply12Current',
        // supply12Power: 'flightSupply12Power',

        supply8Voltage: 'flightSupply8Voltage',
        supply8Current: 'flightSupply8Current',
        supply8Power: 'flightSupply8Power',

        engineTC0: 'engineTop1TC',
        engineTC1: 'engineTop2TC',
        engineTC2: 'engineBottom1TC',
        engineTC3: 'engineBottom2TC',
      },
      () => this.updateState(Date.now(), { flightConnected: true }),
      () => this.updateState(Date.now(), { flightConnected: false }),
      (rate) => this.updateState(Date.now(), { flightKbps: rate }));

    this.groundComputer = new Ground(this.port,
      '10.0.0.43',
      {
        firmwareCommitHash: 'groundCommitHash',

        supplyVoltage: 'groundSupplyVoltage',
        supplyCurrent: 'groundSupplyCurrent',
        supplyPower: 'groundSupplyPower',

        supply12Voltage: 'groundSupply12Voltage',
        supply12Current: 'groundSupply12Current',
        supply12Power: 'groundSupply12Power',

        supply8Voltage: 'groundSupply8Voltage',
        supply8Current: 'groundSupply8Current',
        supply8Power: 'groundSupply8Power',
      },
      () => this.updateState(Date.now(), { groundConnected: true }),
      () => this.updateState(Date.now(), { groundConnected: false }),
      (rate) => this.updateState(Date.now(), { groundKbps: rate }));

    this.daq1 = new DAQ(this.port, '10.0.0.11', {
        firmwareCommitHash: 'daq1CommitHash',

        daqBattVoltage: null,
        daqBattCurrent: null,

        daqADC0: null,
        daqADC1: null,
        daqADC2: null,
        daqADC3: null,
        daqADC4: null,
        daqADC5: null,
        daqADC6: 'rqdPT',
        daqADC7: null,

        daqTC0: 'injectorTC',
        daqTC1: 'engineMid1TC',
        daqTC2: 'engineMid2TC',
        daqTC3: 'engineTop3TC',

        loadCell0: 'thrust0',
        loadCell1: 'thrust1',
        loadCell2: 'thrust2',
        loadCell3: 'thrust3',
        loadCellSum: 'totalThrust12',

        fastLoadCell1: 'fastThrust1',
        fastLoadCell2: 'fastThrust2',

        capacitor1: null,
        capacitor2: null,
      },
      () => this.updateState(Date.now(), { daq1Connected: true }),
      () => this.updateState(Date.now(), { daq1Connected: false }),
      (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));

    this.actCtrlr1 = new ActuatorController(this.port, '10.0.0.21', {
        firmwareCommitHash: 'ac1CommitHash',

        acBattVoltage: 'ac1BattVoltage',
        acBattCurrent: 'ac1BattCurrent',
        acSupply12Voltage: 'ac1Supply12Voltage',
        acSupply12Current: 'ac1Supply12Current',

        acLinAct1State: 'pressurantFillRBVstate',
        acLinAct1Voltage: 'pressurantFillRBVvoltage',
        acLinAct1Current: 'pressurantFillRBVcurrent',
        
        acLinAct2State: 'fuelFillRBVstate',
        acLinAct2Voltage: 'fuelFillRBVvoltage',
        acLinAct2Current: 'fuelFillRBVcurrent',
        
        acLinAct3State: 'pressurantFillVentRBVstate',
        acLinAct3Voltage: 'pressurantFillVentRBVvoltage',
        acLinAct3Current: 'pressurantFillVentRBVcurrent',

        acLinAct4State: null,
        acLinAct4Voltage: null,
        acLinAct4Current: null,
        
        acLinAct5State: null,
        acLinAct5Voltage: null,
        acLinAct5Current: null,
        
        acLinAct6State: null,
        acLinAct6Voltage: null,
        acLinAct6Current: null,

        acLinAct7State: null,
        acLinAct7Voltage: null,
        acLinAct7Current: null,

        acHeater1Voltage: null,
        acHeater1Current: null,

        acHeater2Voltage: null,
        acHeater2Current: null,

        acHeater3Voltage: null,
        acHeater3Current: null,

        acHeater4Voltage: null,
        acHeater4Current: null,
      },
      () => this.updateState(Date.now(), { actCtrlr1Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr1Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr1Kbps: rate }));

    // Begin TouchBar
    this.abort = this.addBackendFunc('abort', this.groundComputer.abort)
    // End TouchBar

    this.setupIPC();
  }
  
  /**
   * Creates a function that will log state update to influx
   */
  addBackendFunc(name, func) {
    return () => {
      this.updateState(Date.now(), {[name]: 'invoked'}, true)
      func()
    }
  }
    

  /**
   * Takes in an update to the state and sends it where it needs to go
   *
   * @param timestamp timestamp of the state update
   * @param {Object} update
   * @param dbrecord should store in db?
   */
  updateState(timestamp, update, dbrecord = true) {
    this.state.updateState(timestamp, update);
    this.sendStateUpdate(timestamp, update);
    if (dbrecord) {
      // if update value is not number -> add to syslog as well
      Object.keys(update).forEach(_k => {
        if(typeof update[_k] !== 'number'){
          if(update[_k].message){
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${update[_k].message}`, update[_k].tags)
          }else{
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${update[_k]}`)
          }
        }
      })
      this.influxDB.handleStateUpdate(timestamp, update);
    }

    if(Object.keys(update).includes("totalThrust12")) {
      lastThrust12 = update['totalThrust12']; // update total thrust value
      this.updateState(timestamp, {"totalThrust": lastThrust12 + lastThrust34});
    }
    if(Object.keys(update).includes("totalThrust34")) {
      lastThrust34 = update['totalThrust34'];
      this.updateState(timestamp, {"totalThrust": lastThrust12 + lastThrust34});
    }
  }

  /**
   * Send the specified state update to all windows
   *
   * @param {moment.Moment} timestamp
   * @param {Object} update
   */
  sendStateUpdate(timestamp, update) {
    for (let wc of this.webContents) {
      wc.send('state-update', {
        timestamp,
        update,
      });
    }
  }

  sendDarkModeUpdate(isDark) {
    for (let wc of this.webContents) {
      wc.send('set-darkmode', isDark);
    }
  }

  /**
   * When a window is created, register it's webContents object so we can send
   * state updates to that window
   *
   * @param {Object} webContents
   */
  addWebContents(webContents) {
    this.webContents.push(webContents);
  }

  removeWebContents(webContents) {
    this.webContents.splice(this.webContents.indexOf(webContents), 1);
  }

  addIPC(channel, handler, dbrecord = true) {
    let updateFunc = (...args) => {
      const update = {
        [channel]: args.length > 1 ? `invoked with arg(s): ${args.slice(1).join(", ")}` : 'invoked'
      };
      this.updateState(Date.now(), update, dbrecord)
      return handler(...args);
    }
    ipcMain.handle(channel, updateFunc);
    this.commandFuncs[channel] = updateFunc
  }

  handleSendCustomMessage(e, messageDestination, message){
    if(messageDestination === 'sys-log'){
      this.influxDB.handleSysLogUpdate(Date.now(), `text-input -> ${message}`, {
        manualInput: true
      }).then(r => {
        // TODO: implement some sort of sent check
      })
    }else{
      const destBoard = this[messageDestination]
      if(destBoard){
        // TODO: implement sending to the respective boards with sendPacket
      }
    }
    console.debug(`received request to send custom message to ${messageDestination}: ${message}`)
  }

  /**
   * Sets up all the IPC commands that the windows have access to
   */
  setupIPC() {
    console.debug('setting up ipc channels')
    this.addIPC('connect-influx', (e, host, port, protocol, username, password) => this.influxDB.connect(host, port, protocol, username, password), false);
    this.addIPC('get-databases', this.influxDB.getDatabaseNames);
    this.addIPC('set-database', (e, database) => this.influxDB.setDatabase(database));
    this.addIPC('set-darkmode', (e, isDark) => this.sendDarkModeUpdate(isDark), false);
    this.addIPC('set-procedure-state', (e, procState) => this.influxDB.setProcedureStep(procState));

    this.addIPC('send-custom-message', this.handleSendCustomMessage, false)


    this.addIPC('flight-connected', () => this.flightComputer.isConnected);
    this.addIPC('ground-connected', () => this.groundComputer.isConnected);
    this.addIPC('daq1-connected', () => this.daq1.isConnected);
    // this.addIPC('daq2-connected', () => this.daq2.isConnected);
    // this.addIPC('daq3-connected', () => this.daq3.isConnected);
    // this.addIPC('daq4-connected', () => this.daq4.isConnected);
    this.addIPC('actctrlr1-connected', () => this.actCtrlr1.isConnected);

    // Flight Computer

    this.addIPC('open-loxGemsValve', this.flightComputer.openloxGemsValve);
    this.addIPC('close-loxGemsValve', this.flightComputer.closeloxGemsValve);

    this.addIPC('open-fuelGemsValve', this.flightComputer.openfuelGemsValve);
    this.addIPC('close-fuelGemsValve', this.flightComputer.closefuelGemsValve);

    this.addIPC('start-toggleLoxGemsValve', this.flightComputer.startToggleLoxGemsValve);
    this.addIPC('stop-toggleLoxGemsValve', this.flightComputer.stopToggleLoxGemsValve);

    this.addIPC('start-toggleFuelGemsValve', this.flightComputer.startToggleFuelGemsValve);
    this.addIPC('stop-toggleFuelGemsValve', this.flightComputer.stopToggleFuelGemsValve);

    this.addIPC('open-pressurantFlowRBV', this.flightComputer.openPressFlowRBV);
    this.addIPC('close-pressurantFlowRBV', this.flightComputer.closePressFlowRBV);
    this.addIPC('time-pressurantFlowRBV', (e, val) => this.flightComputer.pressFlowRBVms(val));

    this.addIPC('enable-flightMode', this.flightComputer.enableFlightMode);
    this.addIPC('disable-flightMode', this.flightComputer.disableFlightMode);

    // Ground Computer

    this.addIPC('enable-launchMode', this.groundComputer.enablelaunchMode);
    this.addIPC('disable-launchMode', this.groundComputer.disablelaunchMode);

    this.addIPC('open-armValve', this.groundComputer.openarmValve);
    this.addIPC('close-armValve', this.groundComputer.closearmValve);

    this.addIPC('activate-igniter', this.groundComputer.activateIgniter);
    this.addIPC('deactivate-igniter', this.groundComputer.deactivateIgniter);

    this.addIPC('open-loxMainValve', this.groundComputer.openloxMainValve);
    this.addIPC('close-loxMainValve', this.groundComputer.closeloxMainValve);

    this.addIPC('open-fuelMainValve', this.groundComputer.openfuelMainValve);
    this.addIPC('close-fuelMainValve', this.groundComputer.closefuelMainValve);

    this.addIPC('open-mainValveVent', this.groundComputer.openMainValveVent);
    this.addIPC('close-mainValveVent', this.groundComputer.closeMainValveVent);

    this.addIPC('open-pressRQD', this.groundComputer.openPressRQD);
    this.addIPC('close-pressRQD', this.groundComputer.closePressRQD);

    this.addIPC('beginFlow', this.groundComputer.beginFlow);
    this.addIPC('abort', this.groundComputer.abort);

    this.addIPC('enable-igniter', this.groundComputer.enableIgniter);
    this.addIPC('disable-igniter', this.groundComputer.disableIgniter);


    // Actuator Controller 1
    this.addIPC('open-pressurantFillRBV', this.actCtrlr1.closeActCh0);
    this.addIPC('close-pressurantFillRBV', this.actCtrlr1.openActCh0);
    this.addIPC('time-pressurantFillRBV', (e, val) => this.actCtrlr1.actCh0ms(-val));

    this.addIPC('open-fuelFillRBV', this.actCtrlr1.openActCh1);
    this.addIPC('close-fuelFillRBV', this.actCtrlr1.closeActCh1);
    this.addIPC('time-fuelFillRBV', (e, val) => this.actCtrlr1.actCh1ms(val));

    this.addIPC('open-loxFillRBV', this.actCtrlr1.openActCh4);
    this.addIPC('close-loxFillRBV', this.actCtrlr1.closeActCh4);
    this.addIPC('time-loxFillRBV', (e, val) => this.actCtrlr1.actCh4ms(val));

    this.addIPC('open-pressurantFillVentRBV', this.actCtrlr1.openActCh2);
    this.addIPC('close-pressurantFillVentRBV', this.actCtrlr1.closeActCh2);
    this.addIPC('time-pressurantFillVentRBV', (e, val) => this.actCtrlr1.actCh2ms(val));

  }
}

module.exports = App;
