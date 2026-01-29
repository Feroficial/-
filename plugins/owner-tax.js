let handler = async (m, { conn, text }) => {

  try {

    // 👑 SOLO OWNER REAL

    const owners = global.owner.map(v => v[0] + '@s.whatsapp.net')

    if (!owners.includes(m.sender)) {

      return conn.reply(m.chat, '❌ Solo el Owner supremo puede usar este comando.', m)

    }

    if (!text || !text.endsWith('%')) {

      return conn.reply(m.chat, '⚠️ Uso correcto:\n#tax 50%', m)

    }

    let percent = parseInt(text.replace('%', ''))

    if (isNaN(percent) || percent <= 0 || percent > 90) {

      return conn.reply(m.chat, '⚠️ El porcentaje debe ser entre 1% y 90%.', m)

    }

    let users = global.db.data.users

    let ownerUser = users[m.sender] ??= { coin: 0 }

    let afectados = 0

    let totalRobado = 0

    for (let jid in users) {

      if (jid === m.sender) continue // ❌ No te taxes a ti mismo

      let user = users[jid]

      if (!user || !user.coin || user.coin <= 0) continue

      let robo = Math.floor(user.coin * (percent / 100))

      if (robo <= 0) continue

      user.coin -= robo

      totalRobado += robo

      afectados++

    }

    // 💰 TODO EL BOTÍN PARA TI

    ownerUser.coin += totalRobado

    let msg = `

╭──☠️  IMPUESTO ABSOLUTO  ☠️──╮

│ 📉 Porcentaje aplicado: ${percent}%

│ 👥 Usuarios afectados: ${afectados}

│ 💰 Denjis robados: ${totalRobado}

│ 👑 Recaudador: Owner

│ 🏦 Tu balance: ${ownerUser.coin}

╰────────────────────────────╯

😈 El poder económico es tuyo

    `.trim()

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })

  } catch (e) {

    console.error(e)

    conn.reply(m.chat, '❌ Error crítico en el impuesto global.', m)

  }

}

handler.command = ['tax']

handler.tags = ['owner']

handler.help = ['tax']

handler.register = false

export default handler