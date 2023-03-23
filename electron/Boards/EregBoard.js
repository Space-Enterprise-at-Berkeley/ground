const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class EregBoard extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      // Pressure Telemetry
      1: [
        ["filteredUpstreamPressure1", asFloat],
        ["filteredUpstreamPressure2", asFloat],
        ["filteredDownstreamPressure1", asFloat],
        ["filteredDownstreamPressure2", asFloat],
        ["rawUpstreamPressure1", asFloat],
        ["rawUpstreamPressure2", asFloat],
        ["rawDownstreamPressure1", asFloat],
        ["rawDownstreamPressure2", asFloat],
      ],

      // Motor Telemetry
      2: [
        ["encoderAngle", asFloat],
        ["angleSetpoint", asFloat],
        ["pressureSetpoint", asFloat],
        ["motorPower", asFloat],
        ["pressureControlP", asFloat],
        ["pressureControlI", asFloat],
        ["pressureControlD", asFloat]
      ],

      // Config
      3: [
        ["pressureSetpointConfig", asFloat],
        ["pOuterNominal", asFloat],
        ["iOuterNominal", asFloat],
        ["dOuterNominal", asFloat],
        ["pInner", asFloat],
        ["iInner", asFloat],
        ["dInner", asFloat],
        ["flowDuration", asFloat]
      ],

      // Diagnostic
      4: [
        ["motorDirPass", asUInt8],
        ["servoDirPass", asUInt8]
      ],

      // State Transition Error
      5: [
        ["errorCode", asUInt8]
      ],

      // Flow State
      6: [
        ["flowState", asUInt8]
      ],

      // Limit Switch
      7: [
        ["fullyClosedSwitch", asFloat],
        ["fullyOpenSwitch", asFloat]
      ],

      // Phase Currents
      8: [
        ["currentA", asFloat],
        ["currentB", asFloat],
        ["currentC", asFloat]
      ],

      // Temperatures
      9: [
        ["boardTempA", asFloat],
        ["boardTempB", asFloat],
        ["motorTemp", asFloat]
      ],

      // Overcurrent Trigger
      10: [
        ["avgCurrent", asFloat],
        ["bufferSize", asFloat]
      ]
    }
  }
}

module.exports = EregBoard;