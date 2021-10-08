const { ipcMain } = require('electron');

const { model } = require('./config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./FlightV2');
const DAQ = require('./DAQ');
const ActuatorController = require('./ActuatorController');
const InfluxDB = require('./InfluxDB');

class App {
  constructor() {
    this.webContents = [];
    this.state = new State(model);
    this.influxDB = new InfluxDB();

    // comms
    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);
    this.port1 = new UdpPort('0.0.0.0', 42070, this.updateState);
    this.port2 = new UdpPort('0.0.0.0', 42071, this.updateState);

    this.flightComputer = new FlightV2(this.port,
                                       '10.0.0.42',
                                       () => this.updateState(Date.now(), { flightConnected: true }),
                                       () => this.updateState(Date.now(), { flightConnected: false }),
                                       (rate) => this.updateState(Date.now(), { flightKbps: rate }));
    this.daq1 = new DAQ(this.port, '10.0.0.11', {
      pressureVal0: 'propGemsPT',
      voltage: 'daq1Voltage',
      power: 'daq1Power',
      currentDraw: 'daq1CurrentDraw',
      lc0: 'thrust1',
      lc1: 'thrust2',
      lcSum: 'totalThrust',
      lc2: 'propaneSourceTankKg',
      tcVal0: 'engineTC1',
      tcVal1: 'engineTC2',
      tcVal2: 'engineTC3',
      tcVal3: 'engineTC4',
      _5v_aVoltage: 'daq1_5v_aVoltage',
      _5v_aCurrent: 'daq1_5v_aCurrent',
      _5vVoltage: 'daq1_5vVoltage',
      _5vCurrent: 'daq1_5vCurrent',
      analogTemp0:'pressurantTemp'
    },
    () => this.updateState(Date.now(), { daq1Connected: true }),
    () => this.updateState(Date.now(), { daq1Connected: false }),
    (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));

    this.daq2 = new DAQ(this.port, '10.0.0.12', {
      pressureVal0: null,
      voltage: 'daq2Voltage',
      power: 'daq2Power',
      currentDraw: 'daq2CurrentDraw',
      lc0: null,
      lc1: null,
      lcSum: null,
      tcVal0: 'engineTC5',
      tcVal1: 'engineTC6',
      tcVal2: 'engineTC7',
      tcVal3: 'engineTC8',
      _5v_aVoltage: 'daq2_5v_aVoltage',
      _5v_aCurrent: 'daq2_5v_aCurrent',
      _5vVoltage: 'daq2_5vVoltage',
      _5vCurrent: 'daq2_5vCurrent',
      analogTemp0: null
    },
    () => this.updateState(Date.now(), { daq2Connected: true }),
    () => this.updateState(Date.now(), { daq2Connected: false }),
    (rate) => this.updateState(Date.now(), { daq2Kbps: rate }));

