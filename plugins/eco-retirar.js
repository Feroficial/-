let handler = async (m, { conn, usedPrefix, text }) => {

  try {

    let user = global.db.data.users[m.sender];

    if (!user.coin) user.coin = 0;

    if (!user.bank) user.bank = 0;

    if (!text) return conn.sendMessage(

      m.chat,

      { text: `🏦 Uso: ${usedPrefix}retirar <cantidad|all>\nEjemplo: ${usedPrefix}retirar 500 o ${usedPrefix}retirar all` },

      { quoted: m }

    );

    // Si el usuario escribe "all", retira todo

    let amount;

    if (text.toLowerCase() === 'all') {

      amount = user.bank;

      if (amount === 0) return conn.sendMessage(

        m.chat,

        { text: `⚠️ No tienes Denjis en el banco para retirar.` },

        { quoted: m }

      );

    } else {

      amount = parseInt(text.replace(/[^0-9]/g, ''));

      if (isNaN(amount) || amount <= 0) return conn.sendMessage(

        m.chat,

        { text: `❌ Cantidad inválida, escribe un número mayor a 0 o "all".` },

        { quoted: m }

      );

      if (amount > user.bank) return conn.sendMessage(

        m.chat,

        { text: `⚠️ No tienes suficientes Denjis en el banco.\n💵 Total en banco: ${user.bank} Denjis` },

        { quoted: m }

      );

    }

    // Hacer el retiro

    user.bank -= amount;

    user.coin += amount;

    // Mensaje decorado con nuevos caracteres y emojis

    let response = `

╔═══💫 Retiro Épico 💫═══╗

║

║ 🧑 Usuario: ${await conn.getName(m.sender)}

║ 💰 Cantidad retirada: +${amount} Denjis

║ 🏦 Total en banco: ${user.bank} Denjis

║ 💸 Saldo actual: ${user.coin} Denjis

║

╚═☆★☆═══════════════╝

⚡ ¡Tus Denjis han vuelto a tu poder! ⚡

✨ Sigue acumulando para tus aventuras épicas ✨

`;

    await conn.sendMessage(m.chat, { text: response }, { quoted: m });

  } catch (e) {

    console.error(e);

    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al retirar Denjis.' }, { quoted: m });

  }

};

handler.help = ['retirar'];

handler.tags = ['eco'];

handler.command = ['retirar', 'withdraw'];

handler.register = false;

export default handler;