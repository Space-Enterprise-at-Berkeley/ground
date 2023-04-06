const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class PTBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // 24V Supply Stats
      1: [
        ["ptSupply24Voltage", asFloat],
        ["ptSupply24Current", asFloat],
        ["ptSupply24Power", asFloat]
      ],

      // PT Value
      2: [
        ["ptValue0", asFloat],
        ["ptValue1", asFloat],
        ["ptValue2", asFloat],
        ["ptValue3", asFloat],
        ["ptValue4", asFloat],
        ["ptValue5", asFloat],
        ["ptValue6", asFloat],
        ["ptValue7", asFloat]
      ]
    }
  }
}

module.exports = PTBoard;