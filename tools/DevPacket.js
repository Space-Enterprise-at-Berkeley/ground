const { INBOUND_PACKET_DEFS } = require("../electron/packetDefs");
const Interpolation = require("../electron/Interpolation");
const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32 } = Interpolation
const Packet = require("../electron/Packet")

class DevPacket extends Packet{
  /**
   *
   * @param {Number} id
   * @param {Array.<Number|String>} values
   * @param {Number|null} [timestamp]
   */
  constructor(id, values, timestamp) {
    super(id, values, timestamp);
  }

  toBuffer() {
    const packetDef = INBOUND_PACKET_DEFS[this.id]
    if (!packetDef) {
      console.debug(`[${this.id}] Packet ID is not defined in the INBOUND_PACKET_DEFS.`)
      return
    }

    /**
     * @type {Array.<Buffer>}
     */
    const dataBufArr = this.values.map((value, idx) => {
      switch (packetDef[idx][1]) {
        case asFloat: {
          const _buf = Buffer.alloc(4)
          _buf.writeFloatLE(value)
          return _buf
        }
        case asUInt8: {
          const _buf = Buffer.alloc(1)
          _buf.writeUInt8(value)
          return _buf
        }
        case asUInt16: {
          const _buf = Buffer.alloc(2)
          _buf.writeUInt16LE(value)
          return _buf
        }
        case asUInt32: {
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
    tsOffsetBuf.writeUInt32LE(Date.now() - DevPacket.initTime)

    const checksumBuf = Buffer.alloc(2)
    checksumBuf.writeUInt16LE(DevPacket.fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...dataBufArr]))

    return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checksumBuf, ...dataBufArr])
  }
}

module.exports = DevPacket;
