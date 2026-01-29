let handler = async (m, { conn }) => {

  let user = global.db.data.users[m.sender];

  let now = Date.now();

  let timeout = 24 * 60 * 60 * 1000; // 24 horas

  if (!user.lastDaily) user.lastDaily = 0;

  if (now - user.lastDaily < timeout) {

    let remaining = timeout - (now - user.lastDaily);

    let hours = Math.floor(remaining / 3600000);

    let minutes = Math.floor((remaining % 3600000) / 60000);

    let seconds = Math.floor((remaining % 60000) / 1000);

    return conn.sendMessage(

      m.chat,

      { text: `⏳ ──💫 Ya reclamaste tu Daily 💫──\nIntenta de nuevo en ${hours}h ${minutes}m ${seconds}s` },

      { quoted: m }

    );

  }

  // Recompensa aleatoria de 1 a 1000 Denjis

  let gain = Math.floor(Math.random() * 1000) + 1;

  user.coin ??= 0; // Asegura que exista user.coin

  user.coin += gain;

  user.lastDaily = now;

  // Banner decorativo

  let text = `

╔════════════════════╗

✨  DAILY RECLAMADO ✨

╠════════════════════╣

👤 Usuario: ${await conn.getName(m.sender)}

💎 Denjis obtenidos: +${gain}

🪙 Total actual: ${user.coin} Denjis

╠════════════════════╣

🌟 ¡Vuelve mañana por más sorpresas!

🔥 Que los Dragones te acompañen

╚════════════════════╝

.trim();

  await conn.sendMessage(

    m.chat,

    { text },

    { quoted: m }

  );

};

handler.command = ['daily'];

handler.tags = ['eco'];

handler.help = ['daily'];

export default handler;