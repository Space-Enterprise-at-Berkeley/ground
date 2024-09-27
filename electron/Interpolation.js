// const CircularBuffer = require("circular-buffer"); // can be used to keep track of finer details later
const GRANULARITY = 200 // store points as 200ms average
const AVERAGE_INTERVAL = 5000 // default to 5 second averages

const LC1_OFFSET = 0;
const LC1_SCALE = 0;

const LC2_OFFSET = 0;
const LC2_SCALE = 0;

class Interpolation {
  static firstTimeStamps = {}
  static valueBuffers = {}
  static pastValues = {}

  static TYPES = {
    FLOAT: 0,
    UINT8: 1,
    UINT16: 2,
    UINT32: 3
  }

  /**
   * Returns the string that is represented by the buffer.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[String,Number]}
   */
  static asASCIIString(buffer, offset) {
    return [buffer.slice(offset).toString("ascii"), buffer.length]
  }

  /**
   * Returns the float that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asFloat(buffer, offset) {
    return [buffer.readFloatLE(offset), 4]
  }

  /**
   * Returns the unsigned 8 bit int that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asUInt8(buffer, offset) {
    return [buffer.readUInt8(offset), 1]
  }

  /**
   * Returns the unsigned 16 bit int that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asUInt16(buffer, offset) {
    return [buffer.readUInt16LE(offset), 2]
  }

  /**
   * Returns the unsigned 32 bit int that is represented by the buffer at the given offset.
   * @param buffer {Buffer} the source buffer
   * @param offset {Number}
   * @returns {[Number|Number]}
   */
  static asUInt32(buffer, offset) {
    return [buffer.readUInt32LE(offset), 4]
  }

  /**
   * @typedef {Object} ExtendedUpdateObject
   * @property {Boolean} isExtended Indicates that this is an extended object
   * @property {any} value The original update value
   * @property {Object.<String,any>} An object containing additional field / value pairs
   */
  /**
   * Allows a value to interpolate into multiple update values
   * @param value {any} the original value
   * @param additionalFields {Object.<String,any>} any additional fields/value that should be added
   * @returns ExtendedUpdateObject
   */
  static createExtendedObject(value, additionalFields) {
    return {
      isExtended: true,
      value,
      additionalFields
    }
  }

  static interpolateFloatToBool(value) {
    return value > 0.0;
  }

  static interpolateErrorFlags(value) {
    if (value > 0.0) {
      return true
    }
    return value
  }

  static interpolateCustomEvent(raw_value) {
    let value_num = Math.round(raw_value)
    if (value_num === 0) {
      return raw_value
    }
    const event_mapping = {
      1: "Open Both Main Valve",
      2: "Open LOX",
      3: "Open Fuel",
      4: "Close LOX",
      5: "Close Fuel",
      6: "Abort Close Lox",
      7: "Abort Close Fuel",
      8: "Turn On Igniter & Open 2 Way",
      9: "Close LOX 2 Way",
      10: "Turn Off Igniter",
      11: "[Abort] Igniter Current",
      12: "[Abort] Igniter Break",
      15: "Enter Checkout",
      16: "Exit Checkout"
    };
    if (Object.keys(event_mapping).includes(raw_value.toString())) {
      return {
        message: event_mapping[raw_value],
        tags: {
          eventId: value_num
        }
      }
    } else {
      return "Id not found: " + raw_value
    }
  }

  static interpolateLoadCell1(value) {
    return (value - LC1_OFFSET) * LC1_SCALE
  }

  static interpolateLoadCell2(value) {
    return (value - LC2_OFFSET) * LC2_SCALE
  }


  static interpolateSolenoidErrors(value) {
    // value is binary where each "1" indicates an error for that solenoid
    // 0 represents no error in any of the sols

    function mapSolNumToName(num) {
      const names = [
        "LOX2Way: Arming valve for 150 psi",
        "Prop2Way: Ignitor",
        "LOX5Way: Main valve for LOX",
        "Prop5Way: main valve for prop",
        "LOXGems",
        "PropGems"
      ]
      return names[num] || `Unknown (#${num + 1})`
    }

    let int = Math.round(value)

    if (int === 0) {
      return value
    }

    let errors = int.toString(2).split("").reverse().map(_char => (+_char === 1))
    return `Shorted sols: <br/>${errors.reduce((acc, cur, idx) => {
      if (cur) {
        acc += `${mapSolNumToName(idx)}, <br/>`
      }
      return acc
    }, "")}`
  }

  static interpolateRateOfChange(value, lastTime, outputFieldName) {
    if (!this.valueBuffers[outputFieldName] || !this.firstTimeStamps[outputFieldName]) {
      this.firstTimeStamps[outputFieldName] = lastTime
      this.valueBuffers[outputFieldName] = []
    }

    let firstTime = this.firstTimeStamps[outputFieldName]

    if (lastTime < firstTime) {
      firstTime = lastTime
      this.firstTimeStamps[outputFieldName] = firstTime
    }
    this.valueBuffers[outputFieldName].push(value)

    if (!this.pastValues[outputFieldName]) {
      this.pastValues[outputFieldName] = []
    }

    if (lastTime - firstTime > GRANULARITY) {
      this.pastValues[outputFieldName].push({
        firstTime,
        lastTime,
        value: this.valueBuffers[outputFieldName].reduce((acc, cur) => acc + cur, 0) / this.valueBuffers[outputFieldName].length
      })
      this.valueBuffers[outputFieldName] = []
      this.firstTimeStamps[outputFieldName] = null

      const current = Date.now()

      const pointsInInterval = this.pastValues[outputFieldName].filter(({ lastTime }) => current - lastTime < AVERAGE_INTERVAL)

      const valuesInInterval = pointsInInterval.map(pt => pt.value)
      const dP = valuesInInterval[valuesInInterval.length - 1] - valuesInInterval[0]

      return this.createExtendedObject(value, {
        [outputFieldName]: dP
      })
    } else {
      return value
    }
  }
}

module.exports = Interpolation;
