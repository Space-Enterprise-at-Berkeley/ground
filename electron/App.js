const { ipcMain } = require('electron');

const Board = require('./Board');
const State = require('./State');
const UdpPort = require('./UdpPort');
const InfluxDB = require('./InfluxDB');
const { initTime, fletcher16Partitioned } = require('./Packet');
const { getPreprocessor } = require('./Preprocessors');

class App {
  constructor(config, port) {
    this.webContents = [];
    this.state = new State({});
    this.influxDB = new InfluxDB(this);
    this.commandFuncs = {};
    this.config = config;
    this.boards = {};
    this.lastValues = {};
    this.recvPort = port;
    this.preprocessors = {};

    this.updateState = this.updateState.bind(this);
    this.sendDarkModeUpdate = this.sendDarkModeUpdate.bind(this);
    this.handleSendCustomMessage = this.handleSendCustomMessage.bind(this)
    this.addBackendFunc = this.addBackendFunc.bind(this);
    this.send = this.send.bind(this);
    this.sendPacket = this.sendPacket.bind(this);
    this.sendSignalPacket = this.sendSignalPacket.bind(this);
    this.sendSignalTimedPacket = this.sendSignalTimedPacket.bind(this);
    this.sendZeroPacket = this.sendZeroPacket.bind(this);
    this.launch = this.launch.bind(this);
    this.abort = this.abort.bind(this);
  }

