import moment from 'moment';

const { ipcRenderer } = window;

class Comms {
  constructor(ipc) {
    this.subscribers = {};
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

    //----------Flight Computer----------

    this.getFlightConnected = this.getFlightConnected.bind(this);
    this.getDaq1Connected = this.getDaq1Connected.bind(this);
    this.getActCtrlr1Connected = this.getActCtrlr1Connected.bind(this);
    this.getActCtrlr2Connected = this.getActCtrlr2Connected.bind(this);
    this.getActCtrlr3Connected = this.getActCtrlr3Connected.bind(this);

    this.openLox2Way = this.openLox2Way.bind(this);
    this.closeLox2Way = this.closeLox2Way.bind(this);

    this.openLox5Way = this.openLox5Way.bind(this);
    this.closeLox5Way = this.closeLox5Way.bind(this);

    this.openProp5Way = this.openProp5Way.bind(this);
    this.closeProp5Way = this.closeProp5Way.bind(this);

    this.openLoxGems = this.openLoxGems.bind(this);
    this.closeLoxGems = this.closeLoxGems.bind(this);

    this.openPropGems = this.openPropGems.bind(this);
    this.closePropGems = this.closePropGems.bind(this);

    this.enableHPS = this.enableHPS.bind(this);
    this.disableHPS = this.disableHPS.bind(this);
    this.openHPS = this.openHPS.bind(this);
    this.closeHPS = this.closeHPS.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);
    this.hold = this.hold.bind(this);


    this.setLoxPTHeater = this.setLoxPTHeater.bind(this);
    this.setLoxGemsHeater = this.setLoxGemsHeater.bind(this);
    this.setLoxInjectorHeater = this.setLoxInjectorHeater.bind(this);

    this.setPropPTHeater = this.setPropPTHeater.bind(this);
    this.setPropGemsHeater = this.setPropGemsHeater.bind(this);
    this.setPropInjectorHeater = this.setPropInjectorHeater.bind(this);

    //---------------DAQ 1---------------

    //---------------DAQ 2---------------

    //-------Actuator Controller 1-------

    this.setPropTankTopHeater = this.setPropTankTopHeater.bind(this);

    this.setPropTankMidHeater = this.setPropTankMidHeater.bind(this);

    this.openPressurantVentRBV = this.openPressurantVentRBV.bind(this);
    this.closePressurantVentRBV = this.closePressurantVentRBV.bind(this);
    this.timePressurantVentRBV = this.timePressurantVentRBV.bind(this);

    this.openPressurantFlowRBV = this.openPressurantFlowRBV.bind(this);
    this.closePressurantFlowRBV = this.closePressurantFlowRBV.bind(this);
    this.timePressurantFlowRBV = this.timePressurantFlowRBV.bind(this);

    this.openLOxVentRBV = this.openLOxVentRBV.bind(this);
    this.closeLOxVentRBV = this.closeLOxVentRBV.bind(this);
    this.timeLOxVentRBV = this.timeLOxVentRBV.bind(this);

    this.openLOxTankVentRBV = this.openLOxTankVentRBV.bind(this);
    this.closeLOxTankVentRBV = this.closeLOxTankVentRBV.bind(this);
    this.timeLOxTankVentRBV = this.timeLOxTankVentRBV.bind(this);

    this.openLOxFlowRBV = this.openLOxFlowRBV.bind(this);
    this.closeLOxFlowRBV = this.closeLOxFlowRBV.bind(this);
    this.timeLOxFlowRBV = this.timeLOxFlowRBV.bind(this);

    //-------Actuator Controller 2-------

    this.setPropTankBottomHeater = this.setPropTankBottomHeater.bind(this);

    this.setLOxTankTopHeater = this.setLOxTankTopHeater.bind(this);

    this.openLOxRQD1 = this.openLOxRQD1.bind(this);
    this.closeLOxRQD1 = this.closeLOxRQD1.bind(this);
    this.timeLOxRQD1 = this.timeLOxRQD1.bind(this);

    this.openLOxRQD2 = this.openLOxRQD2.bind(this);
    this.closeLOxRQD2 = this.closeLOxRQD2.bind(this);
    this.timeLOxRQD2 = this.timeLOxRQD2.bind(this);

