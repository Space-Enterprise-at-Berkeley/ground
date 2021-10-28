const Packet = require('./Packet');
const Interpolation = require("./Interpolation");

const UNIVERSAL_PACKETS = {
  99: {
    0: {
      field: 'boardMetadata',
      interpolation: Interpolation.interpolateMetadata,
      parseAsString: true
    }
  }
}

class Board {
  constructor(port, address, packets, mapping, onConnect, onDisconnect, onRate) {
    this.isConnected = false;
    this.watchdog = null;
    this.port = port;
    this.address = address;
    this.packets = { ...UNIVERSAL_PACKETS, ...packets };
    this.mapping = mapping;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onRate = onRate;
    this.port.register(this.address, this);

    this.bytesRecv = 0;
    this.setupDataRateMonitor();
  }

  setupDataRateMonitor() {
    setInterval(() => {
      const kbps = this.bytesRecv * 8 / 1000;
      this.bytesRecv = 0;
      this.onRate(kbps);
    }, 1000);
  }

  sendPacket(id, values) {
    const p = new Packet(id, values);
    this.port.send(this.address, p.stringify());
    return true;
  }

  /**
   * Takes in a packet and returns a state update
   *
   * @param {Packet} packet
   */
  processPacket(packet) {
    this.resetWatchdog();
    this.bytesRecv += packet.length;
    const def = this.packets[packet.id];
    if (def === undefined) return;
    const update = {};
    for (let i = 0; i < packet.values.length; i++) {
      const fieldDef = def[i];
      if (fieldDef !== undefined) {
        let val = packet.values[i];
        if (fieldDef.interpolation !== null) {
          val = fieldDef.interpolation(val, packet.timestamp);
          if (val._val) {
            const { additionalFields } = val
            Object.assign(update, additionalFields)
            val = val._val
          }
        }
        let mappedField = this.mapping[fieldDef.field];
        if (mappedField === undefined) {
          mappedField = fieldDef.field;
        } else if (mappedField === null) {
          continue;
        }
        update[mappedField] = val;
      } else {
        // check for catch all "*" key in packets def
        const catchDef = def["*"]
        if (catchDef !== undefined) {
          let val = packet.values[i];
          if (catchDef.interpolation !== null) {
            val = catchDef.interpolation(val, packet.timestamp);
            if (val._val) {
              const { additionalFields } = val
              Object.assign(update, additionalFields)
              val = val._val
            }
          }
          if (catchDef.field.includes("{}")) {
            update[catchDef.field.replace("{}", i)] = val
          }else{
            update[`${catchDef.field}${i}`] = val
          }
        }
      }
    }
    return update;
  }

  resetWatchdog() {
    if (!this.isConnected) {
      this.sendPacket(99, [0])
      this.onConnect();
    }
    this.isConnected = true;
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(() => {
      this.isConnected = false;
      this.onDisconnect();
    }, 1000);
  }
}

module.exports = Board;
