import fs from 'fs';
import path from 'path';

// Número del owner
global.owner = ['50432788804']; // Tu número sin @s.whatsapp.net

const handler = async (m, { conn, usedPrefix }) => {
  const isOwner = global.owner.includes(m.sender.split`@`[0]);
  if (!isOwner) return m.reply('❌ Solo el dueño puede usar este comando.');

  try {
    await m.reply('🔄 Limpiando archivos inservibles...');

    const tempFolder = './tmp'; // Carpeta de archivos temporales

    // Verificar si la carpeta existe
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder, { recursive: true });
    }

    const files = fs.readdirSync(tempFolder);

    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(tempFolder, file);
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
      } catch (err) {
        console.warn(`⚠️ No se pudo eliminar ${file}: ${err.message}`);
      }
    }

    m.reply(`✅ Se eliminaron ${deletedCount} archivos inservibles.`);

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al limpiar los archivos.');
  }
}

handler.command = ['dsowner', 'limpiar', 'clearfiles'];
handler.tags = ['owner'];
handler.help = ['dsowner'];
handler.register = false;

export default handler;