    this.actCtrlr1 = new ActuatorController(this.port, '10.0.0.21', {
      ch12v0Current: null,
      ch12v1Current: null,
      ch24v0Current: 'propTankTopHeaterCurrent',
      ch24v1Current: 'propTankMidHeaterCurrent',
      ch12v0State: null,
      ch12v1State: null,
      ch24v0State: 'propTankTopHeaterVal',
      ch24v1State: 'propTankMidHeaterVal',
      voltage: 'ac1Voltage',
      power: 'ac1Power',
      currentDraw: 'ac1CurrentDraw',
      act0Current: 'pressurantFlowRBVcurrent',
      act1Current: 'pressurantFillRBVcurrent',
      act2Current: 'LOxVentRBVcurrent',
      act3Current: 'LOxTankVentRBVcurrent',
      act4Current: 'LOxFlowRBVcurrent',
      act5Current: 'pressurantVentRBVcurrent',
      act6Current: null,
      ch0State: 'pressurantFlowRBVchState',
      ch1State: 'pressurantFillRBVchState',
      ch2State: 'LOxVentRBVchState',
      ch3State: 'LOxTankVentRBVchState',
      ch4State: 'LOxFlowRBVchState',
      ch5State: 'pressurantVentRBVchState',
      ch6State: null,
      act0State: 'pressurantFlowRBVstate',
      act1State: 'pressurantFillRBVstate',
      act2State: 'LOxVentRBVstate',
      act3State: 'LOxTankVentRBVstate',
      act4State: 'LOxFlowRBVstate',
      act5State: 'pressurantVentRBVstate',
      act6State: null,
      packetCounter: 'actCtrlr1packetCounter'
    },
    () => this.updateState(Date.now(), { actCtrlr1Connected: true }),
    () => this.updateState(Date.now(), { actCtrlr1Connected: false }),
    (rate) => this.updateState(Date.now(), { actCtrlr1Kbps: rate }));
    this.actCtrlr2 = new ActuatorController(this.port1, '10.0.0.21', {
      ch12v0Current: null,
      ch12v1Current: null,
      ch24v0Current: 'propTankBottomHeaterCurrent',
      ch24v1Current: 'LOxTankTopHeaterCurrent',
      ch12v0State: null,
      ch12v1State: null,
      ch24v0State: 'propTankBottomHeaterVal',
      ch24v1State: 'LOxTankTopHeaterVal',
      voltage: 'ac2Voltage',
      power: 'ac2Power',
      currentDraw: 'ac2CurrentDraw',
      act0Current: 'LOxRQD1current',
      act1Current: 'LOxRQD2current',
      act2Current: 'propaneVentRBVcurrent',
      act3Current: 'propaneFlowRBVcurrent',
      act4Current: 'propaneRQD1current',
      act5Current: 'propaneRQD2current',
      act6Current: 'propaneTankVentRBVcurrent',
      ch0State: 'LOxRQD1chState',
      ch1State: 'LOxRQD2chState',
      ch2State: 'propaneVentRBVchState',
      ch3State: 'propaneFlowRBVchState',
      ch4State: 'propaneRQD1chState',
      ch5State: 'propaneRQD2chState',
      ch6State: 'propaneTankVentRBVchState',
      act0State: 'LOxRQD1state',
      act1State: 'LOxRQD2state',
      act2State: 'propaneVentRBVstate',
      act3State: 'propaneFlowRBVstate',
      act4State: 'propaneRQD1state',
      act5State: 'propaneRQD2state',
      act6State: 'propaneTankVentRBVstate',
      packetCounter: 'actCtrlr2packetCounter'
    },
    () => this.updateState(Date.now(), { actCtrlr2Connected: true }),
    () => this.updateState(Date.now(), { actCtrlr2Connected: false }),
    (rate) => this.updateState(Date.now(), { actCtrlr2Kbps: rate }));

    this.actCtrlr3 = new ActuatorController(this.port2, '10.0.0.21', {
      ch12v0Current: null,
      ch12v1Current: null,
      ch24v0Current: 'LOxTankMidHeaterCurrent',
      ch24v1Current: 'LOxTankBottomHeaterCurrent',
      ch12v0State: null,
      ch12v1State: null,
      ch24v0State: 'LOxTankMidHeaterVal',
      ch24v1State: 'LOxTankBottomHeaterVal',
      voltage: 'ac3Voltage',
      power: 'ac3Power',
      currentDraw: 'ac3CurrentDraw',
      act0Current: 'LOxPrechillRBVcurrent',
      act1Current: 'purgePrechillVentRBVcurrent',
      act2Current: 'prechillFlowRBVcurrent',
      act3Current: 'propanePrechillRBVcurrent',
      act4Current: 'purgeFlowRBVcurrent',
      act5Current: 'igniterInserterCurrent',
      act6Current: null,
      ch0State: 'LOxPrechillRBVchState',
      ch1State: 'purgePrechillVentRBVchState',
      ch2State: 'prechillFlowRBVchState',
      ch3State: 'propanePrechillRBVchState',
      ch4State: 'purgeFlowRBVchState',
      ch5State: 'igniterInserterChState',
      ch6State: null,
      act0State: 'LOxPrechillRBVstate',
      act1State: 'purgePrechillVentRBVstate',
      act2State: 'prechillFlowRBVstate',
      act3State: 'propanePrechillRBVstate',
      act4State: 'purgeFlowRBVstate',
      act5State: 'igniterInserterState',
      act6State: null,
      packetCounter: 'actCtrlr3packetCounter'
    },
    () => this.updateState(Date.now(), { actCtrlr3Connected: true }),
    () => this.updateState(Date.now(), { actCtrlr3Connected: false }),
    (rate) => this.updateState(Date.now(), { actCtrlr3Kbps: rate }));

