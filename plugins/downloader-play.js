import { spawn } from 'child_process'
import fs from 'fs'
import fetch from 'node-fetch'

// Puedes usar estas APIs públicas (sin necesidad de API Key)
const YT_SEARCH_API = 'https://www.googleapis.com/youtube/v3/search'

// Usamos una API key pública (puede tener límites, recomiendo conseguir tu propia API key)
// Obtén tu propia API Key en: https://console.cloud.google.com/apis/library/youtube.googleapis.com
const YOUTUBE_API_KEY = 'AIzaSyA-OesM6ZqE4prh37VQkM4KX4E8K5jM8Ng' // Esta es una key de ejemplo, mejor usa tu propia key

const yt = {
  static: Object.freeze({
    baseUrl: 'https://cnv.cx',
    headers: {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'origin': 'https://frame.y2meta-uk.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0'
    }
  }),
  
  log(m) { console.log(`[yt-skrep] ${m}`) },
  
  // Función para buscar video en YouTube por texto
  async searchVideo(query) {
    try {
      // Primero intentamos con API pública
      const searchUrl = `https://yt-api.p.rapidapi.com/search?query=${encodeURIComponent(query)}`
      
      const response = await fetch(searchUrl, {
        headers: {
          'x-rapidapi-key': 'd7b0d0dff9msh8f1c8e2d2b2b3b2p1b0d0djsn8f1c8e2d2b2b', // Key de ejemplo
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data[0]) {
          const videoId = data.data[0].videoId
          return `https://youtu.be/${videoId}`
        }
      }
      
      // Si falla, usamos un método alternativo
      const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      const html = await fetch(fallbackUrl).then(r => r.text())
      
      // Extraer el primer video ID del HTML (método simple)
      const videoIdMatch = html.match(/"videoId":"([^"]+)"/)
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://youtu.be/${videoIdMatch[1]}`
      }
      
      throw new Error('No se encontró el video')
      
    } catch (error) {
      console.error('Error en búsqueda:', error)
      
      // Método alternativo usando invidious (instancia pública)
      try {
        const invidiousUrl = `https://inv.riverside.rocks/api/v1/search?q=${encodeURIComponent(query)}&type=video`
        const invidiousRes = await fetch(invidiousUrl)
        if (invidiousRes.ok) {
          const data = await invidiousRes.json()
          if (data[0] && data[0].videoId) {
            return `https://youtu.be/${data[0].videoId}`
          }
        }
      } catch (e) {
        console.error('Error con invidious:', e)
      }
      
      throw new Error(`No se pudo encontrar "${query}" en YouTube`)
    }
  },
  
  resolveConverterPayload(link, f = '128k') {
    const formatos = ['128k', '320k', '144p', '240p', '360p', '720p', '1080p']
    if (!formatos.includes(f)) throw Error(`Formato inválido. Formatos disponibles: ${formatos.join(', ')}`)
    const tipo = f.endsWith('k') ? 'mp3' : 'mp4'
    const audioBitrate = tipo === 'mp3' ? parseInt(f) + '' : '128'
    const videoQuality = tipo === 'mp4' ? parseInt(f) + '' : '720'
    return { link, format: tipo, audioBitrate, videoQuality, filenameStyle: 'pretty', vCodec: 'h264' }
  },
  
  sanitizeFileName(n) {
    const ext = n.match(/\.[^.]+$/)[0]
    const name = n.replace(new RegExp(`\\${ext}$`), '').replaceAll(/[^A-Za-z0-9]/g, '_').replace(/_+/g, '_').toLowerCase()
    return name + ext
  },
  
  async getBuffer(u) {
    const h = structuredClone(this.static.headers)
    h.referer = 'https://v6.www-y2mate.com/'
    h.range = 'bytes=0-'
    delete h.origin
    const r = await fetch(u, { headers: h })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    const ab = await r.arrayBuffer()
    return Buffer.from(ab)
  },
  
  async getKey() {
    const r = await fetch(this.static.baseUrl + '/v2/sanity/key', { headers: this.static.headers })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return await r.json()
  },
  
  async convert(u, f) {
    const { key } = await this.getKey()
    const p = this.resolveConverterPayload(u, f)
    const h = { key, ...this.static.headers }
    const r = await fetch(this.static.baseUrl + '/v2/converter', { headers: h, method: 'post', body: new URLSearchParams(p) })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return await r.json()
  },
  
  async download(u, f) {
    const { url, filename } = await this.convert(u, f)
    const buffer = await this.getBuffer(url)
    return { fileName: this.sanitizeFileName(filename), buffer }
  }
}

