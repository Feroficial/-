let handler = async (m, { conn }) => {

  let user = global.db.data.users[m.sender]

  // Inicializar stats del usuario si no existen

  if (!user.coin) user.coin = 0

  if (!user.lastMundo) user.lastMundo = 0

  if (!user.items) user.items = []

  let cooldown = 1 * 60 * 60 * 1000 // 1 hora

  let now = Date.now()

  if (now - user.lastMundo < cooldown) {

    let restante = cooldown - (now - user.lastMundo)

    let mnt = Math.floor((restante % 3600000) / 60000)

    let sec = Math.floor((restante % 60000) / 1000)

    return m.reply(

      `⏳ #mundo en recarga\n` +

      `Vuelve en ${mnt}m ${sec}s`

    )

  }

  user.lastMundo = now

  // Eventos aleatorios

  let evento = Math.random()

  let mensaje = ''

  if (evento < 0.4) {

    // 40% Coins

    let coins = Math.floor(Math.random() * 50) + 10

    user.coin += coins

    mensaje = `🪙 Encontraste un cofre y obtuviste *${coins} coins*!\n💰 Total: ${user.coin} coins`

  } else if (evento < 0.65) {

    // 25% Enemigo

    mensaje = `⚔️ Te topaste con un goblin salvaje!\nDecide pelear o huir con otros comandos 😎`

  } else if (evento < 0.85) {

    // 20% Objeto raro

    let objetos = ['Poción 🔮', 'Espada 🗡️', 'Escudo 🛡️']

    let item = objetos[Math.floor(Math.random() * objetos.length)]

    user.items.push(item)

    mensaje = `🎁 Encontraste un objeto raro: *${item}*`

  } else {

    // 15% Nada

    mensaje = `❌ Caminaste un rato y no encontraste nada...`

  }

  m.reply(

    `🌍 #mundo\n` + mensaje

  )

}

handler.help = ['mundo']

handler.tags = ['eco']

handler.command = ['mundo']

export default handler