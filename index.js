const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const Pino = require("pino")
const qrcode = require("qrcode-terminal")

async function start() {

const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
  auth: state,
  logger: Pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {
  const { connection, qr } = update   // ✅ IMPORTANT LINE

  if (qr) {
    console.log("📱 SCAN THIS QR CODE:")
    qrcode.generate(qr, { small: true })
  }

  if (connection === "open") {
    console.log("✅ WhatsApp Connected")
  }
})

}

start()
