import comms from "./api/Comms";

export function calcPressRoc(value) {
  
  const currentPressRocTime = window.performance.now();
  const delta_press_roc = (value - this.lastPressRocValue) * 1000.0 / (currentPressRocTime - this.lastPressRocTime);
  
  this.rocValues.unshift(delta_press_roc);
  if (this.rocValues.length > 30) {
    this.rocValues.pop();
  }
  this.lastPressRocTime = currentPressRocTime;
  this.lastPressRocValue = value;

  let sum = 0;
  for (let rocVal of this.rocValues) {
    sum += Number(rocVal);
  }
  return sum / this.rocValues.length;
}

export function buttonAction(action) {
  return (...args) => {
    switch (action.type) {
      case "retract-full":
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 0, 0);
        break;
      case "extend-full":
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 1, 0);
        break;
      case "retract-timed":
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 2, args[0]);
        break;
      case "extend-timed":
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 3, args[0]);
        break;
      case "on":
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 4, 0);
        break;
      case "off":
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 5, 0);
        break;
      case "enable":
        let enableButton = buttonEnabledManager[action.id];
        if (enableButton !== undefined) {
          enableButton(true);
        }
        break;
      case "disable":
        let disableButton = buttonEnabledManager[action.id];
        if (disableButton !== undefined) {
          disableButton(false);
        }
        break;
      case "signal":
        comms.sendSignalPacket(action.board, action.packet);
        break;
      case "signal-timed":
        comms.sendSignalPacketTimed(action.board, action.packet, args[0]);
        break;
      case "start-pings":
        setInterval(() => {
          comms.sendSignalPacket(action.board, action.packet);
        }, action.delay);
        break;
      case "zero":
        comms.sendZeroPacket(action.board, action.packet, args[0]);
        break;
      default:
        return;
    }
  }
}

export const buttonEnabledManager = {};

export function addButtonEnabledListener(name, callback) {
  buttonEnabledManager[name] = callback;
}

export function removeButtonEnabledListener(name) {
  delete buttonEnabledManager[name];
}