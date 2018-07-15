const Discord = require('discord.js')
const bot = new Discord.Client()
var prefix = '!'
const speak = new Set();
const kickspeak = new Set();
bot.login(process.env.TOKENd)
bot.on('ready', function() {
console.log('Je suis prêt ! #SunLight')
bot.user.setActivity('!help | SunLight')
});
bot.on('guildMemberAdd', function (member) {
member.addRole('467231547490172932')
member.createDM().then(function(channel){
    channel.send('Bienvenue à toi sur le serveur de la SunLight !');
});
member.guild.channels.find(c=>c.name.includes('bienvenue')).send(`Bienvenue à ${member} sur le serveur de la SunLight, tu peux parler dans <#467240899034742784> et faire une candidature avec le lien dans <#467238523301527553> mais avant n'oublie pas de lire les règles <#467233011826688001> !`);
});
bot.on('guildMemberRemove', function (member) {
    member.guild.channels.find(c=>c.name.includes('bienvenue')).send(`Au revoir ${member.displayName} sur le serveur de la SunLight.`);
});
bot.on('message', async message =>{
  function fkick() {
    message.author.send('Vous avez été expulsé pour spam sur le serveur **SunLight**, voici le lien pour revenir : https://discord.gg/tCJZv2h !')
    message.member.kick('Auto KICK Raison : Spam')
  }
  if (message.author.bot) return;
  if (speak.has(message.author.id)) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.delete()
    message.channel.send('Merci de ne pas spam ! 2 secondes entre chaque message.').then((message)=>{
      setTimeout(()=>{
        message.delete()
      }, 2000)
      if (kickspeak.has(message.author.id)) {
        fkick()
      } else {
        kickspeak.add(message.author.id)
        setTimeout(()=>{
          kickspeak.delete(message.author.id)
        }, 2000)
      }
    })
    }
  } else {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      speak.add(message.author.id)
    setTimeout(()=>{
      speak.delete(message.author.id)
    }, 2000)
    }
  }
