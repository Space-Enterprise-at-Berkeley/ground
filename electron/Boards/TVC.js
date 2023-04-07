// const Board = require('../Board');

// class TVC extends Board {
//   constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
//     super(port, address, mapping, onConnect, onDisconnect, onRate);
//     this.zeroEncoders  = this.zeroEncoders.bind(this);
//     this.setMotorEncoder = this.setMotorEncoder.bind(this);
//     this.runDiagnostic = this.runDiagnostic.bind(this);
//   }
//   setMotorEncoder (value) { return this.sendPacket(202, [value]); } // float
//   runDiagnostic () { return this.sendPacket(204, []); }
//   zeroEncoders () { return this.sendPacket(205, []); }
// }

// module.exports = TVC;

const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class TVC extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],

      1: [
        ["tvcEncoderX", asUInt32],
        ["tvcEncoderY", asUInt32],
      ],

      2: [
        ["tvcSetpointX", asUInt32],
        ["tvcSetpointY", asUInt32],
      ],

      3: [
        ["tvcMode", asUInt8],
      ],
    }
  }
}

module.exports = TVC;
