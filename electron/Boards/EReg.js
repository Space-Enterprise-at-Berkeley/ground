const Board = require('../Board');

class EReg extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);
    this.startPropellantFlow = this.startPropellantFlow.bind(this);
    this.zeroEncoders  = this.zeroEncoders.bind(this);
    this.setMotorEncoder = this.setMotorEncoder.bind(this);
    this.pressurizePropellantStatic = this.pressurizePropellantStatic.bind(this);
    this.runDiagnostic = this.runDiagnostic.bind(this);
    this.zeroEncoders = this.zeroEncoders.bind(this);
    this.actuateMainValve = this.actuateMainValve.bind(this);
  }
  startPropellantFlow () { return this.sendPacket(200, []); }
  abortEreg () { return this.sendPacket(201, []); }
  setMotorEncoder (value) { return this.sendPacket(202, [value]); } // float
  pressurizePropellantStatic () { return this.sendPacket(203, []); }
  runDiagnostic () { return this.sendPacket(204, []); }
  zeroEncoders () { return this.sendPacket(205, []); }
  actuateMainValve (state) { return this.sendPacket(206, [state]); } // int
}

module.exports = EReg;
