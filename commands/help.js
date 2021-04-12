const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Lists all commands, their callbacks and their descriptions",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}help`,
    async execute (message, client) {

        const filter = (reaction, user) => {
            return ['⚙️', '😀', '👨‍⚖️', '📝'].includes(reaction.emoji.name) && (!user.bot);
        };

        let utility = [];
        let fun = [];
        let moderation = [];
        let config = [];
        let music = [];
        
        const index = {
            "⚙️": utility,
            "😀": fun,
            "👨‍⚖️": moderation,
            "📝": config,
            "🎶": music
        };

        client.commands.forEach(element => { //loops over all commands
            if (element.catigory === 'utility') utility.push(element);
            if (element.catigory === 'fun') fun.push(element);
            if (element.catigory === 'moderation') moderation.push(element);
            if (element.catigory === 'config') config.push(element);
            if (element.catigory === 'config') config.push(element);
        });

        let embed = new Discord.MessageEmbed()
            .setTitle('**Help:**')
            .setFooter('⚙️ = utility || 😀 = fun || 👨‍⚖️ = moderation || 📝 = config || 🎶 = music')
            .setDescription('Choose which catigory you want')
            .setColor(client.color)


        const {msg, catigory} = await sendEmbed(embed);
        if (!msg) return;
        const edMSG = msg;
        buildEmbed(catigory);

        async function sendEmbed ( embed ) {
            try {
                const msg = await message.channel.send('help');
                msg.edit(embed);
                msg.react('⚙️');
                msg.react('😀');
                msg.react('👨‍⚖️');
                msg.react('📝');
                msg.react("🎶")
    
                let emoji = await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                emoji = emoji.first().emoji.name;
    
                const catigory = index[emoji];
                
                return {msg, catigory};
            }
            catch {
                msg = false;
                catigory = false;
                return {msg, catigory};
                edMSG.reactions.removeAll();
            }

        }

        async function editEmbed ( embed ) {
            try {
    
                let emoji = await edMSG.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                emoji = emoji.first().emoji.name;
    
                const catigory = index[emoji];
    
                buildEmbed(catigory);
            }
            catch {
                edMSG.reactions.removeAll();
            }
        }

        async function buildEmbed (catigory) {
            try {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`**Help (${catigory[0].catigory}):**`)
                    .setFooter("⚙️ = utility || 😀 = fun || 👨‍⚖️ = moderation || 📝 = config || 🎶 = music")
                    .setColor(client.color)
                
                for (cmd of catigory) {
                    try {
                        embed.addField('**' + cmd.name + '**', `${cmd.description}\n\`${cmd.usage}\``, true)
                    }catch{}
                    
                }
                
                edMSG.edit(embed);
                edMSG.reactions.removeAll();
                edMSG.react('⚙️');
                edMSG.react('😀');
                edMSG.react('👨‍⚖️');
                edMSG.react('📝');
                edMSG.react("🎶")

                editEmbed(embed);
            }
            catch {
                edMSG.reactions.removeAll();
            }
        }

    }
} 
