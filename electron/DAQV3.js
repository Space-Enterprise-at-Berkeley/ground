const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  1: {
    "*": {
      field: 'daq3-pressure{}'
    }
  },
  2: {
    0: {
      field: 'daq3-voltage'
    },
    1: {
      field: 'daq3-power'
    },
    2: {
      field: 'daq3-currentDraw'
    }
  },
  3: {
    0: {
      field: 'daq3-loadCell0'
    },
    1: {
      field: 'daq3-loadCell1'
    },
    2: {
      field: 'daq3-loadCellSum'
    },
    3: {
      field: 'daq3-loadCell3'
    }
  },
  4: {
    0: {
      field: 'daq3-tcVal0'
    },
    1: {
      field: 'daq3-tcVal1'
    },
    2: {
      field: 'daq3-tcVal2'
    },
    3: {
      field: 'daq3-tcVal3'
    }
  },

  5: {
    0: {
      field: 'daq3-numPacketSent',
      interpolation: null
    }
  },

  6: {
    0: {
      field: 'daq3-5v_A_Voltage',
      interpolation: null
    },
    1: {
      field: 'daq3-5v_A_Current',
      interpolation: null
    },
    2: {
      field: 'daq3-5v_Voltage',
      interpolation: null
    },
    3: {
      field: 'daq3-5v_Current',
      interpolation: null
    }
  },

  8: {
    0: {
      field: 'daq3-fuel-capVal',
      interpolation: null
    },
    1: {
      field: 'daq3-fuel-frequency',
      interpolation: null
    },
    2: {
      field: 'daq3-lox-capVal',
      interpolation: null
    },
    3: {
      field: 'daq3-lox-frequency',
      interpolation: null
    }

  },

  19: {
    "*": {
      field: 'daq3-tempSensor{}',
      interpolation: null
    }
  }
};

class DAQV3 extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, packets, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = DAQV3;
