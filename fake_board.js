const dgram = require("dgram");

const sock = dgram.createSocket("udp4");

const address = "127.0.0.1";
const port = 42069;
const board_ips = {
	flight: "10.0.0.42",
	pt: "10.0.0.43",
	tc: "10.0.0.44",
	lc: "10.0.0.45",
	ac: "10.0.0.46"
};

const initTime = Date.now();

function fletcher16Partitioned(bufArr) {
	let a = 0, b = 0;
	for (const buf of bufArr) {
		for (let i = 0; i < buf.length; i++) {
			a = (a + buf[i]) % 256;
			b = (b + a) % 256;
		}
	}
	return a | (b << 8);
}

const fakePort = {
	register: () => {}
}

function packet(id, addr, values, local=false) {
	let addrLenBuf = Buffer.alloc(1);
	addrLenBuf.writeUInt8(addr.length);
	let addrBuf = Buffer.alloc(addr.length);
	addrBuf.write(addr);
	let idBuf = Buffer.alloc(1);
	idBuf.writeUInt8(id);
	let lenBuf = Buffer.alloc(1);
	lenBuf.writeUInt8(values.reduce((acc, cur) => acc + cur.length, 0));
	let tsOffsetBuf = Buffer.alloc(4);
	tsOffsetBuf.writeUInt32LE(Date.now() - initTime);
	let checkSumBuf = Buffer.alloc(2);
	checkSumBuf.writeUInt16LE(fletcher16Partitioned([idBuf, lenBuf, tsOffsetBuf, ...values]))
	if (local) {
		return Buffer.concat([addrLenBuf, addrBuf, idBuf, lenBuf, tsOffsetBuf, checkSumBuf, ...values]);
	}
	return Buffer.concat([idBuf, lenBuf, tsOffsetBuf, checkSumBuf, ...values]);
}

sock.on("message", (msg, rinfo) => {
	console.log(`[${rinfo.address}] ${msg.toString("hex").match(/.{1,2}/g).join(" ")}`);
});

// sock.bind(42070, "0.0.0.0");

// const boards = {
// 	"10.0.0.11": new ACBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.12": new ACBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.61": new EregBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.62": new EregBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.51": new TCBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.31": new PTBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.21": new LCBoard(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.42": new FlightV4(fakePort, null, null, () => {}, () => {}, () => {}),
// 	"10.0.0.72": new FlightV4(fakePort, null, null, () => {}, () => {}, () => {})
// }

const bufferSizes = {
	asASCIIString: 7,
	asUInt8: 1,
	asUInt16: 2,
	asUInt32: 4,
	asUInt64: 8,
	asFloat: 4
}

function buf8(value) {
	let buffer = Buffer.alloc(4);
	buffer.writeUInt8(value);
	return buffer;
}

function buf16(value) {
	let buffer = Buffer.alloc(4);
	buffer.writeUInt16LE(value);
	return buffer;
}

function buf32(value) {
	let buffer = Buffer.alloc(4);
	buffer.writeUInt32LE(value);
	return buffer;
}

function buf64(value) {
	let buffer = Buffer.alloc(4);
	buffer.writeUInt64LE(value);
	return buffer;
}

function bufFloat(value) {
	let buffer = Buffer.alloc(4);
	buffer.writeFloatLE(value);
	return buffer;
}

/************************************
Packets go below here
************************************/
const rate = 100;
const loop = true;

// let p = packet(103, "", [buf8(4)], false);
// sock.send(p, 42099, "10.0.0.31");

// let p = packet(100, "", [buf8(4)], false);
// sock.send(p, 42099, "10.0.0.31");

// let p = packet(250, "", [buf8(172), buf8(0)], false);
// sock.send(p, 42099, "10.0.0.13");

if (loop) {
	setInterval(() => {
		// bufFloat((Date.now() - initTime) / 1000)

		// let p = packet(2, "", [bufFloat(0), bufFloat(0), bufFloat(0)], false);
		// sock.send(p, 42099, "10.0.0.255");

		let val0 = (Date.now() - initTime) / 1000;
		let val1 = 5000;

		let p = packet(2, "10.0.0.21", [bufFloat(val0), bufFloat(val1), bufFloat(0), bufFloat(0)], true);
		sock.send(p, 42069, "127.0.0.1");
	}, rate);
}

console.log("Done");