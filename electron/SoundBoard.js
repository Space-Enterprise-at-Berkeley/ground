const sound = require("sound-play");

const path = require("path");

const file_mappings = {
  'LOX Dome': 'lox_dome.mp3',
  'Fuel Dome': 'fuel_dome.mp3',
  'LOX Fitting Tree': 'lox_fitting_tree.mp3',
  'Fuel Fitting Tree': 'fuel_fitting_tree.mp3',
  'Pressurant System': 'pressurant_system.mp3'
}

const leek1Path = path.join(__dirname, "media", "leek_part1.mp3");
const leek2Path = path.join(__dirname, "media", "leek_part2.mp3");

class SoundBoard {
  constructor() {

  }

  playUpdog() {
    const filePath = path.join(__dirname, "media", "fuel_dome.mp3");
    sound.play(filePath);
  }
  
  async playSound(key) {
    const filePath = path.join(__dirname, "media", file_mappings[key]);
    await sound.play(leek1Path);
    await sound.play(filePath);
    await sound.play(leek2Path);
  }
  
}

module.exports = SoundBoard;
