const Board = require('../Board');
const Interpolation = require("../Interpolation");

const { asASCIIString, asFloat, asUInt8, asUInt16, asUInt32, asUInt32fromustos} = Interpolation;
const { FLOAT, UINT8, UINT32, UINT16 } = Interpolation.TYPES;

class EregHat extends Board {
  constructor(port, address, name, onConnect, onDisconnect, onRate) {
    
    super(port, address, name, {}, onConnect, onDisconnect, onRate);

    // constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    //     super(port, address, mapping, onConnect, onDisconnect, onRate);
    //     this.startPropellantFlow = this.startPropellantFlow.bind(this);
    //     this.zeroEncoders  = this.zeroEncoders.bind(this);
    //     this.setMotorEncoder = this.setMotorEncoder.bind(this);
    //     this.pressurizePropellantStatic = this.pressurizePropellantStatic.bind(this);
    //     this.runDiagnostic = this.runDiagnostic.bind(this);
    //     this.actuateMainValve = this.actuateMainValve.bind(this);
    //     this.abortEReg = this.abortEReg.bind(this);
    //   }
    //   startPropellantFlow () { return this.sendPacket(200, []); }
    //   abortEReg () { return this.sendPacket(201, []); }
    //   setMotorEncoder (value) { return this.sendPacket(202, [value]); } // float
    //   pressurizePropellantStatic () { return this.sendPacket(203, []); }
    //   runDiagnostic () { return this.sendPacket(204, []); }
    //   zeroEncoders () { return this.sendPacket(205, []); }
    //   actuateMainValve (state) { return this.sendPacket(206, [state]); } // int
    // }

    this.inboundPacketDefs = {

        1: [
            ['EReg_HP_PT', asFloat],
            ['EReg_LP_PT', asFloat],

            ['EReg_ENCODER_ANGLE', asFloat],
            ['EReg_ANGLE_SETPOINT', asFloat],
            ['EReg_PRESSURE_SETPOINT', asFloat],
            ['EReg_MOTOR_POWER', asFloat],
            ['EReg_PRESSURE_CONTROL_P', asFloat],
            ['EReg_PRESSURE_CONTROL_I', asFloat],
            ['EReg_PRESSURE_CONTROL_D', asFloat],
        ],

        2: [
            ['EReg_CONFIG_PRESSURE_SETPOINT', asFloat],
            ['EReg_KP_OUTER', asFloat],
            ['EReg_KL_OUTER', asFloat],
            ['EReg_KD_OUTER', asFloat],
            ['EReg_KP_INNER', asFloat],
            ['EReg_KL_INNER', asFloat],
            ['EReg_KD_INNER', asFloat],
            ['EReg_FLOW_DURATION', asFloat],
        ], 

        3: [ // diagnostic
            ['EReg_DIAGNOSTIC_MESSAGE', asDiagnosticMessage],
        ],
        
        4: [ //command  fail
            ['EReg_ERROR_CODE', asUInt8],
        ],
        
        5: [ // flow state
            ['EReg_STATE', asUInt8],
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
    }
  }
}

module.exports = EregHat;