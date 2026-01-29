import fetch from 'node-fetch'

const API_KEY = 'AdonixKeyrku1g92356'

const API_URL = 'https://api-adonix.ultraplus.click/download/spotify'

async function fetchSpotify(url) {

  for (let i = 0; i < 2; i++) {

    try {

      const controller = new AbortController()

      setTimeout(() => controller.abort(), 15000)

      let res = await fetch(url, { signal: controller.signal })

      let json = await res.json()

      if (json?.status && json?.result?.url) return json

    } catch {}

  }

  return null

}

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {

    return m.reply(`❌ Usa un link de Spotify\n\nEjemplo:\n${usedPrefix + command} https://open.spotify.com/track/XXXX`)

  }

  await conn.reply(m.chat, '⏳ Descargando desde Spotify...', m)

  const apiURL = `${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(text)}`

  const data = await fetchSpotify(apiURL)

  if (!data) {

    return m.reply('❌ Spotify está ocupado, intenta otra vez en unos segundos.')

  }

  const r = data.result

  await conn.sendMessage(m.chat, {

    image: { url: r.thumbnail },

    caption: `🎧 *Spotify*\n\n🎵 *${r.title}*`

  }, { quoted: m })

  await conn.sendMessage(m.chat, {

    audio: { url: r.url },

    mimetype: 'audio/mpeg',

    fileName: `${r.title}.mp3`

  }, { quoted: m })

}

handler.command = ['spotifydl', 'spdl']

handler.tags = ['donwloader']

handler.help = ['spotifydl']

handler.register = false

export default handler