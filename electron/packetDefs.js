const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES

/**
 * Interpolates the value to obtain an update object
 * @typedef {function(any): any|ExtendedUpdateObject} Interpolator
 */
/**
 * Parses the buffer at an offset to obtain a value
 * @typedef {function(Buffer,Number): [any, Number]} Parser
 */
/** @type {Object.<Number,Array.<[String,Parser,Interpolator|null]>|Array.<[String,Parser]>>} */
const INBOUND_PACKET_DEFS = {

  0: [
    ['firmwareCommitHash', asASCIIString],
  ],


// SENT BY FLIGHT COMPUTER

  3: [
    ['supply8Voltage', asFloat],
    ['supply8Current', asFloat],
    ['supply8Power', asFloat]
  ],


  // [4..6] Sensor breakouts, sent by Flight Computer

  // IMU
  4: [
    ['qW', asFloat],
    ['qX', asFloat],
    ['qY', asFloat],
    ['qZ', asFloat],
    ['accelX', asFloat],
    ['accelY', asFloat],
    ['accelZ', asFloat],
  ],

  // Barometer
  5: [
    ['baroAltitude', asFloat],
    ['baroPressure', asFloat],
    ['baroTemperature', asFloat],
  ],

  // GPS
  6: [
    ['gpsLatitude', asFloat],
    ['gpsLongitude', asFloat],
    ['gpsAltitude', asFloat],
    ['gpsSpeed', asFloat],
    ['validGpsFix', asUInt8],
    ['numGpsSats', asUInt8]
  ],


  10: [
    ['loxTankPT', asFloat],
    ['fuelTankPT', asFloat],
    ['loxInjectorPT', asFloat],
    ['fuelInjectorPT', asFloat],
    ['pressurantPT', asFloat],
    ['loxDomePT', asFloat],
    ['fuelDomePT', asFloat]
  ],

  11: [
    ['loxGemsVoltage', asFloat],
    ['loxGemsCurrent', asFloat],
  ],

  12: [
    ['fuelGemsVoltage', asFloat],
    ['fuelGemsCurrent', asFloat],
  ],

  13: [
    ['pressurantFlowRBVstate', asUInt8],
    ['pressurantFlowRBVvoltage', asFloat],
    ['pressurantFlowRBVcurrent', asFloat],
  ], 

  20: [
    ['engineTC0', asFloat],
  ],
  21: [
    ['engineTC1', asFloat],
  ],
  22: [
    ['engineTC2', asFloat],
  ],
  23: [
    ['engineTC3', asFloat],
  ],

  28: [
    // ['apogeeCheck', asUInt8],
    ['apogeeTime', asUInt32],
    ['apogeeAltitude', asFloat],
    // ['apogeesFound', asUInt8],
    // ['mainChuteDeployTime', asUInt32],
  ],

  29: [
    ['vehicleState', asUInt8],
  ],

  30: [
    ['storageUsed', asUInt32], 
    ['isRecording', asUInt8],
  ], 

  31: [
    ['loxGemsValveState', asUInt8],
  ],
  
  32: [
    ['fuelGemsValveState', asUInt8],
  ],

  34: [
    ['breakWire1Voltage', asFloat], 
    ['breakWire1Current', asFloat], // not used, we only care about continuity reading
  ], 

  35: [
    ['breakWire2Voltage', asFloat],
    ['breakWire2Current', asFloat], // not used, we only care about continuity reading
  ], 

  38: [
    ['loxCapVal', asFloat],
    ['loxCapValFiltered', asFloat],
    ['loxCapTemp', asFloat],
  ],

  39: [
    ['fuelCapVal', asFloat],
    ['fuelCapValFiltered', asFloat],
    ['fuelCapTemp', asFloat],
  ],

  40: [
    ['flightOCEvent', asUInt16]
  ],

  41: [
    ['autoVentStatus', asUInt8],
  ],


// SENT BY GROUND COMPUTER  

  42: [
    ['flightEnable', asUInt8],
  ],

  56: [
    ['loxDSideTC', asFloat], //dometc0
  ],

  57: [
    ['loxDTopTC', asFloat], //dometc1
  ],

  58: [
    ['fuelDTopTC', asFloat], //dometc2
  ],

  59: [
    ['fuelDSideTC', asFloat], //dometc3
  ],

  60: [
    ['armValveVoltage', asFloat],
    ['armValveCurrent', asFloat],
  ],
  61: [
    ['igniterVoltage', asFloat],
    ['igniterCurrent', asFloat],
  ],
  62: [
    ['loxMainValveVoltage', asFloat],
    ['loxMainValveCurrent', asFloat],
  ],
  63: [
    ['fuelMainValveVoltage', asFloat],
    ['fuelMainValveCurrent', asFloat],
  ],
  64: [
    ['breakwireVoltage', asFloat],
    ['breakwireCurrent', asFloat],
  ],

  65: [
    ['mainValveVentVoltage', asFloat],
    ['mainValveVentCurrent', asFloat],
  ],

  66: [
    ['RQDVoltage', asFloat],
    ['RQDCurrent', asFloat],
  ],

  67: [
    ['igniterEnableVoltage', asFloat],
    ['igniterEnableCurrent', asFloat],
  ],

  68: [
    ['mainValvePurgeVoltage', asFloat],
    ['mainValvePurgeCurrent', asFloat],
  ],

  70: [
    ['armValveState', asUInt8],
  ],
  71: [
    ['igniterState', asUInt8],
  ],
  72: [
    ['loxMainValveState', asUInt8],
  ],
  73: [
    ['fuelMainValveState', asUInt8],
  ],
  75: [
    ['mainValveVentState', asUInt8],
  ],
  76: [
    ['pressRQDState', asUInt8],
  ],
  77: [
    ['igniterEnableState', asUInt8],
  ],
  78: [
    ['mainValvePurgeState', asUInt8],
  ], 

  79: [
    ['actuatorStates', asUInt8],
  ],

  80: [
    ['flowState', asUInt8],
  ],

  81: [
    ['rqdPT', asFloat],
    ['purgePT', asFloat],
    ['mainValvePT', asFloat],
  ],



  152: [
    ['autoLoxLead', asUInt32fromustos],
    ['autoBurnTime', asUInt32fromustos],
    ['autoIgniterAbortEnabled', asUInt8],
    ['autoBreakwireAbortEnabled', asUInt8],
  ],


  // ACTUATOR CONTROLLER 1

  88: [
    ['acBattVoltage', asFloat],
    ['acBattCurrent', asFloat],
  ],
  89: [
    ['acSupply12Voltage', asFloat],
    ['acSupply12Current', asFloat],
  ],
  90: [
    ['acLinAct1State', asUInt8], //0
    ['acLinAct1Voltage', asFloat],
    ['acLinAct1Current', asFloat],
  ],
  91: [
    ['acLinAct2State', asUInt8], //1
    ['acLinAct2Voltage', asFloat],
    ['acLinAct2Current', asFloat],
  ],
  92: [
    ['acLinAct3State', asUInt8], //2
    ['acLinAct3Voltage', asFloat],
    ['acLinAct3Current', asFloat],
  ],
  93: [
    ['acLinAct4State', asUInt8], //3
    ['acLinAct4Voltage', asFloat],
    ['acLinAct4Current', asFloat],
  ],
  94: [
    ['acLinAct5State', asUInt8], //4
    ['acLinAct5Voltage', asFloat],
    ['acLinAct5Current', asFloat],
  ],
  95: [
    ['acLinAct6State', asUInt8],
    ['acLinAct6Voltage', asFloat],
    ['acLinAct6Current', asFloat],
  ],
  96: [
    ['acLinAct7State', asUInt8],
    ['acLinAct7Voltage', asFloat],
    ['acLinAct7Current', asFloat],
  ],

  100: [
    ['acHeater1Voltage', asFloat],
    ['acHeater1Current', asFloat],
  ],
  101: [
    ['acHeater2Voltage', asFloat],
    ['acHeater2Current', asFloat],
  ],
  102: [
    ['loxDomeHeaterVoltage', asFloat],
    ['loxDomeHeaterCurrent', asFloat],
  ],
  103: [
    ['fuelDomeHeaterVoltage', asFloat],
    ['fuelDomeHeaterCurrent', asFloat],
  ],
  104: [
    ['loxDomeHeaterState', asUInt8],
  ],
  105: [
    ['fuelDomeHeaterState', asUInt8],
  ],


  // DAQs

  110: [
    ['daqBattVoltage', asFloat],
    ['daqBattCurrent', asFloat],
  ],

  111: [
    ['daqADC0', asFloat],
    ['daqADC1', asFloat],
    ['daqADC2', asFloat],
    ['daqADC3', asFloat],
    ['daqADC4', asFloat],
    ['daqADC5', asFloat],
    ['daqADC6', asFloat],
    ['daqADC7', asFloat],
  ],

  112: [
    ['daqTC0', asFloat],
  ],
  113: [
    ['daqTC1', asFloat],
  ],
  114: [
    ['daqTC2', asFloat],
  ],
  115: [
    ['daqTC3', asFloat],
  ],

  116: [
    ['loadCell0', asFloat],
    ['loadCell1', asFloat],
    ['loadCell2', asFloat],
    ['loadCellSum', asFloat],
  ],

  153: [
    ['dataWritten', asUInt32],
  ]

}