if (message.content.includes('https://discord.gg/')) {
  if (message.channel.id === '467241067800952832') return;
  message.delete()
  message.reply('Les invitation discord sont autorisé seulement dans <#467241067800952832> !').then((message)=>{
    setTimeout(()=>{
      message.delete()
    }, 3000)
  })
}
if (message.mentions.users.size >= 4) {
  if (message.member.hasPermission('MANAGE_MESSAGES')) return;
  message.delete()
  message.reply('Merci de ne pas mentionner plus de 4 personnes dans votre message.')
}
if (message.channel.type === 'dm') return message.channel.send(':x: **Seulement le staff à accès au bot.**')
if (message.content === prefix + 'help') {
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
    let helpEmbed = new Discord.RichEmbed()
    .setTitle('__**Help**__')
    .setDescription('Help du bot SunLight')
    .addField('!clear <nombre>', 'Clear un nombre de message compris entre 2 et 100')
    .addField('!kick <@pseudo> <raison>', 'Expulser une personne du serveur.')
    .addField('!ban <@pseudo> <raison>', 'Bannir une personne du serveur.')
    .addField('!mute <@pseudo>', 'Muter une personne du serveur.')
    .addField('!unmute <@pseudo>', 'Unmuter une personne du serveur.')
    .addField('!addrole <@pseudo> <nom du role>', 'Ajouter un role à une personne.')
    .addField('!removerole <@pseudo> <nom du role>', 'Enlever un role à une personne.')
    .addField('!membercount', 'Calculer le nombre de membre dans le discord et dans la team.')
    .setFooter('#SunLight')
    message.author.send(helpEmbed).catch(e=> {
        return message.channel.send(":x: Je ne peux pas vous envoyez l'aide ! Activez les messages venant des utilisateurs non amis")
    })
    message.reply(`L'aide vous a été envoyé en privé !`)
}
if (message.content === '!membercount') {
  let nrole = message.guild.members.filter(m=>m.roles.has('467237426046435328'))
  let MEmbed = new Discord.RichEmbed()
.setDescription("__**Member Count**__")
  .setColor("#3f168a")
  .setThumbnail(message.guild.iconURL)
.addField("Utilisateurs total", message.guild.memberCount)
.addField("Humains", message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size)
.addField("Bots", message.guild.members.filter(m=>m.user.bot).size)
.addField("Membres SunLight", nrole.size)
.addField("Pseudo membres SunLight", nrole.map(m=>m.displayName))
return message.channel.send(MEmbed)
}
    let args = message.content.split(' ');
    let mUser = message.guild.member(message.mentions.users.first());
    let raison = args.join(' ')
    let mAuthor = message.author;
    if(message.content.startsWith(prefix + 'clear')) {
      let args = message.content.split(' ')
        const deleteCount = parseInt(args[1], 10);
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Le nombre de message à supprimer doit être compris entre 2 et 100.");
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
      }
    if (message.content.startsWith(prefix + 'kick')) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
        if (!mUser) return message.channel.send('Choisir une personne ! !kick <@pseudo> <raison>')
        if (mUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Cette personne ne peux pas être kick !')
        if (!raison) return message.channel.send('Choisir une raison ! !kick <@pseudo> <raison>')
        let kickEmbed = new Discord.RichEmbed()
        .setTitle('__**Kick**__')
        .setColor('#3f168a')
        .addField('Kické par', mAuthor)
        .addField('Personne kické', mUser)
        .addField('Raison', raison.slice(28))
        message.guild.member(mUser).kick(raison)
        return message.channel.send(kickEmbed)
    }
    if (message.content.startsWith(prefix + 'ban')) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
        if (!mUser) return message.channel.send('Choisir une personne ! !ban <@pseudo> <raison>')
        if (mUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Cette personne ne peux pas être ban !')
        if (!raison) return message.channel.send('Choisir une raison ! !ban <@pseudo> <raison>')
        let kickEmbed = new Discord.RichEmbed()
        .setTitle('__**Ban**__')
        .setColor('#3f168a')
        .addField('Banni par', mAuthor)
        .addField('Personne banni', mUser)
        .addField('Raison', raison.slice(27))
        message.guild.member(mUser).ban(raison.slice())
        return message.channel.send(kickEmbed)
    }
    if (message.content.startsWith( prefix + 'mute')) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
        let role = message.guild.roles.find(r => r.name === "Muted");
        let toMute = message.guild.member(message.mentions.users.first())
        if(!role){
            try {
              role = await message.guild.createRole({
                name: "Muted",
                color:"#000000",
                permissions:[]
              });
      
              message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false
                });
              });
            } catch (e) {
              console.log(e.stack)
            }
          }
        if (!toMute) return message.channel.send('Choisir une personne ! !mute <@pseudo>')
        if (toMute.hasPermission('KICK_MEMBERS')) return message.channel.send('Cette personne ne peux pas être mute !')
        if (toMute.roles.has(role.id)) return message.channel.send('Cette personne est déjà muté !')
        toMute.addRole(role)
        return message.channel.send(`${toMute} est désormais muté !`)
    }
    if (message.content.startsWith( prefix + 'unmute')) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
        let role = message.guild.roles.find(r => r.name === "Muted");
        let toMute = message.guild.member(message.mentions.users.first())
        if(!role){
            try {
              role = await message.guild.createRole({
                name: "Muted",
                color:"#000000",
                permissions:[]
              });
      
              message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false
                });
              });
            } catch (e) {
              console.log(e.stack)
            }
          }
        if (!toMute) return message.channel.send('Choisir une personne ! !unmute <@pseudo>')
        if (toMute.hasPermission('KICK_MEMBERS')) return message.channel.send('Cette personne ne peux pas être unmute !')
        if (!toMute.roles.has(role.id)) return message.channel.send(`Cette personne n'est pas muté !`)
        toMute.removeRole(role)
        return message.channel.send(`${toMute} est désormais unmuté !`)
    }
    if (message.content.startsWith(prefix + 'addrole')) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
        let role = args.join(' ').slice(31)
        let grole = message.guild.roles.find('name', role)
        if (!mUser) return message.channel.send('Choisir une personne ! !addrole <@pseudo> <role>')
        if (!role) return message.channel.send('Choisir un role ! !addrole <@pseudo> <role>')
        if (!grole) return message.channel.send(`Le role "${role}" n'a pas été trouvé !`)
        if (mUser.roles.has(grole.id)) return message.channel.send('Cette personne a déjà ce role !')
        message.channel.send(`${mUser} à reçu le role ${grole.name}`)
        mUser.addRole(grole.id)
    }
    if (message.content.startsWith(prefix + 'removerole')) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: **Seulement le staff à accès au bot.**')
        let role = args.join(' ').slice(34)
        let grole = message.guild.roles.find('name', role)
        if (!mUser) return message.channel.send('Choisir une personne ! !addrole <@pseudo> <role>')
        if (!role) return message.channel.send('Choisir un role ! !addrole <@pseudo> <role>')
        if (!grole) return message.channel.send(`Le role "${role}" n'a pas été trouvé !`)
        if (!mUser.roles.has(grole.id)) return message.channel.send(`Cette personne n'a pas ce role !`)
        message.channel.send(`${mUser} à été enlevé du role ${grole.name}`)
        mUser.removeRole(grole.id)
    }
});



// NOTIF

const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = bot.users.get(data.user_id);
  const channel = bot.channels.get(data.channel_id) || await user.createDM();

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);
  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
  }

  bot.emit(events[event.t], reaction, user);
});
bot.on('messageReactionAdd', async (reaction, user)=>{
    if (reaction.message.id === '467719049254797313') {
    if (reaction.message.member.hasPermission('ADMINISTRATOR')) {
      reaction.message.react('🔔')
      if (reaction.emoji.name === '🔔') {
        reaction.message.guild.members.get(user.id).addRole('467712226837528577')
        user.send('Vous avez activé les notifs du serveur de la **SunLight** !')
      } else{  
    reaction.remove(user)
}
    }
    }
});
bot.on('messageReactionRemove', async (reaction, user)=>{
  if (reaction.message.id === '467719049254797313') {
    if (reaction.message.member.hasPermission('ADMINISTRATOR')) {
      if (reaction.emoji.name === '🔔') {
        reaction.message.guild.members.get(user.id).removeRole('467712226837528577')
        user.send('Vous avez desactivé les notifs du serveur de la **SunLight** !')
      } else {
    reaction.remove(user)
}
    }
    }
});
