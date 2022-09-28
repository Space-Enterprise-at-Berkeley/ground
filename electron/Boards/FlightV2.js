const Board = require('../Board');

class FlightV2 extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, () => { this.sendPacket(152, []); onConnect(); }, onDisconnect, onRate);
  }

  openloxGemsValve() { return this.sendPacket(126, [1]); }
  closeloxGemsValve() { return this.sendPacket(126, [0]); }

  openfuelGemsValve() { return this.sendPacket(127, [1]); }
  closefuelGemsValve() { return this.sendPacket(127, [0]); }

  startToggleLoxGemsValve() { return this.sendPacket(128, [1]); }
  stopToggleLoxGemsValve() { return this.sendPacket(128, [0]); }

  startToggleFuelGemsValve() { return this.sendPacket(129, [1]); }
  stopToggleFuelGemsValve() { return this.sendPacket(129, [0]); }

  openarmValve() { return this.sendPacket(130, [1]); }
  closearmValve() { return this.sendPacket(130, [0]); }

  activateIgniter() { return this.sendPacket(131, [1]); }
  deactivateIgniter() { return this.sendPacket(131, [0]); }

  openloxMainValve() { return this.sendPacket(132, [1]); }
  closeloxMainValve() { return this.sendPacket(132, [0]); }

  openfuelMainValve() { return this.sendPacket(133, [1]); }
  closefuelMainValve() { return this.sendPacket(133, [0]); }

  activateLoxTankBottomHtr() { return this.sendPacket(135, [1]); }
  deactivateLoxTankBottomHtr() { return this.sendPacket(135, [0]); }

  activateLoxTankMidHtr() { return this.sendPacket(136, [1]); }
  deactivateLoxTankMidHtr() { return this.sendPacket(136, [0]); }

  activateLoxTankTopHtr() { return this.sendPacket(137, [1]); }
  deactivateLoxTankTopHtr() { return this.sendPacket(137, [0]); }

  beginFlow() { return this.sendPacket(150, []); }
  abort() { return this.sendPacket(151, []); }

  enableFastReadRate() { return this.sendPacket(140, [1]); }
  disableFastReadRate() { return this.sendPacket(140, [0]); }

  enableIgniter() { return this.sendPacket(138, [1]); }
  disableIgniter() { return this.sendPacket(138, [0]); }

}

module.exports = FlightV2;
