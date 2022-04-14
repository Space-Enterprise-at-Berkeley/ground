const Interpolation = require("./Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32 } = Interpolation
const { interpolateQuaternionString, interpolateCoordString } = Interpolation
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
  4: [
    ['qW', asFloat],
    ['qX', asFloat],
    ['qY', asFloat],
    ['qZ', asFloat],
    ['accelX', asFloat],
    ['accelY', asFloat],
    ['accelZ', asFloat],
  ],
  5: [
    ['baroAltitude', asFloat],
    ['baroPressure', asFloat],
    ['baroTemperature', asFloat],
  ],
  6: [
    ['gpsLatitude', asFloat],
    ['gpsLongitude', asFloat],
    ['gpsAltitude', asFloat],
    ['gpsSpeed', asFloat],
    ['validGpsFix', asUInt8],
    ['numGpsSats', asUInt8]
  ],

  39: [
    ['breakwire1', asFloat],
    ['breakwire2', asFloat],
  ],

  55: [
    ['vehicleMode', asUInt8],
  ],

  56: [
    ['radioRSSI', asFloat],
  ],

  158: [
    ['apogeeTime', asUInt32],
    ['mainChuteDeployTime', asUInt32],
  ],

  57: [
    ['gx', asFloat],
    ['gy', asFloat],
    ['gz', asFloat]
  ]
}

/** @type {Object.<Number,Array.<Number>>} */
const OUTBOUND_PACKET_DEFS = {
  // Windows enable port packet
  0: [UINT8],
  // [130..169] Sent to Flight Computer
  130: [UINT8],
  131: [UINT8],
  132: [UINT8],
  133: [UINT8],
  135: [UINT8],
  136: [UINT8],
  137: [UINT8],

  140: [UINT8],

  150: [],
  151: [],
  153: [], // dump flash data
  154: [], // start recording
  155: [], // erase
  157: [], // erase


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
