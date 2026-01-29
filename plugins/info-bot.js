const handler = async (m, { conn }) => {
  const totalUsers = Object.keys(global.db.data.users || {}).length;

  const info = `
🧃 𝗗𝗲𝗻𝗷𝗶 𝗕𝗼𝘁

👑 Owner: FER OFICIAL
🤖 Bot activo y estable
👥 Usuarios registrados: ${totalUsers}
🌎 Zona horaria: Honduras
⚙️ Motor: Node.js

✨ Hecho con ❤️ para la comunidad
`.trim();

  m.reply(info);
};

handler.command = ['info', 'botinfo'];
handler.tags = ['info'];
handler.help = ['info'];
handler.register = false;

export default handler;