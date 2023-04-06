const Board = require('../Board');

class FlightV3 extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {

    super(port, address, mapping, onConnect, onDisconnect, onRate);

    this.openloxGemsValve = this.openloxGemsValve.bind(this);
    this.closeloxGemsValve = this.closeloxGemsValve.bind(this);

    this.openfuelGemsValve = this.openfuelGemsValve.bind(this);
    this.closefuelGemsValve = this.closefuelGemsValve.bind(this);

    this.startToggleLoxGemsValve = this.startToggleLoxGemsValve.bind(this);
    this.stopToggleLoxGemsValve = this.stopToggleLoxGemsValve.bind(this);

    this.startToggleFuelGemsValve = this.startToggleFuelGemsValve.bind(this);
    this.stopToggleFuelGemsValve = this.stopToggleFuelGemsValve.bind(this);

    this.openPressFlowRBV = this.openPressFlowRBV.bind(this);
    this.closePressFlowRBV = this.closePressFlowRBV.bind(this);
    this.pressFlowRBVms = this.pressFlowRBVms.bind(this);

    this.enableFlightMode = this.enableFlightMode.bind(this);
    this.disableFlightMode = this.disableFlightMode.bind(this);

    // this.enableFastReadRate = this.enableFastReadRate.bind(this);
    // this.disableFastReadRate = this.disableFastReadRate.bind(this);
  }

  openloxGemsValve() { return this.sendPacket(126, [1]); }
  closeloxGemsValve() { return this.sendPacket(126, [0]); }

  openfuelGemsValve() { return this.sendPacket(127, [1]); }
  closefuelGemsValve() { return this.sendPacket(127, [0]); }

  startToggleLoxGemsValve() { return this.sendPacket(128, [1]); }
  stopToggleLoxGemsValve() { return this.sendPacket(128, [0]); }

  startToggleFuelGemsValve() { return this.sendPacket(129, [1]); }
  stopToggleFuelGemsValve() { return this.sendPacket(129, [0]); }

  openPressFlowRBV() { return this.sendPacket(169, [0, 0.0]); }
  closePressFlowRBV() { return this.sendPacket(169, [1, 0.0]); }
  pressFlowRBVms(time) { return this.sendPacket(169, [(time > 0) ? 2 : 3, Math.abs(time)]); }

  // enableFastReadRate() { return this.sendPacket(140, [1]); }
  // disableFastReadRate() { return this.sendPacket(140, [0]); }

  enableFlightMode() { return this.sendPacket(29, [1]); }
  disableFlightMode() { return this.sendPacket(29, [0]); }
}

module.exports = FlightV3;