/** @type {Object.<Number,Array.<Number>>} */
const OUTBOUND_PACKET_DEFS = {
  // Windows enable port packet
  0: [UINT8],

  // Sent to Flight Computer
  
  29: [UINT8], // Flight mode enable/disable  
  169: [UINT8, UINT32], // Press Flow RBV

  // Sent to Ground Computer

  42:  [UINT8], // Flight Enable
  126: [UINT8], // Lox gems
  127: [UINT8], // Fuel gems
  128: [UINT8], // Lox gems toggle
  129: [UINT8], // Fuel gems toggle
  130: [UINT8], // Arm valve
  131: [UINT8], // Igniter
  132: [UINT8], // Lox main valve
  133: [UINT8], // Fuel main valve
  135: [UINT8], // Press RQD
  136: [UINT8], // Main valve vent
  137: [UINT8], // Enable igniter relay

  // 140: [UINT8], // Formerly Fast Read Rate, now deprecated

  150: [], // Begin Flow
  151: [], // Abort Flow
  152: [], // Automation settings

  153: [UINT8], // erase black box

  // Sent to Actuator Controller

  170: [UINT8, UINT32],
  171: [UINT8, UINT32],
  172: [UINT8, UINT32],
  173: [UINT8, UINT32],
  174: [UINT8, UINT32],
  175: [UINT8, UINT32],
  176: [UINT8, UINT32],
  180: [UINT8],
  181: [UINT8],
  182: [UINT8],
  183: [UINT8],
}

module.exports = { INBOUND_PACKET_DEFS, OUTBOUND_PACKET_DEFS }
