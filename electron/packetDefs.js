const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32 } = Interpolation
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
  // [1..59] Sent by Flight Computer
  0: [
    ['firmwareCommitHash', asASCIIString],
  ],
  1: [
    ['flightBattVoltage', asFloat],
    ['flightBattCurrent', asFloat],
    ['flightBattPower', asFloat]
  ],
  2: [
    ['flightSupply12Voltage', asFloat],
    ['flightSupply12Current', asFloat],
    ['flightSupply12Power', asFloat]
  ],
  3: [
    ['flightSupply8Voltage', asFloat],
    ['flightSupply8Current', asFloat],
    ['flightSupply8Power', asFloat]
  ],
  9: [
    ['pressurantPTROC', asFloat],
  ],
  // [10..59] Sent by Flight Computer
  10: [
    ['loxTankPT', asFloat],
    ['fuelTankPT', asFloat],
    ['loxInjectorPT', asFloat],
    ['fuelInjectorPT', asFloat],
    ['pressurantPT', asFloat],
    ['loxDomePT', asFloat],
    ['fuelDomePT', asFloat]
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
    ['loxGemsVoltage', asFloat],
    ['loxGemsCurrent', asFloat],
  ],
  29: [
    ['fuelGemsVoltage', asFloat],
    ['fuelGemsCurrent', asFloat],
  ],
  30: [
    ['armValveVoltage', asFloat],
    ['armValveCurrent', asFloat],
  ],
  31: [
    ['igniterVoltage', asFloat],
    ['igniterCurrent', asFloat],
  ],
  32: [
    ['loxMainValveVoltage', asFloat],
    ['loxMainValveCurrent', asFloat],
  ],
  33: [
    ['fuelMainValveVoltage', asFloat],
    ['fuelMainValveCurrent', asFloat],
  ],
  34: [
    ['breakwireVoltage', asFloat],
    ['breakwireCurrent', asFloat],
  ],

  35: [
    ['loxTankBottomHtrVoltage', asFloat],
    ['loxTankBottomHtrCurrent', asFloat],
  ],
  36: [
    ['loxTankMidHtrVoltage', asFloat],
    ['loxTankMidHtrCurrent', asFloat],
  ],
  37: [
    ['loxTankTopHtrVoltage', asFloat],
    ['loxTankTopHtrCurrent', asFloat],
  ],
  38: [
    ['igniterEnableVoltage', asFloat],
    ['igniterEnableCurrent', asFloat],
  ],

  40: [
    ['armValveState', asUInt8],
  ],
  41: [
    ['igniterState', asUInt8],
  ],
  42: [
    ['loxMainValveState', asUInt8],
  ],
  43: [
    ['fuelMainValveState', asUInt8],
  ],
  45: [
    ['loxTankBottomHtrState', asUInt8],
  ],
  46: [
    ['loxTankMidHtrState', asUInt8],
  ],
  47: [
    ['loxTankTopHtrState', asUInt8],
  ],
  48: [
    ['igniterEnableState', asUInt8],
  ],

  49: [
    ['actuatorStates', asUInt8],
  ],

  50: [
    ['flowState', asUInt8],
  ],
  51: [
    ['autoVentStatus', asUInt8],
  ],
  52: [
    ['loxGemsValveState', asUInt8],
  ],
  53: [
    ['fuelGemsValveState', asUInt8],
  ],

  152: [
    ['autoLoxLead', asUInt32],
    ['autoBurnTime', asUInt32],
    ['autoIgniterAbortEnabled', asUInt8],
    ['autoBreakwireAbortEnabled', asUInt8],
    ['autoThrustAbortEnabled', asUInt8],
  ],

  // [60:89] ACTUATOR CONTROLLERS
  61: [
    ['acBattVoltage', asFloat],
    ['acBattCurrent', asFloat],
  ],
  62: [
    ['acSupply12Voltage', asFloat],
    ['acSupply12Current', asFloat],
  ],
  70: [
    ['acLinAct1State', asUInt8],
    ['acLinAct1Voltage', asFloat],
    ['acLinAct1Current', asFloat],
  ],
  71: [
    ['acLinAct2State', asUInt8],
    ['acLinAct2Voltage', asFloat],
    ['acLinAct2Current', asFloat],
  ],
  72: [
    ['acLinAct3State', asUInt8],
    ['acLinAct3Voltage', asFloat],
    ['acLinAct3Current', asFloat],
  ],
  73: [
    ['acLinAct4State', asUInt8],
    ['acLinAct4Voltage', asFloat],
    ['acLinAct4Current', asFloat],
  ],
  74: [
    ['acLinAct5State', asUInt8],
    ['acLinAct5Voltage', asFloat],
    ['acLinAct5Current', asFloat],
  ],
  75: [
    ['acLinAct6State', asUInt8],
    ['acLinAct6Voltage', asFloat],
    ['acLinAct6Current', asFloat],
  ],
  76: [
    ['acLinAct7State', asUInt8],
    ['acLinAct7Voltage', asFloat],
    ['acLinAct7Current', asFloat],
  ],

  80: [
    ['acHeater1Voltage', asFloat],
    ['acHeater1Current', asFloat],
  ],
  81: [
    ['acHeater2Voltage', asFloat],
    ['acHeater2Current', asFloat],
  ],
  82: [
    ['acHeater3Voltage', asFloat],
    ['acHeater3Current', asFloat],
  ],
  83: [
    ['acHeater4Voltage', asFloat],
    ['acHeater4Current', asFloat],
  ],

  // [100:129] DAQs
  100: [
    ['daqBattVoltage', asFloat],
    ['daqBattCurrent', asFloat],
  ],

  101: [
    ['daqADC0', asFloat],
    ['daqADC1', asFloat],
    ['daqADC2', asFloat],
    ['daqADC3', asFloat],
    ['daqADC4', asFloat],
    ['daqADC5', asFloat],
    ['daqADC6', asFloat],
    ['daqADC7', asFloat],
  ],

  110: [
    ['daqTC1', asFloat],
  ],
  111: [
    ['daqTC2', asFloat],
  ],
  112: [
    ['daqTC3', asFloat],
  ],
  113: [
    ['daqTC4', asFloat],
  ],

  120: [
    ['loadCell1', asFloat],
    ['loadCell2', asFloat],
    ['loadCellSum', asFloat],
  ],
  121: [
    ['fastLoadCell1', asFloat],
    ['fastLoadCell2', asFloat],
    // ['fastLoadCellSum', asFloat],
  ],
  221: [
    ['capVal', asFloat],
    ['capValFiltered', asFloat],
    ['capTemperature', asFloat],
  ],
  222: [
    ['capVal', asFloat],
    ['capValFiltered', asFloat],
    ['capTemperature', asFloat],
  ],
}

/** @type {Object.<Number,Array.<Number>>} */
const OUTBOUND_PACKET_DEFS = {
  // Windows enable port packet
  0: [UINT8],
  // [130..169] Sent to Flight Computer
  126: [UINT8], // Lox gems
  127: [UINT8], // Fuel gems
  128: [UINT8], // Lox gems toggle
  129: [UINT8], // Fuel gems toggle
  130: [UINT8],
  131: [UINT8],
  132: [UINT8],
  133: [UINT8],
  135: [UINT8],
  136: [UINT8],
  137: [UINT8],
  138: [UINT8],

  140: [UINT8],

  150: [],
  151: [],
  152: [],

  // [170..199] Sent to Actuator Controller
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
