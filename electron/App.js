const { ipcMain, TouchBar } = require('electron');

// const { model } = require('./config');

const State = require('./State');
const UdpPort = require('./UdpPort');
const FlightV2 = require('./Boards/FlightV2');
const DAQ = require('./Boards/DAQ');
const DAQV3 = require('./Boards/DAQV3');
const EReg = require('./Boards/EReg');
const ERegDAQ = require('./Boards/ERegDAQ');
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

    this.flightComputer = new FlightV2(this.port,
      '10.0.0.42',
      {
        firmwareCommitHash: 'flightCommitHash',
      },
      () => this.updateState(Date.now(), { flightConnected: true }),
      () => this.updateState(Date.now(), { flightConnected: false }),
      (rate) => this.updateState(Date.now(), { flightKbps: rate }));
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
        daqADC6: null,
        daqADC7: null,

        daqTC1: 'injectorTC',
        daqTC2: 'engineMid1TC',
        daqTC3: 'engineMid2TC',
        daqTC4: 'engineTop3TC',

        loadCell1: 'thrust1',
        loadCell2: 'thrust2',
        loadCellSum: 'totalThrust12',

        fastLoadCell1: 'fastThrust1',
        fastLoadCell2: 'fastThrust2',

        capacitor1: null,
        capacitor2: null,
      },
      () => this.updateState(Date.now(), { daq1Connected: true }),
      () => this.updateState(Date.now(), { daq1Connected: false }),
      (rate) => this.updateState(Date.now(), { daq1Kbps: rate }));

    this.daq2 = new DAQ(this.port, '10.0.0.12', {
        firmwareCommitHash: 'daq2CommitHash',

        daqBattVoltage: null,
        daqBattCurrent: null,

        daqADC0: null,
        daqADC1: null,
        daqADC2: null,
        daqADC3: null,
        daqADC4: null,
        daqADC5: null,
        daqADC6: null,
        daqADC7: null,

        daqTC1: 'tc0',
        daqTC2: 'tc1',
        daqTC3: 'tc2',
        daqTC4: 'tc3',

        loadCell1: 'thrust1',
        loadCell2: 'thrust2',
        loadCellSum: 'totalThrust',

        capacitor1: null,
        capacitor2: null,
      },
      () => this.updateState(Date.now(), { daq2Connected: true }),
      () => this.updateState(Date.now(), { daq2Connected: false }),
      (rate) => this.updateState(Date.now(), { daq2Kbps: rate }));

    this.daq3 = new DAQ(this.port, '10.0.0.33', {
        firmwareCommitHash: 'daq3CommitHash',

        daqBattVoltage: null,
        daqBattCurrent: null,

        daqADC0: null,
        daqADC1: null,
        daqADC2: null,
        daqADC3: null,
        daqADC4: null,
        daqADC5: null,
        daqADC6: null,
        daqADC7: null,

        daqTC1: null,
        daqTC2: null,
        daqTC3: null,
        daqTC4: null,

        loadCell1: null,
        loadCell2: null,
        loadCellSum: null,

      capVal: 'loxCapVal',
      capValFiltered: 'loxCapValFiltered',
      capTemperature: 'loxCapTemp',
      },
      () => this.updateState(Date.now(), { daq3Connected: true }),
      () => this.updateState(Date.now(), { daq3Connected: false }),
      (rate) => this.updateState(Date.now(), { daq3Kbps: rate })
    )

    this.daq4 = new DAQ(this.port, '10.0.0.32', {
      firmwareCommitHash: 'daq4CommitHash',

      daqBattVoltage: null,
      daqBattCurrent: null,

      daqADC0: null,
      daqADC1: null,
      daqADC2: null,
      daqADC3: null,
      daqADC4: null,
      daqADC5: null,
      daqADC6: null,
      daqADC7: null,

      daqTC1: null,
      daqTC2: null,
      daqTC3: null,
      daqTC4: null,

      loadCell1: null,
      loadCell2: null,
      loadCellSum: null,

      loxCapVal: 'loxCapVal',
      fuelCapVal: 'fuelCapVal',
      capValFiltered: 'fuelCapValFiltered',
      capTemperature: 'fuelCapTemp',
    },
    () => this.updateState(Date.now(), { daq4Connected: true }),
    () => this.updateState(Date.now(), { daq4Connected: false }),
    (rate) => this.updateState(Date.now(), { daq4Kbps: rate })
  )

    this.actCtrlr1 = new ActuatorController(this.port, '10.0.0.21', {
        firmwareCommitHash: 'ac1CommitHash',

        acBattVoltage: 'ac1BattVoltage',
        acBattCurrent: 'ac1BattCurrent',
        acSupply12Voltage: 'ac1Supply12Voltage',
        acSupply12Current: 'ac1Supply12Current',

        acLinAct1State: 'ERegACCh0state',
        acLinAct1Voltage: 'ERegACCh0voltage',
        acLinAct1Current: 'ERegACCh0current',
        
        acLinAct2State: 'ERegACCh1state',
        acLinAct2Voltage: 'ERegACCh1voltage',
        acLinAct2Current: 'ERegACCh1current',
        
        acLinAct3State: 'ERegACCh2state',
        acLinAct3Voltage: 'ERegACCh2voltage',
        acLinAct3Current: 'ERegACCh2current',

        acLinAct4State: 'ERegACCh3state',
        acLinAct4Voltage: 'ERegACCh3voltage',
        acLinAct4Current: 'ERegACCh3current',
        
        acLinAct5State: 'ERegACCh4state',
        acLinAct5Voltage: 'ERegACCh4voltage',
        acLinAct5Current: 'ERegACCh4current',
        
        acLinAct6State: 'ERegACCh5state',
        acLinAct6Voltage: 'ERegACCh5voltage',
        acLinAct6Current: 'ERegACCh5current',

        acLinAct7State: 'ERegACCh6state',
        acLinAct7Voltage: 'ERegACCh6voltage',
        acLinAct7Current: 'ERegACCh6current',

        acHeater1Voltage: 'acHeater1Voltage',
        acHeater1Current: 'acHeater1Current',

        acHeater2Voltage: 'acHeater2Voltage',
        acHeater2Current: 'acHeater2Current',

        acHeater3Voltage: 'acHeater3Voltage',
        acHeater3Current: 'acHeater3Current',

        acHeater4Voltage: 'acHeater4Voltage',
        acHeater4Current: 'acHeater4Current',
      },
      () => this.updateState(Date.now(), { actCtrlr1Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr1Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr1Kbps: rate }));
    this.actCtrlr2 = new ActuatorController(this.port, '10.0.0.22', {
        firmwareCommitHash: 'ac2CommitHash',

        acBattVoltage: 'ac2BattVoltage',
        acBattCurrent: 'ac2BattCurrent',
        acSupply12Voltage: 'ac2Supply12Voltage',
        acSupply12Current: 'ac2Supply12Current',
        
        acLinAct1State: 'loxTankVentRBVstate',
        acLinAct1Voltage: 'loxTankVentRBVvoltage',
        acLinAct1Current: 'loxTankVentRBVcurrent',

        acLinAct2State: null,
        acLinAct2Voltage: null,
        acLinAct2Current: null,

        acLinAct3State: 'fuelTankVentRBVstate',
        acLinAct3Voltage: 'fuelTankVentRBVvoltage',
        acLinAct3Current: 'fuelTankVentRBVcurrent',

        acLinAct4State: 'fuelPrechillRBVstate',
        acLinAct4Voltage: 'fuelPrechillRBVvoltage',
        acLinAct4Current: 'fuelPrechillRBVcurrent',

        acLinAct5State: 'purgeFlowRBVstate',
        acLinAct5Voltage: 'purgeFlowRBVvoltage',
        acLinAct5Current: 'purgeFlowRBVcurrent',

        acLinAct6State: 'prechillFlowRBVstate',
        acLinAct6Voltage: 'prechillFlowRBVvoltage',
        acLinAct6Current: 'prechillFlowRBVcurrent',

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
      () => this.updateState(Date.now(), { actCtrlr2Connected: true }),
      () => this.updateState(Date.now(), { actCtrlr2Connected: false }),
      (rate) => this.updateState(Date.now(), { actCtrlr2Kbps: rate }));



    this.fuelTankEReg = new EReg(this.port, '10.0.0.25', { 
      // fuel EReg telemetry, to dashboard from EReg
      EReg_HP_PT: 'fuelTankERegHPT',
      EReg_LP_PT: 'fuelTankERegLPT',
      EReg_ENCODER_ANGLE: 'fuelTankERegEncoderAngle',
      EReg_ANGLE_SETPOINT: 'fuelTankERegAngleSetPoint',
      EReg_PRESSURE_SETPOINT: 'fuelTankERegPressureSetpoint',
      EReg_MOTOR_POWER: 'fuelTankERegMotorPower',
      EReg_PRESSURE_CONTROL_P: 'fuelTankERegPTerm',
      EReg_PRESSURE_CONTROL_I: 'fuelTankERegITerm',
      EReg_PRESSURE_CONTROL_D: 'fuelTankERegDTerm',

      EReg_CONFIG_PRESSURE_SETPOINT: 'fuelTankConfigERegPressureSetpoint',
      EReg_KP_OUTER: 'fuelTankERegKPOuter',
      EReg_KL_OUTER: 'fuelTankERegKLOuter',
      EReg_KD_OUTER: 'fuelTankERegKDOuter',
      EReg_KP_INNER: 'fuelTankERegKPInner',
      EReg_KL_INNER: 'fuelTankERegKLInner',
      EReg_KD_INNER: 'fuelTankERegKDInner',
      EReg_FLOW_DURATION: 'fuelTankERegFlowDuration',


      EReg_ERROR_CODE: 'fuelTankERegErrorCode',

      EReg_STATE: 'fuelTankERegERegState',


    },
    () => this.updateState(Date.now(), { EReg1Connected: true }),
    () => this.updateState(Date.now(), { EReg1Connected: false }),
    (rate) => this.updateState(Date.now(), { EReg1kbps: rate })); 

  this.LoxTankEReg = new EReg(this.port, '10.0.0.26', { 
      //add values here
      EReg_HP_PT: 'LoxTankERegHPT',
      EReg_LP_PT: 'LoxTankERegLPT',
      EReg_ENCODER_ANGLE: 'LoxTankERegEncoderAngle',
      EReg_ANGLE_SETPOINT: 'LoxTankERegAngleSetPoint',
      EReg_PRESSURE_SETPOINT: 'LoxTankERegPressureSetpoint',
      EReg_MOTOR_POWER: 'LoxTankERegMotorPower',
      EReg_PRESSURE_CONTROL_P: 'LoxTankERegPTerm',
      EReg_PRESSURE_CONTROL_I: 'LoxTankERegITerm',
      EReg_PRESSURE_CONTROL_D: 'LoxTankERegDTerm',

      EReg_CONFIG_PRESSURE_SETPOINT: 'LoxTankConfigERegPressureSetpoint',
      EReg_KP_OUTER: 'LoxTankERegKPOuter',
      EReg_KL_OUTER: 'LoxTankERegKLOuter',
      EReg_KD_OUTER: 'LoxTankERegKDOuter',
      EReg_KP_INNER: 'LoxTankERegKPInner',
      EReg_KL_INNER: 'LoxTankERegKLInner',
      EReg_KD_INNER: 'LoxTankERegKDInner',
      EReg_FLOW_DURATION: 'LoxTankERegFlowDuration',


      EReg_ERROR_CODE: 'LoxTankERegErrorCode',

      EReg_STATE: 'LoxTankERegERegState',

    },
    () => this.updateState(Date.now(), { EReg2Connected: true }),
    () => this.updateState(Date.now(), { EReg2Connected: false }),
    (rate) => this.updateState(Date.now(), { EReg2kbps: rate })); 

  this.fuelInjectorEReg = new EReg(this.port, '10.0.0.27', { 
      //add values here
      EReg_HP_PT: 'FuelInjectorERegHPT',
      EReg_LP_PT: 'FuelInjectorERegLPT',
      EReg_ENCODER_ANGLE: 'FuelInjectorERegEncoderAngle',
      EReg_ANGLE_SETPOINT: 'FuelInjectorERegAngleSetPoint',
      EReg_PRESSURE_SETPOINT: 'FuelInjectorERegPressureSetpoint',
      EReg_MOTOR_POWER: 'FuelInjectorERegMotorPower',
      EReg_PRESSURE_CONTROL_P: 'FuelInjectorERegPTerm',
      EReg_PRESSURE_CONTROL_I: 'FuelInjectorERegITerm',
      EReg_PRESSURE_CONTROL_D: 'FuelInjectorERegDTerm',

      EReg_CONFIG_PRESSURE_SETPOINT: 'FuelInjectorConfigERegPressureSetpoint',
      EReg_KP_OUTER: 'FuelInjectorERegKPOuter',
      EReg_KL_OUTER: 'FuelInjectorERegKLOuter',
      EReg_KD_OUTER: 'FuelInjectorERegKDOuter',
      EReg_KP_INNER: 'FuelInjectorERegKPInner',
      EReg_KL_INNER: 'FuelInjectorERegKLInner',
      EReg_KD_INNER: 'FuelInjectorERegKDInner',
      EReg_FLOW_DURATION: 'FuelInjectorERegFlowDuration',


      EReg_ERROR_CODE: 'FuelInjectorERegErrorCode',
      
      EReg_STATE: 'FuelInjectorERegERegState',

    },
    () => this.updateState(Date.now(), { EReg3Connected: true }),
    () => this.updateState(Date.now(), { EReg3Connected: false }),
    (rate) => this.updateState(Date.now(), { EReg3kbps: rate })); 

    this.LoxInjectorEReg = new EReg(this.port, '10.0.0.28', { 
      //add values here
      EReg_HP_PT: 'LoxInjectorERegHPT',
      EReg_LP_PT: 'LoxInjectorERegLPT',
      EReg_ENCODER_ANGLE: 'LoxInjectorERegEncoderAngle',
      EReg_ANGLE_SETPOINT: 'LoxInjectorERegAngleSetPoint',
      EReg_PRESSURE_SETPOINT: 'LoxInjectorERegPressureSetpoint',
      EReg_MOTOR_POWER: 'LoxInjectorERegMotorPower',
      EReg_PRESSURE_CONTROL_P: 'LoxInjectorERegPTerm',
      EReg_PRESSURE_CONTROL_I: 'LoxInjectorERegITerm',
      EReg_PRESSURE_CONTROL_D: 'LoxInjectorERegDTerm',

      EReg_CONFIG_PRESSURE_SETPOINT: 'LoxInjectorConfigERegPressureSetpoint',
      EReg_KP_OUTER: 'LoxInjectorERegKPOuter',
      EReg_KL_OUTER: 'LoxInjectorERegKLOuter',
      EReg_KD_OUTER: 'LoxInjectorERegKDOuter',
      EReg_KP_INNER: 'LoxInjectorERegKPInner',
      EReg_KL_INNER: 'LoxInjectorERegKLInner',
      EReg_KD_INNER: 'LoxInjectorERegKDInner',
      EReg_FLOW_DURATION: 'LoxInjectorERegFlowDuration',


      EReg_ERROR_CODE: 'LoxInjectorERegErrorCode',
      
      EReg_STATE: 'LoxInjectorERegERegState',

    },
    () => this.updateState(Date.now(), { EReg4Connected: true }),
    () => this.updateState(Date.now(), { EReg4Connected: false }),
    (rate) => this.updateState(Date.now(), { EReg4kbps: rate })); 

  this.ERegdaq = new ERegDAQ(this.port, '10.0.0.11', { 
      //add values here
      ERegDAQ_TC1: 'ERegDAQ_TC1',
      ERegDAQ_TC2: 'ERegDAQ_TC2',
      ERegDAQ_TC3: 'ERegDAQ_TC3',
      ERegDAQ_TC4: 'ERegDAQ_TC4',
      ERegDAQ_LC1: 'ERegDAQ_LC1',
      ERegDAQ_LC2: 'ERegDAQ_LC2',


    },
    () => this.updateState(Date.now(), { EReg4DAQ: true }),
    () => this.updateState(Date.now(), { EReg4DAQ: false }),
    (rate) => this.updateState(Date.now(), { EReg4DAQ: rate })); 

    // Begin TouchBar
    this.abort = this.addBackendFunc('abort', this.flightComputer.abort)
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

    // Flight Computer

    this.addIPC('flight-connected', () => this.flightComputer.isConnected);
    this.addIPC('EReg1-connected', () => this.EReg1Connected.isConnected);
    this.addIPC('EReg2-connected', () => this.EReg2Connected.isConnected);
    this.addIPC('EReg3-connected', () => this.EReg3Connected.isConnected);
    this.addIPC('EReg4-connected', () => this.EReg4Connected.isConnected);
    this.addIPC('daq1-connected', () => this.daq1.isConnected);
    this.addIPC('daq2-connected', () => this.daq2.isConnected);
    this.addIPC('daq3-connected', () => this.daq3.isConnected);
    this.addIPC('daq4-connected', () => this.daq4.isConnected);
    this.addIPC('actctrlr1-connected', () => this.actCtrlr1.isConnected);
    this.addIPC('actctrlr2-connected', () => this.actCtrlr2.isConnected);

    this.addIPC('open-loxGemsValve', this.flightComputer.openloxGemsValve);
    this.addIPC('close-loxGemsValve', this.flightComputer.closeloxGemsValve);

    this.addIPC('open-fuelGemsValve', this.flightComputer.openfuelGemsValve);
    this.addIPC('close-fuelGemsValve', this.flightComputer.closefuelGemsValve);

    this.addIPC('start-toggleLoxGemsValve', this.flightComputer.startToggleLoxGemsValve);
    this.addIPC('stop-toggleLoxGemsValve', this.flightComputer.stopToggleLoxGemsValve);

    this.addIPC('start-toggleFuelGemsValve', this.flightComputer.startToggleFuelGemsValve);
    this.addIPC('stop-toggleFuelGemsValve', this.flightComputer.stopToggleFuelGemsValve);

    this.addIPC('open-armValve', this.flightComputer.openarmValve);
    this.addIPC('close-armValve', this.flightComputer.closearmValve);

    this.addIPC('activate-igniter', this.flightComputer.activateIgniter);
    this.addIPC('deactivate-igniter', this.flightComputer.deactivateIgniter);

    this.addIPC('open-loxMainValve', this.flightComputer.openloxMainValve);
    this.addIPC('close-loxMainValve', this.flightComputer.closeloxMainValve);

    this.addIPC('open-fuelMainValve', this.flightComputer.openfuelMainValve);
    this.addIPC('close-fuelMainValve', this.flightComputer.closefuelMainValve);

    this.addIPC('activate-loxTankBottomHtr', this.flightComputer.activateLoxTankBottomHtr);
    this.addIPC('deactivate-loxTankBottomHtr', this.flightComputer.deactivateLoxTankBottomHtr);

    this.addIPC('activate-loxTankMidHtr', this.flightComputer.activateLoxTankMidHtr);
    this.addIPC('deactivate-loxTankMidHtr', this.flightComputer.deactivateLoxTankMidHtr);

    this.addIPC('activate-loxTankTopHtr', this.flightComputer.activateLoxTankTopHtr);
    this.addIPC('deactivate-loxTankTopHtr', this.flightComputer.deactivateLoxTankTopHtr);

    this.addIPC('beginFlow', this.flightComputer.beginFlow);
    this.addIPC('abort', this.flightComputer.abort);

    this.addIPC('enable-fastReadRate', this.flightComputer.enableFastReadRate);
    this.addIPC('disable-fastReadRate', this.flightComputer.disableFastReadRate);

    this.addIPC('enable-igniter', this.flightComputer.enableIgniter);
    this.addIPC('disable-igniter', this.flightComputer.disableIgniter);


    // DAQ 1

    // DAQ 2


    // Actuator Controller 1
    
    this.addIPC('open-ERegACCh0', this.actCtrlr1.openActCh0);
    this.addIPC('close-ERegACCh0', this.actCtrlr1.closeActCh0);
    this.addIPC('time-ERegACCh0', (e, val) => this.actCtrlr1.actCh0ms(val));



    this.addIPC('open-ERegACCh2', this.actCtrlr1.openActCh2);
    this.addIPC('close-ERegACCh2', this.actCtrlr1.closeActCh2);
    this.addIPC('time-ERegACCh2', (e, val) => this.actCtrlr1.actCh2ms(val));

    this.addIPC('open-ERegACCh4', this.actCtrlr1.openActCh4);
    this.addIPC('close-ERegACCh4', this.actCtrlr1.closeActCh4);
    this.addIPC('time-ERegACCh4', (e, val) => this.actCtrlr1.actCh4ms(val));

    this.addIPC('open-ERegACCh3', this.actCtrlr1.openActCh3);
    this.addIPC('close-ERegACCh3', this.actCtrlr1.closeActCh3);
    this.addIPC('time-ERegACCh3', (e, val) => this.actCtrlr1.actCh3ms(val));

    this.addIPC('open-ERegACCh5', this.actCtrlr1.openActCh5);
    this.addIPC('close-ERegACCh5', this.actCtrlr1.closeActCh5);
    this.addIPC('time-ERegACCh5', (e, val) => this.actCtrlr1.actCh5ms(val));

    this.addIPC('open-ERegACCh6', this.actCtrlr1.openActCh6);
    this.addIPC('close-ERegACCh6', this.actCtrlr1.closeActCh6);
    this.addIPC('time-ERegACCh6', (e, val) => this.actCtrlr1.actCh6ms(val));

    this.addIPC('open-ERegAC24VCh0', this.actCtrlr1.open24vCh0);
    this.addIPC('close-ERegAC24VCh0', this.actCtrlr1.close24vCh0);

    this.addIPC('open-ERegAC24VCh1', this.actCtrlr1.open24vCh1);
    this.addIPC('close-ERegAC24VCh1', this.actCtrlr1.close24vCh1);

    this.addIPC('send-FuelERegDiag', this.actCtrlr1.sendFuelERegDiag);
    this.addIPC('send-LOXERegDiag', this.actCtrlr1.sendLOXERegDiag);

    this.addIPC('start-oneSidedFuel', this.actCtrlr1.startOneSidedFuel);
    this.addIPC('start-oneSidedLOX', this.actCtrlr1.startOneSidedLOX);

    this.addIPC('begin-ERegFlow', this.actCtrlr1.beginERegFlow);

    this.addIPC('abort-ERegFlow', this.actCtrlr1.abortFlow);

    this.addIPC('set-LOXERegEncoder', (e, val)=>this.actCtrlr1.setLOXERegEncoder(val));
    this.addIPC('set-FuelERegEncoder', (e, val)=>this.actCtrlr1.setFuelERegEncoder(val));

    this.addIPC('press-ERegFuelStatic', this.actCtrlr1.pressERegFuelStatic);
    this.addIPC('press-ERegLOXStatic', this.actCtrlr1.pressERegLOXStatic);

    this.addIPC('zero-ERegFuelEncoder', this.actCtrlr1.zeroERegFuelEncoder);
    this.addIPC('zero-ERegLOXEncoder', this.actCtrlr1.zeroERegLOXEncoder);

    this.addIPC('actuate-LOXERegMainValve', (e, val)=>this.actCtrlr1.actuateLOXERegMainValve(val));
    this.addIPC('actuate-FuelERegMainValve', (e, val)=>this.actCtrlr1.actuateFuelERegMainValve(val));




    

    // Actuator Controller 2
    // TODO: swap RBV wiring so code mapping doesn't have to be swapped
    // this.addIPC('open-pressurantFlowRBV', this.actCtrlr1.openActCh2);
    // this.addIPC('close-pressurantFlowRBV', this.actCtrlr1.closeActCh2);
    // this.addIPC('time-pressurantFlowRBV', (e, val) => this.actCtrlr1.actCh2ms(val));

    this.addIPC('open-ERegACCh1', this.actCtrlr1.openActCh1);
    this.addIPC('close-ERegACCh1', this.actCtrlr1.closeActCh1);
    this.addIPC('time-ERegACCh1', (e, val) => this.actCtrlr1.actCh1ms(val));

    this.addIPC('open-loxTankVentRBV', this.actCtrlr2.openActCh0);
    this.addIPC('close-loxTankVentRBV', this.actCtrlr2.closeActCh0);
    this.addIPC('time-loxTankVentRBV', (e, val) => this.actCtrlr2.actCh0ms(val)); //wtf why is this still like this

    this.addIPC('open-fuelTankVentRBV', this.actCtrlr2.openActCh2);
    this.addIPC('close-fuelTankVentRBV', this.actCtrlr2.closeActCh2);
    this.addIPC('time-fuelTankVentRBV', (e, val) => this.actCtrlr2.actCh2ms(val));

    this.addIPC('open-fuelPrechillRBV', this.actCtrlr2.openActCh3);
    this.addIPC('close-fuelPrechillRBV', this.actCtrlr2.closeActCh3);
    this.addIPC('time-fuelPrechillRBV', (e, val) => this.actCtrlr2.actCh3ms(val));

    this.addIPC('open-purgeFlowRBV', this.actCtrlr2.openActCh4);
    this.addIPC('close-purgeFlowRBV', this.actCtrlr2.closeActCh4);
    this.addIPC('time-purgeFlowRBV', (e, val) => this.actCtrlr2.actCh4ms(val));

    this.addIPC('open-prechillFlowRBV', this.actCtrlr2.openActCh5);
    this.addIPC('close-prechillFlowRBV', this.actCtrlr2.closeActCh5);
    this.addIPC('time-prechillFlowRBV', (e, val) => this.actCtrlr2.actCh5ms(val));


    // FuelTankEReg
    this.addIPC('start-propellantFlowFuelTankEReg', this.fuelTankEReg.startPropellantFlow);
    this.addIPC('abort-ERegFuelTankEReg', this.fuelTankEReg.abortEReg);
    this.addIPC('set-motorEncoderFuelTankEReg', (e, val) => this.fuelTankEReg.setMotorEncoder(val));
    this.addIPC('pressurize-propellantStaticFuelTankEReg', this.fuelTankEReg.pressurizePropellantStatic);
    this.addIPC('run-diagnosticFuelTankEReg', this.fuelTankEReg.runDiagnostic);
    this.addIPC('zero-encodersFuelTankEReg', this.fuelTankEReg.zeroEncoders);
    this.addIPC('actuate-mainValveFuelTankEReg', (e, val) => this.fuelTankEReg.actuateMainValve(val));
    
    //  loxTankEReg
    this.addIPC('start-propellantFlowLoxTankEReg', this.LoxTankEReg.startPropellantFlow);
    this.addIPC('abort-ERegLoxTankEReg', this.LoxTankEReg.abortEReg);
    this.addIPC('set-motorEncoderLoxTankEReg', (e, val) => this.LoxTankEReg.setMotorEncoder(val));
    this.addIPC('pressurize-propellantStaticLoxTankEReg', this.LoxTankEReg.pressurizePropellantStatic);
    this.addIPC('run-diagnosticLoxTankEReg', this.LoxTankEReg.runDiagnostic);
    this.addIPC('zero-encodersLoxTankEReg', this.LoxTankEReg.zeroEncoders);
    this.addIPC('actuate-mainValveLoxTankEReg', (e, val) => this.LoxTankEReg.actuateMainValve(val));

    // fuelInjectorEReg
    this.addIPC('start-propellantFlowFuelInjectorEReg', this.fuelInjectorEReg.startPropellantFlow);
    this.addIPC('abort-ERegFuelInjectorEReg', this.fuelInjectorEReg.abortEReg);
    this.addIPC('set-motorEncoderFuelInjectorEReg', (e, val) => this.fuelInjectorEReg.setMotorEncoder(val));
    this.addIPC('pressurize-propellantStaticFuelInjectorEReg', this.fuelInjectorEReg.pressurizePropellantStatic);
    this.addIPC('run-diagnosticFuelInjectorEReg', this.fuelInjectorEReg.runDiagnostic);
    this.addIPC('zero-encodersFuelInjectorEReg', this.fuelInjectorEReg.zeroEncoders);
    this.addIPC('actuate-mainValveFuelInjectorEReg', (e, val) => this.fuelInjectorEReg.actuateMainValve(val));
    // loxInjectorEReg
    this.addIPC('start-propellantFlowLoxInjectorEReg', this.LoxInjectorEReg.startPropellantFlow);
    this.addIPC('abort-ERegLoxInjectorEReg', this.LoxInjectorEReg.abortEReg);
    this.addIPC('set-motorEncoderLoxInjectorEReg', (e, val) => this.LoxInjectorEReg.setMotorEncoder(val));
    this.addIPC('pressurize-propellantStaticLoxInjectorEReg', this.LoxInjectorEReg.pressurizePropellantStatic);
    this.addIPC('run-diagnosticLoxInjectorEReg', this.LoxInjectorEReg.runDiagnostic);
    this.addIPC('zero-encodersLoxInjectorEReg', this.LoxInjectorEReg.zeroEncoders);
    this.addIPC('actuate-mainValveLoxInjectorEReg', (e, val) => this.LoxInjectorEReg.actuateMainValve(val));  

    // ERegdaq

    this.addIPC('open-RBV0ERegdaq', this.ERegdaq.openRBV0);
    this.addIPC('close-RBV0ERegdaq', this.ERegdaq.closeRBV0);
    this.addIPC('act-RBV0ERegdaq', (e, val) => this.ERegdaq.actRBV0(val));

    this.addIPC('open-RBV1ERegdaq', this.ERegdaq.openRBV1);
    this.addIPC('close-RBV1ERegdaq', this.ERegdaq.closeRBV1);
    this.addIPC('act-RBV1ERegdaq', (e, val) => this.ERegdaq.actRBV1(val));

    this.addIPC('open-RBV2ERegdaq', this.ERegdaq.openRBV2);
    this.addIPC('close-RBV2ERegdaq', this.ERegdaq.closeRBV2);
    this.addIPC('act-RBV2ERegdaq', (e, val) => this.ERegdaq.actRBV2(val));

  }

}

module.exports = App;
