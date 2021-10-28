const Interpolation = require("./Interpolation");
const sendMapping = {}

const receiveMapping = {
  flightComputer: {
    ipAddress: "10.0.0.42",
    packets: {
      0: {
        0: {
          field: 'loxTankPTTemp',
        },
        1: {
          field: 'loxTankPTHeater',
        },
        2: {
          field: 'loxTankPTHeaterCurrent',
        },
        3: {
          field: 'loxTankPTHeaterVoltage',
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
        // 4: {
        //   field: 'loxGems',
        //   interpolation: null
        // },
        // 5: {
        //   field: 'propGems',
        //   interpolation: null
        // },
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
        // 4: {
        //   field: 'loxGemsCurrent',
        //   interpolation: null
        // },
        // 5: {
        //   field: 'propGemsCurrent',
        //   interpolation: null
        // },
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
        // 4: {
        //   field: 'loxGemsVoltage',
        //   interpolation: null
        // },
        // 5: {
        //   field: 'propGemsVoltage',
        //   interpolation: null
        // },
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
    }
  },
  daq: {
    ipAddress: "10.0.0.12"
  },
  actuatorController1: {
    ipAddress: "10.0.0.21"
  },
  actuatorController2: {
    ipAddress: "10.0.0.22"
  },
  actuatorController3: {
    ipAddress: "10.0.0.23"
  }
}

const receiveFields = Object.fromEntries(
  Object.keys(receiveMapping)
    .map(board => Object.keys(receiveMapping[board].packets || {})
      .map(packet => Object.keys(receiveMapping[board].packets[packet])
        .map(idx => receiveMapping[board].packets[packet][idx].field)))
    .reduce((acc, cur) => [...acc, ...cur], [])
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map(field => [field, field])
)

module.exports = {
  receiveMapping,
  sendMapping,
  receiveFields
}
