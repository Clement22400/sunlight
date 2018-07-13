const Discord = require('discord.js')
const bot = new Discord.Client()
var prefix = '!'
const speak = new Set();
bot.login(process.env.TOKEN)
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
  if (message.author.bot) return;
  if (speak.has(message.author.id)) {
    message.delete()
    message.channel.send('Merci de ne pas spam ! 2 secondes entre chaque message.').then((message)=>{
      setTimeout(()=>{
        message.delete()
      }, 1000)
    })
  } else {
    speak.add(message.author.id)
    setTimeout(()=>{
      speak.delete(message.author.id)
    }, 2000)
  }
if (message.author.bot) return;
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
    .setFooter('#SunLight')
    message.author.send(helpEmbed).catch(e=> {
        return message.channel.send(":x: Je ne peux pas vous envoyez l'aide ! Activez les messages venant des utilisateurs non amis")
    })
    message.reply(`L'aide vous a été envoyé en privé !`)
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