    this.openPropaneVentRBV = this.openPropaneVentRBV.bind(this);
    this.closePropaneVentRBV = this.closePropaneVentRBV.bind(this);
    this.timePropaneVentRBV = this.timePropaneVentRBV.bind(this);

    this.openPropaneFlowRBV = this.openPropaneFlowRBV.bind(this);
    this.closePropaneFlowRBV = this.closePropaneFlowRBV.bind(this);
    this.timePropaneFlowRBV = this.timePropaneFlowRBV.bind(this);

    this.openPropaneRQD1 = this.openPropaneRQD1.bind(this);
    this.closePropaneRQD1 = this.closePropaneRQD1.bind(this);
    this.timePropaneRQD1 = this.timePropaneRQD1.bind(this);

    this.openPropaneRQD2 = this.openPropaneRQD2.bind(this);
    this.closePropaneRQD2 = this.closePropaneRQD2.bind(this);
    this.timePropaneRQD2 = this.timePropaneRQD2.bind(this);

    //-------Actuator Controller 3-------

    this.setLOxTankMidHeater = this.setLOxTankMidHeater.bind(this);

    this.setLOxTankBottomHeater = this.setLOxTankBottomHeater.bind(this);

    this.openLOxPrechillRBV = this.openLOxPrechillRBV.bind(this);
    this.closeLOxPrechillRBV = this.closeLOxPrechillRBV.bind(this);
    this.timeLOxPrechillRBV = this.timeLOxPrechillRBV.bind(this);

    this.openPurgePrechillVentRBV = this.openPurgePrechillVentRBV.bind(this);
    this.closePurgePrechillVentRBV = this.closePurgePrechillVentRBV.bind(this);
    this.timePurgePrechillVentRBV = this.timePurgePrechillVentRBV.bind(this);

    this.openPrechillFlowRBV = this.openPrechillFlowRBV.bind(this);
    this.closePrechillFlowRBV = this.closePrechillFlowRBV.bind(this);
    this.timePrechillFlowRBV = this.timePrechillFlowRBV.bind(this);

    this.openPropanePrechillRBV = this.openPropanePrechillRBV.bind(this);
    this.closePropanePrechillRBV = this.closePropanePrechillRBV.bind(this);
    this.timePropanePrechillRBV = this.timePropanePrechillRBV.bind(this);

