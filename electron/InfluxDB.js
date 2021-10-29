const Influx = require('influx');
const throttle = require('lodash.throttle');

const BATCH_SIZE = 10000;

const procedureSteps = {
  0: "Setup",
  1: "Pressurant Fill",
  2: "Prop Fill",
  3: "LOx Fill",
  4: "Pre-Chill",
  5: "Burn"
}

class InfluxDB {
  constructor() {
    this.influx = null;
    this.database = null;
    this.tags = {
      recording: null,
      procedureStep: null,
    };
    this.pointsBuffer = [];
    this.sysLogBuffer = [];

    this.connect = this.connect.bind(this);
    this.getDatabaseNames = this.getDatabaseNames.bind(this);
    this.setDatabase = this.setDatabase.bind(this);
    this.setRecording = this.setRecording.bind(this);
    this.clearRecording = this.clearRecording.bind(this);
    this.setProcedureStep = this.setProcedureStep.bind(this);
    this.clearProcedureStep = this.clearProcedureStep.bind(this);
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
    this.handleSysLogUpdate = this.handleSysLogUpdate.bind(this);

    this._pushStateUpdate = this._pushStateUpdate.bind(this);
    this.throttledStateUpdate = throttle(this._pushStateUpdate, 2000)
    this._pushSysLog = this._pushSysLog.bind(this);
    this.throttledSysLogPush = throttle(this._pushSysLog, 250)
  }

  connect(host, port, protocol, username, password) {
    this.influx = new Influx.InfluxDB({
      host,
      port,
      protocol,
      username,
      password,
      requestTimeout: 20000,
      failoverTimeout: 40000,
    });
  }

  async getDatabaseNames() {
    return await this.influx.getDatabaseNames();
  }

  setDatabase(database) {
    this.database = database;
  }

  setRecording(name) {
    this.tags.recording = name;
  }

  clearRecording() {
    this.tags.recording = null;
  }

  setProcedureStep(step) {
    this.tags.procedureStep = procedureSteps[step];
  }

  clearProcedureStep() {
    this.tags.procedureStep = null;
  }

  async _pushSysLog() {
    const sysLogBuffer = [...this.sysLogBuffer]
    if (sysLogBuffer.length === 0) return
    this.sysLogBuffer = []
    // console.debug(`writing ${sysLogBuffer.length} syslogs to influx.`)
    await this.influx.writePoints(sysLogBuffer, { database: this.database, precision: 'ms' }
    )
  }

  async _pushStateUpdate(){
    const pointsBuffer = [...this.pointsBuffer]
    if (pointsBuffer.length === 0) return
    this.pointsBuffer = []
    // console.debug(`writing ${pointsBuffer.length} state update points to influx.`)
    await this.influx.writePoints(pointsBuffer, { database: this.database, precision: 'ms' }
    )
  }

  async handleSysLogUpdate(timestamp, message, additionalTags = {}) {
    this.sysLogBuffer.push({
      measurement: 'syslog',
      tags: { ...this.tags, ...additionalTags },
      fields: {
        // TODO: can implement severity at one point?
        message,
      },
      timestamp
    })

    console.debug("pushed to syslog queue", this.sysLogBuffer[this.sysLogBuffer.length - 1].fields.message)

    if (this.influx === null) return;
    if (this.database === null) return;

    console.debug("sysLogBufferLength", this.sysLogBuffer.length)

    this.throttledSysLogPush()
  }

  async handleStateUpdate(timestamp, update) {
    for (let k of Object.keys(update)) {
      this.pointsBuffer.push({
        measurement: k,
        tags: this.tags,
        fields: { value: update[k].message ? update[k].message : update[k] },
        timestamp: timestamp
      });
    }

    if (this.influx === null) return;
    if (this.database === null) return;

    if (this.pointsBuffer.length > BATCH_SIZE) {
      console.debug('points buffer has exceeded batch size, sending early.')
      this.throttledStateUpdate.flush()
      return true
    }

    this.throttledStateUpdate()
  }
}

module.exports = InfluxDB;
