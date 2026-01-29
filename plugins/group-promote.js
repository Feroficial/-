let handler = async (m, { conn, text, usedPrefix }) => {

  try {

    // Validar si el chat es un grupo

    if (!m.isGroup) return conn.sendMessage(m.chat, { text: "⚠️ Este comando solo funciona en grupos." }, { quoted: m });

    // Validar si el que usa el comando es admin

    let groupAdmins = m.isGroup ? (await conn.groupMetadata(m.chat)).participants.filter(p => p.admin) : [];

    if (!groupAdmins.some(a => a.id === m.sender)) return conn.sendMessage(m.chat, { text: "❌ Solo los admins pueden usar este comando." }, { quoted: m });

    // Validar si mencionaron a alguien

    if (!m.mentionedJid || !m.mentionedJid[0]) return conn.sendMessage(m.chat, { text: `❌ Uso correcto: ${usedPrefix}promote @usuario` }, { quoted: m });

    // Promover al primer mencionado

    const target = m.mentionedJid[0];

    await conn.groupParticipantsUpdate(m.chat, [target], 'promote');

    // Mensaje decorado

    let nameTarget = await conn.getName(target);

    let response = `

✨⚡ ¡Promoción Realizada! ⚡✨

╭─❉ 👑 Nuevo Admin 👑 ❉─╮

│ Usuario: @${nameTarget.split('@')[0]}

│ Grupo: ${m.chat.split('@')[0]}

│ Acción: 🔼 Promovido a Admin

╰───────────────────────╯

💫 ¡Que los poderes del grupo lo acompañen! 💫

`;

    await conn.sendMessage(m.chat, { text: response, mentions: [target] }, { quoted: m });

  } catch (e) {

    console.error('❌ Error en promote:', e);

    conn.sendMessage(m.chat, { text: '❌ Nesesito ser admin para promover.' }, { quoted: m });

  }

};

handler.command = ['promote'];

handler.tags = ['group'];

handler.help = ['promote'];

handler.register = false;

export default handler;