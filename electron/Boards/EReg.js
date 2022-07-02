const Board = require('../Board');

class EReg extends Board {
  constructor(port, mapping, onConnect, onDisconnect, onRate) {
    super(port, null, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = EReg;
