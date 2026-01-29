const OWNER_NUMBER = '50432788804@s.whatsapp.net'

const handler = async (m, { conn, args }) => {

  // Verificar owner por número

  if (m.sender !== OWNER_NUMBER) {

    return m.reply('❌ Este comando es solo para el owner.')

  }

  // Obtener usuario objetivo

  let user =

    m.mentionedJid?.[0] ||

    (args[0]?.includes('@') ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null) ||

    m.sender

  let amount = parseInt(args[1] || args[0])

  if (!user || isNaN(amount)) {

    return m.reply(

      `⚠️ Uso correcto:\n` +

      `• ${usedPrefix}adddenjis 100\n` +

      `• ${usedPrefix}adddenjis @usuario 100`

    )

  }

  if (amount <= 0) return m.reply('❌ La cantidad debe ser mayor a 0.')

  // Crear usuario si no existe

  if (!global.db.data.users[user]) {

    global.db.data.users[user] = { coin: 0 }

  }

  // Agregar coins

  global.db.data.users[user].coin += amount

  m.reply(

    `✅ *DENJIS AÑADIDOS*\n\n` +

    `👤 Usuario: @${user.split('@')[0]}\n` +

    `🪙 Denjis añadidos: ${amount}\n` +

    `💰 Total actual: ${global.db.data.users[user].coin}`,

    null,

    { mentions: [user] }

  )

}

handler.command = ['adddenjis']

handler.tags = ['owner']

handler.help = ['adddenjis']

handler.owner = true

handler.register = false

export default handler