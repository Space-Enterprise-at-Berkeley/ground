const Board = require('../Board');

class DAQV3 extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = DAQV3;
