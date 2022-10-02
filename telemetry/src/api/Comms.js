import moment from 'moment';

const { ipcRenderer } = window;

class Comms {
  constructor(ipc) {
    this.subscribers = {};
    this.universalSubscribers = [];
    this.darkmodeListeners = [];
    this.ipc = ipc;
    this.stateUpdate = this.stateUpdate.bind(this);
    this.darkmodeUpdate = this.darkmodeUpdate.bind(this);

    this.openMainWindows = this.openMainWindows.bind(this);
    this.openAuxWindows = this.openAuxWindows.bind(this);

    this.connectInflux = this.connectInflux.bind(this);
    this.getDatabases = this.getDatabases.bind(this);
    this.setDatabase = this.setDatabase.bind(this);
    this.setDarkMode = this.setDarkMode.bind(this);

    this.setProcedureState = this.setProcedureState.bind(this);
    this.doNothing = this.doNothing.bind(this);

    //----------Flight Computer----------

    this.getFlightConnected = this.getFlightConnected.bind(this);
    this.getDaq1Connected = this.getDaq1Connected.bind(this);
    this.getDaq2Connected = this.getDaq2Connected.bind(this);
    this.getDaq3Connected = this.getDaq3Connected.bind(this);
    this.getDaq4Connected = this.getDaq4Connected.bind(this);
    this.getActCtrlr1Connected = this.getActCtrlr1Connected.bind(this);
    this.getActCtrlr2Connected = this.getActCtrlr2Connected.bind(this);

    this.openloxGemsValve = this.openloxGemsValve.bind(this);
    this.closeloxGemsValve = this.closeloxGemsValve.bind(this);

    this.openfuelGemsValve = this.openfuelGemsValve.bind(this);
    this.closefuelGemsValve = this.closefuelGemsValve.bind(this);

    this.startToggleLoxGemsValve = this.startToggleLoxGemsValve.bind(this);
    this.stopToggleLoxGemsValve = this.stopToggleLoxGemsValve.bind(this);

    this.startToggleFuelGemsValve = this.startToggleFuelGemsValve.bind(this);
    this.stopToggleFuelGemsValve = this.stopToggleFuelGemsValve.bind(this);

    this.openarmValve = this.openarmValve.bind(this);
    this.closearmValve = this.closearmValve.bind(this);

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.openloxMainValve = this.openloxMainValve.bind(this);
    this.closeloxMainValve = this.closeloxMainValve.bind(this);

    this.openfuelMainValve = this.openfuelMainValve.bind(this);
    this.closefuelMainValve = this.closefuelMainValve.bind(this);

    this.activateLoxTankBottomHtr = this.activateLoxTankBottomHtr.bind(this);
    this.deactivateLoxTankBottomHtr = this.deactivateLoxTankBottomHtr.bind(this);

    this.activateLoxTankMidHtr = this.activateLoxTankMidHtr.bind(this);
    this.deactivateLoxTankMidHtr = this.deactivateLoxTankMidHtr.bind(this);

    this.activateLoxTankTopHtr = this.activateLoxTankTopHtr.bind(this);
    this.deactivateLoxTankTopHtr = this.deactivateLoxTankTopHtr.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);

    this.enableFastRead = this.enableFastRead.bind(this);
    this.disableFastRead = this.disableFastRead.bind(this);

    this.enableIgniter = this.enableIgniter.bind(this);
    this.disableIgniter = this.disableIgniter.bind(this);

    //---------------DAQ 1---------------

    //---------------DAQ 2---------------

    //-------Actuator Controller 1-------

    this.openPressurantFlowRBV = this.openPressurantFlowRBV.bind(this);
    this.closePressurantFlowRBV = this.closePressurantFlowRBV.bind(this);
    this.timePressurantFlowRBV = this.timePressurantFlowRBV.bind(this);

    this.openERegACCh3 = this.openERegACCh3.bind(this);
    this.closeERegACCh3 = this.closeERegACCh3.bind(this);
    this.timeERegACCh3 = this.timeERegACCh3.bind(this);

    this.openERegACCh5 = this.openERegACCh5.bind(this);
    this.closeERegACCh5 = this.closeERegACCh5.bind(this);
    this.timeERegACCh5 = this.timeERegACCh5.bind(this);
    
