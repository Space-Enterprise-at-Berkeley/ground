const { ipcMain } = require('electron');

// const { model } = require('./config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./FlightV2');
const DAQ = require('./DAQ');
const DAQV3 = require('./DAQV3');
const ActuatorController = require('./ActuatorController');
const InfluxDB = require('./InfluxDB');
const Packet = require('./Packet');

class App {
  constructor() {
    this.webContents = [];
    // this.state = new State(model);
    this.state = new State({});
    this.influxDB = new InfluxDB();

    this.ledDelay = 0.0;

    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.abort = this.abort.bind(this);
    this.hold = this.hold.bind(this);
    this.handleSendCustomMessage = this.handleSendCustomMessage.bind(this);
  }

  /**
   * Separate init function from constructor to ensure WebContents are present before accepting IPC invocations
   */
  initApp(){
    this.port = new UdpPort('0.0.0.0', 42069, this.updateState);

    this.flightComputer = new FlightV2(this.port,
      '10.0.0.42',
      () => this.updateState(Date.now(), { flightConnected: true }),
      () => this.updateState(Date.now(), { flightConnected: false }),
      (rate) => this.updateState(Date.now(), { flightKbps: rate }));
    this.daq1 = new DAQ(this.port, '10.0.0.11', {
        pressureVal0: 'fuelDomePT',
        voltage: 'daq1Voltage',
        power: 'daq1Power',
        currentDraw: 'daq1CurrentDraw',
        lc0: 'thrust1',
        lc1: 'thrust2',
        lcSum: 'totalThrust',
        // lc2: 'propaneSourceTankKg',
        tcVal0: 'loxTankMidTC',
        tcVal1: 'engineTC5',
        tcVal2: 'engineTC6',
        tcVal3: 'loxTankTopTC',
        _5v_aVoltage: 'daq1_5v_aVoltage',
        _5v_aCurrent: 'daq1_5v_aCurrent',
        _5vVoltage: 'daq1_5vVoltage',
        _5vCurrent: 'daq1_5vCurrent',
        analogTemp0: 'pressurantTemp'
      },
      () => this.updateState(Date.now(), { daq1Connected: true }),
      () => this.updateState(Date.now(), { daq1Connected: false }),
      (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));

    this.daq2 = new DAQ(this.port, '10.0.0.12', {
        pressureVal0: null,
        voltage: null,
        power: null,
        currentDraw: null,
        lc0: null,
        lc1: null,
        lcSum: null,
        tcVal0: 'engineTC1',
        tcVal1: 'engineTC2',
        tcVal2: 'engineTC3',
        tcVal3: 'engineTC4',
        _5v_aVoltage: null,
        _5v_aCurrent: null,
        _5vVoltage: null,
        _5vCurrent: null,
        analogTemp0: null
      },
      () => this.updateState(Date.now(), { daq2Connected: true }),
      () => this.updateState(Date.now(), { daq2Connected: false }),
      (rate) => this.updateState(Date.now(), { daq2Kbps: rate }));

    this.daq3 = new DAQV3(this.port, '10.0.0.13', {},
      () => this.updateState(Date.now(), { daq3Connected: true }),
      () => this.updateState(Date.now(), { daq3Connected: false }),
      (rate) => this.updateState(Date.now(), { daq3Kbps: rate })
    )

    this.actCtrlr1 = new ActuatorController(this.port, '10.0.0.21', {
        ch12v0Current: null, // these dont work currently
        ch12v1Current: null, // ^^^
        ch24v0Current: 'fuelTankBottomHeaterCurrent',
        ch24v1Current: 'loxTankTopHeaterCurrent',
        ch12v0State: null, // dont work
        ch12v1State: null, // ^^^
        ch24v0State: 'fuelTankBottomHeaterVal',
        ch24v1State: 'loxTankTopHeaterVal',
        voltage: 'ac1Voltage',
        power: 'ac1Power',
        currentDraw: 'ac1CurrentDraw',
        act0Current: 'pressurantFlowRBVcurrent',
        act1Current: 'fuelFillRBVcurrent',
        act2Current: null,
        act3Current: 'loxTankVentRBVcurrent',
        act4Current: 'loxFillRBVcurrent',
        act5Current: null,
        act6Current: 'fuelTankVentRBVcurrent',
        ch0State: 'pressurantFlowRBVchState',
        ch1State: 'fuelFillRBVchState',
        ch2State: null,
        ch3State: 'loxTankVentRBVchState',
        ch4State: 'loxFillRBVchState',
        ch5State: null,
        ch6State: 'fuelTankVentRBVchState',
        act0State: 'pressurantFlowRBVstate',
        act1State: 'fuelFillRBVstate',
        act2State: null,
        act3State: 'loxTankVentRBVstate',
        act4State: 'loxFillRBVstate',
        act5State: null,
        act6State: 'fuelTankVentRBVstate',
        packetCounter: 'actCtrlr1packetCounter'
      },
      () => this.updateState(Date.now(), { actCtrlr1Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr1Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr1Kbps: rate }));
    this.actCtrlr2 = new ActuatorController(this.port, '10.0.0.22', {
        ch12v0Current: null,
        ch12v1Current: null,
        ch24v0Current: 'fuelTankTopHeaterCurrent',
        ch24v1Current: 'fuelTankMidHeaterCurrent',
        ch12v0State: null,
        ch12v1State: null,
        ch24v0State: 'fuelTankTopHeaterVal',
        ch24v1State: 'fuelTankMidHeaterVal',
        voltage: 'ac2Voltage',
        power: 'ac2Power',
        currentDraw: 'ac2CurrentDraw',

        act0Current: null,
        act1Current: null,
        act2Current: null,
        act3Current: null,
        act4Current: null,
        act5Current: null,
        act6Current: 'pressurantFillRBVcurrent',

        ch0State: null,
        ch1State: null,
        ch2State: null,
        ch3State: null,
        ch4State: null,
        ch5State: null,
        ch6State: 'pressurantFillRBVchState',

        act0State: null,
        act1State: null,
        act2State: null,
        act3State: null,
        act4State: null,
        act5State: null,
        act6State: 'pressurantFillRBVstate',

        packetCounter: 'actCtrlr2packetCounter'
      },
      () => this.updateState(Date.now(), { actCtrlr2Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr2Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr2Kbps: rate }));

    this.actCtrlr3 = new ActuatorController(this.port, '10.0.0.23', {
        ch12v0Current: null,
        ch12v1Current: null,
        ch24v0Current: 'loxTankBottomHeaterCurrent',
        ch24v1Current: 'loxTankMidHeaterCurrent',
        ch12v0State: null,
        ch12v1State: null,
        ch24v0State: 'loxTankBottomHeaterVal',
        ch24v1State: 'loxTankMidHeaterVal',
        voltage: 'ac3Voltage',
        power: 'ac3Power',
        currentDraw: 'ac3CurrentDraw',
        act0Current: 'loxPrechillRBVcurrent',
        act1Current: 'purgePrechillVentRBVcurrent',
        act2Current: 'prechillFlowRBVcurrent',
        act3Current: 'fuelPrechillRBVcurrent',
        act4Current: 'purgeFlowRBVcurrent',
        act5Current: null,
        act6Current: null,
        ch0State: 'loxPrechillRBVchState',
        ch1State: 'purgePrechillVentRBVchState',
        ch2State: 'prechillFlowRBVchState',
        ch3State: 'fuelPrechillRBVchState',
        ch4State: 'purgeFlowRBVchState',
        ch5State: null,
        ch6State: null,
        act0State: 'loxPrechillRBVstate',
        act1State: 'purgePrechillVentRBVstate',
        act2State: 'prechillFlowRBVstate',
        act3State: 'fuelPrechillRBVstate',
        act4State: 'purgeFlowRBVstate',
        act5State: null,
        act6State: null,
        packetCounter: 'actCtrlr3packetCounter'
      },
      () => this.updateState(Date.now(), { actCtrlr3Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr3Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr3Kbps: rate }));

    this.setupIPC();
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
  }

