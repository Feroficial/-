let handler = async (m, { conn, text, isAdmin, isBotAdmin }) => {

  if (!m.isGroup)

    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)

  if (!isAdmin)

    return conn.reply(m.chat, '❌ Solo admins pueden usar este comando.', m)

  if (!text || !['open', 'close'].includes(text.toLowerCase()))

    return conn.reply(

      m.chat,

      '❌ Usa: #group open | close',

      m

    )

  if (!isBotAdmin)

    return conn.reply(m.chat, '❌ Necesito ser admin para cambiar la configuración del grupo.', m)

  if (text.toLowerCase() === 'open') {

    await conn.groupSettingUpdate(m.chat, 'not_announcement')

    return conn.reply(m.chat, '🔓 El grupo ahora está ABIERTO. Todos pueden enviar mensajes.', m)

  }

  if (text.toLowerCase() === 'close') {

    await conn.groupSettingUpdate(m.chat, 'announcement')

    return conn.reply(m.chat, '🔒 El grupo ahora está CERRADO. Solo admins pueden enviar mensajes.', m)

  }

}

handler.command = ['group']

handler.tags = ['group']

handler.help = ['group']

handler.register = false

export default handler