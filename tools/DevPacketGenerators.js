const THREE = require("../telemetry/node_modules/three")

class DevPacketGenerators {
  static baseLatVal = 35.34737384872146
  static baseLongVal = -117.80822750160537

  static createRanIntGen(numFields = 4, baseVal = 12, baseJitter = 1) {
    return () => {
      return new Array(numFields).fill(0).map(() => Math.random() * baseJitter + baseVal)
    }
  }

  static createRanCoordGen(){
    return () => {
      DevPacketGenerators.baseLongVal += Math.random() / 10000
      DevPacketGenerators.baseLatVal += Math.random() / 10000
      return [[DevPacketGenerators.baseLongVal, DevPacketGenerators.baseLatVal].join("|")]
    }
  }

  static createRanQuartGen(){
    return () => {
      const quaternion = new THREE.Quaternion();
      quaternion.random()
      return [quaternion.toArray().join("|")]
    }
  }
}


module.exports = DevPacketGenerators
