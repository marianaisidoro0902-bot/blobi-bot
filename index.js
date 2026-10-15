const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers
  ],
  partials: [Partials.Message, Partials.Channel]
});

client.on('ready', () => {
  console.log(`✅ Blobi logado como ${client.user.tag}!`);
  console.log(`Bot online! Use !criar-emoji em qualquer servidor`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Comando: !criar-emoji nome_do_emoji
  // O usuário precisa anexar uma imagem
  if (message.content.toLowerCase().startsWith('!criar-emoji')) {
    const args = message.content.split(' ');
    const nomeEmoji = args[1];

    if (!nomeEmoji) {
      return message.reply('❌ **Uso certo:** `!criar-emoji nome_do_emoji` + anexe uma imagem PNG/JPG\nExemplo: `!criar-emoji blodi_fofo`');
    }

    if (message.attachments.size === 0) {
      return message.reply('❌ **Faltou a imagem!**\nAnexa uma imagem (PNG/JPG até 256kb) junto com o comando.\nEx: `!criar-emoji blodi_fofo` + arrasta a imagem');
    }

    // Verifica se tem permissão
    if (!message.guild.members.me.permissions.has('ManageGuildExpressions') && !message.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      return message.reply('❌ Eu preciso da permissão **Gerenciar Emojis e Figurinhas** nesse servidor!');
    }

    const imagem = message.attachments.first();

    try {
      const emojiCriado = await message.guild.emojis.create({
        attachment: imagem.url,
        name: nomeEmoji.replace(/[^a-z0-9_]/gi, '').toLowerCase().substring(0, 32)
      });

      message.reply(`✅ **Emoji criado!** ${emojiCriado}\nUse assim: \`:${emojiCriado.name}:\``);
    } catch (erro) {
      console.log(erro);
      if (erro.code === 30008) {
        message.reply('❌ Esse servidor já atingiu o limite máximo de emojis!');
      } else {
        message.reply(`❌ Deu erro: ${erro.message}\nVerifica se a imagem tem menos de 256kb e é PNG/JPG`);
      }
    }
  }

  if (message.content.toLowerCase() === '!blodi') {
    message.reply('👋 Oi! Eu sou o **Blodi**! Use `!criar-emoji nome` + imagem pra criar emojis personalizados!');
  }
});

// Usa variável de ambiente - NUNCA coloque o token direto aqui!
client.login(process.env.TOKEN);
