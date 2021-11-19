const Interpolation = require('./Interpolation');
const Board = require('./Board');
const Packet = require('./Packet');

const packets = {
  0: {
    0: {
      field: 'loxTankPTTemp',
      interpolation: null
    },
    1: {
      field: 'loxTankPTHeater',
      interpolation: null
    },
    2: {
      field: 'loxTankPTHeaterCurrent',
      interpolation: null
    },
    3: {
      field: 'loxTankPTHeaterVoltage',
      interpolation: null
    },
    4: {
      field: 'loxTankPTHeaterOvercurrentFlag',
      interpolation: Interpolation.interpolateErrorFlags
    }
  },
  1: {
    0: {
      field: 'loxTankPT',
      interpolation: null
    },
    1: {
      field: 'fuelTankPT',
      interpolation: null
    },
    2: {
      field: 'loxInjectorPT',
      interpolation: null
    },
    3: {
      field: 'fuelInjectorPT',
      interpolation: null
    },
    4: {
      field: 'pressurantPT',
      interpolation: (val, timestamp) => Interpolation.interpolateRateOfChange(val, timestamp, 'dPressurantPT'),
    },
    5: {
      field: 'loxDomePT',
      interpolation: null
    },
    6: {
      field: 'fuelDomePT',
      interpolation: null
    },
  },
  2: {
    0: {
      field: 'flightVoltage',
      interpolation: null
    },
    1: {
      field: 'flightPower',
      interpolation: null
    },
    2: {
      field: 'flightCurrent',
      interpolation: null
    },
  },
  4: {
    0: {
      field: 'fuelTankMidTC',
      interpolation: null
    },
    1: {
      field: 'loxTankBottomTC',
      interpolation: null
    },
    2: {
      field: 'fuelTankTopTC',
      interpolation: null
    },
    3: {
      field: 'fuelTankBottomTC',
      interpolation: null
    },
  },
  16: {
    0: {
      field: 'fuelTankPTTemp',
      interpolation: null
    },
    1: {
      field: 'fuelTankPTHeater',
      interpolation: null
    },
    2: {
      field: 'fuelTankPTHeaterCurrent',
      interpolation: null
    },
    3: {
      field: 'fuelTankPTHeaterVoltage',
      interpolation: null
    },
    4: {
      field: 'fuelTankPTHeaterOvercurrentFlag',
      interpolation: Interpolation.interpolateErrorFlags
    },
  },
  17: {
    0: {
      field: 'loxExpectedStatic',
      interpolation: null
    },
    1: {
      field: 'fuelExpectedStatic',
      interpolation: null
    },
  },
  18: {
    0: {
      field: 'flowType',
      interpolation: null
    },
    1: {
      field: 'flowState',
      interpolation: null
    },
  },
  19: {
    0: {
      field: 'loxInjectorPTTemp',
      interpolation: null
    },
    1: {
      field: 'loxInjectorPTHeater',
      interpolation: null
    },
    2: {
      field: 'loxInjectorPTHeaterCurrent',
      interpolation: null
    },
    3: {
      field: 'loxInjectorPTHeaterVoltage',
      interpolation: null
    },
    4: {
      field: 'loxInjectorPTHeaterOvercurrentFlag',
      interpolation: Interpolation.interpolateErrorFlags
    },
  },
  20: {
    0: {
      field: 'armValve',
      interpolation: null
    },
    1: {
      field: 'igniter',
      interpolation: null
    },
    2: {
      field: 'loxMainValve',
      interpolation: null
    },
    3: {
      field: 'fuelMainValve',
      interpolation: null
    },
    4: {
      field: 'breakwire',
      interpolation: null
    },
    5: {
      field: 'led2',
      interpolation: null
    },
    6: {
      field: 'HPS',
      interpolation: null
    },
    7: {
      field: 'HPSEnable',
      interpolation: null
    },
  },
  21: {
    0: {
      field: 'armValveCurrent',
      interpolation: null
    },
    1: {
      field: 'igniterCurrent',
      interpolation: null
    },
    2: {
      field: 'loxMainValveCurrent',
      interpolation: null
    },
    3: {
      field: 'fuelMainValveCurrent',
      interpolation: null
    },
    4: {
      field: 'breakwireCurrent',
      interpolation: null
    },
    5: {
      field: 'led2Current',
      interpolation: null
    },
    6: {
      field: 'HPSCurrent',
      interpolation: null
    },
    7: {
      field: 'overcurrentTriggeredSols',
      interpolation: Interpolation.interpolateSolenoidErrors
    },
  },
  22: {
    0: {
      field: 'armValveVoltage',
      interpolation: null
    },
    1: {
      field: 'igniterVoltage',
      interpolation: null
    },
    2: {
      field: 'loxMainValveVoltage',
      interpolation: null
    },
    3: {
      field: 'fuelMainValveVoltage',
      interpolation: null
    },
    4: {
      field: 'breakwireVoltage',
      interpolation: null
    },
    5: {
      field: 'led2Voltage',
      interpolation: null
    },
    6: {
      field: 'HPSVoltage',
      interpolation: null
    },
    7: {
      field: 'HPSSupplyVoltage',
      interpolation: null
    },
  },
  57: {
    0: {
      field: 'fcEvent',
      interpolation: Interpolation.interpolateCustomEvent
    }
  },
  58: {
    0: {
      field: 'fcEventEnable',
      interpolation: null
    }
  },
  60: {
    0: {
      field: 'fuelInjectorPTTemp',
      interpolation: null
    },
    1: {
      field: 'fuelInjectorPTHeater',
      interpolation: null
    },
    2: {
      field: 'fuelInjectorPTHeaterCurrent',
      interpolation: null
    },
    3: {
      field: 'fuelInjectorPTHeaterVoltage',
      interpolation: null
    },
    4: {
      field: 'fuelInjectorPTHeaterOvercurrentFlag',
      interpolation: Interpolation.interpolateErrorFlags
    },
  },
  65: {
    0: {
      field: 'thermocoupleReadEnable',
      interpolation: null
    }
  }
};

