const Influx = require('influx');

const BATCH_SIZE = 10000;

const procedureSteps = {
    0:"Setup",
    1:"Pressurant Fill",
    2:"Prop Fill",
    3:"LOx Fill",
    4:"Pre-Chill",
    5:"Burn"
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

    this.connect = this.connect.bind(this);
    this.getDatabaseNames = this.getDatabaseNames.bind(this);
    this.setDatabase = this.setDatabase.bind(this);
    this.setRecording = this.setRecording.bind(this);
    this.clearRecording = this.clearRecording.bind(this);
    this.setProcedureStep = this.setProcedureStep.bind(this);
    this.clearProcedureStep = this.clearProcedureStep.bind(this);
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
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

  async handleStateUpdate(timestamp, update) {
    if(this.influx === null) return;
    if(this.database === null) return;
    for(let k of Object.keys(update)) {
      this.pointsBuffer.push({
        measurement: k,
        tags: this.tags,
        fields: { value: update[k] },
        timestamp: timestamp
      });
    }
    if(this.pointsBuffer.length > BATCH_SIZE) {
      const buffer = this.pointsBuffer;
      this.pointsBuffer = [];
      await this.influx.writePoints(buffer, { database: this.database, precision: 'ms' });
      return true;
    }
    return false;
  }
}

module.exports = InfluxDB;
