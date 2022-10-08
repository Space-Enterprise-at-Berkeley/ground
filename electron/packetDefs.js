const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asFlowState, asAutoVentTriggered, asLCAbortTriggered, asTCAbortTriggered, asNegativeLoadCell, asDiagnosticMessage} = Interpolation
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
  // 0: [
  //   ['firmwareCommitHash', asASCIIString],
  // ],
  // 1: [
  //   ['flightBattVoltage', asFloat],
  //   ['flightBattCurrent', asFloat],
  //   ['flightBattPower', asFloat]
  // ],
  // 2: [
  //   ['flightSupply12Voltage', asFloat],
  //   ['flightSupply12Current', asFloat],
  //   ['flightSupply12Power', asFloat]
  // ],
  // 3: [
  //   ['flightSupply8Voltage', asFloat],
  //   ['flightSupply8Current', asFloat],
  //   ['flightSupply8Power', asFloat]
  // ],
  // 9: [
  //   ['pressurantPTROC', asFloat],
  // ],
  // // [10..59] Sent by Flight Computer
  // 10: [
  //   ['loxTankPT', asFloat],
  //   ['fuelTankPT', asFloat],
  //   ['loxInjectorPT', asFloat],
  //   ['fuelInjectorPT', asFloat],
  //   ['pressurantPT', asFloat],
  //   ['loxDomePT', asFloat],
  //   ['fuelDomePT', asFloat]
  // ],

  // 20: [
  //   ['engineTop1TC', asFloat],
  // ],
  // 21: [
  //   ['engineTop2TC', asFloat],
  // ],
  // 22: [
  //   ['engineBottom1TC', asFloat],
  // ],
  // 23: [
  //   ['engineBottom2TC', asFloat],
  // ],

  // 28: [
  //   ['loxGemsVoltage', asFloat],
  //   ['loxGemsCurrent', asFloat],
  // ],
  // 29: [
  //   ['fuelGemsVoltage', asFloat],
  //   ['fuelGemsCurrent', asFloat],
  // ],
  // 30: [
  //   ['armValveVoltage', asFloat],
  //   ['armValveCurrent', asFloat],
  // ],
  // 31: [
  //   ['igniterVoltage', asFloat],
  //   ['igniterCurrent', asFloat],
  // ],
  // 32: [
  //   ['loxMainValveVoltage', asFloat],
  //   ['loxMainValveCurrent', asFloat],
  // ],
  // 33: [
  //   ['fuelMainValveVoltage', asFloat],
  //   ['fuelMainValveCurrent', asFloat],
  // ],
  // 34: [
  //   ['breakwireVoltage', asFloat],
  //   ['breakwireCurrent', asFloat],
  // ],

  // 35: [
  //   ['RQDVoltage', asFloat],
  //   ['RQDCurrent', asFloat],
  // ],
  // 36: [
  //   ['mainValveVentVoltage', asFloat],
  //   ['mainValveVentCurrent', asFloat],
  // ],
  // 37: [
  //   ['loxTankTopHtrVoltage', asFloat],
  //   ['loxTankTopHtrCurrent', asFloat],
  // ],
  // 38: [
  //   ['igniterEnableVoltage', asFloat],
  //   ['igniterEnableCurrent', asFloat],
  // ],

  // 40: [
  //   ['armValveState', asUInt8],
  // ],
  // 41: [
  //   ['igniterState', asUInt8],
  // ],
  // 42: [
  //   ['loxMainValveState', asUInt8],
  // ],
  // 43: [
  //   ['fuelMainValveState', asUInt8],
  // ],
  // 45: [
  //   ['RQDState', asUInt8],
  // ],
  // 46: [
  //   ['mainValveVentState', asUInt8],
  // ],
  // 47: [
  //   ['loxTankTopHtrState', asUInt8],
  // ],
  // 48: [
  //   ['igniterEnableState', asUInt8],
  // ],

  // 49: [
  //   ['actuatorStates', asUInt8],
  // ],

  // 50: [
  //   ['flowState', asUInt8],
  // ],
  // 51: [
  //   ['autoVentStatus', asUInt8],
  // ],
  // 52: [
  //   ['loxGemsValveState', asUInt8],
  // ],
  // 53: [
  //   ['fuelGemsValveState', asUInt8],
  // ],

  // 152: [
  //   ['autoLoxLead', asUInt32],
  //   ['autoBurnTime', asUInt32],
  //   ['autoIgniterAbortEnabled', asUInt8],
  //   ['autoBreakwireAbortEnabled', asUInt8],
  //   ['autoThrustAbortEnabled', asUInt8],
  // ],

  // [60:89] ACTUATOR CONTROLLERS



  1: [ // telemetry
    ['EREG_HP_PT', asFloat],
    ['EREG_LP_PT', asFloat],

    ['EREG_ENCODER_ANGLE', asFloat],
    ['EREG_ANGLE_SETPOINT', asFloat],
    ['EREG_PRESSURE_SETPOINT', asFloat],
    ['EREG_MOTOR_POWER', asFloat],
    ['EREG_PRESSURE_CONTROL_P', asFloat],
    ['EREG_PRESSURE_CONTROL_I', asFloat],
    ['EREG_PRESSURE_CONTROL_D', asFloat],

  ],
  

  2: [ // config
    ['EREG_CONFIG_PRESSURE_SETPOINT', asFloat],
    ['EREG_KP_OUTER', asFloat],
    ['EREG_KL_OUTER', asFloat],
    ['EREG_KD_OUTER', asFloat],
    ['EREG_KP_INNER', asFloat],
    ['EREG_KL_INNER', asFloat],
    ['EREG_KD_INNER', asFloat],
    ['EREG_FLOW_DURATION', asFloat],
  ],
  
  3: [ // diagnostic
    ['EREG_DIAGNOSTIC_MESSAGE', asDiagnosticMessage],
  ],

  4: [ //command  fail
    ['EREG_ERROR_CODE', asUInt8],
  ],

  5: [ // flow state
    ['EREG_STATE', asUInt8],
  ],


  12: [ 
    ['fuelDiagnosticMsg', asASCIIString],
  ],

  13: [ 
    ['loxDiagnosticMsg', asASCIIString],
  ],

  14: [ //command fail msg
    ['fuelCommandFailMsg', asASCIIString],
  ],

  15: [
    ['loxCommandFailMsg', asASCIIString],
  ],

  50: [
    ['flowState', asFlowState],
  ],
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

  77: [
    ['acHeater1Voltage', asFloat], //inbound 12V channel 0
    ['acHeater1Current', asFloat],
  ],
  78: [
    ['acHeater2Voltage', asFloat], //inbound 12V channel 1
    ['acHeater2Current', asFloat],
  ],
  79: [
    ['acHeater3Voltage', asFloat], //inbound 24V channel 0
    ['acHeater3Current', asFloat],
  ],
  80: [
    ['acHeater4Voltage', asFloat], //inbound 24V channel 1
    ['acHeater4Current', asFloat],
  ],

  120: [
    ['LC1', asFloat],
    ['LC2', asFloat],
    ['LCsum', asFloat],
  ],

  110: [
    ['TC0', asFloat],
  ],
  111: [
    ['TC1', asFloat],
  ],
  112: [
    ['TC2', asFloat],
  ],
  113: [
    ['TC3', asFloat],
  ],
  114: [
    ['TC4', asFloat],
  ],
  221: [
    ['loxCapFill', asFloat],
  ],


  51: [
    ['autoVentTriggered', asAutoVentTriggered],
  ],

  30: [
    ['tcAbortTriggered', asTCAbortTriggered],
  ],

  31: [
    ['lcAbortTriggered', asLCAbortTriggered],
  ],


  // // [100:129] DAQs
  // 100: [
  //   ['daqBattVoltage', asFloat],
  //   ['daqBattCurrent', asFloat],
  // ],

  // 101: [
  //   ['daqADC0', asFloat],
  //   ['daqADC1', asFloat],
  //   ['daqADC2', asFloat],
  //   ['daqADC3', asFloat],
  //   ['daqADC4', asFloat],
  //   ['daqADC5', asFloat],
  //   ['daqADC6', asFloat],
  //   ['daqADC7', asFloat],
  // ],

  // 121: [
  //   ['fastLoadCell1', asFloat],
  //   ['fastLoadCell2', asFloat],
  //   // ['fastLoadCellSum', asFloat],
  // ],
  221: [
    ['capVal', asFloat],
    ['capValFiltered', asFloat],
    ['capTemperature', asFloat],
  ],
  // 222: [
  //   ['capVal', asFloat],
  //   ['capValFiltered', asFloat],
  //   ['capTemperature', asFloat],
  // ],

  301: [  // thermocouples
    ['EREGDAQ_TC1', asFloat],
    ['EREGDAQ_TC2', asFloat],
    ['EREGDAQ_TC3', asFloat],
    ['EREGDAQ_TC4', asFloat],
  ],
  302: [ // Load Cells
    ['EREGDAQ_LC1', asFloat],
    ['EREGDAQ_LC2', asFloat],
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

  // EReg packets
  1: [UINT8], //begin one sided flow -> [fuel ereg ? 1 : 0]
  2: [], //start flow
  3: [], //abort
  4: [UINT8, FLOAT], // set encoder to value; [fuel ereg ? 1 : 0, encoderValue]
  5: [UINT8, UINT8], //open main valve
  6: [UINT8, UINT8], //close main valve
  7: [UINT8], //static press -> [fuel ereg ? 1 : 0]
  8: [UINT8], //Zero encoder; [fuel ereg ? 1 : 0]
  9: [UINT8], //Run diagnostic; [fuel ereg ? 1 : 0]



  //AC RBV & 24/12V packets
  10: [UINT8, UINT32],
  11: [UINT8, UINT32],
  12: [UINT8, UINT32],
  13: [UINT8, UINT32],
  14: [UINT8, UINT32],
  15: [UINT8, UINT32],
  16: [UINT8, UINT32],
  // 17: [UINT8, UINT32],



  19: [UINT8],
  20: [UINT8],
  21: [UINT8],

  // EReg Outbound from dashboard
  200: [],
  201: [],
  202: [FLOAT],
  203: [],
  204: [],
  205: [],
  206: [UINT8],

  // EReg outbound from dashboard
  251: [UINT8, UINT32],
  252: [UINT8, UINT32],
  253: [UINT8, UINT32],

}

module.exports = { INBOUND_PACKET_DEFS, OUTBOUND_PACKET_DEFS }
