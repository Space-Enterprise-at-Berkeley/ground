const Interpolation = require('./Interpolation');
const Board = require('./Board');

const packets = {
  
};

class DAQ extends Board {
  constructor(port, address, mapping, onConnect, onDisconnect, onRate) {
    super(port, address, packets, mapping, onConnect, onDisconnect, onRate);
  }
}

module.exports = DAQ;
