let handler = async (m, { conn, usedPrefix, command }) => {

    let user = global.db.data.users[m.sender]

    if (!user) user = global.db.data.users[m.sender] = { coin: 1000 } // Inicializa si no existe

    // Sacamos solo los argumentos después del comando

    let args = m.text.trim().split(/\s+/).slice(1)

    let color = args[0]?.toLowerCase()

    let bet = args[1]

    if (!color || !['red', 'black'].includes(color)) return m.reply('⚠️ Debes apostar a "red" o "black".')

    if (!bet) return m.reply('⚠️ Ingresa la cantidad a apostar.')

    // Apostar todo con "all"

    if (bet.toLowerCase() === 'all') bet = user.coin

    else bet = parseInt(bet.replace(/[^0-9]/g, ''))

    if (isNaN(bet) || bet <= 0) return m.reply('⚠️ La cantidad debe ser un número mayor a 0.')

    if (bet > user.coin) return m.reply('⚠️ No tienes suficientes coins.')

    // Restar apuesta

    user.coin -= bet

    // Tirada aleatoria

    let result = Math.random() < 0.5 ? 'red' : 'black'

    let winnings = 0

    let emojiColor = result === 'red' ? '🔴' : '⚫'

    if (result === color) {

        winnings = bet * 2

        user.coin += winnings

        m.reply(`🎰 *Denji Bot Ruleta* 🎰\n\nColor salido: ${emojiColor} ${result.toUpperCase()}\n💸 ¡Ganaste! Ganancia: ${winnings}\n💰 Saldo: ${user.coin}`)

    } else {

        m.reply(`🎰 *Denji Bot Ruleta* 🎰\n\nColor salido: ${emojiColor} ${result.toUpperCase()}\n💸 Perdiste 😢\n💰 Saldo: ${user.coin}`)

    }

}

handler.command = ['ruleta', 'roulette']

handler.tags = ['eco']

handler.help = ['ruleta']

export default handler