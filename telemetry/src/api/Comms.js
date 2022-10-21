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

    this.getFlightConnected = this.getFlightConnected.bind(this);
    this.getGroundConnected = this.getGroundConnected.bind(this);
    this.getDaq1Connected = this.getDaq1Connected.bind(this);
    this.getActCtrlr1Connected = this.getActCtrlr1Connected.bind(this);

    // Flight Computer

    this.openloxGemsValve = this.openloxGemsValve.bind(this);
    this.closeloxGemsValve = this.closeloxGemsValve.bind(this);

    this.openfuelGemsValve = this.openfuelGemsValve.bind(this);
    this.closefuelGemsValve = this.closefuelGemsValve.bind(this);

    this.startToggleLoxGemsValve = this.startToggleLoxGemsValve.bind(this);
    this.stopToggleLoxGemsValve = this.stopToggleLoxGemsValve.bind(this);

    this.startToggleFuelGemsValve = this.startToggleFuelGemsValve.bind(this);
    this.stopToggleFuelGemsValve = this.stopToggleFuelGemsValve.bind(this);

    this.openPressurantFlowRBV = this.openPressurantFlowRBV.bind(this);
    this.closePressurantFlowRBV = this.closePressurantFlowRBV.bind(this);
    this.timePressurantFlowRBV = this.timePressurantFlowRBV.bind(this);

    this.enableFastRead = this.enableFastRead.bind(this);
    this.disableFastRead = this.disableFastRead.bind(this);

    this.enableFastRead = this.enableFastRead.bind(this);
    this.disableFastRead = this.disableFastRead.bind(this);

    // Ground Computer
    
    this.enablelaunchMode = this.enablelaunchMode.bind(this);
    this.disablelaunchMode = this.disablelaunchMode.bind(this);

    this.openarmValve = this.openarmValve.bind(this);
    this.closearmValve = this.closearmValve.bind(this);

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.openloxMainValve = this.openloxMainValve.bind(this);
    this.closeloxMainValve = this.closeloxMainValve.bind(this);

    this.openfuelMainValve = this.openfuelMainValve.bind(this);
    this.closefuelMainValve = this.closefuelMainValve.bind(this);

    this.openMainValveVent = this.openMainValveVent.bind(this);
    this.closeMainValveVent = this.closeMainValveVent.bind(this);

    this.openPressRQD = this.openPressRQD.bind(this);
    this.closePressRQD = this.closePressRQD.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);

    this.enableIgniter = this.enableIgniter.bind(this);
    this.disableIgniter = this.disableIgniter.bind(this);

    //-------Actuator Controller 1-------

    this.openPressurantFillRBV = this.openPressurantFillRBV.bind(this);
    this.closePressurantFillRBV = this.closePressurantFillRBV.bind(this);
    this.timePressurantFillRBV = this.timePressurantFillRBV.bind(this);

    this.openPressurantFillVentRBV = this.openPressurantFillVentRBV.bind(this);
    this.closePressurantFillVentRBV = this.closePressurantFillVentRBV.bind(this);
    this.timePressurantFillVentRBV = this.timePressurantFillVentRBV.bind(this);

    this.openloxFillRBV = this.openloxFillRBV.bind(this);
    this.closeloxFillRBV = this.closeloxFillRBV.bind(this);
    this.timeloxFillRBV = this.timeloxFillRBV.bind(this);

    this.openfuelFillRBV = this.openfuelFillRBV.bind(this);
    this.closefuelFillRBV = this.closefuelFillRBV.bind(this);
    this.timefuelFillRBV = this.timefuelFillRBV.bind(this);

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

  async getGroundConnected() {
    return await this.ipc.invoke('ground-connected');
  }

  async getDaq1Connected() {
    return await this.ipc.invoke('daq1-connected');
  }

  // async getDaq2Connected() {
  //   return await this.ipc.invoke('daq2-connected');
  // }

  // async getDaq3Connected() {
  //   return await this.ipc.invoke('daq3-connected');
  // }

  // async getDaq4Connected() {
  //   return await this.ipc.invoke('daq4-connected');
  // }

  async getActCtrlr1Connected() {
    return await this.ipc.invoke('actctrlr1-connected');
  }

  // Flight Computer

  async openloxGemsValve() { return await this.ipc.invoke('open-loxGemsValve'); }
  async closeloxGemsValve() { return await this.ipc.invoke('close-loxGemsValve'); }

  async openfuelGemsValve() { return await this.ipc.invoke('open-fuelGemsValve'); }
  async closefuelGemsValve() { return await this.ipc.invoke('close-fuelGemsValve'); }

  async startToggleLoxGemsValve() { return await this.ipc.invoke('start-toggleLoxGemsValve'); }
  async stopToggleLoxGemsValve() { return await this.ipc.invoke('stop-toggleLoxGemsValve'); }

  async startToggleFuelGemsValve() { return await this.ipc.invoke('start-toggleFuelGemsValve'); }
  async stopToggleFuelGemsValve() { return await this.ipc.invoke('stop-toggleFuelGemsValve'); }

  async openPressurantFlowRBV() { return await this.ipc.invoke('open-pressurantFlowRBV'); }
  async closePressurantFlowRBV() { return await this.ipc.invoke('close-pressurantFlowRBV'); }
  async timePressurantFlowRBV(val) { return await this.ipc.invoke('time-pressurantFlowRBV', val); }

  async enableFastRead() { return await this.ipc.invoke('enable-fastReadRate'); }
  async disableFastRead() { return await this.ipc.invoke('disable-fastReadRate'); }

  async enableFlightMode() { return await this.ipc.invoke('enable-flightMode'); }
  async disableFlightMode() { return await this.ipc.invoke('disable-flightMode'); }

  // Ground Computer

  async enablelaunchMode() { return await this.ipc.invoke('enable-launchMode'); }
  async disablelaunchMode() { return await this.ipc.invoke('disable-launchMode'); }

  async openarmValve() { return await this.ipc.invoke('open-armValve'); }
  async closearmValve() { return await this.ipc.invoke('close-armValve'); }

  async openloxMainValve() { return await this.ipc.invoke('open-loxMainValve'); }
  async closeloxMainValve() { return await this.ipc.invoke('close-loxMainValve'); }

  async openfuelMainValve() { return await this.ipc.invoke('open-fuelMainValve'); }
  async closefuelMainValve() { return await this.ipc.invoke('close-fuelMainValve'); }

  async openMainValveVent() { return await this.ipc.invoke('open-mainValveVent'); }
  async closeMainValveVent() { return await this.ipc.invoke('close-mainValveVent'); }

  async openPressRQD() { return await this.ipc.invoke('open-pressRQD'); }
  async closePressRQD() { return await this.ipc.invoke('close-pressRQD'); }

  async openMainValvePurge() { return await this.ipc.invoke('open-mainValvePurge'); }
  async closeMainValvePurge() { return await this.ipc.invoke('close-mainValvePurge'); }

  async activateIgniter() { return await this.ipc.invoke('activate-igniter'); }
  async deactivateIgniter() { return await this.ipc.invoke('deactivate-igniter'); }

  async beginFlow() { return await this.ipc.invoke('beginFlow'); }
  async abort() { return await this.ipc.invoke('abort'); }

  async enableIgniter() { return await this.ipc.invoke('enable-igniter'); }
  async disableIgniter() { return await this.ipc.invoke('disable-igniter'); }

  //-------Actuator Controller 1-------

  async openPressurantFillRBV() { return await this.ipc.invoke('open-pressurantFillRBV'); }
  async closePressurantFillRBV() { return await this.ipc.invoke('close-pressurantFillRBV'); }
  async timePressurantFillRBV(val) { return await this.ipc.invoke('time-pressurantFillRBV', val); }

  async openPressurantFillVentRBV() { return await this.ipc.invoke('open-pressurantFillVentRBV'); }
  async closePressurantFillVentRBV() { return await this.ipc.invoke('close-pressurantFillVentRBV'); }
  async timePressurantFillVentRBV(val) { return await this.ipc.invoke('time-pressurantFillVentRBV', val); }

  async openloxFillRBV() { return await this.ipc.invoke('open-loxFillRBV'); }
  async closeloxFillRBV() { return await this.ipc.invoke('close-loxFillRBV'); }
  async timeloxFillRBV(val) { return await this.ipc.invoke('time-loxFillRBV', val); }

  async openfuelFillRBV() { return await this.ipc.invoke('open-fuelFillRBV'); }
  async closefuelFillRBV() { return await this.ipc.invoke('close-fuelFillRBV'); }
  async timefuelFillRBV(val) { return await this.ipc.invoke('time-fuelFillRBV', val); }

}

export default new Comms(ipcRenderer);
