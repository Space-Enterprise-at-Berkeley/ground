const Board = require('../Board');

class Ground extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {

    super(port, address, mapping, () => { this.sendPacket(152, []); onConnect(); }, onDisconnect, onRate);

    this.openarmValve = this.openarmValve.bind(this);
    this.closearmValve = this.closearmValve.bind(this);

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.openloxMainValve = this.openloxMainValve.bind(this);
    this.closeloxMainValve = this.closeloxMainValve.bind(this);

    this.openfuelMainValve = this.openfuelMainValve.bind(this);
    this.closefuelMainValve = this.closefuelMainValve.bind(this);

    this.openMainValveVent = this.openMainValveVent.bind(this);
    this.closeMainValveVent = this.closeMainValveVent.bind(this);

    this.openPressRQD = this.openPressRQD.bind(this);
    this.closePressRQD = this.closePressRQD.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);

    this.enableIgniter = this.enableIgniter.bind(this);
    this.disableIgniter = this.disableIgniter.bind(this);
  }


  openarmValve() { return this.sendPacket(130, [1]); }
  closearmValve() { return this.sendPacket(130, [0]); }

  activateIgniter() { return this.sendPacket(131, [1]); }
  deactivateIgniter() { return this.sendPacket(131, [0]); }

  openloxMainValve() { return this.sendPacket(132, [1]); }
  closeloxMainValve() { return this.sendPacket(132, [0]); }

  openfuelMainValve() { return this.sendPacket(133, [1]); }
  closefuelMainValve() { return this.sendPacket(133, [0]); }

  openMainValveVent() { return this.sendPacket(136, [1]); }
  closeMainValveVent() { return this.sendPacket(136, [0]); }

  openPressRQD() { return this.sendPacket(135, [1]); }
  closePressRQD() { return this.sendPacket(135, [0]); }

  beginFlow() { return this.sendPacket(150, []); }
  abort() { return this.sendPacket(151, []); }

  enableIgniter() { return this.sendPacket(138, [1]); }
  disableIgniter() { return this.sendPacket(138, [0]); }

}

module.exports = Ground;
