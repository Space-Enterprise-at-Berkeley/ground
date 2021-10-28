// const CircularBuffer = require("circular-buffer"); // can be used to keep track of finer details later
const GRANULARITY = 200 // store points as 200ms average
const AVERAGE_INTERVAL = 5000 // default to 5 second averages

class Interpolation {
  static firstTimeStamps = {}
  static valueBuffers = {}
  static pastValues = {}

  static floatToBool(value) {
    return value > 0.0;
  }

  static interpolateErrorFlags(value) {
    if (value > 0.0) {
      return true
    }
    return value
  }

  static interpolateMetadata(value) {
    return value;
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
      11: "[Igniter] Abort",
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

      const current = new Date().getTime()

      const pointsInInterval = this.pastValues[outputFieldName].filter(({ lastTime }) => current - lastTime < AVERAGE_INTERVAL)

      const valuesInInterval = pointsInInterval.map(pt => pt.value)
      const dP = valuesInInterval[valuesInInterval.length - 1] - valuesInInterval[0]

      return {
        additionalFields: {
          [outputFieldName]: dP
        },
        _val: value
      }
    } else {
      return value
    }
  }
}

module.exports = Interpolation;