    this.openERegACCh6 = this.openERegACCh6.bind(this);
    this.closeERegACCh6 = this.closeERegACCh6.bind(this);
    this.timeERegACCh6 = this.timeERegACCh6.bind(this);

    // this.openLOxVentRBV = this.openLOxVentRBV.bind(this);
    // this.closeLOxVentRBV = this.closeLOxVentRBV.bind(this);
    // this.timeLOxVentRBV = this.timeLOxVentRBV.bind(this);

    this.openloxTankVentRBV = this.openloxTankVentRBV.bind(this);
    this.closeloxTankVentRBV = this.closeloxTankVentRBV.bind(this);
    this.timeloxTankVentRBV = this.timeloxTankVentRBV.bind(this);


    this.openERegACCh0 = this.openERegACCh0.bind(this);
    this.closeERegACCh0 = this.closeERegACCh0.bind(this);
    this.timeERegACCh0 = this.timeERegACCh0.bind(this);

    this.openERegAC24VCh0 = this.openERegAC24VCh0.bind(this);
    this.closeERegAC24VCh0 = this.closeERegAC24VCh0.bind(this);
    this.openERegAC24VCh1 = this.openERegAC24VCh1.bind(this);
    this.closeERegAC24VCh1 = this.closeERegAC24VCh1.bind(this);

    this.sendFuelERegDiag = this.sendFuelERegDiag.bind(this);
    this.sendLOXERegDiag = this.sendLOXERegDiag.bind(this);

    this.startOneSidedFuel = this.startOneSidedFuel.bind(this);
    this.startOneSidedLOX = this.startOneSidedLOX.bind(this);

    this.beginERegFlow = this.beginERegFlow.bind(this);

    this.abortEReg = this.abortEReg.bind(this);

    this.setFuelERegEncoder = this.setFuelERegEncoder.bind(this);
    this.setLOXERegEncoder = this.setLOXERegEncoder.bind(this);

    this.pressERegFuelStatic = this.pressERegFuelStatic.bind(this);
    this.pressERegLOXStatic = this.pressERegLOXStatic.bind(this);

    this.zeroERegFuelEncoder = this.zeroERegFuelEncoder.bind(this);
    this.zeroERegLOXEncoder = this.zeroERegLOXEncoder.bind(this);

    this.actuateFuelERegMainValve = this.actuateFuelERegMainValve.bind(this);
    this.actuateLOXERegMainValve = this.actuateLOXERegMainValve.bind(this);

    // this.openPressurantVentRBV = this.openPressurantVentRBV.bind(this);
    // this.closePressurantVentRBV = this.closePressurantVentRBV.bind(this);
    // this.timePressurantVentRBV = this.timePressurantVentRBV.bind(this);

    //-------Actuator Controller 2-------

    // this.openLOxRQD = this.openLOxRQD.bind(this);
    // this.closeLOxRQD = this.closeLOxRQD.bind(this);
    // this.timeLOxRQD = this.timeLOxRQD.bind(this);

    // this.openPropaneVentRBV = this.openPropaneVentRBV.bind(this);
    // this.closePropaneVentRBV = this.closePropaneVentRBV.bind(this);
    // this.timePropaneVentRBV = this.timePropaneVentRBV.bind(this);


    this.openERegACCh1 = this.openERegACCh1.bind(this);
    this.closeERegACCh1 = this.closeERegACCh1.bind(this);
    this.timeERegACCh1 = this.timeERegACCh1.bind(this);

    this.openfuelTankVentRBV = this.openfuelTankVentRBV.bind(this);
    this.closefuelTankVentRBV = this.closefuelTankVentRBV.bind(this);
    this.timefuelTankVentRBV = this.timefuelTankVentRBV.bind(this);

    // this.openPropaneRQD = this.openPropaneRQD.bind(this);
    // this.closePropaneRQD = this.closePropaneRQD.bind(this);
    // this.timePropaneRQD = this.timePropaneRQD.bind(this);

    //-------Actuator Controller 3-------