    this.openPurgeFlowRBV = this.openPurgeFlowRBV.bind(this);
    this.closePurgeFlowRBV = this.closePurgeFlowRBV.bind(this);
    this.timePurgeFlowRBV = this.timePurgeFlowRBV.bind(this);

  }

  stateUpdate(event, payload) {
    const { timestamp, update } = payload;
    const mTimestamp = moment(timestamp);
    for(let k of Object.keys(update)) {
      const subs = this.subscribers[k];
      if(subs !== undefined) {
        const val = update[k];
        for(let s of subs) {
          s(mTimestamp, val);
        }
      }
    }
  }

  addSubscriber(field, callback) {
    if(this.subscribers[field] === undefined) {
      this.subscribers[field] = [];
    }
    if(this.subscribers[field].indexOf(callback) === -1) {
      this.subscribers[field].push(callback);
    }
  }

  removeSubscriber(field, callback) {
    const index = this.subscribers[field].indexOf(callback);
    if(index === -1) return;
    this.subscribers[field].splice(index, 1);
  }

  addDarkModeListener(listener) {
    this.darkmodeListeners.push(listener);
  }

  darkmodeUpdate(event, isDark) {
    for(let l of this.darkmodeListeners) {
      l(isDark);
    }
  }

  removeDarkModeListener(listener) {
    const index = this.darkmodeListeners.indexOf(listener);
    if(index === -1) return;
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

  //----------Flight Computer----------

  async openMainWindows() { return await this.ipc.invoke('open-main-windows'); }
  async openAuxWindows() { return await this.ipc.invoke('open-aux-windows'); }

  async connectInflux(host, port, protocol, username, password) { return await this.ipc.invoke('connect-influx', host, port, protocol, username, password); }
  async getDatabases() { return await this.ipc.invoke('get-databases'); }
  async setDatabase(database) { return await this.ipc.invoke('set-database', database); }
  async setDarkMode(isDark) { return await this.ipc.invoke('set-darkmode', isDark); }

  async getFlightConnected() { return await this.ipc.invoke('flight-connected'); }
  async getDaq1Connected() { return await this.ipc.invoke('daq1-connected'); }
  async getActCtrlr1Connected() { return await this.ipc.invoke('actctrlr1-connected'); }
  async getActCtrlr2Connected() { return await this.ipc.invoke('actctrlr2-connected'); }
  async getActCtrlr3Connected() { return await this.ipc.invoke('actctrlr3-connected'); }

  async openLox2Way() { return await this.ipc.invoke('open-lox2Way'); }
  async closeLox2Way() { return await this.ipc.invoke('close-lox2Way'); }

  async openLox5Way() { return await this.ipc.invoke('open-lox5Way'); }
  async closeLox5Way() { return await this.ipc.invoke('close-lox5Way'); }

  async openProp5Way() { return await this.ipc.invoke('open-prop5Way'); }
  async closeProp5Way() { return await this.ipc.invoke('close-prop5Way'); }

  async openLoxGems() { return await this.ipc.invoke('open-loxGems'); }
  async closeLoxGems() { return await this.ipc.invoke('close-loxGems'); }

  async openPropGems() { return await this.ipc.invoke('open-propGems'); }
  async closePropGems() { return await this.ipc.invoke('close-propGems'); }

  async enableHPS() { return await this.ipc.invoke('enable-HPS'); }
  async disableHPS() { return await this.ipc.invoke('disable-HPS'); }
  async openHPS() { return await this.ipc.invoke('open-HPS'); }
  async closeHPS() { return await this.ipc.invoke('close-HPS'); }

  async beginFlow() { return await this.ipc.invoke('begin-flow'); }
  async abort() { return await this.ipc.invoke('abort'); }
  async hold() { return await this.ipc.invoke('hold'); }

  async setLoxPTHeater(val) { return await this.ipc.invoke('set-loxPTHeater', val); }
  async setLoxGemsHeater(val) { return await this.ipc.invoke('set-loxGemsHeater', val); }
  async setLoxInjectorHeater(val) { return await this.ipc.invoke('set-loxInjectorHeater', val); }

  async setPropPTHeater(val) { return await this.ipc.invoke('set-propPTHeater', val); }
  async setPropGemsHeater(val) { return await this.ipc.invoke('set-propGemsHeater', val); }
  async setPropInjectorHeater(val) { return await this.ipc.invoke('set-propInjectorHeater', val); }

  //---------------DAQ 1---------------

  //---------------DAQ 2---------------

  //-------Actuator Controller 1-------

  async setPropTankTopHeater(val) {return await this.ipc.invoke('set-propTankTopHeater', val); }

  async setPropTankMidHeater(val) {return await this.ipc.invoke('set-propTankMidHeater', val); }

  async openPressurantVentRBV() {return await this.ipc.invoke('open-pressurantVentRBV'); }
  async closePressurantVentRBV() {return await this.ipc.invoke('close-pressurantVentRBV'); }
  async timePressurantVentRBV(val) {return await this.ipc.invoke('time-pressurantVentRBV', val); }

  async openPressurantFlowRBV() {return await this.ipc.invoke('open-pressurantFlowRBV'); }
  async closePressurantFlowRBV() {return await this.ipc.invoke('close-pressurantFlowRBV'); }
  async timePressurantFlowRBV(val) {return await this.ipc.invoke('time-pressurantFlowRBV', val); }

  async openLOxVentRBV() {return await this.ipc.invoke('open-LOxVentRBV'); }
  async closeLOxVentRBV() {return await this.ipc.invoke('close-LOxVentRBV'); }
  async timeLOxVentRBV(val) {return await this.ipc.invoke('time-LOxVentRBV', val); }

  async openLOxTankVentRBV() {return await this.ipc.invoke('open-LOxTankVentRBV'); }
  async closeLOxTankVentRBV() {return await this.ipc.invoke('close-LOxTankVentRBV'); }
  async timeLOxTankVentRBV(val) {return await this.ipc.invoke('time-LOxTankVentRBV', val); }

  async openLOxFlowRBV() {return await this.ipc.invoke('open-LOxFlowRBV'); }
  async closeLOxFlowRBV() {return await this.ipc.invoke('close-LOxFlowRBV'); }
  async timeLOxFlowRBV(val) {return await this.ipc.invoke('time-LOxFlowRBV', val); }

  //-------Actuator Controller 2-------

  async setPropTankBottomHeater(val) {return await this.ipc.invoke('set-propTankBottomHeater', val); }

  async setLOxTankTopHeater(val) {return await this.ipc.invoke('set-LOxTankTopHeater', val); }

  async openLOxRQD1() {return await this.ipc.invoke('open-LOxRQD1'); }
  async closeLOxRQD1() {return await this.ipc.invoke('close-LOxRQD1'); }
  async timeLOxRQD1(val) {return await this.ipc.invoke('time-LOxRQD1', val); }

  async openLOxRQD2() {return await this.ipc.invoke('open-LOxRQD2'); }
  async closeLOxRQD2() {return await this.ipc.invoke('close-LOxRQD2'); }
  async timeLOxRQD2(val) {return await this.ipc.invoke('time-LOxRQD2', val); }

  async openPropaneVentRBV() {return await this.ipc.invoke('open-propaneVentRBV'); }
  async closePropaneVentRBV() {return await this.ipc.invoke('close-propaneVentRBV'); }
  async timePropaneVentRBV(val) {return await this.ipc.invoke('time-propaneVentRBV', val); }

  async openPropaneFlowRBV() {return await this.ipc.invoke('open-propaneFlowRBV'); }
  async closePropaneFlowRBV() {return await this.ipc.invoke('close-propaneFlowRBV'); }
  async timePropaneFlowRBV(val) {return await this.ipc.invoke('time-propaneFlowRBV', val); }

  async openPropaneRQD1() {return await this.ipc.invoke('open-propaneRQD1'); }
  async closePropaneRQD1() {return await this.ipc.invoke('close-propaneRQD1'); }
  async timePropaneRQD1(val) {return await this.ipc.invoke('time-propaneRQD1', val); }

  async openPropaneRQD2() {return await this.ipc.invoke('open-propaneRQD2'); }
  async closePropaneRQD2() {return await this.ipc.invoke('close-propaneRQD2'); }
  async timePropaneRQD2(val) {return await this.ipc.invoke('time-propaneRQD2', val); }

  //-------Actuator Controller 3-------

  async setLOxTankMidHeater(val) {return await this.ipc.invoke('set-LOxTankMidHeater', val); }

  async setLOxTankBottomHeater(val) {return await this.ipc.invoke('set-LOxTankBottomHeater', val); }

  async openLOxPrechillRBV() {return await this.ipc.invoke('open-LOxPrechillRBV'); }
  async closeLOxPrechillRBV() {return await this.ipc.invoke('close-LOxPrechillRBV'); }
  async timeLOxPrechillRBV(val) {return await this.ipc.invoke('time-LOxPrechillRBV', val); }

  async openPurgePrechillVentRBV() {return await this.ipc.invoke('open-purgePrechillVentRBV'); }
  async closePurgePrechillVentRBV() {return await this.ipc.invoke('close-purgePrechillVentRBV'); }
  async timePurgePrechillVentRBV(val) {return await this.ipc.invoke('time-purgePrechillVentRBV', val); }

  async openPrechillFlowRBV() {return await this.ipc.invoke('open-prechillFlowRBV'); }
  async closePrechillFlowRBV() {return await this.ipc.invoke('close-prechillFlowRBV'); }
  async timePrechillFlowRBV(val) {return await this.ipc.invoke('time-prechillFlowRBV', val); }

  async openPropanePrechillRBV() {return await this.ipc.invoke('open-propanePrechillRBV'); }
  async closePropanePrechillRBV() {return await this.ipc.invoke('close-propanePrechillRBV'); }
  async timePropanePrechillRBV(val) {return await this.ipc.invoke('time-propanePrechillRBV', val); }

  async openPurgeFlowRBV() {return await this.ipc.invoke('open-purgeFlowRBV'); }
  async closePurgeFlowRBV() {return await this.ipc.invoke('close-purgeFlowRBV'); }
  async timePurgeFlowRBV(val) {return await this.ipc.invoke('time-purgeFlowRBV', val); }

}

export default new Comms(ipcRenderer);