    this.abort = this.abort.bind(this);
    this.hold = this.hold.bind(this);

    this.setupIPC();

  }

  /**
   * Takes in an update to the state and sends it where it needs to go
   *
   * @param {Object} update
   */
  updateState(timestamp, update) {
    // console.log(update);
    this.state.updateState(timestamp, update);
    this.sendStateUpdate(timestamp, update);
    this.influxDB.handleStateUpdate(timestamp, update);
  }

  /**
   * Send the specified state update to all windows
   *
   * @param {moment.Moment} timestamp
   * @param {Object} update
   */
  sendStateUpdate(timestamp, update) {
    for(let wc of this.webContents) {
      wc.send('state-update', {
        timestamp,
        update,
      });
    }
  }

  sendDarkModeUpdate(isDark) {
    for(let wc of this.webContents) {
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

  abort() { // feels like this should be done in the frontend, not the backend.
    this.flightComputer.abort();
    this.actCtrlr1.closeActCh1(); // Close Pressurant Flow
    this.actCtrlr1.closeActCh4(); // Close LOx Flow
    this.actCtrlr2.closeActCh3(); // Close Propane Flow

    this.actCtrlr3.closeActCh2(); // Close pre-chill Flow
    this.actCtrlr3.closeActCh4(); // Close Purge Flow
    this.actCtrlr3.closeActCh0(); // Close LOx Prechill
    this.actCtrlr3.closeActCh3(); // Close Propane Prechill

    this.actCtrlr1.openActCh2(); // Open LOx Vent
    this.actCtrlr2.openActCh2(); // Open Propane Vent
    this.actCtrlr3.openActCh1(); // Open Purge/Pre-chill Vent
    this.actCtrlr1.openActCh3(); // Open LOx Tank Vent
    this.actCtrlr2.openActCh6(); // Open Propane Tank Vent
  }

  hold() {
    // TODO: implement hold
  }

  addIPC(channel, handler, dbrecord=true) {
    ipcMain.handle(channel, (...args) => {
      if(dbrecord) {
        const update = {};
        update[channel] = true;
        this.influxDB.handleStateUpdate(Date.now(), update);
      }
      return handler(...args);
    });
  }

  /**
   * Sets up all the IPC commands that the windows have access to
   */
  setupIPC() {

    this.addIPC('connect-influx', (e, host, port, protocol, username, password) => this.influxDB.connect(host, port, protocol, username, password));
    this.addIPC('get-databases', this.influxDB.getDatabaseNames);
    this.addIPC('set-database', (e, database) => this.influxDB.setDatabase(database) );
    this.addIPC('set-darkmode', (e, isDark) => this.sendDarkModeUpdate(isDark));
    this.addIPC('set-procedure-state', (e, procState) => this.influxDB.setProcedureStep(procState));

    // Flight Computer

    this.addIPC('flight-connected', () => this.flightComputer.isConnected);
    this.addIPC('daq1-connected', () => this.daq1.isConnected);
    this.addIPC('daq2-connected', () => this.daq2.isConnected);
    this.addIPC('actctrlr1-connected', () => this.actCtrlr1.isConnected);
    this.addIPC('actctrlr2-connected', () => this.actCtrlr2.isConnected);
    this.addIPC('actctrlr3-connected', () => this.actCtrlr3.isConnected);

    this.addIPC('open-lox2Way', this.flightComputer.openLox2Way);
    this.addIPC('close-lox2Way', this.flightComputer.closeLox2Way);

    this.addIPC('open-lox5Way', this.flightComputer.openLox5Way);
    this.addIPC('close-lox5Way', this.flightComputer.closeLox5Way);

    this.addIPC('open-prop5Way', this.flightComputer.openProp5Way);
    this.addIPC('close-prop5Way', this.flightComputer.closeProp5Way);

    this.addIPC('open-loxGems', this.flightComputer.openLoxGems);
    this.addIPC('close-loxGems', this.flightComputer.closeLoxGems);

    this.addIPC('open-propGems', this.flightComputer.openPropGems);
    this.addIPC('close-propGems', this.flightComputer.closePropGems);

    this.addIPC('enable-HPS', this.flightComputer.enableHPS);
    this.addIPC('disable-HPS', this.flightComputer.disableHPS);
    this.addIPC('open-HPS', this.flightComputer.openHPS);
    this.addIPC('close-HPS', this.flightComputer.closeHPS);

    this.addIPC('activate-Igniter', this.flightComputer.activateIgniter)
    this.addIPC('deactivate-Igniter', this.flightComputer.deactivateIgniter)

    this.addIPC('begin-flow', this.flightComputer.beginFlow);
    this.addIPC('end-flow', this.flightComputer.abort);
    this.addIPC('abort', this.abort);
    this.addIPC('hold', this.hold);


    this.addIPC('set-loxPTHeater', (e, val) => this.flightComputer.setLoxPTHeater(val));
    this.addIPC('set-loxGemsHeater', (e, val) => this.flightComputer.setLoxGemsHeater(val));
    this.addIPC('set-loxInjectorHeater', (e, val) => this.flightComputer.setLoxInjectorHeater(val));

    this.addIPC('set-propPTHeater', (e, val) => this.flightComputer.setPropanePTHeater(val));
    this.addIPC('set-propGemsHeater', (e, val) => this.flightComputer.setPropaneGemsHeater(val));
    this.addIPC('set-propInjectorHeater', (e, val) => this.flightComputer.setPropaneInjectorHeater(val));


    // DAQ 1

    // DAQ 2


    // Actuator Controller 1

    this.addIPC('set-propTankTopHeater', (e, val) => this.actCtrlr1.setHeater24vCh0(val));

    this.addIPC('set-propTankMidHeater', (e, val) => this.actCtrlr1.setHeater24vCh1(val));

    this.addIPC('open-pressurantFlowRBV', this.actCtrlr1.openActCh0);
    this.addIPC('close-pressurantFlowRBV', this.actCtrlr1.closeActCh0);
    this.addIPC('time-pressurantFlowRBV', (e, val) => this.actCtrlr1.actCh0ms(val));

    this.addIPC('open-pressurantFillRBV', this.actCtrlr1.openActCh1);
    this.addIPC('close-pressurantFillRBV', this.actCtrlr1.closeActCh1);
    this.addIPC('time-pressurantFillRBV', (e, val) => this.actCtrlr1.actCh1ms(val));

    this.addIPC('open-LOxVentRBV', this.actCtrlr1.openActCh2);
    this.addIPC('close-LOxVentRBV', this.actCtrlr1.closeActCh2);
    this.addIPC('time-LOxVentRBV', (e, val) => this.actCtrlr1.actCh2ms(val));

    this.addIPC('open-LOxTankVentRBV', this.actCtrlr1.openActCh3);
    this.addIPC('close-LOxTankVentRBV', this.actCtrlr1.closeActCh3);
    this.addIPC('time-LOxTankVentRBV', (e, val) => this.actCtrlr1.actCh3ms(val));

    this.addIPC('open-LOxFlowRBV', this.actCtrlr1.openActCh4);
    this.addIPC('close-LOxFlowRBV', this.actCtrlr1.closeActCh4);
    this.addIPC('time-LOxFlowRBV', (e, val) => this.actCtrlr1.actCh4ms(val));

    this.addIPC('open-pressurantVentRBV', this.actCtrlr1.openActCh5);
    this.addIPC('close-pressurantVentRBV', this.actCtrlr1.closeActCh5);
    this.addIPC('time-pressurantVentRBV', (e, val) => this.actCtrlr1.actCh5ms(val));

    // Actuator Controller 2

    this.addIPC('set-propTankBottomHeater', (e, val) => this.actCtrlr2.setHeater24vCh0(val));

    this.addIPC('set-LOxTankTopHeater', (e, val) => this.actCtrlr2.setHeater24vCh1(val));

    this.addIPC('open-LOxRQD', () => { this.actCtrlr2.openActCh0(); this.actCtrlr2.openActCh1() });
    this.addIPC('close-LOxRQD', () => { this.actCtrlr2.closeActCh0(); this.actCtrlr2.closeActCh1() });
    this.addIPC('time-LOxRQD', (e, val) => { this.actCtrlr2.actCh0ms(val); this.actCtrlr2.actCh1ms(val) });

    this.addIPC('open-propaneVentRBV', this.actCtrlr2.openActCh2);
    this.addIPC('close-propaneVentRBV', this.actCtrlr2.closeActCh2);
    this.addIPC('time-propaneVentRBV', (e, val) => this.actCtrlr2.actCh2ms(val));

    this.addIPC('open-propaneFlowRBV', this.actCtrlr2.openActCh3);
    this.addIPC('close-propaneFlowRBV', this.actCtrlr2.closeActCh3);
    this.addIPC('time-propaneFlowRBV', (e, val) => this.actCtrlr2.actCh3ms(val));

    this.addIPC('open-propaneRQD', () => { this.actCtrlr2.openActCh4(); this.actCtrlr2.openActCh5() });
    this.addIPC('close-propaneRQD', () => { this.actCtrlr2.closeActCh4(); this.actCtrlr2.closeActCh5() });
    this.addIPC('time-propaneRQD', (e, val) => { this.actCtrlr2.actCh4ms(val); this.actCtrlr2.actCh5ms(val) });

    // this.addIPC('open-propaneRQD2', this.actCtrlr2.openActCh5);
    // this.addIPC('close-propaneRQD2', this.actCtrlr2.closeActCh5);
    // this.addIPC('time-propaneRQD2', (e, val) => this.actCtrlr2.actCh5ms(val));

    this.addIPC('open-propaneTankVentRBV', this.actCtrlr2.openActCh6);
    this.addIPC('close-propaneTankVentRBV', this.actCtrlr2.closeActCh6);
    this.addIPC('time-propaneTankVentRBV', (e, val) => this.actCtrlr2.actCh6ms(val));

    // Actuator Controller 3

    this.addIPC('set-LOxTankMidHeater', (e, val) => this.actCtrlr3.setHeater24vCh0(val));

    this.addIPC('set-LOxTankBottomHeater', (e, val) => this.actCtrlr3.setHeater24vCh1(val));

    this.addIPC('open-LOxPrechillRBV', this.actCtrlr3.openActCh0);
    this.addIPC('close-LOxPrechillRBV', this.actCtrlr3.closeActCh0);
    this.addIPC('time-LOxPrechillRBV', (e, val) => this.actCtrlr3.actCh0ms(val));

    this.addIPC('open-purgePrechillVentRBV', this.actCtrlr3.openActCh1);
    this.addIPC('close-purgePrechillVentRBV', this.actCtrlr3.closeActCh1);
    this.addIPC('time-purgePrechillVentRBV', (e, val) => this.actCtrlr3.actCh1ms(val));

    this.addIPC('open-prechillFlowRBV', this.actCtrlr3.openActCh2);
    this.addIPC('close-prechillFlowRBV', this.actCtrlr3.closeActCh2);
    this.addIPC('time-prechillFlowRBV', (e, val) => this.actCtrlr3.actCh2ms(val));

    this.addIPC('open-propanePrechillRBV', this.actCtrlr3.openActCh3);
    this.addIPC('close-propanePrechillRBV', this.actCtrlr3.closeActCh3);
    this.addIPC('time-propanePrechillRBV', (e, val) => this.actCtrlr3.actCh3ms(val));

    this.addIPC('open-purgeFlowRBV', this.actCtrlr3.openActCh4);
    this.addIPC('close-purgeFlowRBV', this.actCtrlr3.closeActCh4);
    this.addIPC('time-purgeFlowRBV', (e, val) => this.actCtrlr3.actCh4ms(val));

    this.addIPC('extend-igniterInserter', this.actCtrlr3.openActCh5);
    this.addIPC('retract-igniterInserter', this.actCtrlr3.closeActCh5);
    this.addIPC('time-igniterInserter', (e, val) => this.actCtrlr3.actCh5ms(val));

  }
}

module.exports = App;
