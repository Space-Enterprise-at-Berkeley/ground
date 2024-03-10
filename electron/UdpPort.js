const dgram = require('dgram');
const fs = require('fs');
const os = require('os');

class UdpPort {
  /**
   *
   * @param {String} address
   * @param {Number} host
   * @param {Function} updateStateCallback
   */
  constructor(address, host, updateStateCallback) {
    this.address = address;
    this.host = host;
    this.server = dgram.createSocket('udp4');
    this.broadcastServer = dgram.createSocket('udp4');
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

    this.broadcastServer.on('error', (err) => {
      console.log(`${this.address}:${this.port} server error:\n${err.stack}`);
      this.broadcastServer.close();
    });

    this.server.on('message', (msg, rinfo) => {
      try {
        // console.log(rinfo.address);
        let board
        if(rinfo.address === '127.0.0.1'){
          const addressLen = msg.readUInt8(0)
          const devAddress = msg.toString("utf8", 1, 1+addressLen)
          board = this.boards[devAddress]
          msg = msg.slice(1+addressLen)
        }else{
          let id = msg.readUInt8(0);
          if (id === 133) { // Abort stuff
            let abortReason = msg.readUInt8(9);
            console.log("Abort reason: " + abortReason);
            fs.appendFile("./abortlog.txt", new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}) + " " + rinfo.address + " " + abortReason + "\n", "utf8", () => {});
          }
          board = this.boards[rinfo.address];
        }
        if(!board) return;
        board.updateRcvRate(msg.length);
        const packet = board.parseMsgBuf(msg);
        if (packet) {
          // if (rinfo.address === "10.0.0.13" && packet.id === 3) {
          //   console.log(packet);
          // }
          const update = board.processPacket(packet);
          // console.log(update);
          if (update === undefined) return;
          this.updateStateCallback(packet.timestamp, update);
        }
      }
      catch (e) {
        console.log(e);
      }
    });

    this.broadcastServer.on('message', (msg, rinfo) => {
      try {
        // console.log(rinfo.address);
        let board
        if(rinfo.address === '127.0.0.1'){
          const addressLen = msg.readUInt8(0)
          const devAddress = msg.toString("utf8", 1, 1+addressLen)
          board = this.boards[devAddress]
          msg = msg.slice(1+addressLen)
        }else{
          let id = msg.readUInt8(0);
          if (id === 133) { // Abort stuff
            let abortReason = msg.readUInt8(9);
            console.log("Abort reason: " + abortReason);
            fs.appendFile("./abortlog.txt", new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}) + " " + rinfo.address + " " + abortReason + "\n", "utf8", () => {});
          }
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
      }
      catch (e) {
        console.log(e);
      }
    });

    this.server.on('listening', () => {
      this.server.setBroadcast(true);
      this.server.setMulticastTTL(128);
      let membershipInterval = setInterval(() => {
        if (Object.values(os.networkInterfaces()).flat(1).some(o => o.address === "10.0.0." + (this.host % 42000))) {
          this.server.addMembership('224.0.0.3', "10.0.0." + (this.host % 42000));
          clearInterval(membershipInterval);
        }
      }, 1000);
      // this.server.addMembership('224.0.0.3', "10.0.0." + (this.host % 42000));
      const address = this.server.address();
      // this.server.setBroadcast(true);
      // this.server.setMulticastTTL(128);
      // for (let board in this.config.boards) {
      //   let ipChunks = this.config.boards[board].address.split(".");
      //   this.server.addMembership('224.0.5.' + ipChunks[3]);
      // }
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.broadcastServer.on('listening', () => {
      const address = this.broadcastServer.address();
      // this.server.setBroadcast(true);
      // this.server.setMulticastTTL(128);
      // for (let board in this.config.boards) {
      //   let ipChunks = this.config.boards[board].address.split(".");
      //   this.server.addMembership('224.0.5.' + ipChunks[3]);
      // }
      console.log(`server listening ${address.address}:${address.port}`);
      this.broadcastServer.setBroadcast(true);
    });

    this.server.bind(42080, this.address);

    this.broadcastServer.bind(42099, this.address);
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
    // if (process.platform === 'win32') {
    //   this.send(address, Buffer.alloc(0), error => {
    //     if (!error) {
    //       return
    //     }
    //     console.debug(`could not connect to the board on address: ${address}. Error: ${error.toString()}`)
    //   });
    // }
  }

  /**
   * Send data over the port to the specified address
   *
   * @param {String} address
   * @param {Object} data
   * @param {Function} cb
    */
  send(address, data, print=true, cb) {
    if (print && data.toString('hex').substring(0, 2) !== "d1") {
      process.stdout.write(data.toString('hex').match(/../g).join(' '));
      console.log(` sent to [${address}] `);
    }
    this.broadcastServer.send(data, 42099, address, cb);
  }

  broadcast(data, print=true, cb) {
    this.send("10.0.0.255", data, print, cb);
  }
}

module.exports = UdpPort;
