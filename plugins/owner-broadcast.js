let handler = async (m, { conn, text }) => {

  // 🔐 Solo el owner

  const ownerNumber = '50432788804@s.whatsapp.net'

  if (m.sender !== ownerNumber)

    return conn.reply(m.chat, '❌ Solo el owner puede usar este comando.', m)

  if (!text)

    return conn.reply(m.chat, '❌ Debes escribir un mensaje.\n\nEjemplo:\n#broadcast Hola grupos', m)

  // 📦 Obtener TODOS los grupos reales del bot

  const groups = await conn.groupFetchAllParticipating()

  const groupIds = Object.keys(groups)

  if (!groupIds.length)

    return conn.reply(m.chat, '⚠️ El bot no está en ningún grupo.', m)

  let sent = 0

  for (let id of groupIds) {

    try {

      await conn.sendMessage(id, {

        text: `📢 *🧃 Broadcast del Owner 🧃* 📢\n\n✨ ${text} ✨\n\n🪚 Denji-Bot activo 🩸`

      })

      sent++

    } catch (e) {

      console.error('Error enviando a', id, e)

    }

  }

  conn.reply(m.chat, `✅ Broadcast enviado a *${sent}* grupo(s).`, m)

}

handler.command = ['broadcast']

handler.tags = ['owner']

handler.help = ['broadcast']

handler.register = false

export default handler