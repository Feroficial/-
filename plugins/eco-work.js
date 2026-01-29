let handler = async (m, { conn }) => {

  try {

    const cooldown = 2 * 60 * 1000 // 2 minutos

    const now = Date.now()

    // Inicializar usuario

    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}

    let user = global.db.data.users[m.sender]

    if (user.coin == null) user.coin = 0

    if (user.exp == null) user.exp = 0

    if (user.lastWork == null) user.lastWork = 0

    // Cooldown

    if (now - user.lastWork < cooldown) {

      const remaining = Math.ceil((cooldown - (now - user.lastWork)) / 1000)

      return m.reply(

        `🧃 *Entrenamiento en curso*\n` +

        `⏳ Espera *${remaining}s* para volver a entrenar.\n\n` +

        `📖 *Teoría Denji:* Incluso los denjis entrenan en silencio.`

      )

    }

    user.lastWork = now

    // Textos Dragon Ball

    const winTexts = [

      'Denji entrenó contigo y rompiste un límite invisible 🥋',

      'Fer aceptó entrenarte tras ver tu orgullo intacto 💥',

      'darkenes corrigió tu postura… fue un avance divino ✨',

      'jose decidió no borrarte del universo 🌌',

      'Niki te recompensó por probar tecnología Denji 🧪',

      'Un Denji observó tu progreso con interés ⚖️',

      'El entrenamiento Denji aceleró tu evolución ⏱️',

      'Fer bendijo tu disciplina 🌌',

      'Tu Denji fluyó como el de un Denji-Bot ⚡',

      'El espíritu Denji-Bot despertó brevemente 🔥'

    ]

    const loseTexts = [

      'Intentaste enfrentar al Fer… un golpe fue suficiente 💀',

      'jose se molestó y saliste volando 😨',

      'darkenes negó con la cabeza ante tu error 🤦',

      'Fer se fue decepcionado 😤',

      'El aura no respondió ❌',

      'Tu cuerpo colapsó por exceso de entrenamiento 🌱',

      'La tierra no estuvo de tu lado 🌌',

      'Perdiste el control de tu Denji poder ⚠️',

      'Subestimaste a tu rival 🩸',

      'El orgullo te traicionó 🥀'

    ]

    // Recompensas

    const zenis = Math.floor(Math.random() * 1000) + 1

    const xpWin = Math.floor(Math.random() * 25) + 15

    const xpLose = Math.floor(Math.random() * 10) + 5

    const isWin = Math.random() < 0.55

    let msg = ''

    if (isWin) {

      const text = winTexts[Math.floor(Math.random() * winTexts.length)]

      user.coin += zenis

      user.exp += xpWin

      msg = `

🧃 *ENTRENAMIENTO EXITOSO*

📖 ${text}

💰 Denjis ganados: *${zenis.toLocaleString()}*

💎 Denjis totales: *${user.coin.toLocaleString()}*

`

    } else {

      const text = loseTexts[Math.floor(Math.random() * loseTexts.length)]

      const lossPercent = Math.floor(Math.random() * 40) + 30

      const lost = Math.min(Math.floor(zenis * (lossPercent / 100)), user.coin)

      user.coin -= lost

      user.exp += xpLose

      msg = `

💥 *ENTRENAMIENTO FALLIDO*

📖 ${text}

💸 Denjis perdidos: *${lost.toLocaleString()}*

💎 Denjis restantes: *${user.coin.toLocaleString()}*

`

    }

    await conn.sendMessage(

      m.chat,

      { text: msg.trim(), mentions: [m.sender] },

      { quoted: m }

    )

  } catch (e) {

    console.error('❌ Error en work:', e)

    m.reply('❌ Ocurrió un error durante el entrenamiento.')

  }

}

// 🔥 PARA EL MENÚ 🔥

handler.help = ['work']

handler.tags = ['eco']

handler.command = ['work', 'trabajar']

handler.disabled = false

handler.register = false

export default handler