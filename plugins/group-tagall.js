let handler = async (m, { conn, isAdmin }) => {

  if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)

  if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden usar #tagall.', m)

  try {

    let groupMetadata = await conn.groupMetadata(m.chat)

    let participants = groupMetadata.participants.map(p => p.id)

    // Construir el mensaje mencionando a todos

    let text = '📢 @invocacion\n\n'

    text += participants.map(p => `👤 @${p.split('@')[0]}`).join('\n')

    text += '\n\n⚡ Todos han sido mencionados por el admin.'

    await conn.sendMessage(

      m.chat,

      { text, mentions: participants },

      { quoted: m }

    )

  } catch (e) {

    console.error('Error en #tagall:', e)

    conn.reply(m.chat, '❌ Ocurrió un error al mencionar a todos.', m)

  }

}

handler.command = ['tagall']

handler.tags = ['group']

handler.help = ['tagall']

handler.register = false

export default handler