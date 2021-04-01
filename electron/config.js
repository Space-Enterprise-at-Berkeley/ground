const config = {
  sensors: [
    {
      name: "GPS",
      packetId: 11,
      values: [
        {
          packetPosition: 0,
          storageName: "gpsLatitude",
          label: "gpsLatitude",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "decimal minutes",
          }
        },
        {
          packetPosition: 1,
          storageName: "gpsLongitude",
          label: "gpsLongitude",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "decimal minutes",
          }
        }
      ]
    },
    {
      name: "GPS Aux",
      packetId: 12,
      values: [
        {
          packetPosition: 0,
          storageName: "gpsFix",
          label: "gpsFix",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "boolean",
          }
        },
        {
          packetPosition: 1,
          storageName: "gpsNumSat",
          label: "gpsNumSat",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "count",
          }
        },
        {
          packetPosition: 2,
          storageName: "gpsAltitude",
          label: "gpsAltitude",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "??",
          }
        },
        {
          packetPosition: 3,
          storageName: "gpsSpeed",
          label: "gpsSpeed",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "knots",
          }
        },
        {
          packetPosition: 4,
          storageName: "gpsAngle",
          label: "gpsAngle",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "degrees",
          }
        },
      ]
    },
    {
      name: "Barometer",
      packetId: 13,
      values: [
        {
          packetPosition: 0,
          storageName: "baroAltitude",
          label: "baroAltitude",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "??",
          }
        },
        {
          packetPosition: 1,
          storageName: "baroPressure",
          label: "baroPressure",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "??",
          }
        },
      ]
    },
    {
      name: "IMU Acceleration",
      packetId: 14,
      values: [
        {
          packetPosition: 0,
          storageName: "imuAccelX",
          label: "imuAccelX",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "??",
          }
        },
        {
          packetPosition: 1,
          storageName: "imuAccelY",
          label: "imuAccelY",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "??",
          }
        },
        {
          packetPosition: 2,
          storageName: "imuAccelZ",
          label: "imuAccelZ",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "??",
          }
        },
      ]
    },
    {
      name: "IMU Orientation",
      packetId: 15,
      values: [
        {
          packetPosition: 0,
          storageName: "imuAngleX",
          label: "imuAngleX",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "degrees",
          }
        },
        {
          packetPosition: 1,
          storageName: "imuAngleY",
          label: "imuAngleY",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "degrees",
          }
        },
        {
          packetPosition: 2,
          storageName: "imuAngleZ",
          label: "imuAngleZ",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "degrees",
          }
        },
      ]
    },
    {
      name: "Recovery Ack",
      packetId: 10,
      values: [
        {
          packetPosition: 0,
          storageName: "recoveryDrogue",
          label: "recoveryDrogue",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "boolean",
          }
        },
        {
          packetPosition: 1,
          storageName: "recoveryMain",
          label: "recoveryMain",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "boolean",
          }
        },
      ]
    },
    {
      name: "Packet Counter",
      packetId: 5,
      values: [
        {
          packetPosition: 0,
          storageName: "packetCount",
          label: "packetCount",
          interpolation: {
            type: "none", // linear, quadratic
            unit: "count",
          }
        },
      ]
    },
  ]
};

const getPacketConfig = () => {
  const packets = {};
  config.sensors.forEach((s, i) => {
    if(!packets[s.packetId]) {
      packets[s.packetId] = [];
    }
    packets[s.packetId].push(i);
  });
  return packets;
}

module.exports = { config, getPacketConfig };