  /**
   * Send the specified state update to all windows
   *
   * @param {moment.Moment} timestamp
   * @param {Object} update
   */
  sendStateUpdate(timestamp, update) {
    // LED SHENANIGANS
    if(timestamp - this.ledDelay > 200) {
      if(update['daq3-lox-capVal']) {
        this.ledDelay = timestamp;
        this.port.send('10.0.0.12', (new Packet(98, [0, update['daq3-fuel-capVal'], update['daq3-lox-capVal']])).stringify());
      }
    }
    // END LED SHENANIGANS


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

  abort() { // feels like this should be done in the frontend, not the backend.
    // this.flightComputer.abort();
    // this.actCtrlr1.closeActCh1(); // Close Pressurant Flow
    // this.actCtrlr1.closeActCh4(); // Close LOx Flow
    // this.actCtrlr2.closeActCh3(); // Close Propane Flow

    // this.actCtrlr3.closeActCh2(); // Close pre-chill Flow
    // this.actCtrlr3.closeActCh4(); // Close Purge Flow
    // this.actCtrlr3.closeActCh0(); // Close LOx Prechill
    // this.actCtrlr3.closeActCh3(); // Close Propane Prechill

    // this.actCtrlr1.openActCh2(); // Open LOx Vent
    // this.actCtrlr2.openActCh2(); // Open Propane Vent
    // this.actCtrlr3.openActCh1(); // Open Purge/Pre-chill Vent
    // this.actCtrlr1.openActCh3(); // Open LOx Tank Vent
    // this.actCtrlr2.openActCh6(); // Open Propane Tank Vent


    this.actCtrlr1.openActCh3(); // loxTankVent open
    this.actCtrlr1.openActCh6(); // fuelTankVent open

    this.actCtrlr1.closeActCh4(); // loxFill close
    this.actCtrlr1.closeActCh1(); // fuelFill close

    this.actCtrlr2.closeActCh6(); // pressurantFill close
    this.actCtrlr3.closeActCh4(); // purge flow close

    this.actCtrlr3.openActCh1(); // purge prechill vent open



  }

  hold() {
    // TODO: implement hold
  }

  addIPC(channel, handler, dbrecord = true) {
    ipcMain.handle(channel, (...args) => {
      const update = {
        [channel]: args.length > 1 ? `invoked with arg(s): ${args.slice(1).join(", ")}` : 'invoked'
      };
      this.updateState(Date.now(), update, dbrecord)
      return handler(...args);
    });
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

    // Flight Computer

    this.addIPC('flight-connected', () => this.flightComputer.isConnected);
    this.addIPC('daq1-connected', () => this.daq1.isConnected);
    this.addIPC('daq2-connected', () => this.daq2.isConnected);
    this.addIPC('daq3-connected', () => this.daq3.isConnected);
    this.addIPC('actctrlr1-connected', () => this.actCtrlr1.isConnected);
    this.addIPC('actctrlr2-connected', () => this.actCtrlr2.isConnected);
    this.addIPC('actctrlr3-connected', () => this.actCtrlr3.isConnected);

    this.addIPC('open-armValve', this.flightComputer.openarmValve);
    this.addIPC('close-armValve', this.flightComputer.closearmValve);

    this.addIPC('open-loxMainValve', this.flightComputer.openloxMainValve);
    this.addIPC('close-loxMainValve', this.flightComputer.closeloxMainValve);

    this.addIPC('open-fuelMainValve', this.flightComputer.openfuelMainValve);
    this.addIPC('close-fuelMainValve', this.flightComputer.closefuelMainValve);

    // this.addIPC('open-loxGems', this.flightComputer.openLoxGems);
    // this.addIPC('close-loxGems', this.flightComputer.closeLoxGems);

    // this.addIPC('open-propGems', this.flightComputer.openPropGems);
    // this.addIPC('close-propGems', this.flightComputer.closePropGems);

    this.addIPC('enable-HPS', this.flightComputer.enableHPS);
    this.addIPC('disable-HPS', this.flightComputer.disableHPS);
    this.addIPC('open-HPS', this.flightComputer.openHPS);
    this.addIPC('close-HPS', this.flightComputer.closeHPS);

    this.addIPC('activate-Igniter', this.flightComputer.activateIgniter)
    this.addIPC('deactivate-Igniter', this.flightComputer.deactivateIgniter)

    this.addIPC('enable-thermocoupleReading', this.flightComputer.enableThermocoupleRead)
    this.addIPC('disable-thermocoupleReading', this.flightComputer.disableThermocoupleRead)

    this.addIPC('begin-flow', this.flightComputer.beginFlow);
    this.addIPC('end-flow', this.flightComputer.abort);
    this.addIPC('abort', this.abort);
    this.addIPC('hold', this.hold);


    this.addIPC('set-loxTankPTHeater', (e, val) => this.flightComputer.setloxTankPTHeater(val));
    // this.addIPC('set-loxGemsHeater', (e, val) => this.flightComputer.setLoxGemsHeater(val));
    this.addIPC('set-loxInjectorPTHeater', (e, val) => this.flightComputer.setloxInjectorPTHeater(val));

    this.addIPC('set-fuelTankPTHeater', (e, val) => this.flightComputer.setfuelTankPTHeater(val));
    // this.addIPC('set-propGemsHeater', (e, val) => this.flightComputer.setPropaneGemsHeater(val));
    this.addIPC('set-fuelInjectorPTHeater', (e, val) => this.flightComputer.setfuelInjectorPTHeater(val));

    this.addIPC('end-Checkout', this.flightComputer.endCheckout);
    this.addIPC('start-Checkout', this.flightComputer.startCheckout);


    // DAQ 1

    // DAQ 2

    this.addIPC('set-capLoxValBase', (e, val) => this.port.send('10.0.0.12', (new Packet(97, [val])).stringify()))
    this.addIPC('set-capFuelValBase', (e, val) => this.port.send('10.0.0.12', (new Packet(96, [val])).stringify()))


    // Actuator Controller 1

    this.addIPC('set-fuelTankBottomHeater', (e, val) => this.actCtrlr1.setHeater24vCh0(val));

    this.addIPC('set-loxTankTopHeater', (e, val) => this.actCtrlr1.setHeater24vCh1(val));

    this.addIPC('open-pressurantFlowRBV', this.actCtrlr1.openActCh0);
    this.addIPC('close-pressurantFlowRBV', this.actCtrlr1.closeActCh0);
    this.addIPC('time-pressurantFlowRBV', (e, val) => this.actCtrlr1.actCh0ms(val));

    this.addIPC('open-fuelFillRBV', this.actCtrlr1.openActCh1);
    this.addIPC('close-fuelFillRBV', this.actCtrlr1.closeActCh1);
    this.addIPC('time-fuelFillRBV', (e, val) => this.actCtrlr1.actCh1ms(val));

    // this.addIPC('open-LOxVentRBV', this.actCtrlr1.openActCh2);
    // this.addIPC('close-LOxVentRBV', this.actCtrlr1.closeActCh2);
    // this.addIPC('time-LOxVentRBV', (e, val) => this.actCtrlr1.actCh2ms(val));

    this.addIPC('open-loxTankVentRBV', this.actCtrlr1.openActCh3);
    this.addIPC('close-loxTankVentRBV', this.actCtrlr1.closeActCh3);
    this.addIPC('time-loxTankVentRBV', (e, val) => this.actCtrlr1.actCh3ms(val));

    this.addIPC('open-loxFillRBV', this.actCtrlr1.openActCh4);
    this.addIPC('close-loxFillRBV', this.actCtrlr1.closeActCh4);
    this.addIPC('time-loxFillRBV', (e, val) => this.actCtrlr1.actCh4ms(val));

    // this.addIPC('open-pressurantVentRBV', this.actCtrlr1.openActCh5);
    // this.addIPC('close-pressurantVentRBV', this.actCtrlr1.closeActCh5);
    // this.addIPC('time-pressurantVentRBV', (e, val) => this.actCtrlr1.actCh5ms(val));

    this.addIPC('open-fuelTankVentRBV', this.actCtrlr1.openActCh6);
    this.addIPC('close-fuelTankVentRBV', this.actCtrlr1.closeActCh6);
    this.addIPC('time-fuelTankVentRBV', (e, val) => this.actCtrlr1.actCh6ms(val));

    // Actuator Controller 2

    this.addIPC('set-fuelTankTopHeater', (e, val) => this.actCtrlr2.setHeater24vCh0(val));

    this.addIPC('set-fuelTankMidHeater', (e, val) => this.actCtrlr2.setHeater24vCh1(val));


    this.addIPC('open-pressurantFillRBV', this.actCtrlr2.openActCh6);
    this.addIPC('close-pressurantFillRBV', this.actCtrlr2.closeActCh6);
    this.addIPC('time-pressurantFillRBV', (e, val) => this.actCtrlr2.actCh6ms(val));


    // this.addIPC('open-LOxRQD', () => { this.actCtrlr2.openActCh0(); this.actCtrlr2.openActCh1() });
    // this.addIPC('close-LOxRQD', () => { this.actCtrlr2.closeActCh0(); this.actCtrlr2.closeActCh1() });
    // this.addIPC('time-LOxRQD', (e, val) => { this.actCtrlr2.actCh0ms(val); this.actCtrlr2.actCh1ms(val) });

    // this.addIPC('open-propaneVentRBV', this.actCtrlr2.openActCh2);
    // this.addIPC('close-propaneVentRBV', this.actCtrlr2.closeActCh2);
    // this.addIPC('time-propaneVentRBV', (e, val) => this.actCtrlr2.actCh2ms(val));

    // this.addIPC('open-fuelFillRBV', this.actCtrlr2.openActCh3);
    // this.addIPC('close-fuelFillRBV', this.actCtrlr2.closeActCh3);
    // this.addIPC('time-fuelFillRBV', (e, val) => this.actCtrlr2.actCh3ms(val));

    // this.addIPC('open-propaneRQD', () => { this.actCtrlr2.openActCh4(); this.actCtrlr2.openActCh5() });
    // this.addIPC('close-propaneRQD', () => { this.actCtrlr2.closeActCh4(); this.actCtrlr2.closeActCh5() });
    // this.addIPC('time-propaneRQD', (e, val) => { this.actCtrlr2.actCh4ms(val); this.actCtrlr2.actCh5ms(val) });

    // this.addIPC('open-propaneRQD2', this.actCtrlr2.openActCh5);
    // this.addIPC('close-propaneRQD2', this.actCtrlr2.closeActCh5);
    // this.addIPC('time-propaneRQD2', (e, val) => this.actCtrlr2.actCh5ms(val));

    // this.addIPC('open-fuelTankVentRBV', this.actCtrlr2.openActCh6);
    // this.addIPC('close-fuelTankVentRBV', this.actCtrlr2.closeActCh6);
    // this.addIPC('time-fuelTankVentRBV', (e, val) => this.actCtrlr2.actCh6ms(val));

    // Actuator Controller 3

    this.addIPC('set-loxTankBottomHeater', (e, val) => this.actCtrlr3.setHeater24vCh0(val));

    this.addIPC('set-loxTankMidHeater', (e, val) => this.actCtrlr3.setHeater24vCh1(val));

    this.addIPC('open-loxPrechillRBV', this.actCtrlr3.openActCh0);
    this.addIPC('close-loxPrechillRBV', this.actCtrlr3.closeActCh0);
    this.addIPC('time-loxPrechillRBV', (e, val) => this.actCtrlr3.actCh0ms(val));

    this.addIPC('open-purgePrechillVentRBV', this.actCtrlr3.openActCh1);
    this.addIPC('close-purgePrechillVentRBV', this.actCtrlr3.closeActCh1);
    this.addIPC('time-purgePrechillVentRBV', (e, val) => this.actCtrlr3.actCh1ms(val));

    this.addIPC('open-prechillFlowRBV', this.actCtrlr3.openActCh2);
    this.addIPC('close-prechillFlowRBV', this.actCtrlr3.closeActCh2);
    this.addIPC('time-prechillFlowRBV', (e, val) => this.actCtrlr3.actCh2ms(val));

    this.addIPC('open-fuelPrechillRBV', this.actCtrlr3.openActCh3);
    this.addIPC('close-fuelPrechillRBV', this.actCtrlr3.closeActCh3);
    this.addIPC('time-fuelPrechillRBV', (e, val) => this.actCtrlr3.actCh3ms(val));

    this.addIPC('open-purgeFlowRBV', this.actCtrlr3.openActCh4);
    this.addIPC('close-purgeFlowRBV', this.actCtrlr3.closeActCh4);
    this.addIPC('time-purgeFlowRBV', (e, val) => this.actCtrlr3.actCh4ms(val));

    // this.addIPC('extend-igniterInserter', this.actCtrlr3.openActCh5);
    // this.addIPC('retract-igniterInserter', this.actCtrlr3.closeActCh5);
    // this.addIPC('time-igniterInserter', (e, val) => this.actCtrlr3.actCh5ms(val));

  }
}

module.exports = App;
