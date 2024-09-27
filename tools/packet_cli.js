const dgram = require('dgram');

const server = dgram.createSocket('udp4');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// address of board to send to
const BOARD_ADDRESS = "10.0.0.12";
const BOARD_PORT = 42069;

// checksum generator
fletcher16 = (data) => {
  var a = 0, b = 0;
  for (var i = 0; i < data.length; i++) {
      a = (a + data[i]) % 255;
      b = (b + a) % 255;
  }
  return a | (b << 8);
}

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', (msg, rinfo) => {
  console.log(msg.toString());
});
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  if(process.platform === 'win32') {
    server.send("big yeet", 42069, "10.0.0.42");
  }
  rl.on('line', line => {
    const checksum = fletcher16(Buffer.from(line, 'binary')).toString(16);
    console.log('sending: ' + '{' + line + '|' + checksum + '}');
    server.send('{' + line + '|' + checksum + '}', BOARD_PORT, BOARD_ADDRESS);
  });
});
server.bind(42069);

// Prints: server listening 0.0.0.0:42069
