const Board = require('../Board');

class ActuatorController extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);

    this.open12vCh0 = this.open12vCh0.bind(this);
    this.close12vCh0 = this.close12vCh0.bind(this);

    this.open12vCh1 = this.open12vCh1.bind(this);
    this.close12vCh1 = this.close12vCh1.bind(this);

    this.openActCh0 = this.openActCh0.bind(this);
    this.closeActCh0 = this.closeActCh0.bind(this);
    this.actCh0ms = this.actCh0ms.bind(this);

    this.openActCh1 = this.openActCh1.bind(this);
    this.closeActCh1 = this.closeActCh1.bind(this);
    this.actCh1ms = this.actCh1ms.bind(this);

    this.openActCh2 = this.openActCh2.bind(this);
    this.closeActCh2 = this.closeActCh2.bind(this);
    this.actCh2ms = this.actCh2ms.bind(this);

    this.openActCh3 = this.openActCh3.bind(this);
    this.closeActCh3 = this.closeActCh3.bind(this);
    this.actCh3ms = this.actCh3ms.bind(this);

    this.openActCh4 = this.openActCh4.bind(this);
    this.closeActCh4 = this.closeActCh4.bind(this);
    this.actCh4ms = this.actCh4ms.bind(this);

    this.openActCh5 = this.openActCh5.bind(this);
    this.closeActCh5 = this.closeActCh5.bind(this);
    this.actCh5ms = this.actCh5ms.bind(this);

    this.openActCh6 = this.openActCh6.bind(this);
    this.closeActCh6 = this.closeActCh6.bind(this);
    this.actCh6ms = this.actCh6ms.bind(this);

    this.openLoxDomeHeater = this.openLoxDomeHeater.bind(this);
    this.closeLoxDomeHeater = this.closeLoxDomeHeater.bind(this);

    this.openFuelDomeHeater = this.openFuelDomeHeater.bind(this);
    this.closeFuelDomeHeater = this.closeFuelDomeHeater.bind(this);
  }

  open12vCh0() { return this.sendPacket(180, [1]); }
  close12vCh0() { return this.sendPacket(180, [0]); }

  open12vCh1() { return this.sendPacket(181, [1]); }
  close12vCh1() { return this.sendPacket(181, [0]); }

  openLoxDomeHeater() { return this.sendPacket(182, [1]); }
  closeLoxDomeHeater() { return this.sendPacket(182, [0]); }

  openFuelDomeHeater() { return this.sendPacket(183, [1]); }
  closeFuelDomeHeater() { return this.sendPacket(183, [0]); }

  openActCh0() { return this.sendPacket(170, [0, 0.0]); }
  closeActCh0() { return this.sendPacket(170, [1, 0.0]); }
  actCh0ms(time) { return this.sendPacket(170, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh1() { return this.sendPacket(171, [0, 0.0]); }
  closeActCh1() { return this.sendPacket(171, [1, 0.0]); }
  actCh1ms(time) { return this.sendPacket(171, [(time > 0) ? 2 : 3, Math.abs(time)]); }
  
  openActCh2() { return this.sendPacket(172, [0, 0.0]); }
  closeActCh2() { return this.sendPacket(172, [1, 0.0]); }
  actCh2ms(time) { return this.sendPacket(172, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh3() { return this.sendPacket(173, [0, 0.0]); }
  closeActCh3() { return this.sendPacket(173, [1, 0.0]); }
  actCh3ms(time) { return this.sendPacket(173, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh4() { return this.sendPacket(174, [0, 0.0]); }
  closeActCh4() { return this.sendPacket(174, [1, 0.0]); }
  actCh4ms(time) { return this.sendPacket(174, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh5() { return this.sendPacket(175, [0, 0.0]); }
  closeActCh5() { return this.sendPacket(175, [1, 0.0]); }
  actCh5ms(time) { return this.sendPacket(175, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh6() { return this.sendPacket(176, [0, 0.0]); }
  closeActCh6() { return this.sendPacket(176, [1, 0.0]); }
  actCh6ms(time) { return this.sendPacket(176, [(time > 0) ? 2 : 3, Math.abs(time)]); }

}

module.exports = ActuatorController;
