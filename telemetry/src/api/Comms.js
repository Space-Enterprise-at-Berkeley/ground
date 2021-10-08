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

    this.setProcedureState = this.setProcedureState.bind(this);

    //----------Flight Computer----------

    this.getFlightConnected = this.getFlightConnected.bind(this);
    this.getDaq1Connected = this.getDaq1Connected.bind(this);
    this.getDaq2Connected = this.getDaq2Connected.bind(this);
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

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.beginFlowAll = this.beginFlowAll.bind(this);
    this.beginFlow = this.beginFlow.bind(this);
    this.endFlow = this.endFlow.bind(this);
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

    this.openPressurantFlowRBV = this.openPressurantFlowRBV.bind(this);
    this.closePressurantFlowRBV = this.closePressurantFlowRBV.bind(this);
    this.timePressurantFlowRBV = this.timePressurantFlowRBV.bind(this);

    this.openPressurantFillRBV = this.openPressurantFillRBV.bind(this);
    this.closePressurantFillRBV = this.closePressurantFillRBV.bind(this);
    this.timePressurantFillRBV = this.timePressurantFillRBV.bind(this);

    this.openLOxVentRBV = this.openLOxVentRBV.bind(this);
    this.closeLOxVentRBV = this.closeLOxVentRBV.bind(this);
    this.timeLOxVentRBV = this.timeLOxVentRBV.bind(this);

    this.openLOxTankVentRBV = this.openLOxTankVentRBV.bind(this);
    this.closeLOxTankVentRBV = this.closeLOxTankVentRBV.bind(this);
    this.timeLOxTankVentRBV = this.timeLOxTankVentRBV.bind(this);

    this.openLOxFlowRBV = this.openLOxFlowRBV.bind(this);
    this.closeLOxFlowRBV = this.closeLOxFlowRBV.bind(this);
    this.timeLOxFlowRBV = this.timeLOxFlowRBV.bind(this);

    this.openPressurantVentRBV = this.openPressurantVentRBV.bind(this);
    this.closePressurantVentRBV = this.closePressurantVentRBV.bind(this);
    this.timePressurantVentRBV = this.timePressurantVentRBV.bind(this);

    //-------Actuator Controller 2-------

    this.setPropTankBottomHeater = this.setPropTankBottomHeater.bind(this);

    this.setLOxTankTopHeater = this.setLOxTankTopHeater.bind(this);

    this.openLOxRQD = this.openLOxRQD.bind(this);
    this.closeLOxRQD = this.closeLOxRQD.bind(this);
    this.timeLOxRQD = this.timeLOxRQD.bind(this);

    this.openPropaneVentRBV = this.openPropaneVentRBV.bind(this);
    this.closePropaneVentRBV = this.closePropaneVentRBV.bind(this);
    this.timePropaneVentRBV = this.timePropaneVentRBV.bind(this);

    this.openPropaneFlowRBV = this.openPropaneFlowRBV.bind(this);
    this.closePropaneFlowRBV = this.closePropaneFlowRBV.bind(this);
    this.timePropaneFlowRBV = this.timePropaneFlowRBV.bind(this);

    this.openPropaneTankVentRBV = this.openPropaneTankVentRBV.bind(this);
    this.closePropaneTankVentRBV = this.closePropaneTankVentRBV.bind(this);
    this.timePropaneTankVentRBV = this.timePropaneTankVentRBV.bind(this);

    this.openPropaneRQD = this.openPropaneRQD.bind(this);
    this.closePropaneRQD = this.closePropaneRQD.bind(this);
    this.timePropaneRQD = this.timePropaneRQD.bind(this);

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

    this.extendIgniterInserter = this.extendIgniterInserter.bind(this);
    this.retractIgniterInserter = this.retractIgniterInserter.bind(this);
    this.timeIgniterInserter = this.timeIgniterInserter.bind(this);

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

  //----------Dashboard Data----------

  async setProcedureState(procState) { return await this.ipc.invoke('set-procedure-state', procState)}

  //----------Flight Computer----------

  async openMainWindows() { return await this.ipc.invoke('open-main-windows'); }
  async openAuxWindows() { return await this.ipc.invoke('open-aux-windows'); }

  async connectInflux(host, port, protocol, username, password) { return await this.ipc.invoke('connect-influx', host, port, protocol, username, password); }
  async getDatabases() { return await this.ipc.invoke('get-databases'); }
  async setDatabase(database) { return await this.ipc.invoke('set-database', database); }
  async setDarkMode(isDark) { return await this.ipc.invoke('set-darkmode', isDark); }

  async getFlightConnected() { return await this.ipc.invoke('flight-connected'); }
  async getDaq1Connected() { return await this.ipc.invoke('daq1-connected'); }
  async getDaq2Connected() { return await this.ipc.invoke('daq2-connected'); }
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

  async activateIgniter() { return await this.ipc.invoke('activate-Igniter'); }
  async deactivateIgniter() { return await this.ipc.invoke('deactivate-Igniter'); }

  async beginFlowAll() {
    await this.closeLOxPrechillRBV();
    await this.closePropanePrechillRBV();
    await this.closePrechillFlowRBV();
    await this.closeLOxTankVentRBV();
    return await this.beginFlow();
  }
  async beginFlow() { return await this.ipc.invoke('begin-flow'); }
  async endFlow() { return await this.ipc.invoke('end-flow'); }
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

  async openPressurantFlowRBV() {return await this.ipc.invoke('open-pressurantFlowRBV'); }
  async closePressurantFlowRBV() {return await this.ipc.invoke('close-pressurantFlowRBV'); }
  async timePressurantFlowRBV(val) {return await this.ipc.invoke('time-pressurantFlowRBV', val); }

  async openPressurantFillRBV() {return await this.ipc.invoke('open-pressurantFillRBV'); }
  async closePressurantFillRBV() {return await this.ipc.invoke('close-pressurantFillRBV'); }
  async timePressurantFillRBV(val) {return await this.ipc.invoke('time-pressurantFillRBV', val); }

  async openLOxVentRBV() {return await this.ipc.invoke('open-LOxVentRBV'); }
  async closeLOxVentRBV() {return await this.ipc.invoke('close-LOxVentRBV'); }
  async timeLOxVentRBV(val) {return await this.ipc.invoke('time-LOxVentRBV', val); }

  async openLOxTankVentRBV() {return await this.ipc.invoke('open-LOxTankVentRBV'); }
  async closeLOxTankVentRBV() {return await this.ipc.invoke('close-LOxTankVentRBV'); }
  async timeLOxTankVentRBV(val) {return await this.ipc.invoke('time-LOxTankVentRBV', val); }

  async openLOxFlowRBV() {return await this.ipc.invoke('open-LOxFlowRBV'); }
  async closeLOxFlowRBV() {return await this.ipc.invoke('close-LOxFlowRBV'); }
  async timeLOxFlowRBV(val) {return await this.ipc.invoke('time-LOxFlowRBV', val); }

  async openPressurantVentRBV() {return await this.ipc.invoke('open-pressurantVentRBV'); }
  async closePressurantVentRBV() {return await this.ipc.invoke('close-pressurantVentRBV'); }
  async timePressurantVentRBV(val) {return await this.ipc.invoke('time-pressurantVentRBV', val); }

  //-------Actuator Controller 2-------

  async setPropTankBottomHeater(val) {return await this.ipc.invoke('set-propTankBottomHeater', val); }

  async setLOxTankTopHeater(val) {return await this.ipc.invoke('set-LOxTankTopHeater', val); }

  async openLOxRQD() {return await this.ipc.invoke('open-LOxRQD'); }
  async closeLOxRQD() {return await this.ipc.invoke('close-LOxRQD'); }
  async timeLOxRQD(val) {return await this.ipc.invoke('time-LOxRQD', val); }

  async openPropaneVentRBV() {return await this.ipc.invoke('open-propaneVentRBV'); }
  async closePropaneVentRBV() {return await this.ipc.invoke('close-propaneVentRBV'); }
  async timePropaneVentRBV(val) {return await this.ipc.invoke('time-propaneVentRBV', val); }

  async openPropaneFlowRBV() {return await this.ipc.invoke('open-propaneFlowRBV'); }
  async closePropaneFlowRBV() {return await this.ipc.invoke('close-propaneFlowRBV'); }
  async timePropaneFlowRBV(val) {return await this.ipc.invoke('time-propaneFlowRBV', val); }

  async openPropaneRQD() {return await this.ipc.invoke('open-propaneRQD'); }
  async closePropaneRQD() {return await this.ipc.invoke('close-propaneRQD'); }
  async timePropaneRQD(val) {return await this.ipc.invoke('time-propaneRQD', val); }

  async openPropaneTankVentRBV() {return await this.ipc.invoke('open-propaneTankVentRBV'); }
  async closePropaneTankVentRBV() {return await this.ipc.invoke('close-propaneTankVentRBV'); }
  async timePropaneTankVentRBV(val) {return await this.ipc.invoke('time-propaneTankVentRBV', val); }

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

  async extendIgniterInserter() {return await this.ipc.invoke('extend-igniterInserter')}
  async retractIgniterInserter() {return await this.ipc.invoke('retract-igniterInserter')}
  async timeIgniterInserter() {return await this.ipc.invoke('time-igniterInserter')}

}

export default new Comms(ipcRenderer);
