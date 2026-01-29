let handler = async (m, { conn }) => {

  try {

    // 👤 Obtener usuario objetivo

    let target =

      m.mentionedJid?.[0] ||

      (m.quoted ? m.quoted.sender : m.sender)

    // 📦 Asegurar usuario en DB

    let users = global.db.data.users

    if (!users[target]) {

      users[target] = { coin: 0 }

    }

    let coins = users[target].coin || 0

    // 🎨 Texto decorado

    let text = `

╭───❖  BALANCE DENJIS  ❖───╮

│ 👤 Usuario: @${target.split('@')[0]}

│ 💠 Denjis: ${coins}

╰─────────────────────────╯

✨ Administra bien tu fortuna ✨

    `.trim()

    await conn.sendMessage(

      m.chat,

      { text, mentions: [target] },

      { quoted: m }

    )

  } catch (e) {

    console.error(e)

    conn.reply(m.chat, '❌ Ocurrió un error al ver el balance.', m)

  }

}

handler.command = ['bal', 'balance']

handler.tags = ['eco']

handler.help = ['bal']

handler.register = false

export default handler