const { ipcMain } = require('electron');
const { EventEmitter } = require('events');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const moment = require('moment');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();

const { config, getPacketConfig } = require('./config');
const { initInfluxLocal,
        getSelectedInfluxDB,
        handleSensorData,
        handleValveEvent,
        startRecording,
        stopRecording } = require('./storage');

const { PerformanceObserver, performance } = require('perf_hooks');
const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

class Comms {
  constructor() {
    this.state = {
      port: null,
      portSelected: null,
      open: false,
      connected: false,
      connTimeout: null,
      bandwidth: 0, // bits per second
      sensors: { // For web server
        loxTank: 0,
        propTank: 0,
        loxInjector: 0,
        propInjector: 0,
        highPressure: 0,
        battery: 0,
        wattage: 0
      },
      valves: {
        loxTwoWay: false,
        propTwoWay: false,
        loxFiveWay: false,
        propFiveWay: false,
        loxGems: false,
        propGems: false,
        HPS: false
      }
    };
    // TODO: add code to transmit ping and wait for pong
    this.connEvents = new EventEmitter();
    this.sensorEvents = new EventEmitter();
    this.valveEvents = new EventEmitter();
  }

  init = () => {
    app.use(serveStatic(path.join(__dirname, 'viewer'), { 'index': ['index.html'] }));
    app.get('/data', (req, res) => {
      res.send({sensors: this.state.sensors, valves: this.state.valves});
    });
    this.sensorEvents.on('data', data => {
      switch(data.idx) {
        case 0:
          this.state.sensors.loxTank = data.values[0];
          break;
        case 1:
          this.state.sensors.propTank = data.values[0];
          break;
        case 2:
          this.state.sensors.loxInjector = data.values[0];
          break;
        case 3:
          this.state.sensors.propInjector = data.values[0];
          break;
        case 4:
          this.state.sensors.highPressure = data.values[0];
          break;
        case 5:
          this.state.sensors.battery = data.values[0];
          this.state.sensors.wattage = data.values[1];
          break;
      }
    });
    this.valveEvents.on('update', data => {
      // find differences
      Object.keys(data).forEach(k => {
        if(data[k] !== this.state.valves[k]) {
          handleValveEvent(k, data[k]);
        }
      });
      this.state.valves = data;
    });
    app.listen(5000, '0.0.0.0');




    this.packetConfig = getPacketConfig();
    console.log(this.packetConfig);

    this.receivedPacket = true;
    this.connectionInterval = setInterval(() => {
      if(!this.receivedPacket) {
        if(this.state.connected) {
          this.connEvents.emit('disconnect');
        }
        this.state.connected = false;
      }
      this.receivedPacket = false;
    }, 1000);

    ipcMain.handle('get-config', (event) => {
      return config;
    });

    ipcMain.handle('list-ports', async (event) => {
      return await SerialPort.list();
    });

    ipcMain.handle('get-connected', async (event) => {
      return this.state.connected;
    });

    ipcMain.handle('get-port', async (event) => {
      return this.state.portSelected;
    });

    ipcMain.handle('select-port', async (event, port, baud) => {
      console.log(port.path);
      console.log(baud);
      this.state.portSelected = port;
      this.state.port = new SerialPort(port.path, {
        baudRate: baud,
        autoOpen: false
      });
      this.state.open = await new Promise((res, rej) => {
        this.state.port.open((err) => {
          if (err) {
            console.error(`Error opening port ${port.path}`);
            console.error(err);
            res(false);
          }
          this.parser = new Readline();
          this.state.port.pipe(this.parser);
          this.parser.on('data', this.processData);
          console.log('Port opened!');
          res(true);
        });
      });
      return this.state.open;
    });

    ipcMain.handle('start-recording', (event, name) => {
      startRecording(name);
    });

    ipcMain.handle('stop-recording', async (event) => {
      await stopRecording();
    });

    ipcMain.handle('get-database', async (event) => {
      return getSelectedInfluxDB();
    });

    ipcMain.handle('select-database', async (event, db) => {
      await initInfluxLocal(db);
    });

    ipcMain.handle('send-packet', async (event, id, data) => {
      this.sendPacket(id, data);
      return 3;
    });

    ipcMain.handle('start-rssi', async (event) => {
      this.startRadioRSSI();
    });
  }

  sendPacket = (id, data) => {
    // console.log(id,...data);
    const pack = this.createPacket(id, data);
    console.log(pack);
    if (this.state.open) {
      this.state.port.write(pack, (err) => {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
      });
    }

    return 3;
  }

  startRadioRSSI = () => {
    if(this.state.open) {
      this.state.port.write("+++");
      this.state.port.drain();
      setTimeout(() => {
        this.state.port.write("AT&T=RSSI\r\n");
        this.state.port.drain();
      }, 1000);
    }
  }

  openWebCon = (webCon) => {
    console.log('web connection');
    this.webCon = webCon;

    this.connEvents.on('connect', () => {
      console.log('Connected!');
      this.webCon.send('connect');
    });
    this.connEvents.on('disconnect', () => {
      console.log('Disconnected!');
      this.webCon.send('disconnect');
    });

    this.sensorEvents.on('data', data => {
      this.webCon.send('sensor-data', data);
    });

    this.valveEvents.on('update', data => {
      console.log('Sending Valve Telemetry - Graphs');
      this.webCon.send('valve-update', data);
    });

    this.bandwidthCounter = 0;
    this.bandwidthInterval = setInterval(() => {
      this.state.bandwidth = this.bandwidthCounter;
      this.bandwidthCounter = 0;
      this.webCon.send('bandwidth', this.state.bandwidth);
    }, 1000);
  }

