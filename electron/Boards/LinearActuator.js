const Interpolation = require('../Interpolation');
const Board = require('../Board');

const packets = {

};

class LinearActuator extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = LinearActuator;
