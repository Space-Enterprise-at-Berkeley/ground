import comms from "./api/Comms";

let intervals = {};

export function buttonAction(action) {
  return (...args) => {
    switch (action.type) {
      case "retract-full":
        if (action.number != null) {
          comms.send(action.board, action.packet, action.number, "asUInt8", 0, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(action.board, action.packet, 0, "asUInt8", 0, "asUInt32");
        }
        comms.sendPacket(action.board, action.packet, action.number == null ? -1 : action.number, 0, 0);
        break;
      case "extend-full":
        if (action.number != null) {
          comms.send(action.board, action.packet, action.number, "asUInt8", 1, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(action.board, action.packet, 1, "asUInt8", 0, "asUInt32");
        }
        break;
      case "retract-timed":
        if (action.number != null) {
          comms.send(action.board, action.packet, action.number, "asUInt8", 2, "asUInt8", args[0], "asUInt32");
        }
        else {
          comms.send(action.board, action.packet, 2, "asUInt8", args[0], "asUInt32");
        }
        break;
      case "extend-timed":
        if (action.number != null) {
          comms.send(action.board, action.packet, action.number, "asUInt8", 3, "asUInt8", args[0], "asUInt32");
        }
        else {
          comms.send(action.board, action.packet, 3, "asUInt8", args[0], "asUInt32");
        }
        break;
      case "on":
        if (action.number != null) {
          comms.send(action.board, action.packet, action.number, "asUInt8", 4, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(action.board, action.packet, 4, "asUInt8", 0, "asUInt32");
        }
        break;
      case "off":
        if (action.number != null) {
          comms.send(action.board, action.packet, action.number, "asUInt8", 5, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(action.board, action.packet, 5, "asUInt8", 0, "asUInt32");
        }
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
        comms.send(action.board, action.packet);
        break;
      case "signal-timed":
        comms.send(action.board, action.packet, args[0], "asFloat");
        break;
      case "start-pings":
        intervals[action.pingId] = setInterval(() => {
          comms.send(action.board, action.packet);
        }, action.delay);
        break;
      case "stop-pings":
        clearInterval(intervals[action.pingId]);
        break;
      case "zero":
        comms.send(action.board, action.packet, args[0], "asUInt8");
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