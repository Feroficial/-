import fetch from "node-fetch"
import yts from 'yt-search'

const BOT_NAME = "KILLUA-BOT v1.00"
const ADONIX_API = "https://api-adonix.ultraplus.click/download/ytaudio"
const ADONIX_KEY = "dvyer"

global.pendingDownloads = global.pendingDownloads || new Map()

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m, global.channelInfo)

    if (global.pendingDownloads.get(m.sender)) {
      return conn.reply(
        m.chat,
        "⚠️ Tienes un audio pendiente enviándose. Espera a que termine antes de solicitar otro.",
        m,
        global.channelInfo
      )
    }

    global.pendingDownloads.set(m.sender, true)
    await m.react('🕒')

    const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
    const query = videoMatch ? 'https://youtu.be/' + videoMatch[1] : text
    const search = await yts(query)
    const result = videoMatch
      ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0]
      : search.all[0]

    if (!result) throw 'ꕥ No se encontraron resultados.'

    const { title, thumbnail, timestamp, views, ago, url, author, seconds } = result
    if (seconds > 1800) throw '⚠ El contenido supera el límite de duración (30 minutos).'

    const vistas = formatViews(views)
    const info = `「✦」Descargando *<${title}>*\n\n> ❑ Canal » *${author.name}*\n> ♡ Vistas » *${vistas}*\n> ✧︎ Duración » *${timestamp}*\n> ☁︎ Publicado » *${ago}*\n> ➪ Link » ${url}`
    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(m.chat, { image: thumb, caption: info }, { quoted: m, ...global.channelInfo })

    const audio = await getAud(url)
    if (!audio?.url) throw '⚠ No se pudo obtener el audio desde Adonix.'

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audio.url },
        fileName: `${title}.mp3`,
        mimetype: 'audio/mpeg',
        caption: `🎧 ${title}\n🤖 Bot: ${BOT_NAME}`
      },
      { quoted: m, ...global.channelInfo }
    )

    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    return conn.reply(
      m.chat,
      typeof e === 'string' ? e : '⚠︎ Se ha producido un problema.\n> Usa *' + usedPrefix + 'report* para informarlo.\n\n' + e.message,
      m,
      global.channelInfo
    )
  } finally {
    global.pendingDownloads.delete(m.sender)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'playaudio']
handler.tags = ['descargas']
handler.group = true
export default handler

async function getAud(url) {
  try {
    const endpoint = `${ADONIX_API}?apikey=${ADONIX_KEY}&url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint).then(r => r.json())
    if (res?.data?.url) return { url: res.data.url, api: 'Adonix' }
  } catch (e) {
    console.error("Error en API Adonix:", e)
  }
  return null
}

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}