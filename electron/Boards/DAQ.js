const Board = require('../Board');

class DAQ extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = DAQ;
