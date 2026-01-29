let handler = async (m, { conn }) => {

  let user = global.db.data.users[m.sender];

  // Inicializar stats si no existen

  if (!user.coin) user.coin = 0;

  if (!user.items) user.items = [];

  if (!user.lastAventura) user.lastAventura = 0;

  let cooldown = 2 * 60 * 60 * 1000; // 2 horas

  let now = Date.now();

  if (now - user.lastAventura < cooldown) {

    let restante = cooldown - (now - user.lastAventura);

    let h = Math.floor(restante / 3600000);

    let mnt = Math.floor((restante % 3600000) / 60000);

    return m.reply(`⏳ #aventura en recarga\nVuelve en ${h}h ${mnt}m`);

  }

  user.lastAventura = now;

  // Eventos aleatorios

  let evento = Math.random();

  let mensaje = '';

  if (evento < 0.35) {

    let coins = Math.floor(Math.random() * 1000) + 1;

    user.coin += coins;

    mensaje = `🪙 Encontraste un tesoro y obtuviste *${coins} coins*!\n💰 Total: ${user.coin} coins`;

  } else if (evento < 0.60) {

    let enemigos = ['Goblin 🐲', 'Bandido 🏹', 'Slime 💧'];

    let enemigo = enemigos[Math.floor(Math.random() * enemigos.length)];

    mensaje = `⚔️ Te encontraste con un ${enemigo}!\nDecide pelear o huir con otros comandos 😎`;

  } else if (evento < 0.85) {

    let objetos = ['Poción 🔮', 'Espada 🗡️', 'Escudo 🛡️', 'Amuleto ✨'];

    let item = objetos[Math.floor(Math.random() * objetos.length)];

    user.items.push(item);

    mensaje = `🎁 Encontraste un objeto raro: *${item}*`;

  } else {

    mensaje = `❌ Caminaste por el bosque y no encontraste nada...`;

  }

  m.reply(`🌄 #aventura\n${mensaje}`);

};

// Ajuste del handler

handler.help = ['aventura'];

handler.tags = ['eco'];

handler.command = ['aventura']

export default handler