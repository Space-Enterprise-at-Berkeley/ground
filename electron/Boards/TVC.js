const Board = require('../Board');

class TVC extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);
    this.zeroEncoders  = this.zeroEncoders.bind(this);
    this.setMotorEncoder = this.setMotorEncoder.bind(this);
    this.runDiagnostic = this.runDiagnostic.bind(this);
  }
  setMotorEncoder (value) { return this.sendPacket(202, [value]); } // float
  runDiagnostic () { return this.sendPacket(204, []); }
  zeroEncoders () { return this.sendPacket(205, []); }
}

module.exports = TVC;