  openControlWebCon = (webCon) => {
    console.log('control web connection');
    this.controlWebCon = webCon;

    this.connEvents.on('connect', () => {
      console.log('Connected!');
      this.controlWebCon.send('connect');
    });

    this.connEvents.on('disconnect', () => {
      console.log('Disconnected!');
      this.controlWebCon.send('disconnect');
    });

    this.valveEvents.on('update', data => {
      console.log('Sending Valve Telemetry - Control');
      this.controlWebCon.send('valve-update', data);
    });

  }






  parsePacket = rawData => {
    const data = rawData.replace(/(\r\n|\n|\r)/gm, '');
    if(data.substring(0, 1) === '{') { // data packet
      if(!this.state.connected) {
        this.connEvents.emit('connect');
        this.state.connected = true;
      }
      this.receivedPacket = true;
      const [ rawValues, checksum ] = data.replace(/({|})/gm, '').split('|');
      const [ id, ...values ] = rawValues.split(',').map(v => parseFloat(v));
      const calculatedChecksum = this.fletcher16(Buffer.from(rawValues, 'binary'));
      if(parseInt(Number('0x' + checksum), 10) !== calculatedChecksum) {
        console.log(`Checksums don't match! Message: ${data} Checksum: ${calculatedChecksum}`);
        return null;
      }
      return {
        id,
        values
      };
    }
    return null;
  }

  createPacket = (id, payload) => {
    let data = [id].concat(payload).toString();
    return `{${data}|${this.fletcher16(data.split("").map(c => c.charCodeAt(0))).toString(16)}}`;
  }

  processData = rawData => {
    this.bandwidthCounter += rawData.length * 8 + 3 // 8 bits per byte plus one start bit and two stop bits
    const timestamp = moment().toJSON();
    let packet;
    console.log(rawData.substr(1, 3));
    if(rawData.substr(0, 3) === "L/R") {
      
      // RSSI packet
      console.log(rawData);
      const rssi = rawData.match(/L\/R RSSI: (\d+)\/(\d+)/);
      const noise = rawData.match(/L\/R noise: (\d+)\/(\d+)/);
      const pkts = rawData.match(/pkts: (\d+)/);
      const txe = rawData.match(/txe=(\d+)/);
      const rxe = rawData.match(/rxe=(\d+)/);
      const stx = rawData.match(/stx=(\d+)/);
      const srx = rawData.match(/srx=(\d+)/);
      const ecc = rawData.match(/ecc=(\d+)\/(\d+)/);
      const temp = rawData.match(/temp=([+-]?\d+)/);
      const dco = rawData.match(/dco=(\d+)/);
      packet = {
        id: 50,
        values: [
          parseInt(rssi[1]),
          parseInt(rssi[2]),
          parseInt(noise[1]),
          parseInt(noise[2]),
          parseInt(pkts[1]),
          parseInt(txe[1]),
          parseInt(rxe[1]),
          parseInt(stx[1]),
          parseInt(srx[1]),
          parseInt(ecc[1]),
          parseInt(ecc[2]),
          parseInt(temp[1]),
          parseInt(dco[1]),
        ],
      };
    } else {
      packet = this.parsePacket(rawData);
    }
    if(!packet) { // packet is not data or is invalid
      return;
    }

    // Update Valves States based off Valve Status Packets
    if(packet.id >= 20 && packet.id <= 29 && packet.values.length == 7) {
      const valves = {
        loxTwoWay: packet.values[0] === 1,
        propTwoWay: packet.values[1] === 1,
        loxFiveWay: packet.values[2] === 1,
        propFiveWay: packet.values[3] === 1,
        loxGems: packet.values[4] === 1,
        propGems: packet.values[5] === 1,
        HPS: packet.values[6] === 1
      };
      this.valveEvents.emit('update', valves);
      console.log("Recevied packet:" + JSON.stringify(packet));
      return;
    }

    if(!this.packetConfig[packet.id]) { // if no config exists for this packet, we don't know about it
      return;
    }
    const storageValues = { timestamp, values: {} };
    this.packetConfig[packet.id].forEach(idx => {
      const sensor = config.sensors[idx]; // get sensor that is associated with this packet
      const payload = {
        idx,
        timestamp,
        values: sensor.values.map(v => {
          if(packet.values[v.packetPosition] === undefined) {
            return NaN; // sonetimes packets have sensors with different read frequencies
          }
          let res;
          switch(v.interpolation.type) {
            case "none":
              res = packet.values[v.packetPosition];
              break;
            case "linear":
              res = this.linearInterpolate(packet.values[v.packetPosition], v.interpolation.values);
              break;
            case "coef":
              res = packet.values[v.packetPosition] * v.interpolation.coefficient;
              break;
            default:
              res = packet.values[v.packetPosition];
              break;
          }
          // if(v.storageName === 'highPressure') {
          //   console.log(packet.values[v.packetPosition]);
          // }
          storageValues.values[v.storageName] = res;
          return res;
        })
      };
      this.sensorEvents.emit('data', payload);
    });
    handleSensorData(storageValues);
  }

  linearInterpolate = (rawValue, map) => {
    var index = 0;
    if(map[map.length-1][0] < rawValue) {
      index = map.length-2;
    } else if(map[0][0] > rawValue) {
      return map[0][1];
    } else {
      index = map.findIndex((v, i) => {
        return v[0] <= rawValue && map[i+1][0] >= rawValue;
      });
    }
    return map[index][1] + (map[index+1][1] - map[index][1]) * ((rawValue - map[index][0]) / (map[index+1][0] - map[index][0]));
  }

  fletcher16 = (data) => {
    var a = 0, b = 0;
    for (var i = 0; i < data.length; i++) {
        a = (a + data[i]) % 255;
        b = (b + a) % 255;
    }
    return a | (b << 8);
  }
}


module.exports = new Comms();
