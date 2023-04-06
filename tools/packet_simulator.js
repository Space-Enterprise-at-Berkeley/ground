const dgram = require('dgram')
const DevPacket = require("./DevPacket")


const FPS = 300 // packets per second

const MAX_PACKET = 5 * 1000 // max number of packets
// const MAX_PACKET = Math.pow(2, 26)

const PACKET_ID = 10
const PACKET_GENERATOR = () => ([Math.random() + 12, Math.random() + 12, Math.random() + 12, Math.random() + 12, Math.random() + 12, Math.random() + 12])
const BOARD_IP = "10.0.0.11"

const TARGET_PORT = 42099
const LISTENING_PORT = 42099
const LISTENING_HOST = '0.0.0.0'

const server = dgram.createSocket('udp4')

server.on('error', (err) => {
  console.log(`${LISTENING_HOST}:${LISTENING_PORT} server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.debug(`[${rinfo.address}] Received message but cannot decode.`)
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  server.setBroadcast(true);
});

server.bind(LISTENING_PORT, LISTENING_HOST);

function sleep(ms) {
  return new Promise((res, _) => {
    setTimeout(() => {
      res(true)
    }, ms)
  })
}

;(async () => {
  const START = Date.now()
  await sleep(500)
  // await delayedRecurse(1000 / FPS, (counter) => {
  //   return new Promise((res) => {
  //     if (counter >= MAX_PACKET) {
  //       res(false)
  //     }

  //     const p = new DevPacket(PACKET_ID, PACKET_GENERATOR(), Date.now() - START)
  //     // console.log(`sending #${counter}`)
  //     // const pktBuffer = p.toBuffer()
      // const pktBuffer = new Buffer([0x95, 0x05, 0xd2, 0x4a, 0x6c, 0x00, 0x9b, 0x76, 0x02, 0xc8, 0xaf, 0x00, 0x00]);
      const pktBuffer = new Buffer([0x95, 0x05, 0x04, 0xab, 0x6e, 0x00, 0x30, 0x4e, 0x02, 0xc8, 0xaf, 0x00, 0x00]);
  //     const addressBuffer = Buffer.from(BOARD_IP, "utf8")
  //     const lenBuffer = Buffer.alloc(1)
  //     lenBuffer.writeUInt8(addressBuffer.byteLength)
  //     const msgBuffer = Buffer.concat([lenBuffer, addressBuffer, pktBuffer])
  //     server.send(pktBuffer, TARGET_PORT, ((error) => {
  //       if (error) {
  //         console.error(error)
  //         res(false)
  //       }
  //       res(true)
  //     }))
  //   })
  // }, 0)
  server.send(pktBuffer, TARGET_PORT, BOARD_IP, ((error) => {
    if (error) {
      console.error(error)
      res(false)
    }
    res(true)
  }))
  console.log('done')
  process.exit(0)
})()

async function delayedRecurse(ms, handler, counter) {
  await sleep(ms)
  let result
  try {
    result = await handler(counter)
  } catch (err) {
    console.error(err)
  }
  if (!result) {
    return
  }
  await delayedRecurse(ms, handler, counter + 1)
}
