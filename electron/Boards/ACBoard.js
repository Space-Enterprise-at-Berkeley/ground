const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class ACBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // 24V Supply Stats
      1: [
        ["acSupply24Voltage", asFloat],
        ["acSupply24Current", asFloat],
        ["acSupply24Power", asFloat]
      ],

      // Actuator States
      2: [
        ["actuatorState0", asUInt8],
        ["actuatorState1", asUInt8],
        ["actuatorState2", asUInt8],
        ["actuatorState3", asUInt8],
        ["actuatorState4", asUInt8],
        ["actuatorState5", asUInt8],
        ["actuatorState6", asUInt8],
        ["actuatorState7", asUInt8]
      ],

      // Actuator Continuities
      3: [
        ["actuatorContinuity0", asFloat],
        ["actuatorContinuity1", asFloat],
        ["actuatorContinuity2", asFloat],
        ["actuatorContinuity3", asFloat],
        ["actuatorContinuity4", asFloat],
        ["actuatorContinuity5", asFloat],
        ["actuatorContinuity6", asFloat],
        ["actuatorContinuity7", asFloat]
      ],

      // Actuator Currents
      4: [
        ["actuatorCurrent0", asFloat],
        ["actuatorCurrent1", asFloat],
        ["actuatorCurrent2", asFloat],
        ["actuatorCurrent3", asFloat],
        ["actuatorCurrent4", asFloat],
        ["actuatorCurrent5", asFloat],
        ["actuatorCurrent6", asFloat],
        ["actuatorCurrent7", asFloat]
      ]
    }
  }
}

module.exports = ACBoard;