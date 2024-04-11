const Influx = require("influx");
const throttle = require("lodash.throttle");

const procedureSteps = {
  0: "Setup",
  1: "Pressurant Fill",
  2: "Prop Fill",
  3: "LOx Fill",
  4: "Pre-Chill",
  5: "Burn",
};

class InfluxDB {
  constructor(app) {
    this.app = app;
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
    this._pushSysLog = this._pushSysLog.bind(this);
    this.throttledSysLogPush = throttle(this._pushSysLog, 250);
    this.lastTimeStamp = Date.now();
    this.lastState = 0;
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
    this.lastState = 1;
    this.app.updateState(Date.now(), {"influxState": 1, "influxDatabase": database}, false);
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
    const sysLogBuffer = [...this.sysLogBuffer];
    if (sysLogBuffer.length === 0) return;
    this.sysLogBuffer = [];
    console.debug("writing # to influx", sysLogBuffer.length);
    await this.influx.writePoints(sysLogBuffer, {
      database: this.database,
      precision: "ms",
    });
  }

  async handleSysLogUpdate(timestamp, message, additionalTags = {}) {
    this.sysLogBuffer.push({
      measurement: "syslog",
      tags: { ...this.tags, ...additionalTags },
      fields: {
        // TODO: can implement severity at one point?
        message,
      },
      timestamp,
    });

    console.debug(
      "pushed to syslog queue",
      this.sysLogBuffer[this.sysLogBuffer.length - 1].fields.message
    );

    if (this.influx === null) return;
    if (this.database === null) return;

    console.debug("sysLogBufferLength", this.sysLogBuffer.length);

    this.throttledSysLogPush();
  }

  async handleStateUpdate(timestamp, update) {
    if (this.influx === null || this.database === null) {
      if (this.lastState !== 0) {
        this.lastState = 0;
        this.app.updateState(Date.now(), {"influxState": 0}, false);
      }
      return;
    }

    for (let k of Object.keys(update)) {
      if (isNaN(update[k])) continue;
      if (!isFinite(update[k])) continue;
      this.pointsBuffer.push({
        measurement: k,
        tags: this.tags,
        fields: { value: update[k].message ? update[k].message : update[k] },
        timestamp: timestamp,
      });
    }

    const currentTime = Date.now()
    const timeElapsed = currentTime - this.lastTimeStamp;
    if (timeElapsed > 1000) {
      this.lastTimeStamp = currentTime
      try {
        await this.influx.writePoints(this.pointsBuffer, {
          database: this.database,
          precision: "ms",
        });
        this.pointsBuffer = [];
        return true;
      } catch (e) {
        console.log("error writing to influx", e);
        if (this.lastState !== 2) {
          this.lastState = 2;
          this.app.updateState(Date.now(), {"influxState": 2}, false);
        }
        return false;
      }
    }
    return false;
  }
}

module.exports = InfluxDB;
