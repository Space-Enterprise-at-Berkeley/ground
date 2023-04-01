const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', (msg, rinfo) => {
  rinfo.address
  console.log(rinfo.address + ":" + msg.toString() + " ---- " + msg.readUInt8(0));
});
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  if(process.platform === 'win32') {
    server.send("big yeet", 42069, "10.0.0.42");
  }
});
server.bind(42070);

// Prints: server listening 0.0.0.0:42069
