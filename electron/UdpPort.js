const dgram = require('dgram');

const Packet = require('./Packet');

class UdpPort {
  /**
   *
   * @param {String} address
   * @param {Number} port
   * @param {Function} updateStateCallback
   */
  constructor(address, port, updateStateCallback) {
    this.address = address;
    this.port = port;
    this.server = dgram.createSocket('udp4');
    /**
     * @type {Object.<String, Board>}
     */
    this.boards = {};
    /**
     * Callback to update the state of the ground station.
     * @typedef {function(Number, any): void} updateStateCallback
     */
    /**
     * @type {updateStateCallback}
     */
    this.updateStateCallback = updateStateCallback;

    this.server.on('error', (err) => {
      console.log(`${this.address}:${this.port} server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      let board
      if(rinfo.address === '127.0.0.1'){
        const addressLen = msg.readUInt8(0)
        const devAddress = msg.toString("utf8", 1, 1+addressLen)
        board = this.boards[devAddress]
        msg = msg.slice(1+addressLen)
      }else{
        board = this.boards[rinfo.address];
      }
      if(!board) return;
      board.updateRcvRate(msg.length);
      const packet = board.parseMsgBuf(msg);

      if (packet) {
        const update = board.processPacket(packet);
        if (update === undefined) return;
        this.updateStateCallback(packet.timestamp, update);
      }
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(this.port, this.address);
  }

  /**
   * Register a board to receive packets
   *
   * @param {String} address
   * @param {Board} board
   */
  register(address, board) {
    this.boards[address] = board;
    // Windows sometimes only accepts packets from an address/port AFTER making an outbound connection to it first.
    if (process.platform === 'win32') {
      this.send(address, new Packet(0, [0]).toBuffer(), error => {
        if (!error) {
          return
        }
        console.debug(`could not connect to the board on address: ${address}. Error: ${error.toString()}`)
      });
    }
  }

  /**
   * Send data over the port to the specified address
   *
   * @param {String} address
   * @param {Object} data
   * @param {Function} cb
    */
  send(address, data, cb) {
    console.debug(`[${address}]: `);
    console.debug(data.toString('hex').match(/../g).join(' '))
    this.server.send(data, this.port, address, cb);
  }
}

module.exports = UdpPort;
