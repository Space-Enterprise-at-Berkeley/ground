const Packet = require('./Packet');

const { INBOUND_PACKET_DEFS } = require("./packetDefs");

class Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    this.isConnected = false;
    this.watchdog = null;
    this.port = port;
    this.address = address;
    this.mapping = mapping;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onRate = onRate;
    this.port.register(this.address, this);
    /** @type {Number} the local time (in ms) at which the first packet was received from this board */
    this.firstRecvTime = -1;
    /** @type {Number} the sent offset time (in ms) at which the first packet was received */
    this.firstRecvOffset = -1;
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
    const buf = p.toBuffer()
    if (!buf) {
      console.debug(`[id ${id}] Outbound packet's packet data typing definition could not be found. Not sent.`)
      return false
    }
    this.port.send(this.address, buf);
    return true;
  }

  /**
   * Uses the offset given in the first packet received from the board to calculate subsequent packet arrival times
   * @param runTime {number} is the received running duration of the board (in ms)
   * @returns {number} the estimated timestamp at which the packet was sent (in ms)
   */
  calculateTimestamp(runTime) {
    // This needs to be updated everytime a board gets disconnected and reconnected
    if (this.firstRecvTime < 0) {
      /* TODO: consider using multiple packet offsets to reduce likelihood of noise causing the first receive time to
      *   deviate too significantly */
      this.firstRecvTime = Date.now()
    }
    if (this.firstRecvOffset < 0) {
      this.firstRecvOffset = runTime
    }
    return runTime - this.firstRecvOffset + this.firstRecvTime
  }

  /**
   * Parses the raw packet into a data object
   * @param buf {Buffer} is the buffer that contains the full udp packet content
   * @returns {Packet|null} packet with parsed data
   */
  parseMsgBuf(buf) {
    // Packet format:
    // [ ________ | ________ | ________ ________ ________ ________ | ________ ________ | ________ ... ________ ]
    // [    id    |   len    |              runTime                |       checkSum    |          data         ]
    // [  u_int8  |  u_int8  |              u_int32                |        u_int16    |     defined in doc    ]
    const id = buf.readUInt8(0);
    const len = buf.readUInt8(1);

    const runTime = buf.readUInt32LE(2);
    const timestamp = this.calculateTimestamp(runTime);

    const checksum = buf.readUInt16LE(6);

    // currently, data comes after the 2 bytes checksum (at offset 2) 2 + 2 = 4
    const dataOffset = 8;

    const dataBuf = buf.slice(dataOffset, dataOffset + len)
    const payloadBuf = buf.slice(0, 6)
    const sumBuf = Buffer.concat([payloadBuf, dataBuf])
    const expectedChecksum = Packet.fletcher16(sumBuf)

    if (checksum === expectedChecksum) {
      const values = []
      const packetDef = INBOUND_PACKET_DEFS[id]
      if(!packetDef) return null;

      if (!packetDef) {
        console.debug(`inbound packet with id: ${id} has the correct checksum but is undefined in the PACKET_DEFS.`)
        return null
      }

      let offset = 0;

      for (const [_, parser, __] of packetDef) {
        const [value, byteLen] = parser(dataBuf, offset);
        values.push(value);
        offset += byteLen;
      }

      return new Packet(id, values, timestamp);
    } else {
      console.debug(`check sum check failed for packet id: ${id} from board ip: ${this.address}`)
      return null
    }
  }

  /**
   * Resets the board status watch dog and increases total bytesReceived
   * @param byteLen {Number} the number of bytes received
   * @returns {void}
   */
  updateRcvRate(byteLen) {
    this.resetWatchdog();
    this.bytesRecv += byteLen;
  }

  /**
   * Takes in a packet and returns a state update
   * @param packet {Packet} a fully formed packet
   */
  processPacket(packet) {
    const { id, values } = packet
    const packetDef = INBOUND_PACKET_DEFS[id];
    if(!packetDef) return;

    const update = {};

    values.forEach((_value, idx) => {
      const fieldDef = packetDef[idx]
      // if(id === 152) {
        
      // }
      const [_fieldName, _, interpolator] = fieldDef
      let value
      if (interpolator) {
        value = interpolator(_value)
        if (value.isExtended) {
          const { additionalFields } = value
          Object.assign(update, additionalFields)
          value = value.value
        }
      } else {
        value = _value
      }
      const fieldName = this.mapping[_fieldName]
      if (fieldName === undefined) {
        update[_fieldName] = value
      } else if (fieldName !== null) {
        update[fieldName] = value
      }
    })

    return update
  }

  resetWatchdog() {
    if (!this.isConnected) {
      this.sendPacket(0, []);
      this.onConnect();
    }
    this.isConnected = true;
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(() => {
      this.isConnected = false;
      this.firstRecvTime = -1;
      this.firstRecvOffset = -1;
      this.onDisconnect();
    }, 1000);
  }
}

module.exports = Board;
