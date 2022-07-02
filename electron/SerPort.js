const { SerialPort } = require('serialport');
const DelimiterParser = require('@serialport/parser-delimiter');

class SerPort {
  /**
   * @param {string} path The serial port path
   * @param {number} baud The baud rate for this path
   * @param {App.updateState} updateStateCallback
   */
  constructor(updateStateCallback) {

    this.board = null;
    this.updateStateCallback = updateStateCallback;
  }

  connect(path, baud) {
    console.log(path)
    console.log(baud)
    this.device = new SerialPort(path, {
      baudRate: baud,
      autoOpen: false
    });

    this.lineStream = this.device.pipe(new DelimiterParser({ delimiter: "\n", includeDelimiter: true }));

    this.buf1 = Buffer.alloc(265);
    this.buf_len = 0;

    this.lineStream.on('data', (msg) => {
      let buf = Buffer.concat([this.buf1.slice(0, this.buf_len), msg])
      // let buf = msg
      // console.log(buf);
      this.board.updateRcvRate(msg.length - 1);
      let packet
      let len
      if(this.buf_len > 0) {
        len = buf.readUInt8(1);
      } else {
        len = msg.readUInt8(1);
      }
      try {
        if (buf.length-1 >= len + 8) {
          packet = this.board.parseMsgBuf(buf);
          this.buf_len = 0;
        }
        else {
          // console.log("attempting to recover");
          // add msg to buf1, including '\n' delimiter
          msg.copy(this.buf1, this.buf_len);
          this.buf_len += msg.length;
        }
      } catch(err) {
        console.log("unknown error with receiving serial packets lol");
        this.buf_len = 0;
      }

      if (packet) {
        const update = this.board.processPacket(packet);
        if (update === undefined) return;
        this.updateStateCallback(packet.timestamp, update);
      }
    });

    this.device.open(error => {
      if (!error) {
        return
      }
      console.debug(`could not connect to the board on path: ${this.device.path}. Error: ${error.toString()}`)
      console.debug("to list all the available serial ports on your device, please run `npx @serialport/list -f jsonline`")
      console.debug("afterwards, update App.js with the correct ports.")
    })
  }

  // receive(_, msg) {
  //   console.log(msg.length);
  //   this.board.updateRcvRate(msg.length);
  //   let packet
  //   try {
  //     packet = this.board.parseMsgBuf(msg);
  //   } catch(err) {
  //     // ignore
  //   }

  //   if (packet) {
  //     const update = this.board.processPacket(packet);
  //     if (update === undefined) return;
  //     this.updateStateCallback(packet.timestamp, update);
  //   }
  // }

  /**
   * Register a board to receive packets from the specified serial port path
   *
   * @param {string} _
   * @param {Board} board
   */
  register(_, board) {
    if(this.board){
      console.error(`You may only register one board to each serial port. Conflicting path: ${this.device.path}`)
      process.exit(1)
    }
    this.board = board

    // tries to open the serial port
  }

  /**
   * Send data over the serial port
   *
   * @param {any} _
   * @param {Buffer} data
   * @param cb
   */
  send(_, data, cb) {
    console.debug(`[${this.device.path}]: `);
    console.debug(data);
    // console.debug(data.toString('hex').match(/../g).join(' '))
    this.device.write(data.concat('\n'), "ascii", cb);
  }

  static getPortsAvailable() {
    return SerialPort.list();
  }
}

module.exports = SerPort;
