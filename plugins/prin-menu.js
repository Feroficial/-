import moment from "moment-timezone"

import fs from "fs"

const USERS_DB = './database/users.json'

// Inicializar carpeta y archivo si no existen

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })

if (!fs.existsSync(USERS_DB)) fs.writeFileSync(USERS_DB, JSON.stringify([]), 'utf-8')

// Definición de categorías (tags)

const tags = {

  eco:  '💰 Economía',

  group:    '👥 Grupos',

  owner:     '👑 Owner',

  donwloader: '⬇️ Descargas',
    
  info: 'ℹ️ Información',
     

}

let handler = async (m, { conn, usedPrefix: prefix }) => {

  try {

    const hora = moment.tz("America/Tegucigalpa").format("HH:mm:ss")

    const fecha = moment.tz("America/Tegucigalpa").format("DD/MM/YYYY")

    const uptime = process.uptime()

    const hours = Math.floor(uptime / 3600)

    const minutes = Math.floor((uptime % 3600) / 60)

    const seconds = Math.floor(uptime % 60)

    const uptimeStr = `${hours.toString().padStart(2,'0')}h ${minutes.toString().padStart(2,'0')}m ${seconds.toString().padStart(2,'0')}s`

    // Usuarios registrados

    let users = []

    try { users = JSON.parse(fs.readFileSync(USERS_DB, 'utf-8')) } catch {}

    const totalUsers = users.length

    // Emojis kawaii/neko

    const emojis = ['✨', '🌸', '🎀', '🐾', '💫', '🍓', '🪄', '🧸', '💖', '🔮']

    // Agrupar comandos por tag

    const menuByTag = {}

    Object.values(global.plugins || {}).forEach(plugin => {

      if (plugin.disabled || !plugin.help || !plugin.tags) return

      const cmds = Array.isArray(plugin.help) ? plugin.help.filter(Boolean) : [plugin.help].filter(Boolean)

      const pluginTags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags]

      cmds.forEach(cmd => {

        if (!cmd || typeof cmd !== 'string' || cmd.trim() === '') return

        pluginTags.forEach(tag => {

          if (tags[tag]) {  // solo tags válidos

            if (!menuByTag[tag]) menuByTag[tag] = []

            const emoji = emojis[Math.floor(Math.random() * emojis.length)]

            menuByTag[tag].push(`${emoji} ${prefix}${cmd}`) // <-- aquí usamos variables reales

          }

        })

      })

    })

    // Construcción del texto del menú

    let txt = `

╭────✦ 🌸 Denji-Bot 🌸 

│ Hola! soy *${global.botname || 'Denji-Bot'}* ${conn.user.jid === global.conn.user.jid ? '🅥 Principal' : 'Sub-Bot'}

│

│ ⏰ Hora: ${hora}

│ 📅 Fecha: ${fecha}

│ ⚡ Activo: ${uptimeStr}

│ 💕 Usuarios: ${totalUsers}

╰─────✦ nyaa~ 

✿ Canal oficial:

https://whatsapp.com/channel/0029Vb7C4sr5fM5abFr6bL0W

`

    // Agregar categorías con comandos

    for (const tagKey in tags) {

      const comandos = menuByTag[tagKey] || []

      if (comandos.length === 0) continue

      txt += `\n╭─⊹ ${tags[tagKey]} ⊹─╮\n`

      comandos.forEach(line => {

        txt += `│ ${line}\n`

      })

      txt += `╰──────────────╯\n`

    }

    // Firma final

    txt += `

────────────────────────

ᴅᴇᴠ → Fer | 開発者

sʏsᴛᴇᴍ → ғᴜᴛᴜʀᴇ-ʙᴏᴛ ⚡

────────────────────────

"Ara ara~ ¿qué travesura haremos hoy? 🩸🪚♡"

`

    // Enviar mensaje

    const banner = global.michipg || ""

    if (banner && banner.trim()) {

      await conn.sendMessage(m.chat, { image: { url: banner }, caption: txt }, { quoted: m })

    } else {

      await conn.sendMessage(m.chat, { text: txt }, { quoted: m })

    }

  } catch (e) {

    console.error('Error en menú:', e)

    await conn.reply(m.chat, '❌ Error al mostrar el menú nya...', m)

  }

}

handler.command = ['help', 'menu']

handler.help = ['help']

handler.tags = ['main']

handler.register = false

export default handler
      
