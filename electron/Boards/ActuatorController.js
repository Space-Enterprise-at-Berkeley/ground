const Board = require('../Board');

class ActuatorController extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);


    this.open12vCh0 = this.open12vCh0.bind(this);
    this.close12vCh0 = this.close12vCh0.bind(this);

    this.open12vCh1 = this.open12vCh1.bind(this);
    this.close12vCh1 = this.close12vCh1.bind(this);

    this.open24vCh0 = this.open24vCh0.bind(this);
    this.close24vCh0 = this.close24vCh0.bind(this);

    this.open24vCh1 = this.open24vCh1.bind(this);
    this.close24vCh1 = this.close24vCh1.bind(this);

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

    this.beginERegFlow = this.beginERegFlow.bind(this);

    this.setLOXERegEncoder = this.setLOXERegEncoder.bind(this);
    this.setFuelERegEncoder = this.setFuelERegEncoder.bind(this);

    this.pressERegFuelStatic = this.pressERegFuelStatic.bind(this);
    this.pressERegLOXStatic = this.pressERegLOXStatic.bind(this);

    this.zeroERegFuelEncoder = this.zeroERegFuelEncoder.bind(this);
    this.zeroERegLOXEncoder = this.zeroERegLOXEncoder.bind(this);

    this.actuateFuelERegMainValve = this.actuateFuelERegMainValve.bind(this);
    this.actuateLOXERegMainValve = this.actuateLOXERegMainValve.bind(this);


    this.abortFlow = this.abortFlow.bind(this);
  }


  open12vCh0() { return this.sendPacket(180, [1]); }
  close12vCh0() { return this.sendPacket(180, [0]); }

  open12vCh1() { return this.sendPacket(181, [1]); }
  close12vCh1() { return this.sendPacket(181, [0]); }

  open24vCh0() { return this.sendPacket(19, [1]); }
  close24vCh0() { return this.sendPacket(19, [0]); }

  open24vCh1() { return this.sendPacket(20, [1]); }
  close24vCh1() { return this.sendPacket(20, [0]); }


  openActCh0() { return this.sendPacket(10, [0, 0.0]); }
  closeActCh0() { return this.sendPacket(10, [1, 0.0]); }
  actCh0ms(time) { return this.sendPacket(10, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh1() { return this.sendPacket(11, [0, 0.0]); }
  closeActCh1() { return this.sendPacket(11, [1, 0.0]); }
  actCh1ms(time) { return this.sendPacket(11, [(time > 0) ? 2 : 3, Math.abs(time)]); }
  
  openActCh2() { return this.sendPacket(12, [0, 0.0]); }
  closeActCh2() { return this.sendPacket(12, [1, 0.0]); }
  actCh2ms(time) { return this.sendPacket(12, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh3() { return this.sendPacket(13, [0, 0.0]); }
  closeActCh3() { return this.sendPacket(13, [1, 0.0]); }
  actCh3ms(time) { return this.sendPacket(13, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh4() { return this.sendPacket(14, [0, 0.0]); }
  closeActCh4() { return this.sendPacket(14, [1, 0.0]); }
  actCh4ms(time) { return this.sendPacket(14, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh5() { return this.sendPacket(15, [0, 0.0]); }
  closeActCh5() { return this.sendPacket(15, [1, 0.0]); }
  actCh5ms(time) { return this.sendPacket(15, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  openActCh6() { return this.sendPacket(16, [0, 0.0]); }
  closeActCh6() { return this.sendPacket(16, [1, 0.0]); }
  actCh6ms(time) { return this.sendPacket(16, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  beginERegFlow() {return this.sendPacket(9, []);}

  setFuelERegEncoder(value) {
    if ((value <= 600) && (value > 0)) {
      return this.sendPacket(4, [0, value]);
    } else if (value == 0) {
      return this.sendPacket(21, [0]);
    } else {
      console.log("fuel encoder set value out of bound");
    }
  }
  setLOXERegEncoder(value) {
    if ((value <= 600) && (value > 0)) {
      return this.sendPacket(4, [1, value]);
    } else if (value == 0) {
      return this.sendPacket(21, [1]);
    } else {
      console.log("lox encoder set value out of bound");
    }
  }

  pressERegFuelStatic() {return this.sendPacket(7, [0]);}
  pressERegLOXStatic() {return this.sendPacket(7, [1]);}

  zeroERegFuelEncoder() {return this.sendPacket(8, [0]);}
  zeroERegLOXEncoder() {return this.sendPacket(8, [1]);}

  actuateFuelERegMainValve(value) {
    if (0 <= value <= 1) {
      return this.sendPacket(5, [0, value])
    } else {
      console.log("what easrr")
    }
  } 

  actuateLOXERegMainValve(value) {
    if (0 <= value <= 1) {
      return this.sendPacket(5, [1, value])
    } else {
      console.log("what erwere")
    }
  }

  abortFlow() {return this.sendPacket(201, []);}

}

module.exports = ActuatorController;
