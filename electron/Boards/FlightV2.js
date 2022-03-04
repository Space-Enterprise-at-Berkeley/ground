const Board = require('../Board');

class FlightV2 extends Board {
  constructor(port, address, onConnect, onDisconnect, onRate) {
    super(port, address, {}, onConnect, onDisconnect, onRate);

    this.openarmValve = this.openarmValve.bind(this);
    this.closearmValve = this.closearmValve.bind(this);

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.openloxMainValve = this.openloxMainValve.bind(this);
    this.closeloxMainValve = this.closeloxMainValve.bind(this);

    this.openfuelMainValve = this.openfuelMainValve.bind(this);
    this.closefuelMainValve = this.closefuelMainValve.bind(this);

    this.activateLoxTankBottomHtr = this.activateLoxTankBottomHtr.bind(this);
    this.deactivateLoxTankBottomHtr = this.deactivateLoxTankBottomHtr.bind(this);

    this.activateLoxTankMidHtr = this.activateLoxTankMidHtr.bind(this);
    this.deactivateLoxTankMidHtr = this.deactivateLoxTankMidHtr.bind(this);

    this.activateLoxTankTopHtr = this.activateLoxTankTopHtr.bind(this);
    this.deactivateLoxTankTopHtr = this.deactivateLoxTankTopHtr.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);

    this.enableFastReadRate = this.enableFastReadRate.bind(this);
    this.disableFastReadRate = this.disableFastReadRate.bind(this);

    this.startRecording = this.startRecording.bind(this);
    this.eraseRecording = this.eraseRecording.bind(this);
    this.dumpRecording = this.dumpRecording.bind(this);
  }

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

  startRecording() { return this.sendPacket(153, []); }
  eraseRecording() { return this.sendPacket(154, []); }
  dumpRecording() { return this.sendPacket(155, []); }

}

module.exports = FlightV2;
