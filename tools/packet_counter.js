const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const Packet = require('../electron/Packet');

const pktCounts = {};

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', (msg, rinfo) => {
  const pkt = Packet.parsePacket(msg.toString());
  if(pkt) {
    if(!pktCounts[pkt.id]) pktCounts[pkt.id] = 0;
    pktCounts[pkt.id] += 1;
  }
});
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  if(process.platform === 'win32') {
    server.send("big yeet", 42069, "10.0.0.42");
  }
});
server.bind(42069);

setInterval(() => {
  for(let k of Object.keys(pktCounts)) {
    console.log(k + " : " + pktCounts[k] + ' pkt/s');
    pktCounts[k] = 0;
  }
  console.log('----------------------------------');
}, 1000);

// Prints: server listening 0.0.0.0:42069
