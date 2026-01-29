let handler = async (m, { conn, isAdmin }) => {

  if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)

  if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden usar este comando.', m)

  let participants = m.participants.map(u => u.id)

  if (!participants.length) return conn.reply(m.chat, '❌ No hay miembros en el grupo.', m)

  // Elegir un miembro al azar

  let winner = participants[Math.floor(Math.random() * participants.length)]

  // Contenido de la caja misteriosa

  const rewards = [

    '🎉 Ganaste un sticker sorpresa!',

    '✨ Has recibido 50 Denjis fantasma!',

    '💌 Mensaje secreto del admin!',

    '🃏 Has encontrado un GIF misterioso!'

  ]

  let reward = rewards[Math.floor(Math.random() * rewards.length)]

  // Mensaje decorativo

  let text = `

🎁 ¡Caja Misteriosa Activada!

👤 Ganador: @${winner.split('@')[0]}

🎯 Recompensa: ${reward}

🧃 Disfruta tu sorpresa, pero shhh… es secreta!

  `.trim()

  await conn.sendMessage(

    m.chat,

    { text, mentions: [winner] },

    { quoted: m }

  )

}

handler.command = ['mystery']

handler.tags = ['group']

handler.help = ['mystery']

handler.register = false

export default handler