    this.openERegACCh2 = this.openERegACCh2.bind(this);
    this.closeERegACCh2 = this.closeERegACCh2.bind(this);
    this.timeERegACCh2 = this.timeERegACCh2.bind(this);

    this.openERegACCh4 = this.openERegACCh4.bind(this);
    this.closeERegACCh4 = this.closeERegACCh4.bind(this);
    this.timeERegACCh4 = this.timeERegACCh4.bind(this);

    this.openPrechillFlowRBV = this.openPrechillFlowRBV.bind(this);
    this.closePrechillFlowRBV = this.closePrechillFlowRBV.bind(this);
    this.timePrechillFlowRBV = this.timePrechillFlowRBV.bind(this);

    this.openfuelPrechillRBV = this.openfuelPrechillRBV.bind(this);
    this.closefuelPrechillRBV = this.closefuelPrechillRBV.bind(this);
    this.timefuelPrechillRBV = this.timefuelPrechillRBV.bind(this);

    this.openPurgeFlowRBV = this.openPurgeFlowRBV.bind(this);
    this.closePurgeFlowRBV = this.closePurgeFlowRBV.bind(this);
    this.timePurgeFlowRBV = this.timePurgeFlowRBV.bind(this);

  }

  stateUpdate(event, payload) {
    const { timestamp, update } = payload;
    for (let k of Object.keys(update)) {
      const subs = this.subscribers[k];
      if (subs !== undefined) {
        const val = update[k];
        for (let s of subs) {
          s(timestamp, val);
        }
      }
    }

    this.universalSubscribers.forEach(cb => {
      cb(timestamp, update)
    })
  }

  addSubscriber(field, callback) {
    if (this.subscribers[field] === undefined) {
      this.subscribers[field] = [];
    }
    if (this.subscribers[field].indexOf(callback) === -1) {
      this.subscribers[field].push(callback);
    }
  }

  removeSubscriber(field, callback) {
    const index = this.subscribers[field].indexOf(callback);
    if (index === -1) return;
    this.subscribers[field].splice(index, 1);
  }

  addUniversalSubscriber(callback) {
    this.universalSubscribers.push(callback)
  }

  removeUniversalSubscriber(callback) {
    const index = this.universalSubscribers.indexOf(callback)
    if (index !== -1) {
      this.universalSubscribers.splice(index, 1);
    }
  }

  addDarkModeListener(listener) {
    this.darkmodeListeners.push(listener);
  }

  darkmodeUpdate(event, isDark) {
    for (let l of this.darkmodeListeners) {
      l(isDark);
    }
  }

  removeDarkModeListener(listener) {
    const index = this.darkmodeListeners.indexOf(listener);
    if (index === -1) return;
    this.darkmodeListeners.splice(index, 1);
  }

  connect() {
    this.ipc.on('state-update', this.stateUpdate);
    this.ipc.on('set-darkmode', this.darkmodeUpdate);
  }

  destroy() {
    this.ipc.removeListener('state-update', this.stateUpdate);
    this.ipc.removeListener('set-darkmode', this.darkmodeUpdate);
  }

  //----------Universal Parser--------

  async sendCustomMessage(messageDestination, message) {
    return await this.ipc.invoke('send-custom-message', messageDestination, message)
  }

  //----------Dashboard Data----------

  async setProcedureState(procState) {
    return await this.ipc.invoke('set-procedure-state', procState)
  }

  async doNothing() {
    return
  }

  //----------Flight Computer----------

  async openMainWindows() {
    return await this.ipc.invoke('open-main-windows');
  }

  async openAuxWindows() {
    return await this.ipc.invoke('open-aux-windows');
  }

  async connectInflux(host, port, protocol, username, password) {
    return await this.ipc.invoke('connect-influx', host, port, protocol, username, password);
  }

  async getDatabases() {
    return await this.ipc.invoke('get-databases');
  }

  async setDatabase(database) {
    return await this.ipc.invoke('set-database', database);
  }

  async setDarkMode(isDark) {
    return await this.ipc.invoke('set-darkmode', isDark);
  }

  async getFlightConnected() {
    return await this.ipc.invoke('flight-connected');
  }

  async getDaq1Connected() {
    return await this.ipc.invoke('daq1-connected');
  }

  async getDaq2Connected() {
    return await this.ipc.invoke('daq2-connected');
  }

  async getDaq3Connected() {
    return await this.ipc.invoke('daq3-connected');
  }

  async getDaq4Connected() {
    return await this.ipc.invoke('daq4-connected');
  }

  async getActCtrlr1Connected() {
    return await this.ipc.invoke('actctrlr1-connected');
  }

  async getActCtrlr2Connected() {
    return await this.ipc.invoke('actctrlr2-connected');
  }

  async openloxGemsValve() {
    return await this.ipc.invoke('open-loxGemsValve');
  }

  async closeloxGemsValve() {
    return await this.ipc.invoke('close-loxGemsValve');
  }

  async openfuelGemsValve() {
    
    return await this.ipc.invoke('open-fuelGemsValve');
  }

  async closefuelGemsValve() {
    return await this.ipc.invoke('close-fuelGemsValve');
  }

  async startToggleLoxGemsValve() {
    return await this.ipc.invoke('start-toggleLoxGemsValve');
  }

  async stopToggleLoxGemsValve() {
    return await this.ipc.invoke('stop-toggleLoxGemsValve');
  }

  async startToggleFuelGemsValve() {
    return await this.ipc.invoke('start-toggleFuelGemsValve');
  }

  async stopToggleFuelGemsValve() {
    return await this.ipc.invoke('stop-toggleFuelGemsValve');
  }

  async openarmValve() {
    return await this.ipc.invoke('open-armValve');
  }

  async closearmValve() {
    return await this.ipc.invoke('close-armValve');
  }

  async openloxMainValve() {
    return await this.ipc.invoke('open-loxMainValve');
  }

  async closeloxMainValve() {
    return await this.ipc.invoke('close-loxMainValve');
  }

  async openfuelMainValve() {
    return await this.ipc.invoke('open-fuelMainValve');
  }

  async closefuelMainValve() {
    return await this.ipc.invoke('close-fuelMainValve');
  }

  async activateIgniter() {
    return await this.ipc.invoke('activate-igniter');
  }

  async deactivateIgniter() {
    return await this.ipc.invoke('deactivate-igniter');
  }

  async beginFlow() {
    return await this.ipc.invoke('beginFlow');
  }

  async abort() {
    return await this.ipc.invoke('abort');
  }

  async enableFastRead() {
    return await this.ipc.invoke('enable-fastReadRate');
  }

  async disableFastRead() {
    return await this.ipc.invoke('disable-fastReadRate');
  }

  async enableIgniter() {
    return await this.ipc.invoke('enable-igniter');
  }

  async disableIgniter() {
    return await this.ipc.invoke('disable-igniter');
  }

  async activateLoxTankBottomHtr() { return await this.ipc.invoke('activate-loxTankBottomHtr'); }
  async deactivateLoxTankBottomHtr() { return await this.ipc.invoke('deactivate-loxTankBottomHtr'); }

  async activateLoxTankMidHtr() { return await this.ipc.invoke('activate-loxTankMidHtr'); }
  async deactivateLoxTankMidHtr() { return await this.ipc.invoke('deactivate-loxTankMidHtr'); }

  async activateLoxTankTopHtr() { return await this.ipc.invoke('activate-loxTankTopHtr'); }
  async deactivateLoxTankTopHtr() { return await this.ipc.invoke('deactivate-loxTankTopHtr'); }


  //---------------DAQ 1---------------

  //---------------DAQ 2---------------

  //-------Actuator Controller 1-------

  async setfuelTankTopHeater(val) {
    return await this.ipc.invoke('set-fuelTankTopHeater', val);
  }

  async setfuelTankMidHeater(val) {
    return await this.ipc.invoke('set-fuelTankMidHeater', val);
  }

  async openPressurantFlowRBV() {
    return await this.ipc.invoke('open-pressurantFlowRBV');
  }

  async closePressurantFlowRBV() {
    return await this.ipc.invoke('close-pressurantFlowRBV');
  }

  async timePressurantFlowRBV(val) {
    return await this.ipc.invoke('time-pressurantFlowRBV', val);
  }

  async openERegACCh3() {
    return await this.ipc.invoke('open-ERegACCh3');
  }

  async closeERegACCh3() {
    return await this.ipc.invoke('close-ERegACCh3');
  }

  async timeERegACCh3(val) {
    return await this.ipc.invoke('time-ERegACCh3', val);
  }

  async openERegACCh5() {
    return await this.ipc.invoke('open-ERegACCh5');
  }

  async closeERegACCh5() {
    return await this.ipc.invoke('close-ERegACCh5');
  }

  async timeERegACCh5(val) {
    return await this.ipc.invoke('time-ERegACCh5', val);
  }
  
  async openERegACCh6() {
    return await this.ipc.invoke('open-ERegACCh6');
  }

  async closeERegACCh6() {
    return await this.ipc.invoke('close-ERegACCh6');
  }

  async timeERegACCh6(val) {
    return await this.ipc.invoke('time-ERegACCh6', val);
  }

  async openERegAC24VCh0(val) {
    return await this.ipc.invoke('open-ERegAC24VCh0', val);
  }

  async closeERegAC24VCh0(val) {
    return await this.ipc.invoke('close-ERegAC24VCh0', val);
  }

  async openERegAC24VCh1(val) {
    return await this.ipc.invoke('open-ERegAC24VCh1', val);
  }

  async closeERegAC24VCh1(val) {
    return await this.ipc.invoke('close-ERegAC24VCh1', val);
  }

  async sendFuelERegDiag(val) {
    return await this.ipc.invoke('send-FuelERegDiag');
  }

  async sendLOXERegDiag(val) {
    return await this.ipc.invoke('send-LOXERegDiag');
  }

  async startOneSidedFuel(val) {
    return await this.ipc.invoke('start-oneSidedFuel');
  }

  async startOneSidedLOX(val) {
    return await this.ipc.invoke('start-oneSidedLOX')
  }

  async beginERegFlow(val) {
    return await this.ipc.invoke('begin-ERegFlow');
  }

  async abortEReg(val) {
    return await this.ipc.invoke('abort-EReg');
  }

  async setFuelERegEncoder(val) {
    return await this.ipc.invoke('set-FuelERegEncoder', val);
  }

  async setLOXERegEncoder(val) {
    return await this.ipc.invoke('set-LOXERegEncoder', val);
  }

  async pressERegFuelStatic(val) {
    return await this.ipc.invoke('press-ERegFuelStatic');
  }

  async pressERegLOXStatic(val) {
    return await this.ipc.invoke('press-ERegLOXStatic');
  }

  async zeroERegFuelEncoder(val) {
    return await this.ipc.invoke('zero-ERegFuelEncoder');
  }

  async zeroERegLOXEncoder(val) {
    return await this.ipc.invoke('zero-ERegLOXEncoder');
  }

  async actuateFuelERegMainValve(val) {
    return await this.ipc.invoke('actuate-FuelERegMainValve', val);
  }

  async actuateLOXERegMainValve(val) {
    return await this.ipc.invoke('actuate-LOXERegMainValve', val);
  }

  // ========= NEW EREG PACKETS ================

  // FUEL TANK

  async startFlowFuelTankEReg() {
    return await this.ipc.invoke('start-propellantFlowFuelTankEreg');
  }

  async abortFuelTankEReg() {
    return await this.ipc.invoke('abort-eregFuelTankEreg');
  }

  async setEncoderFuelTankEReg(val) {
    return await this.ipc.invoke('set-motorEncoderFuelTankEreg', val);
  }

  async staticPressurizeFuelTankEReg() {
    return await this.ipc.invoke('pressurize-propellantStaticFuelTankEreg');
  }

  async diagnosticFuelTankEReg() {
    return await this.ipc.invoke('run-diagnosticFuelTankEreg');
  }

  async zeroFuelTankEReg() {
    return await this.ipc.invoke('zero-encodersFuelTankEreg');
  }

  async actuateMainValveFuelTankEReg(val) {
    return await this.ipc.invoke('actuate-mainValveFuelTankEreg', val);
  }

  // LOX TANK

  async startFlowLoxTankEReg() {
    return await this.ipc.invoke('start-propellantFlowLoxTankEreg');
  }

  async abortLoxTankEReg() {
    return await this.ipc.invoke('abort-eregLoxTankEreg');
  }

  async setEncoderLoxTankEReg(val) {
    return await this.ipc.invoke('set-motorEncoderLoxTankEreg', val);
  }

  async staticPressurizeLoxTankEReg() {
    return await this.ipc.invoke('pressurize-propellantStaticLoxTankEreg');
  }

  async diagnosticLoxTankEReg() {
    return await this.ipc.invoke('run-diagnosticLoxTankEreg');
  }

  async zeroLoxTankEReg() {
    return await this.ipc.invoke('zero-encodersLoxTankEreg');
  }

  async actuateMainValveLoxTankEReg(val) {
    return await this.ipc.invoke('actuate-mainValveLoxTankEreg', val);
  }

  // Fuel Injector

  async startFlowFuelInjectorEReg() {
    return await this.ipc.invoke('start-propellantFlowFuelInjectorEreg');
  }

  async abortFuelInjectorEReg() {
    return await this.ipc.invoke('abort-eregFuelInjectorEreg');
  }

  async setEncoderFuelInjectorEReg(val) {
    return await this.ipc.invoke('set-motorEncoderFuelInjectorEreg', val);
  }

  async staticPressurizeFuelInjectorEReg() {
    return await this.ipc.invoke('pressurize-propellantStaticFuelInjectorEreg');
  }

  async diagnosticFuelInjectorEReg() {
    return await this.ipc.invoke('run-diagnosticFuelInjectorEreg');
  }

  async zeroFuelInjectorEReg() {
    return await this.ipc.invoke('zero-encodersFuelInjectorEreg');
  }

  async actuateMainValveFuelInjectorEReg(val) {
    return await this.ipc.invoke('actuate-mainValveFuelInjectorEreg', val);
  }

  // Lox Injector

  async startFlowLoxInjectorEReg() {
    return await this.ipc.invoke('start-propellantFlowLoxInjectorEreg');
  }

  async abortLoxInjectorEReg() {
    return await this.ipc.invoke('abort-eregLoxInjectorEreg');
  }

  async setEncoderLoxInjectorEReg(val) {
    return await this.ipc.invoke('set-motorEncoderLoxInjectorEreg', val);
  }

  async staticPressurizeLoxInjectorEReg() {
    return await this.ipc.invoke('pressurize-propellantStaticLoxInjectorEreg');
  }

  async diagnosticLoxInjectorEReg() {
    return await this.ipc.invoke('run-diagnosticLoxInjectorEreg');
  }

  async zeroLoxInjectorEReg() {
    return await this.ipc.invoke('zero-encodersLoxInjectorEreg');
  }

  async actuateMainValveLoxInjectorEReg(val) {
    return await this.ipc.invoke('actuate-mainValveLoxInjectorEreg', val);
  }

  // async openLOxVentRBV() {return await this.ipc.invoke('open-LOxVentRBV'); }
  // async closeLOxVentRBV() {return await this.ipc.invoke('close-LOxVentRBV'); }
  // async timeLOxVentRBV(val) {return await this.ipc.invoke('time-LOxVentRBV', val); }

  async openloxTankVentRBV() {
    return await this.ipc.invoke('open-loxTankVentRBV');
  }


  async closeloxTankVentRBV() {
    return await this.ipc.invoke('close-loxTankVentRBV');
  }

  async timeloxTankVentRBV(val) {
    return await this.ipc.invoke('time-loxTankVentRBV', val);
  }


  async openERegACCh0() {
    return await this.ipc.invoke('open-ERegACCh0');
  }

  async closeERegACCh0() {
    return await this.ipc.invoke('close-ERegACCh0');
  }

  async timeERegACCh0(val) {
    return await this.ipc.invoke('time-ERegACCh0', val);
  }

  async openPressurantVentRBV() {
    return await this.ipc.invoke('open-pressurantVentRBV');
  }

  async closePressurantVentRBV() {
    return await this.ipc.invoke('close-pressurantVentRBV');
  }

  async timePressurantVentRBV(val) {
    return await this.ipc.invoke('time-pressurantVentRBV', val);
  }

  //-------Actuator Controller 2-------

  async setfuelTankBottomHeater(val) {
    return await this.ipc.invoke('set-fuelTankBottomHeater', val);
  }

  async setloxTankTopHeater(val) {
    return await this.ipc.invoke('set-loxTankTopHeater', val);
  }

  // async openLOxRQD() {return await this.ipc.invoke('open-LOxRQD'); }
  // async closeLOxRQD() {return await this.ipc.invoke('close-LOxRQD'); }
  // async timeLOxRQD(val) {return await this.ipc.invoke('time-LOxRQD', val); }

  // async openPropaneVentRBV() {return await this.ipc.invoke('open-propaneVentRBV'); }
  // async closePropaneVentRBV() {return await this.ipc.invoke('close-propaneVentRBV'); }
  // async timePropaneVentRBV(val) {return await this.ipc.invoke('time-propaneVentRBV', val); }

  async openERegACCh1() {
    return await this.ipc.invoke('open-ERegACCh1');
  }

  async closeERegACCh1() {
    return await this.ipc.invoke('close-ERegACCh1');
  }

  async timeERegACCh1(val) {
    return await this.ipc.invoke('time-ERegACCh1', val);
  }

  // async openPropaneRQD() {return await this.ipc.invoke('open-propaneRQD'); }
  // async closePropaneRQD() {return await this.ipc.invoke('close-propaneRQD'); }
  // async timePropaneRQD(val) {return await this.ipc.invoke('time-propaneRQD', val); }

  async openfuelTankVentRBV() {
    return await this.ipc.invoke('open-fuelTankVentRBV');
  }

  async closefuelTankVentRBV() {
    return await this.ipc.invoke('close-fuelTankVentRBV');
  }

  async timefuelTankVentRBV(val) {
    return await this.ipc.invoke('time-fuelTankVentRBV', val);
  }

  //-------Actuator Controller 3-------

  async setloxTankMidHeater(val) {
    return await this.ipc.invoke('set-loxTankMidHeater', val);
  }

  async setloxTankBottomHeater(val) {
    return await this.ipc.invoke('set-loxTankBottomHeater', val);
  }

  async openERegACCh2() {
    return await this.ipc.invoke('open-ERegACCh2');
  }

  async closeERegACCh2() {
    return await this.ipc.invoke('close-ERegACCh2');
  }

  async timeERegACCh2(val) {
    return await this.ipc.invoke('time-ERegACCh2', val);
  }

  async openERegACCh4() {
    return await this.ipc.invoke('open-ERegACCh4');
  }

  async closeERegACCh4() {
    return await this.ipc.invoke('close-ERegACCh4');
  }

  async timeERegACCh4(val) {
    return await this.ipc.invoke('time-ERegACCh4', val);
  }

  async openPrechillFlowRBV() {
    return await this.ipc.invoke('open-prechillFlowRBV');
  }

  async closePrechillFlowRBV() {
    return await this.ipc.invoke('close-prechillFlowRBV');
  }

  async timePrechillFlowRBV(val) {
    return await this.ipc.invoke('time-prechillFlowRBV', val);
  }

  async openfuelPrechillRBV() {
    return await this.ipc.invoke('open-fuelPrechillRBV');
  }

  async closefuelPrechillRBV() {
    return await this.ipc.invoke('close-fuelPrechillRBV');
  }

  async timefuelPrechillRBV(val) {
    return await this.ipc.invoke('time-fuelPrechillRBV', val);
  }

  async openPurgeFlowRBV() {
    return await this.ipc.invoke('open-purgeFlowRBV');
  }

  async closePurgeFlowRBV() {
    return await this.ipc.invoke('close-purgeFlowRBV');
  }

  async timePurgeFlowRBV(val) {
    return await this.ipc.invoke('time-purgeFlowRBV', val);
  }

  // async extendIgniterInserter() {return await this.ipc.invoke('extend-igniterInserter')}
  // async retractIgniterInserter() {return await this.ipc.invoke('retract-igniterInserter')}
  // async timeIgniterInserter() {return await this.ipc.invoke('time-igniterInserter')}

}

export default new Comms(ipcRenderer);
