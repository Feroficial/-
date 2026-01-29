import fetch from 'node-fetch'

import ffmpeg from 'fluent-ffmpeg'

import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args.length) {

    return m.reply(`*Uso:* \( {usedPrefix} \){command} <nombre de la canción>\nEj: \( {usedPrefix} \){command} Dalex Hola Remix`)

  }

  const query = args.join(' ').trim()

  await m.reply(`🔍 Buscando *${query}*...`)

  try {

    // 1. Búsqueda en API (usa Adonix o GawrGura)

    const searchUrl = `https://api-adonix.ultraplus.click/search?q=${encodeURIComponent(query)}` // o tu GawrGura si prefieres

    const searchRes = await fetch(searchUrl)

    if (!searchRes.ok) throw new Error('Búsqueda falló')

    const json = await searchRes.json()

    if (!json.status || !json.data?.url) return m.reply('❌ No encontré resultados.')

    const data = json.data

    let title = data.title || 'Canción desconocida'

    let artist = 'Artista desconocido'

    // Parsear artista del título

    if (title.includes(' - ') || title.includes(' ft. ') || title.includes(' feat. ')) {

      const sep = title.includes(' - ') ? ' - ' : title.includes(' ft. ') ? ' ft. ' : ' feat. '

      const parts = title.split(sep)

      artist = parts[0].trim()

      title = parts.slice(1).join(sep).trim()

    }

    const audioUrl = data.url

    const thumb = data.thumbnail || null

    await m.reply(`🎵 Procesando *${title}* de ${artist} con FFmpeg...`)

    // 2. Descargar MP3 original como stream

    const originalAudio = await fetch(audioUrl)

    if (!originalAudio.ok) throw new Error('Descarga falló')

    // 3. Usar FFmpeg para re-encodear + agregar metadata

    const processedAudio = ffmpeg(originalAudio.body)

      .audioCodec('aac')                        // codec compatible con WhatsApp

      .audioBitrate(128)                        // bitrate razonable (ajusta si quieres más calidad)

      .format('ipod')                           // contenedor mp4/aac (iPod es un preset bueno para WA)

      .outputOptions([

        '-movflags +faststart',                 // optimiza para streaming

        '-metadata title=' + title,

        '-metadata artist=' + artist,

        '-metadata album=Denji-Bot Music',      // opcional

        '-metadata comment=Descargado con Denji-Bot'

      ])

    if (thumb) {

      // Si tienes thumbnail, puedes agregarlo como carátula (necesita descargar la imagen también)

      const thumbRes = await fetch(thumb)

      processedAudio.input(thumbRes.body)

      processedAudio.complexFilter([

        '[1:v]scale=512:512[thumb]',

        '[0:a][thumb]concat=n=1:v=1:a=1[v][a]'

      ])

      processedAudio.outputOptions('-map [a]', '-map [v]', '-metadata:s:v title="Album cover"')

    }

    const caption = `

🎵 **${title}**

Artista: **${artist}**

${data.duration ? `Duración: ${data.duration}` : ''}

⬅ Denji-Bot ➡

`.trim()

    await conn.sendMessage(m.chat, {

      audio: processedAudio.pipe(),  // envía el stream procesado directamente

      mimetype: 'audio/mp4',

      fileName: `${artist} - ${title}.m4a`,  // .m4a es más compatible que .mp3

      caption,

      contextInfo: {

        externalAdReply: {

          showAdAttribution: true,

          title: `${artist} - ${title}`,

          body: `Duración: ${data.duration || 'N/A'} • Denji-Bot 🎶`,

          thumbnailUrl: thumb || undefined,

          sourceUrl: audioUrl,

          mediaUrl: audioUrl,

          mediaType: 2,

          renderLargerThumbnail: true

        }

      }

    }, { quoted: m })

    m.reply(`✅ ¡Reproduciendo *${artist} - ${title}* con metadata agregada!`)

  } catch (e) {

    console.error('[PLAY ERROR]', e)

    m.reply(`❌ Error: ${e.message || 'Fallo al procesar con FFmpeg. Intenta otro nombre.'}`)

  }

}

handler.command = ['play']

handler.tags = ['downloader']

handler.help = ['play']

handler.register = false

export default handler