  /**
   * Separate init function from constructor to ensure WebContents are present before accepting IPC invocations
   */
  initApp() {
    this.port = new UdpPort('0.0.0.0', this.recvPort, this.updateState);

    for (let boardName in this.config.boards) {
      this.boards[boardName] = new Board(
        this.port,
        this.config.boards[boardName].address,
        boardName,
        {},
        () => {
          let packet = {};
          packet[boardName + ".boardConnected"] = true;
          this.updateState(Date.now(), packet);
        },
        () => {
          let packet = {};
          packet[boardName + ".boardConnected"] = false;
          this.updateState(Date.now(), packet);
        },
        (rate) => {
          let packet = {};
          packet[boardName + ".boardKbps"] = rate;
          this.updateState(Date.now(), packet);
        },
        this.config.packets[this.config.boards[boardName].type]
      );
    }

    for (let field in this.config.preprocessors) {
      this.preprocessors[field] = [];
      for (let processor of this.config.preprocessors[field]) {
        this.preprocessors[field].push([getPreprocessor(processor.func, processor.args || []), field + "@" + processor.suffix]);
      }
    }

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
    for (let _k in update) {
      if (this.preprocessors[_k] == null) {
        continue;
      }
      for (let p of this.preprocessors[_k]) {
        update[p[1]] = p[0](update[_k], timestamp);
      }
    }
    this.state.updateState(timestamp, update);
    this.sendStateUpdate(timestamp, update);
    let mappedUpdate = {};
    for (let _k in update) {
      if (this.config.influxMap[_k] !== undefined) {
        mappedUpdate[this.config.influxMap[_k]] = update[_k];
      }
      else {
        let [board, field] = _k.split(".");
        if (board === "freg" || board === "oreg" || field === "boardConnected" || field === "boardKbps" || board === "fcap" || board === "ocap") {
          this.config.influxMap[_k] = _k;
          mappedUpdate[_k] = update[_k];
        }
        else {
          this.config.influxMap[_k] = field;
          mappedUpdate[field] = update[_k];
        }
      }
    }
    if (dbrecord) {
      // if update value is not number -> add to syslog as well
      Object.keys(mappedUpdate).forEach(_k => {
        if(typeof mappedUpdate[_k] !== 'number'){
          if(mappedUpdate[_k].message){
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${mappedUpdate[_k].message}`, mappedUpdate[_k].tags)
          }else{
            this.influxDB.handleSysLogUpdate(timestamp, `${_k} -> ${mappedUpdate[_k]}`)
          }
        }
      })
      this.influxDB.handleStateUpdate(timestamp, mappedUpdate);
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
      if (wc.isDestroyed()) {
        continue;
      }
      wc.send('state-update', {
        timestamp,
        update,
      });
    }
  }

  sendDarkModeUpdate(isDark) {
    for (let wc of this.webContents) {
      if (wc.isDestroyed()) {
        continue;
      }
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
      if (args[2] !== 209) {
        const update = {
          [channel]: args.length > 1 ? `invoked with arg(s): ${args.slice(1).join(", ")}` : 'invoked'
        };
        this.updateState(Date.now(), update, dbrecord)
      }
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

    this.addIPC('send-custom-message', this.handleSendCustomMessage, false);

    this.addIPC('send', this.send);
    this.addIPC('send-packet', this.sendPacket);
    this.addIPC('send-signal-packet', this.sendSignalPacket);
    this.addIPC('send-signal-timed-packet', this.sendSignalTimedPacket);
    this.addIPC('send-zero-packet', this.sendZeroPacket);
    this.addIPC('launch', this.launch);
    this.addIPC('abort', this.abort);
  }

  send(_, board, packet, ...vals) {
    let buf = App.generatePacket(packet, ...vals);
    this.port.send(this.boards[board].address, buf);
  }

  sendPacket(_, board, packet, number, command, time) {
    let buf = App.generatePacket(packet, number, "asUInt8", command, "asUInt8", time, "asUInt32");
    this.port.send(this.boards[board].address, buf);
    // this.port.server.send(buf, 42070, this.boards[board].address);
  }

  sendSignalPacket(_, board, packet) {
    let buf = App.generatePacket(packet);
    this.port.send(this.boards[board].address, buf);
  }

  sendSignalTimedPacket(_, board, packet, time) {
    let buf = App.generatePacket(packet, time, "asFloat");
    this.port.send(this.boards[board].address, buf);
  }

  sendZeroPacket(_, board, packet, channel) {
    let buf = App.generatePacket(packet, channel, "asUInt8");
    this.port.send(this.boards[board].address, buf);
  }

  static generatePacket(id, ...vals) {
    let idBuf = Buffer.alloc(1);
    idBuf.writeUint8(id);
    let len = 0;
    let values = [];
    for (let i = 0; i < vals.length; i += 2) {
      let buf;
      let val = vals[i];
      let type = vals[i + 1];
      switch (type) {
        case "asUInt8":
          buf = Buffer.alloc(1);
          buf.writeUint8(val);
          len += 1;
          break;
        case "asUInt16":
          buf = Buffer.alloc(2);
          buf.writeUint16LE(val);
          len += 2;
          break;
        case "asUInt32":
          buf = Buffer.alloc(4);
          buf.writeUint32LE(val);
          len += 4;
          break;
        case "asUInt64":
          buf = Buffer.alloc(8);
          buf.writeUint64LE(val);
          len += 8;
          break;
        case "asFloat":
          buf = Buffer.alloc(4);
          buf.writeFloatLE(val);
          len += 4;
          break;
      }
      console.log(buf);
      values.push(buf);
    }
    let lenBuf = Buffer.alloc(1);
    lenBuf.writeUInt8(len);
    let tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(Date.now() - initTime);
    let checksumBuf = Buffer.alloc(2);
    checksumBuf.writeUInt16LE(fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...values]));
    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...values]);
  }

  launch() {
    console.log("launch");
    // const delay = 30;
    // setTimeout(() => {
      console.log("actual launch");
      let buf = App.generatePacket(149, this.config.mode, "asUInt8", this.config.burnTime, "asUInt32");
      this.port.send(this.boards[this.config.controller].address, buf);
    // }, delay * 1000);
  }

  abortWithReason(reason) {
    console.log("abort " + reason);
    let buf = App.generatePacket(133, this.config.mode, "asUInt8", reason, "asUInt8");
    this.port.broadcast(buf);
  }

  abort() {
    this.abortWithReason(0);
  }
}

module.exports = App;
