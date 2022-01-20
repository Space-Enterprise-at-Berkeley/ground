const THREE = require("../telemetry/node_modules/three")

function createRanIntGen(numFields = 4, baseVal = 12, baseJitter = 1) {
  function generator() {
    return new Array(numFields).fill(0).map(() => Math.random() * baseJitter + baseVal)
  }

  return generator
}

function createRanQuartGen(){
  function generator(){
    const quaternion = new THREE.Quaternion();
    quaternion.random()
    return [quaternion.toArray().join("|")]
  }

  return generator
}

module.exports = {
  createRanIntGen,
  createRanQuartGen
}
