let handler = async (m, { conn }) => {

  const numeroOwner = '+50432788804' // tu número

  const mensaje = `

👑 Creador del bot:

📱 WhatsApp: ${numeroOwner}

🔥 Sígueme para más comandos y actualizaciones!

✿ Canal oficial:
https://whatsapp.com/channel/0029Vb7C4sr5fM5abFr6bL0W

  `.trim()

  m.reply(mensaje)

}

handler.help = ['creador']

handler.tags = ['owner']

handler.command = ['creador']

export default handler