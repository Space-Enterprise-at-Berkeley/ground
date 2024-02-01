const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class FlightV4 extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    this.inboundPacketDefs = {
      // Firmware Status
      0: [
        ["firmwareCommitHash", asASCIIString]
      ],
      
      //24v Supply
      1: [
        ["flightSupply8Voltage", asFloat],
        ["flightSupply8Current", asFloat],
        ["flightsSupply8Power", asFloat]
      ],

      // IMU Telemetry
      2: [
        ["accelX", asFloat],
        ["accelY", asFloat],
        ["accelZ", asFloat],
        ["gyroX", asFloat],
        ["gyroY", asFloat],
        ["gyroZ", asFloat],
        ["accelX2", asFloat],
        ["accelY2", asFloat],
        ["accelZ2", asFloat]
      ],

      // Barometer Telemetry
      3: [
        ["baro1Altitude", asFloat],
        ["baro1Temperature", asFloat],
        ["baro1Pressure", asFloat],
        ["baro2Altitude", asFloat],
        ["baro2Temperature", asFloat],
        ["baro2Pressure", asFloat]
      ],

    // GPS Telemetry
      4: [
        ["gpsAltitude", asFloat],
        ["gpsLatitude", asFloat],
        ["gpsLongitude", asFloat],
        ["gpsDownVel", asFloat],
        ["gpsHeading", asFloat],
        ["gpsGroundSpeed", asFloat],
        ["numGpsSats", asUInt8]
      ],

      // Actuator States
      5: [
        ["actuatorState0", asUInt8],
        ["actuatorState1", asUInt8],
        ["actuatorState2", asUInt8],
        ["actuatorState3", asUInt8]
      ],

      //Actuator Currents
      6: [
        ["actuatorCurrent0", asFloat],
        ["actuatorCurrent1", asFloat],
        ["actuatorCurrent2", asFloat],
        ["actuatorCurrent3", asFloat]
      ],

      //Actuator Continuities
      7: [
        ["actuatorContinuity0", asFloat],
        ["actuatorContinuity1", asFloat],
        ["actuatorContinuity2", asFloat],
        ["actuatorContinuity3", asFloat]
      ],

      //Vehicle State
      13: [
        ["vehicleState", asUInt8]
      ],

      //Blackbox Bytes Written
      14: [
        ["blackboxWritten", asUInt32],
        ["isRecording", asUInt8]
      ],

      //Breakwires
      17: [
        ["breakWire0Voltage", asFloat],
        ["breakWire1Voltage", asFloat]
      ],

      //PT Values
      18: [
        ["loxInjectorPT", asFloat],
        ["fuelInjectorPT", asFloat]
      ],

      //Autovent Setpoints
      18: [
        ["loxAutoventPressure", asFloat],
        ["fuelAutoventPressure", asFloat]
      ],

      //By E-Reg
      
      //LOX Pressure Telemetry
      31: [
        ["LOXfilteredUpstreamPressure1", asFloat],
        ["LOXfilteredUpstreamPressure2", asFloat],
        ["LOXfilteredDownstreamPressure1", asFloat],
        ["LOXfilteredDownstreamPressure2", asFloat],
        ["LOXrawUpstreamPressure1", asFloat],
        ["LOXrawUpstreamPressure2", asFloat],
        ["LOXrawDownstreamPressure1", asFloat],
        ["LOXrawDownstreamPressure2", asFloat],
      ],

      //LOX Motor Telemetry
      32: [
        ["LOXencoderAngle", asFloat],
        ["LOXangleSetpoint", asFloat],
        ["LOXpressureSetpoint", asFloat],
        ["LOXmotorPower", asFloat],
        ["LOXpressureControlP", asFloat],
        ["LOXpressureControlI", asFloat],
        ["LOXpressureControlD", asFloat],
      ],

      //LOX Config
      33: [
        ["LOXpressureSetpointConfig", asFloat],
        ["LOXpOuterNominal", asFloat],
        ["LOXiOuterNominal", asFloat],
        ["LOXdOuterNominal", asFloat],
        ["LOXpInner", asFloat],
        ["LOXiInner", asFloat],
        ["LOXdInner", asFloat],
        ["LOXflowDuration", asFloat]
      ],

      //LOX Diagnostic
      34: [
        ["LOXmotorDirPass", asUInt8],
        ["LOXservoDirPass", asUInt8]
      ],

      //LOX State Transition Error
      35: [
        ["LOXerrorCode", asUInt8]
      ],

      //LOX Flow State
      36: [ 
        ["LOXflowState", asUInt8]
      ],

      //LOX Limit Switch
      37: [
        ["LOXfullyClosedSwitch", asFloat],
        ["LOXfullyOpenSwitch", asFloat],
      ],

      //LOX Phase Currents
      38: [
        ["LOXcurrentA", asFloat],
        ["LOXcurrentB", asFloat],
        ["LOXcurrentC", asFloat]
      ],

      //LOX Temperatures
      39: [
        ["LOXboardTemp1", asFloat],
        ["LOXboardTemp2", asFloat],
        ["LOXmotorTemp", asFloat]
      ],

      //LOX Overcurrent Trigger
      40: [
        ["LOXavgCurrent", asFloat],
        ["LOXbufferSize", asFloat]
      ],

      //Fuel Pressure Telemetry
      51: [
        ["FUELfilteredUpstreamPressure1", asFloat],
        ["FUELfilteredUpstreamPressure2", asFloat],
        ["FUELfilteredDownstreamPressure1", asFloat],
        ["FUELfilteredDownstreamPressure2", asFloat],
        ["FUELrawUpstreamPressure1", asFloat],
        ["FUELrawUpstreamPressure2", asFloat],
        ["FUELrawDownstreamPressure1", asFloat],
        ["FUELrawDownstreamPressure2", asFloat],
      ],

      //Fuel Motor Telemetry
      52: [
        ["FUELencoderAngle", asFloat],
        ["FUELangleSetpoint", asFloat],
        ["FUELpressureSetpoint", asFloat],
        ["FUELmotorPower", asFloat],
        ["FUELpressureControlP", asFloat],
        ["FUELpressureControlI", asFloat],
        ["FUELpressureControlD", asFloat],
      ],

      //Fuel Config
      53: [
        ["FUELpressureSetpointConfig", asFloat],
        ["FUELpOuterNominal", asFloat],
        ["FUELiOuterNominal", asFloat],
        ["FUELdOuterNominal", asFloat],
        ["FUELpInner", asFloat],
        ["FUELiInner", asFloat],
        ["FUELdInner", asFloat],
        ["FUELflowDuration", asFloat]
      ],

      //Fuel Diagnostic
      54: [
        ["FUELmotorDirPass", asUInt8],
        ["FUELservoDirPass", asUInt8]
      ],

      //Fuel State Transition Error
      55: [
        ["FUELerrorCode", asUInt8]
      ],

      //Fuel Flow State
      56: [ 
        ["FUELflowState", asUInt8]
      ],

      //Fuel Limit Switch
      57: [
        ["FUELfullyClosedSwitch", asFloat],
        ["FUELfullyOpenSwitch", asFloat],
      ],

      //Fuel Phase Currents
      58: [
        ["FUELcurrentA", asFloat],
        ["FUELcurrentB", asFloat],
        ["FUELcurrentC", asFloat]
      ],

      //Fuel Temperatures
      59: [
        ["FUELboardTemp1", asFloat],
        ["FUELboardTemp2", asFloat],
        ["FUELmotorTemp", asFloat]
      ],

      //Fuel Overcurrent Trigger
      60: [
        ["FUELavgCurrent", asFloat],
        ["FUELbufferSize", asFloat]
      ],
    }
  }
}

module.exports = FlightV4;