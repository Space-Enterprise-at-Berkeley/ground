const config = {
  ifaces: [
    { name: "ethernet", type: "udp", autoconnect: true, defaults: { bind: "0.0.0.0", port: 42069 } },
    { name: "ereg_serial", type: "serial", autoconnect: false, defaults: { port: "COM1", baud: 115200 }},
  ],
  devices: [
    { name: "fcv2", iface: "ethernet", iface_props: { ipa: "10.0.0.42" }, recv_packets: {
      0: [ ['testValue', asFloat] ],
      1: [ ['p2Test1', asFloat], ['p2Test2', asFloat], ['p2Test3', asFloat] ],
    }, sent_packets: {
      "beginFlow": { type: "command", id: 2 },
    } },
    { name: "ereg", iface: "ereg_serial", iface_props: {}, recv_packets: {
      10: [ ['ereg_testValue', asFloat] ],
      11: [ ['ereg_p2Test1', asFloat], ['ereg_p2Test2', asFloat], ['ereg_p2Test3', asFloat] ],
    }, sent_packets: {
      "setControlStatus": { type: "binary", id: 12 },
      "setTargetPressure": { type: "float", id: 13 },
    } }
  ],
  
};

module.exports = telem;
