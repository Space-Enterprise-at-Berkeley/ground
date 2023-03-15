/*
 * I've used blessed to create a textbox at the bottom line in the screen.
 * The rest of the screen is the 'body' where your code output will be added.
 * This way, when you type input, your program won't muddle it with output.
 *
 * To try this code:
 * - $ npm install blessed --save
 * - $ node screen.js
 *
 * Key points here are:
 * - Your code should show output using the log function.
 *   Think of this as a console.log drop-in-replacement.
 *   Don't use console.* functions anymore, they'll mess up blessed's screen.
 * - You have to 'focus' the inputBar element for it to receive input.
 *   You can have it always focused, however, but my demonstration shows listening for an enter key press or click on the blue bar to focus it.
 * - If you write code that manipulates the screen, remember to run screen.render() to render your changes.
 */

const blessed = require('blessed');
const dgram = require('dgram');
const Packet = require('../electron/Packet');

// state variables
let stateVars = {
  board: '127.0.0.1',
  port: 42099
}

// socket stuff
server = dgram.createSocket('udp4');
server.bind(42069, '0.0.0.0');

server.on('listening', () => {
  server.setBroadcast(true);
})


var screen = blessed.screen();
var body = blessed.box({
  top: 0,
  left: 0,
  height: '100%-1',
  width: '100%',
  keys: true,
  tags: true,
  mouse: true,
  alwaysScroll: true,
  scrollable: true,
  scrollbar: {
    ch: ' ',
    bg: 'red'
  }
});
var inputBar = blessed.textbox({
  bottom: 0,
  left: 0,
  height: 1,
  width: '100%',
  keys: true,
  mouse: true,
  inputOnFocus: true,
  style: {
    fg: 'white',
    bg: 'blue'	// Blue background so you see this is different from body
  }
});

// Add body to blessed screen
screen.append(body);
screen.append(inputBar);

// Close the example on Escape, Q, or Ctrl+C
screen.key(['escape', 'C-c'], (ch, key) => (process.exit(0)));

// Handle submitting data
inputBar.on('submit', (text) => {
  if(text.length < 1) {inputBar.focus(); return};
  if(text[0] === '{') {
    let pkt = Packet.createPacketFromText(text);
    server.send(pkt.toBuffer(), stateVars.port, stateVars.board, false);
    logGreen(pkt.stringify() + ` -> [${stateVars.board}:${stateVars.port}]`);
  } else {
    switch(text.split(' ')[0]) {
      case 'set':
        if(!stateVars[text.split(' ')[1]]) { logBlue("No such variable"); break; }
        stateVars[text.split(' ')[1]] = text.split(' ')[2]
        logBlue(`Set ${text.split(' ')[1]} to ${text.split(' ')[2]}`);
        break;
      case 'get':
        if(!stateVars[text.split(' ')[1]]) { logBlue("No such variable"); break; }
        logBlue(stateVars[text.split(' ')[1]]);
        break;
      default:
        break;
    }
  }
  inputBar.focus();
  inputBar.clearValue();
});

// Add text to body (replacement for console.log)
const log = (text) => {
  body.pushLine(text);
  body.scroll(1);
  screen.render();
}

const logGreen = (text) => {
  log('{bold}{green-fg}' + text + '{/green-fg}{/bold}')
}

const logOrange = (text) => {
  log('{bold}{#ffa500-fg}' + text + '{/#ffa500-fg}{/bold}')
}

const logBlue = (text) => {
  log('{bold}{#ADD8E6-fg}' + text + '{/#ADD8E6-fg}{/bold}')
}


server.on('message', (msg, rinfo) => {
  const disp = `[${rinfo.address}] ${msg.toString('hex').match(/../g).join(' ')}`;
  log(disp)
});


/*
 * Demonstration purposes
 */

// Listen for enter key and focus input then
screen.key('enter', (ch, key) => {
  inputBar.focus();
  inputBar.clearValue();
});

logOrange("Welcome to the SEB Packet API!!!");
logOrange("Received packets will appear in this window.");
logOrange("Packets can be transmitted by typing them into the blue bar at the bottom of the screen.");
logOrange("Press enter to focus the blue bar.");
logOrange("Press escape to exit.");
logOrange("The packet format is as follows:");
logOrange("{id|data,data,data,...}");
logOrange("Where id is a single number, and data can be entered as 2.34f, 0x02, 35u8, 12u16");
logOrange("For example, to send a packet with id 1 and data 45.734, 0x03, and 134, type:");
logOrange("{1|45.734f,0x03,134u8}");
logOrange("");
logOrange("You can also set and get state variables using the following commands:");
logOrange("set [variable] [value]");
logOrange("get [variable]");
logOrange("Current state variables are:");
logOrange("board: board IP address to send to (default: 127.0.0.1)");
logOrange("port: board port to send to (default: 42099)");
logOrange("For example, to set the board IP to 10.0.0.11, type:");
logOrange("set board 10.0.0.11");
logOrange("______________________________________________________________");