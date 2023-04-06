const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class TCBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // 24V Supply Stats
      1: [
        ["tcSupply24Voltage", asFloat],
        ["tcSupply24Current", asFloat],
        ["tcSupply24Power", asFloat]
      ],

      // TC Value
      2: [
        ["tcValue0", asFloat],
        ["tcValue1", asFloat],
        ["tcValue2", asFloat],
        ["tcValue3", asFloat],
        ["tcValue4", asFloat],
        ["tcValue5", asFloat],
        ["tcValue6", asFloat],
        ["tcValue7", asFloat]
      ]
    }
  }
}

module.exports = TCBoard;