// Convertir video a faststart
async function convertToFast(buffer) {
  const tempIn = './temp_in.mp4'
  const tempOut = './temp_out.mp4'
  fs.writeFileSync(tempIn, buffer)
  await new Promise((res, rej) => {
    const ff = spawn('ffmpeg', ['-i', tempIn, '-c', 'copy', '-movflags', 'faststart', tempOut])
    ff.on('close', code => code === 0 ? res() : rej(new Error('Error al convertir con ffmpeg')))
  })
  const newBuffer = fs.readFileSync(tempOut)
  fs.unlinkSync(tempIn)
  fs.unlinkSync(tempOut)
  return newBuffer
}

// Handler para play (busca y descarga audio)
let handler = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`*\`🧇 ESCRIBE EL NOMBRE DE LA CANCIÓN\`*\n*Ejemplo:* .play hola remix`)

  try {
    await m.react('🔍') // Reacción de búsqueda
    await m.reply(`*🔍 Buscando:* ${args.join(' ')}`)
    
    // Buscar el video en YouTube
    const videoUrl = await yt.searchVideo(args.join(' '))
    
    await m.react('🕓') // Reacción de descarga
    await m.reply(`*📥 Descargando audio...*`)
    
    const formato = '128k' // Formato por defecto para audio
    const { buffer, fileName } = await yt.download(videoUrl, formato)

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName
    }, { quoted: m })

    await m.react('✅️') // Reacción al terminar
  } catch (e) {
    console.error(e)
    await m.react('❌')
    return m.reply(`❌ Error: ${e.message}`)
  }
}

// Handler para play con video
let handler2 = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`*Ejemplo:* .playv hola remix`)

  try {
    await m.react('🔍') // Reacción de búsqueda
    await m.reply(`*🔍 Buscando:* ${args.join(' ')}`)
    
    // Buscar el video en YouTube
    const videoUrl = await yt.searchVideo(args.join(' '))
    
    await m.react('🕓') // Reacción de descarga
    await m.reply(`*📥 Descargando video...*`)
    
    const formato = '720p' // Formato por defecto para video
    let { buffer, fileName } = await yt.download(videoUrl, formato)
    buffer = await convertToFast(buffer)

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName
    }, { quoted: m })

    await m.react('✅️') // Reacción al terminar
  } catch (e) {
    console.error(e)
    await m.react('❌')
    return m.reply(`❌ Error: ${e.message}`)
  }
}

// Handler para audio específico (manteniendo ytmp3)
let handler3 = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`*\`🧇 ESCRIBE UN LINK DE YOUTUBE\`*`)

  try {
    await m.react('🕓')
    const formato = args[1] || '128k'
    const { buffer, fileName } = await yt.download(args[0], formato)

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName
    }, { quoted: m })

    await m.react('✅️')
  } catch (e) {
    return m.reply(`❌ Ocurrió un error: ${e.message}`)
  }
}

// Handler para video específico (manteniendo ytmp4)
let handler4 = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`*Ejemplo:* .ytmp4 https://youtu.be/JiEW1agPqNY`)

  try {
    await m.react('🕓')
    const formato = args[1] || '720p'
    let { buffer, fileName } = await yt.download(args[0], formato)
    buffer = await convertToFast(buffer)

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName
    }, { quoted: m })

    await m.react('✅️')
  } catch (e) {
    return m.reply(`❌ Ocurrió un error: ${e.message}`)
  }
}

// Comandos
handler.help = ['play <nombre canción>']
handler.tags = ['dl', 'audio']
handler.command = ['play', 'p', 'musica']

handler2.help = ['playv <nombre canción>']
handler2.tags = ['dl', 'video']
handler2.command = ['playv', 'pv', 'videoplay']

handler3.help = ['ytmp3 <link>']
handler3.tags = ['dl']
handler3.command = ['ytmp3', 'yta', 'ytmp3vd']

handler4.help = ['ytmp4 <link>']
handler4.tags = ['dl']
handler4.command = ['ytmp4', 'ytv', 'ytvideovd']

export default handler
export { handler2, handler3, handler4 }