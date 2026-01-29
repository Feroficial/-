import moment from "moment-timezone"

let handler = async (m, { conn, text }) => {

  if (!text)

    return conn.reply(

      m.chat,

      '❌ Escribe tu sugerencia.\n\nEjemplo:\n#sugerir Agregar comandos de economía',

      m

    )

  const owner = '50432788804@s.whatsapp.net'

  const hora = moment.tz('America/Tegucigalpa').format('HH:mm:ss')

  const fecha = moment.tz('America/Tegucigalpa').format('DD/MM/YYYY')

  const lugar = m.isGroup

    ? `Grupo: ${(await conn.groupMetadata(m.chat)).subject}`

    : 'Chat privado'

  const mensaje = `

📩 *Nueva sugerencia* 📩

👤 Usuario: ${m.pushName || 'Sin nombre'}

📱 Número: ${m.sender.split('@')[0]}

📍 Desde: ${lugar}

🕒 Hora: ${hora}

📅 Fecha: ${fecha}

💡 Sugerencia:

${text}

`.trim()

  // Enviar al owner

  await conn.sendMessage(owner, { text: mensaje })

  // Confirmación al usuario

  await conn.reply(

    m.chat,

    '✅ ¡Gracias por tu sugerencia!\nEl owner la recibirá pronto 💖',

    m

  )

}

handler.command = ['sugerir']

handler.help = ['sugerir <mensaje>']

handler.tags = ['info']

handler.register = false

export default handler