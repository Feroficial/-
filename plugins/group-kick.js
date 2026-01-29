let handler = async (m, { conn, text, isAdmin, isROwner, usedPrefix }) => {

  try {

    // Verifica si es grupo

    if (!m.isGroup) return conn.sendMessage(m.chat, { text: '❌ Este comando solo se puede usar en grupos.' }, { quoted: m });

    // Verifica permisos

    if (!(isAdmin || isROwner)) return conn.sendMessage(m.chat, { text: '❌ Solo los admins pueden usar este comando.' }, { quoted: m });

    // Obtener al usuario a expulsar

    let userToKick;

    if (m.quoted) {

      userToKick = m.quoted.sender; // si respondieron a un mensaje

    } else if (text) {

      userToKick = text.includes('@') ? text.replace(/@|\s/g, '') + '@s.whatsapp.net' : text + '@s.whatsapp.net';

    } else {

      return conn.sendMessage(m.chat, { text: `❌ Uso: ${usedPrefix}kick <@usuario> o responde a su mensaje` }, { quoted: m });

    }

    // Verifica que no se intente expulsar al propio bot

    if (userToKick === conn.user.jid) return conn.sendMessage(m.chat, { text: '❌ No puedo expulsarme a mí mismo 😅' }, { quoted: m });

    // Ejecutar expulsión

    await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove');

    // Mensaje decorado

    let response = `

🛡️ 𝗨𝘀𝘂𝗮𝗿𝗶𝗼 𝗲𝗹𝗶𝗺𝗶𝗻𝗮𝗱𝗼

╔═════════════

║ 👤 Usuario: @${userToKick.split('@')[0]}

║ 🔨 Acción: Expulsado

║ 🏷 Grupo: ${m.chat.split('@')[0]}

╚═════════════

⚡ Hecho por un admin

`;

    await conn.sendMessage(m.chat, { text: response, mentions: [userToKick] }, { quoted: m });

  } catch (e) {

    console.error(e);

    await conn.sendMessage(m.chat, { text: '❌ Nesesito ser admin para expulsar al usuario.' }, { quoted: m });

  }

};

handler.help = ['kick'];

handler.tags = ['group'];

handler.command = ['kick'];

handler.register = false;

export default handler;