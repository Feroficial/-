let handler = async (m, { conn, usedPrefix, text }) => {

  try {

    let user = global.db.data.users[m.sender];

    if (!user.coin) user.coin = 0;

    if (!user.bank) user.bank = 0;

    if (!text) return conn.sendMessage(

      m.chat,

      { text: `💰 Uso: ${usedPrefix}deposit <cantidad|all>\nEjemplo: ${usedPrefix}deposit 500 o ${usedPrefix}deposit all` },

      { quoted: m }

    );

    // Si el usuario escribe "all", deposita todo

    let amount;

    if (text.toLowerCase() === 'all') {

      amount = user.coin;

      if (amount === 0) return conn.sendMessage(

        m.chat,

        { text: `⚠️ No tienes Denjis para depositar.` },

        { quoted: m }

      );

    } else {

      amount = parseInt(text.replace(/[^0-9]/g, ''));

      if (isNaN(amount) || amount <= 0) return conn.sendMessage(

        m.chat,

        { text: `❌ Cantidad inválida, escribe un número mayor a 0 o "all".` },

        { quoted: m }

      );

      if (amount > user.coin) return conn.sendMessage(

        m.chat,

        { text: `⚠️ No tienes suficientes Denjis.\n💵 Tu saldo: ${user.coin} Denjis` },

        { quoted: m }

      );

    }

    // Hacer el depósito

    user.coin -= amount;

    user.bank += amount;

    // Mensaje decorado con emojis y caracteres especiales

    let response = `

╔═══🌟 Depósito Exitoso 🌟═══╗

║

║ 👤 Usuario: ${await conn.getName(m.sender)}

║ 💰 Cantidad depositada: +${amount} Denjis

║ 🏦 Total en banco: ${user.bank} Denjis

║ 💸 Saldo restante: ${user.coin} Denjis

║

╚═════════════════════╝

✨ ¡Gracias por confiar en el banco de Denji! ✨

`;

    await conn.sendMessage(m.chat, { text: response }, { quoted: m });

  } catch (e) {

    console.error(e);

    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al depositar Denjis.' }, { quoted: m });

  }

};

handler.help = ['deposit'];

handler.tags = ['eco'];

handler.command = ['deposit', 'dep'];

handler.register = false;

export default handler;