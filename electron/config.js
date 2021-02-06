const config = {
  sensors: [
    {
      name: "LOX Tank Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 0,
          storageName: "loxTank",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Prop Tank Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 1,
          storageName: "propTank",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "LOX Injector Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 2,
          storageName: "loxInjector",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Prop Injector Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 3,
          storageName: "propInjector",
          label: "pressure",
          interpolation: {
            type: "linear", // none, linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "LOX Dome",
      packetId: 1,
      values: [
        {
          packetPosition: 5,
          storageName: "loxDome",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Prop Dome",
      packetId: 1,
      values: [
        {
          packetPosition: 6,
          storageName: "propDome",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Nitrogen Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 4,
          storageName: "highPressure",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [
              [ 1634771.9270400004, 0 ],
              [ 1771674.0096000005, 150 ],
              [ 2544768.12288, 700 ],
              [ 2601139.56864, 730 ],
              [ 2681670.205440001, 805 ],
              [ 2802466.1606400004, 890 ],
              [ 2931315.1795200002, 990 ],
              [ 3076270.325760001, 1100 ],
              [ 3189013.217280001, 1200 ],
              [ 3414499.0003200006, 1351 ],
              [ 3543348.019200001, 1450 ],
              [ 3704409.292800001, 1580 ],
              [ 3946001.203200001, 1760 ],
              [ 4155380.858880001, 1930 ],
              [ 4380866.641920001, 2100 ],
              [ 4509715.660800001, 2180 ],
              [ 4751307.571200002, 2400 ],
              [ 4976793.35424, 2550 ],
              [ 5202279.13728, 2700 ],
              [ 5411658.792960001, 2870 ],
              [ 5621038.448640001, 3020 ],
              [ 5846524.231680001, 3190 ],
              [ 6015638.568960002, 3333 ],
              [ 6128381.460480002, 3426 ],
              [ 6394132.561920001, 3620 ],
              [ 6474663.198720002, 3700 ],
              [ 6667936.727040001, 3850 ],
              [ 6893422.510080002, 4000 ],
              [ 6990059.274240003, 4080 ],
              [ 7135014.420480002, 4186 ],
              [ 7183332.80256, 4221 ],
              [ 7392712.4582400005, 4365 ]
            ]
          }
        }
      ]
    },
    {
      name: "Battery",
      packetId: 2,
      values: [
        {
          packetPosition: 0,
          storageName: "batteryVoltage",
          label: "voltage",
          interpolation: {
            type: "none",
            unit: "Volts"
          }
        },
        {
          packetPosition: 1,
          storageName: "wattage",
          label: "wattage",
          interpolation: {
            type: "none",
            unit: "Watts"
          }
        },
        {
          packetPosition: 2,
          storageName: "batteryAmperage",
          label: "current",
          interpolation: {
            type: "none",
            unit: "Amps"
          }
        }
      ]
    },
    {
      name: "Fitting Tree",
      packetId: 0,
      values: [
        {
          packetPosition: 0,
          storageName: "fittingTreeTemperature",
          label: "temperature",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
          }
        },
        {
          packetPosition: 1,
          storageName: "fittingTreeHeater",
          label: "heater",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Volts"
          }
        }
      ]
    },
    {
      name: "Temperatures",
      packetId:4,
      values: [
        {
          packetPosition: 0,
          storageName: "cryoLoxTank",
          label: "cryoLoxTank",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
          }
        },
        {
          packetPosition: 1,
          storageName: "cryoInj1",
          label: "cryoInj1",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
          }
        },
        {
          packetPosition: 2,
          storageName: "cryoInj2",
          label: "cryoInj2",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
          }
        },
        {
          packetPosition: 3,
          storageName: "auxTherm",
          label: "auxTherm",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
          }
        }
      ]
    }
  ]
};

// const config = {
//   sensors: [
//     {
//       name: "LOX Tank Pressure",
//       packetId: 0,
//       values: [
//         {
//           packetPosition: 0,
//           storageName: "loxTank",
//           label: "pressure",
//           interpolation: {
//             type: "none", // linear, quadratic, none
//             unit: "PSI"
//           }
//         }
//       ]
//     },
//     {
//       name: "Prop Tank Pressure",
//       packetId: 1,
//       values: [
//         {
//           packetPosition: 0,
//           storageName: "propTank",
//           label: "pressure",
//           interpolation: {
//             type: "none", // linear, quadratic
//             unit: "PSI"
//           }
//         }
//       ]
//     },
//     {
//       name: "LOX Injector Pressure",
//       packetId: 2,
//       values: [
//         {
//           packetPosition: 0,
//           storageName: "loxInjector",
//           label: "pressure",
//           interpolation: {
//             type: "none", // linear, quadratic
//             unit: "PSI",
//           }
//         }
//       ]
//     },
//     {
//       name: "Prop Injector Pressure",
//       packetId: 3,
//       values: [
//         {
//           packetPosition: 0,
//           storageName: "propInjector",
//           label: "pressure",
//           interpolation: {
//             type: "none", // none, linear, quadratic
//             unit: "PSI"
//           }
//         }
//       ]
//     },
//     {
//       name: "Nitrogen Pressure",
//       packetId: 4,
//       values: [
//         {
//           packetPosition: 0,
//           storageName: "highPressure",
//           label: "pressure",
//           interpolation: {
//             type: "none", // linear, quadratic
//             unit: "PSI",
//           }
//         }
//       ]
//     },
//     {
//       name: "Battery",
//       packetId: 2,
//       values: [
//         {
//           packetPosition: 0,
//           storageName: "batteryVoltage",
//           label: "voltage",
//           interpolation: {
//             type: "none",
//             unit: "Volts"
//           }
//         },
//         {
//           packetPosition: 1,
//           storageName: "wattage",
//           label: "wattage",
//           interpolation: {
//             type: "none",
//             unit: "Watts"
//           }
//         },
//         {
//           packetPosition: 2,
//           storageName: "batteryAmperage",
//           label: "current",
//           interpolation: {
//             type: "none",
//             unit: "Amps"
//           }
//         }
//       ]
//     },
//   ]
// };

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
