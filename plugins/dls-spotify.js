import fetch from 'node-fetch'

const API_KEY = 'AdonixKeyrku1g92356'

const API_URL = 'https://api-adonix.ultraplus.click/search/spotify'

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {

    return m.reply(`❌ Escribe el nombre de una canción\n\nEjemplo:\n${usedPrefix + command} nena maldicion`)

  }

  try {

    let res = await fetch(`${API_URL}?apikey=${API_KEY}&query=${encodeURIComponent(text)}`)

    let json = await res.json()

    if (!json?.status || !json?.result?.results?.length) {

      return m.reply('❌ No se encontraron resultados en Spotify.')

    }

    let results = json.result.results.slice(0, 5)

    let txt = `🎧 *RESULTADOS SPOTIFY*\n\n`

    txt += `🔎 Búsqueda: *${json.result.query}*\n\n`

    results.forEach((v, i) => {

      txt += `*${i + 1}.* 🎵 *${v.title}*\n`

      txt += `👤 Artista: ${v.artist}\n`

      txt += `💿 Álbum: ${v.album}\n`

      txt += `⏱ Duración: ${v.duration}\n`

      txt += `🔥 Popularidad: ${v.popularity}\n`

      txt += `🔗 ${v.link}\n\n`

    })

    await conn.sendMessage(m.chat, {

      image: { url: results[0].image },

      caption: txt

    }, { quoted: m })

  } catch (e) {

    console.error(e)

    m.reply('❌ Error al conectar con Spotify.')

  }

}

handler.command = ['spotify']

handler.help = ['spotify']

handler.tags = ['donwloader']

handler.register = false

export default handler