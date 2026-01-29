let handler = async (m, { conn }) => {

  try {

    // Aseguramos que el usuario exista

    if (!global.db.data.users[m.sender]) {

      global.db.data.users[m.sender] = { coin: 0, lastCrimen: 0 };

    }

    let user = global.db.data.users[m.sender];

    const now = Date.now();

    const cooldown = 2 * 60 * 1000; // 2 minutos en ms

    if (now - (user.lastCrimen || 0) < cooldown) {

      const remaining = cooldown - (now - user.lastCrimen);

      const minutes = Math.floor(remaining / 60000);

      const seconds = Math.floor((remaining % 60000) / 1000);

      return conn.sendMessage(

        m.chat,

        { text: `⏳ Espera un momento, tu crimen estará disponible en ${minutes}m ${seconds}s.` },

        { quoted: m }

      );

    }

    // Resultado aleatorio del crimen

    const success = Math.random() < 0.6; // 60% de éxito

    let gain = 0;

    let text = '';

    if (success) {

      gain = Math.floor(Math.random() * 1000) + 1; // 1 a 1000 Denjis

      user.coin = (user.coin || 0) + gain;

      text = `

╭──❉  Crimen realizado  ❉──╮

│ 👤 Usuario: @${m.sender.split('@')[0]}

│ 💎 Ganancia: +${gain} Denjis

│ 🏦 Total: ${user.coin} Denjis

╰──────────────────────────╯

⚡ ¡Cuidado! No te pillen la próxima vez ⚡

      `.trim();

    } else {

      gain = Math.floor(Math.random() * 500) + 1; // Pérdida de 1 a 500 Denjis

      user.coin = Math.max(0, (user.coin || 0) - gain);

      text = `

╭──❉  Crimen fallido  ❉──╮

│ 👤 Usuario: @${m.sender.split('@')[0]}

│ 💎 Pérdida: -${gain} Denjis

│ 🏦 Total: ${user.coin} Denjis

╰─────────────────────────╯

⚡ ¡Te atraparon! Sé más cuidadoso ⚡

      `.trim();

    }

    user.lastCrimen = now;

    await conn.sendMessage(

      m.chat,

      { text, mentions: [m.sender] },

      { quoted: m }

    );

  } catch (e) {

    console.error(e);

    conn.reply(m.chat, '❌ Ocurrió un error al realizar el crimen.', m);

  }

};

handler.command = ['crimen'];

handler.tags = ['eco'];

handler.help = ['crimen'];

handler.register = false;

export default handler;