const Board = require('../Board');

class ERegDAQ extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);
  }
  openRBV0() { return this.sendPacket(251, [0, 0.0]); }
  closeRBV0() { return this.sendPacket(251, [1, 0.0]); }
  actRBV0(time) { return this.sendPacket(251, [(time > 0) ? 2 : 3, Math.abs(time)]); }
  
  openRBV1() { return this.sendPacket(252, [0, 0.0]); }
  closeRBV1() { return this.sendPacket(252, [1, 0.0]); }
  actRBV1(time) { return this.sendPacket(252, [(time > 0) ? 2 : 3, Math.abs(time)]); }
  
  openRBV2() { return this.sendPacket(253, [0, 0.0]); }
  closeRBV2() { return this.sendPacket(253, [1, 0.0]); }
  actRBV2(time) { return this.sendPacket(253, [(time > 0) ? 2 : 3, Math.abs(time)]); }
  

}

module.exports = ERegDAQ;
