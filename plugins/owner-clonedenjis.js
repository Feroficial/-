let handler = async (m, { conn }) => {

  try {

    // 👑 SOLO OWNER

    const owners = global.owner.map(v => v[0] + '@s.whatsapp.net')

    if (!owners.includes(m.sender)) {

      return conn.reply(m.chat, '❌ Solo el Owner puede usar este comando.', m)

    }

    // 🎯 Obtener objetivo

    let target =

      m.mentionedJid?.[0] ||

      (m.quoted ? m.quoted.sender : null)

    if (!target) {

      return conn.reply(m.chat, '⚠️ Menciona o responde a un usuario.', m)

    }

    let users = global.db.data.users

    let victim = users[target]

    let ownerUser = users[m.sender] ??= { coin: 0 }

    if (!victim || !victim.coin || victim.coin <= 0) {

      return conn.reply(m.chat, '⚠️ Ese usuario no tiene Denjis para clonar.', m)

    }

    let clon = victim.coin

    // 💰 CLONAR (NO RESTA AL USUARIO)

    ownerUser.coin += clon

    let msg = `

╭──🧬  CLONACIÓN COMPLETA  🧬──╮

│ 👤 Usuario clonado: @${target.split('@')[0]}

│ 💰 Denjis copiados: ${clon}

│ 👑 Owner recibe: +${clon}

│ 🏦 Tu balance: ${ownerUser.coin}

╰──────────────────────────────╯

😈 El dinero ahora existe dos veces

    `.trim()

    await conn.sendMessage(

      m.chat,

      { text: msg, mentions: [target] },

      { quoted: m }

    )

  } catch (e) {

    console.error(e)

    conn.reply(m.chat, '❌ Error al clonar Denjis.', m)

  }

}

handler.command = ['clonedenjis']

handler.tags = ['owner']

handler.help = ['clonedenjis']

handler.register = false

export default handler