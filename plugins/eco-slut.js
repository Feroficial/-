let handler = async (m, { conn }) => {

  try {

    // Aseguramos que el usuario exista

    if (!global.db.data.users[m.sender]) {

      global.db.data.users[m.sender] = { coin: 0, lastSlut: 0 };

    }

    let user = global.db.data.users[m.sender];

    const now = Date.now();

    const cooldown = 2 * 60 * 1000; // 2 minutos en ms

    if (now - (user.lastSlut || 0) < cooldown) {

      const remaining = cooldown - (now - user.lastSlut);

      const minutes = Math.floor(remaining / 60000);

      const seconds = Math.floor((remaining % 60000) / 1000);

      return conn.sendMessage(

        m.chat,

        { text: `⏳ Espera un momento, tu acción slut estará disponible en ${minutes}m ${seconds}s.` },

        { quoted: m }

      );

    }

    // Resultado aleatorio del comando

    const success = Math.random() < 0.5; // 50% de éxito

    let gain = 0;

    let text = '';

    if (success) {

      gain = Math.floor(Math.random() * 1000) + 1; // Ganancia 1 a 1000 Denjis

      user.coin = (user.coin || 0) + gain;

      text = `

╭──❉  Slut realizado  ❉──╮

│ 👤 Usuario: @${m.sender.split('@')[0]}

│ 💎 Ganancia: +${gain} Denjis

│ 🏦 Total: ${user.coin} Denjis

╰─────────────────────────╯

✨ ¡Tu reputación creció! ✨

      `.trim();

    } else {

      gain = Math.floor(Math.random() * 500) + 1; // Pérdida 1 a 500 Denjis

      user.coin = Math.max(0, (user.coin || 0) - gain);

      text = `

╭──❉  Slut fallido  ❉──╮

│ 👤 Usuario: @${m.sender.split('@')[0]}

│ 💎 Pérdida: -${gain} Denjis

│ 🏦 Total: ${user.coin} Denjis

╰────────────────────────╯

⚡ ¡Te atraparon! Sé más cuidadoso ⚡

      `.trim();

    }

    user.lastSlut = now;

    await conn.sendMessage(

      m.chat,

      { text, mentions: [m.sender] },

      { quoted: m }

    );

  } catch (e) {

    console.error(e);

    conn.reply(m.chat, '❌ Ocurrió un error al ejecutar el comando slut.', m);

  }

};

handler.command = ['slut'];

handler.tags = ['eco'];

handler.help = ['slut'];

handler.register = false;

export default handler;