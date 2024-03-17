import comms from "./api/Comms";

let intervals = {};

export function buttonAction(action) {
  return (...args) => {
    let config = JSON.parse(atob(window.location.hash.split("&")[1]));
    let commandMap = config["commandMap"];
    let board, packet, number;
    if (commandMap[action.target] !== undefined) {
      [board, packet, number] = commandMap[action.target];
    }
    switch (action.type) {
      case "retract-full":
        if (number != null) {
          comms.send(board, packet, number, "asUInt8", 0, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(board, packet, 0, "asUInt8", 0, "asUInt32");
        }
        comms.sendPacket(board, packet, number == null ? -1 : number, 0, 0);
        break;
      case "extend-full":
        if (number != null) {
          comms.send(board, packet, number, "asUInt8", 1, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(board, packet, 1, "asUInt8", 0, "asUInt32");
        }
        break;
      case "retract-timed":
        if (number != null) {
          comms.send(board, packet, number, "asUInt8", 2, "asUInt8", args[0], "asUInt32");
        }
        else {
          comms.send(board, packet, 2, "asUInt8", args[0], "asUInt32");
        }
        break;
      case "extend-timed":
        if (number != null) {
          comms.send(board, packet, number, "asUInt8", 3, "asUInt8", args[0], "asUInt32");
        }
        else {
          comms.send(board, packet, 3, "asUInt8", args[0], "asUInt32");
        }
        break;
      case "on":
        if (number != null) {
          comms.send(board, packet, number, "asUInt8", 4, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(board, packet, 4, "asUInt8", 0, "asUInt32");
        }
        break;
      case "off":
        if (number != null) {
          comms.send(board, packet, number, "asUInt8", 5, "asUInt8", 0, "asUInt32");
        }
        else {
          comms.send(board, packet, 5, "asUInt8", 0, "asUInt32");
        }
        break;
      case "enable":
        console.log(action.id);
        console.log(buttonEnabledManager);
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
        comms.send(board, packet);
        break;
      case "signal-timed":
        comms.send(board, packet, args[0], "asFloat");
        break;
      case "start-pings":
        intervals[action.pingId] = setInterval(() => {
          comms.send(board, packet);
        }, action.delay);
        break;
      case "stop-pings":
        clearInterval(intervals[action.pingId]);
        break;
      case "zero":
        comms.send(board, packet, args[0], "asUInt8");
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