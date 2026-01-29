let handler = async (m, { conn, text, usedPrefix }) => {

  try {

    // Validar si el chat es un grupo

    if (!m.isGroup) return conn.sendMessage(m.chat, { text: "⚠️ Este comando solo funciona en grupos." }, { quoted: m });

    // Validar si el que usa el comando es admin

    let groupAdmins = m.isGroup ? (await conn.groupMetadata(m.chat)).participants.filter(p => p.admin) : [];

    if (!groupAdmins.some(a => a.id === m.sender)) return conn.sendMessage(m.chat, { text: "❌ Solo los admins pueden usar este comando." }, { quoted: m });

    // Validar si mencionaron a alguien

    if (!m.mentionedJid || !m.mentionedJid[0]) return conn.sendMessage(m.chat, { text: `❌ Uso correcto: ${usedPrefix}demote @usuario` }, { quoted: m });

    // Bajar al primer mencionado

    const target = m.mentionedJid[0];

    await conn.groupParticipantsUpdate(m.chat, [target], 'demote');

    // Mensaje decorado

    let nameTarget = await conn.getName(target);

    let response = `

💥⚡ ¡Democión Ejecutada! ⚡💥

╭─❉ ⚠️ Usuario Borrado de Admin ⚠️ ❉─╮

│ Usuario: @${nameTarget.split('@')[0]}

│ Grupo: ${m.chat.split('@')[0]}

│ Acción: 🔽 Bajado de Admin

╰───────────────────────────────╯

🌪️ ¡Que vuelva a entrenar antes de volver al rango! 🌪️

`;

    await conn.sendMessage(m.chat, { text: response, mentions: [target] }, { quoted: m });

  } catch (e) {

    console.error('❌ Error en demote:', e);

    conn.sendMessage(m.chat, { text: '❌ Nesesito ser admin para demotar.' }, { quoted: m });

  }

};

handler.command = ['demote'];

handler.tags = ['group'];

handler.help = ['demote'];

handler.register = false;

export default handler;