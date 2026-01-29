import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix }) => {

  if (!args.length) {

    return m.reply(

      `⚠️ *Uso correcto:*\n` +

      `${usedPrefix}tiktok <búsqueda>\n\n` +

      `📌 *Ejemplo:*\n` +

      `${usedPrefix}tiktok goku edit`

    )

  }

  try {

    const query = encodeURIComponent(args.join(' '))

    const url = `https://gawrgura-api.onrender.com/search/tiktok?q=${query}`

    const res = await fetch(url)

    if (!res.ok) throw 'API no respondió'

    const json = await res.json()

    if (!json.status || !Array.isArray(json.result) || json.result.length === 0) {

      return m.reply('❌ No se encontraron videos.')

    }

    // video aleatorio

    const video = json.result[Math.floor(Math.random() * json.result.length)]

    const videoUrl = video.play || video.wmplay

    if (!videoUrl) return m.reply('❌ Video no disponible.')

    const caption = `

🎵 *TikTok Downloader*

⬅  𝐃𝐄𝐍𝐉𝐈-𝐁𝐎𝐓  ➡

📌 *Título:* ${video.title || 'Sin título'}

👤 *Autor:* ${video.author?.nickname || 'Desconocido'}

⏱️ *Duración:* ${video.duration || 0}s

❤️ *Likes:* ${video.digg_count || 0}

💬 *Comentarios:* ${video.comment_count || 0}

🔁 *Compartidos:* ${video.share_count || 0}

`.trim()

    await conn.sendMessage(

      m.chat,

      {

        video: { url: videoUrl },

        caption

      },

      { quoted: m }

    )

  } catch (err) {

    console.error('[TikTok Error]', err)

    m.reply('❌ Error al obtener el video de TikTok.')

  }

}

handler.command = ['tiktok', 'tt']

handler.tags = ['donwloader']

handler.help = ['tiktok']

handler.register = false

export default handler