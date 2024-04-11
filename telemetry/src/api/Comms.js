import moment from 'moment';

const { ipcRenderer } = window.require("electron");

class Comms {
  constructor(ipc) {
    console.log("Comms exist");
    this.subscribers = {};
    this.universalSubscribers = [];
    this.darkmodeListeners = [];
    this.ipc = ipc;
    console.log(this.ipc);
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
  }

  stateUpdate(event, payload) {
    const { timestamp, update } = payload;
    // console.log(payload);
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
    // console.log(1);
    let call = this.ipc.invoke('connect-influx', host, port, protocol, username, password);
    let ret = await call;
    // console.log(ret);
    return ret;
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

  // ------------ Controls ------------

  async send(board, packet, ...vals) {
    return await this.ipc.invoke('send', board, packet, ...vals);
  }

  // async sendPacket(board, packet, number, command, time) {
  //   return await this.ipc.invoke('send-packet', board, packet, number, command, time);
  // }

  // async sendSignalPacket(board, packet) {
  //   return await this.ipc.invoke('send-signal-packet', board, packet);
  // }

  // async sendSignalPacketTimed(board, packet, time) {
  //   return await this.ipc.invoke('send-signal-timed-packet', board, packet, time);
  // }

  // async sendZeroPacket(board, packet, channel) {
  //   return await this.ipc.invoke('send-zero-packet', board, packet, channel);
  // }

  async beginLaunchSequence(ipaEnabled, nosEnabled) {
    return await this.ipc.invoke('launch', ipaEnabled, nosEnabled);
  }

  async abortAll() {
    return await this.ipc.invoke('abort');
  }

  async setHeartbeatEnabled(enabled) {
    return await this.ipc.invoke('set-heartbeat-enabled', enabled);
  }
}

export default new Comms(ipcRenderer);
