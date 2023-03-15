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
  constructor(id=0, values=[], timestamp=Date.now()-Packet.startupTime) {
    this.id = id;
    this.values = values;
    this.timestamp = timestamp;
  }

  static startupTime = Date.now();

  /**
   * Generates a string representation of the packet that can be transmitted
   * @returns a string representation of the packet
   */
  stringify() {
    return `{${this.id}|${this.values.map(v => {
      if(v[1] === 'f') {
        // value is intended as a float
        return v[0].toFixed(2) + 'f';
      } else if(v[1] === 'x') {
        // value is intended as hexademical
        return '0x' + v[0].toString(16);
      } else if(v[1] === 'u8') {
        return v[0].toString() + 'u8';
      } else if(v[1] === 'u16') {
        return v[0].toString() + 'u16';
      } else if(v[1] === 'u32') {
        return v[0].toString() + 'u32';
      } else {
        // invalid value
      }
    }).join(',')}}`;
  }

  toBuffer() {
    /**
     * @type {Array.<Buffer>}
     */
    const dataBufArr = this.values.map(v => {
      if(v[1] === 'f') {
        // value is intended as a float
        const tmp = Buffer.alloc(4)
        tmp.writeFloatLE(v[0])
        return tmp
      } else if(v[1] === 'x') {
        // value is intended as hexademical
        const tmp = Buffer.alloc(1)
        tmp.writeUint8(v[0])
        return tmp
      } else if(v[1] === 'u8') {
        const tmp = Buffer.alloc(1)
        tmp.writeUInt8(v[0])
        return tmp
      } else if(v[1] === 'u16') {
        const tmp = Buffer.alloc(2)
        tmp.writeUInt16LE(v[0])
        return tmp
      } else if(v[1] === 'u32') {
        const tmp = Buffer.alloc(4)
        tmp.writeUInt32LE(v[0])
        return tmp
      } else {
        // invalid value
      }
    })

    const idBuf = Buffer.alloc(1)
    idBuf.writeUInt8(this.id)
    const lenBuf = Buffer.alloc(1)
    lenBuf.writeUInt8(dataBufArr.reduce((acc, cur) => acc + cur.length, 0))
    const tsOffsetBuf = Buffer.alloc(4)
    tsOffsetBuf.writeUInt32LE(this.timestamp)

    const checksumBuf = Buffer.alloc(2)
    checksumBuf.writeUInt16LE(Packet.fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...dataBufArr]))

    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...dataBufArr])
  }

  static createPacketFromText(text) {
    const idSplit = text.split('|');
    const id = parseInt(idSplit[0].substring(1));
    const values = idSplit[1].split(',');
    if(values.length > 0) {
      values[values.length-1] = values[values.length-1].split('}')[0]
    }

    for(let i in values) {
      const oldValue = values[i]
      if(oldValue[oldValue.length - 1] === 'f') {
        // value is intended as a float
        values[i] = [parseFloat(oldValue.substring(0, oldValue.length - 1)), 'f']
      } else if(oldValue.substring(0, 2) === '0x') {
        // value is intended as hexademical
        values[i] = [parseInt(oldValue.substring(2), 16), 'x']
      } else if(oldValue.substring(oldValue.length - 2) === 'u8') {
        values[i] = [parseInt(oldValue.substring(0, oldValue.length-2)), 'u8']
      } else if(oldValue.substring(oldValue.length - 3) === 'u16') {
        values[i] = [parseInt(oldValue.substring(0, oldValue.length-3)), 'u16']
      } else if(oldValue.substring(oldValue.length - 3) === 'u32') {
        values[i] = [parseInt(oldValue.substring(0, oldValue.length-3)), 'u32']
      } else {
        // invalid value
      }
    }
    const pkt = new Packet(id, values);
    return pkt
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