class FlightV2 extends Board {
  constructor(port, address, onConnect, onDisconnect, onRate) {
    super(port, address, packets, {}, onConnect, onDisconnect, onRate);

    this.openarmValve = this.openarmValve.bind(this);
    this.closearmValve = this.closearmValve.bind(this);

    this.openloxMainValve = this.openloxMainValve.bind(this);
    this.closeloxMainValve = this.closeloxMainValve.bind(this);

    this.openfuelMainValve = this.openfuelMainValve.bind(this);
    this.closefuelMainValve = this.closefuelMainValve.bind(this);

    // this.openLoxGems = this.openLoxGems.bind(this);
    // this.closeLoxGems = this.closeLoxGems.bind(this);

    // this.openPropGems = this.openPropGems.bind(this);
    // this.closePropGems = this.closePropGems.bind(this);

    this.enableHPS = this.enableHPS.bind(this);
    this.disableHPS = this.disableHPS.bind(this);
    this.openHPS = this.openHPS.bind(this);
    this.closeHPS = this.closeHPS.bind(this);

    this.enableThermocoupleRead = this.enableThermocoupleRead.bind(this)
    this.disableThermocoupleRead = this.disableThermocoupleRead.bind(this)

    this.activateIgniter = this.activateIgniter.bind(this);
    this.deactivateIgniter = this.deactivateIgniter.bind(this);

    this.beginFlow = this.beginFlow.bind(this);
    this.abort = this.abort.bind(this);


    this.setloxTankPTHeater = this.setloxTankPTHeater.bind(this);
    // this.setLoxGemsHeater = this.setLoxGemsHeater.bind(this);
    this.setloxInjectorPTHeater = this.setloxInjectorPTHeater.bind(this);

    this.setfuelTankPTHeater = this.setfuelTankPTHeater.bind(this);
    // this.setPropaneGemsHeater = this.setPropaneGemsHeater.bind(this);
    this.setfuelInjectorPTHeater = this.setfuelInjectorPTHeater.bind(this);

    this.endCheckout = this.endCheckout.bind(this);
    this.startCheckout = this.startCheckout.bind(this);

  }

  openarmValve() { return this.sendPacket(20, [1.0]); }
  closearmValve() { return this.sendPacket(20, [0.0]); }

  openloxMainValve() { return this.sendPacket(21, [1.0]); }
  closeloxMainValve() { return this.sendPacket(21, [0.0]); }

  openfuelMainValve() { return this.sendPacket(24, [1.0]); }
  closefuelMainValve() { return this.sendPacket(24, [0.0]); }

  // openLoxGems() { return this.sendPacket(22, [1.0]); }
  // closeLoxGems() { return this.sendPacket(22, [0.0]); }

  // openPropGems() { return this.sendPacket(25, [1.0]); }
  // closePropGems() { return this.sendPacket(25, [0.0]); }

  enableHPS() { return this.sendPacket(31, [1.0]); }
  disableHPS() { return this.sendPacket(31, [0.0]); }
  openHPS() { return this.sendPacket(26, [1.0]); }
  closeHPS() { return this.sendPacket(26, [0.0]); }

  beginFlow() { return this.sendPacket(29, [1.0]); } // 29 is old waterflow
  abort() { return this.sendPacket(29, [0.0]); } // 29 is old waterflow (should change to endFlow)

  activateIgniter() { return this.sendPacket(23, [1.0]); }
  deactivateIgniter() { return this.sendPacket(23, [0.0]); }

  enableThermocoupleRead() { return this.sendPacket(65, [1.0]); }
  disableThermocoupleRead() { return this.sendPacket(65, [0.0]); }


  setloxTankPTHeater(val) { return this.sendPacket(40, [val]); }
  // setLoxGemsHeater(val) { return this.sendPacket(41, [val]); }
  setloxInjectorPTHeater(val) { return this.sendPacket(44, [val]); }

  setfuelTankPTHeater(val) { return this.sendPacket(42, [val]); }
  // setPropaneGemsHeater(val) { return this.sendPacket(43, [val]); }
  setfuelInjectorPTHeater(val) { return this.sendPacket(45, [val]); }

  endCheckout() { return this.sendPacket(58, [1.0]); }
  startCheckout() { return this.sendPacket(58, [0.0]); }

}

module.exports = FlightV2;
