const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const Pino = require("pino")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
  auth: state,
  logger: Pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

// QR EVENT
sock.ev.on("connection.update", (update) => {
  const { connection, qr } = update
  if (qr) {
    console.log("Scan QR Code Below 👇")
    console.log(qr)
  }
  if (connection === "open") {
    console.log("✅ ZORRO BOT CONNECTED")

    // Send session ID to your own chat
    const sessionData = JSON.stringify(state.creds, null, 2)
    sock.sendMessage(sock.user.id, { text: "🔥 ZORRO SESSION DATA:\n\n" + sessionData })
  }
})

// Auto reply
sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0]
  if (!msg.message || msg.key.fromMe) return

  const text = msg.message.conversation || msg.message.extendedTextMessage?.text
  const from = msg.key.remoteJid

  if (text == "hi") {
    await sock.sendMessage(from, { text: "👋 Hello from ZORRO BOT" })
  }
})

}

startBot()
