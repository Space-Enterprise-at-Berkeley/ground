const { OUTBOUND_PACKET_DEFS } = require("./packetDefs");
const Interpolation = require("./Interpolation");
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES

class Packet {
  /**
   *
   * @param {Number} id
   * @param {Array.<Number|String>} values
   * @param {Number|null} [timestamp]
   */
  constructor(id, values, timestamp) {
    if (!timestamp) {
      this.timestamp = Date.now();
    } else {
      this.timestamp = timestamp;
    }
    this.id = id;
    this.values = values;
    this.length = this.values.length;
  }

  /**
   * Generates a string representation of the packet that can be transmitted
   * @returns a string representation of the packet
   */
  stringify() {
    const data = [this.id].concat(this.values.map(v => v.toFixed(2))).toString();
    const pack = `{${data}|${Packet.fletcher16(Buffer.from(data, 'binary')).toString(16)}}`;
    // console.log(pack);
    return pack;
  }

  toBuffer() {
    const packetDef = OUTBOUND_PACKET_DEFS[this.id]
    if (!packetDef) {
      console.debug(`[${this.id}] Packet ID is not defined in the OUTBOUND_PACKET_DEFS.`)
      return
    }
    /**
     * @type {Array.<Buffer>}
     */
    const dataBufArr = this.values.map((value, idx) => {
      switch (packetDef[idx]) {
        case FLOAT: {
          const _buf = Buffer.alloc(4)
          _buf.writeFloatLE(value)
          return _buf
        }
        case UINT8: {
          const _buf = Buffer.alloc(1)
          _buf.writeUInt8(value)
          return _buf
        }
        case UINT16: {
          const _buf = Buffer.alloc(2)
          _buf.writeUInt16LE(value)
          return _buf
        }
        case UINT32: {
          const _buf = Buffer.alloc(4)
          _buf.writeUInt32LE(value)
          return _buf
        }
      }
    })

    const idBuf = Buffer.alloc(1)
    idBuf.writeUInt8(this.id)
    const lenBuf = Buffer.alloc(1)
    lenBuf.writeUInt8(dataBufArr.reduce((acc, cur) => acc + cur.length, 0))
    const tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(Date.now() - Packet.initTime)

    const checksumBuf = Buffer.alloc(2)
    checksumBuf.writeUInt16LE(Packet.fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...dataBufArr]))

    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...dataBufArr])
  }

  /**
   * Calculates the fletcher16 checksum for some partitioned data.
   *
   * See https://en.wikipedia.org/wiki/Fletcher%27s_checksum
   * @param {Buffer[]} bufArr the data to checksum
   * @returns integer checksum
   */
  static fletcher16Partitioned(bufArr) {
    let a = 0, b = 0;
    for (const buf of bufArr) {
      for (let i = 0; i < buf.length; i++) {
        a = (a + buf[i]) % 256;
        b = (b + a) % 256;
      }
    }
    return a | (b << 8);
  }

  /**
   * Calculates the fletcher16 checksum for some data.
   *
   * See https://en.wikipedia.org/wiki/Fletcher%27s_checksum
   * @param {Buffer} data the data to checksum
   * @returns integer checksum
   */
  static fletcher16(data) {
    let a = 0, b = 0;
    for (let i = 0; i < data.length; i++) {
      a = (a + data[i]) % 256;
      b = (b + a) % 256;
    }
    return a | (b << 8);
  }

  static initTime = Date.now()
}

module.exports = Packet;
