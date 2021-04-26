const Discord = require('discord.js'),
  Client = new Discord.Client({
    
    fetchAllMembers: true
  }),

  config = require('./config.json')
  fs = require('fs')


const prefix = "+";


const help = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("**Lake Help**")
  .setDescription("**Les commandes disponibles sont les suivantes :**\n\n(**+**) **mute**\n(**+**) **unmute**\n(**+**) **clear** <**0-100**>\n(**+**) **nuke**")
  .setFooter("Bot développer par W I D E K I#8408")


Client.login(process.env.TOKEN);
Client.commands = new Discord.Collection()


fs.readdir('./commands', (err, files) => {
  if (err) throw err
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    const command = require(`./commands/${file}`)
    Client.commands.set(command.name, command)

  })
})




Client.on('message', message => {
  if(message.content == prefix + "help"){
    message.channel.send(help);
  }
})

Client.on('ready', () => {
  const statuses = [
    () => `Dev By W I D E K I#8408`,
    () => `${Client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateur(s)`
  ]
  let i = 0
  setInterval(() => {
    Client.user.setActivity(statuses[i](), {type: 'PLAYING'})
    i = ++i % statuses.length
  }, 1e4)
})

const btc = new Discord.MessageEmbed()
.setTitle("BTC Minage")
.setColor("Yellow")
.setDescription("Minage de BitCoin$ en cours...")

const btcfinish = new Discord.MessageEmbed()
.setTitle("BTC Minage")
.setColor("Yellow")
.setDescription("Minage de bitcoin échoué !")

Client.on('message', message => {
  if(message.content == prefix + "btc"){
    message.channel.send(btc)
    message.channel.send(btcfinish)
  }
})

Client.on('message', message => {
  if (message.type !== 'DEFAULT' || message.author.bot) return
  const args = message.content.trim().split(/ +/g)
  const commandName = args.shift().toLowerCase()
  if (!commandName.startsWith(config.prefix)) return
  const command = Client.commands.get(commandName.slice(config.prefix.length))
  if (!command) return
  command.run(message, args, Client)
})

const test = new Discord.MessageEmbed()
.setTitle("Test")
.setColor("RED")
.setDescription("Commande de test")


Client.on('message', message => {
  if(message.content == prefix + "test"){
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("Vous n'avez pas la permission !")
    message.channel.send(test)
  }
})


Client.on('message', async (message) => {
  if (
    message.content.toLowerCase().startsWith(prefix + 'clear')
  ) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send("Vous n'avez pas la permission de clear !");
    if (!isNaN(message.content.split(' ')[1])) {
      let amount = 0;
      if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
        amount = 1;
      } else {
        amount = message.content.split(' ')[1];
        if (amount > 100) {
          amount = 100;
        }
      }
      await message.channel.bulkDelete(amount, true).then((_message) => {
        message.channel.send(`J'ai nettoyé \`${_message.size}\` messages :broom:`).then((sent) => {
          setTimeout(function () {
            sent.delete();
          }, 2500);
        });
      });
    } else {
      message.channel.send('Entrez le nombre de message que vous voulez supprimer').then((sent) => {
        setTimeout(function () {
          sent.delete();
        }, 2500);
      });
    }
  } 
});
