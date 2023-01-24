const dgram = require('dgram');
const server = dgram.createSocket('udp4');

let byteCounter = 0;
let pktCounter = 0;

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', (msg, rinfo) => {
  byteCounter += msg.toString().length;
  if(msg.toString().length !== 24) { console.log("length not 24! " + msg.toString().length) }
  pktCounter += 1;
});
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});
server.bind(42069);

setInterval(() => {
    console.log("byte count: " + byteCounter / 1000000 + " MB/s    |   pkt count: " + pktCounter + " pkt/s");
    byteCounter = 0;
    pktCounter = 0;
  console.log('----------------------------------');
}, 1000);

// Prints: server listening 0.0.0.0:42069
