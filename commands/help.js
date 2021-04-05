const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Lists all commands, their callbacks and their descriptions",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}help`,
    async execute (message, client) {
        let embed = new discord.MessageEmbed()
            .setColor(client.color)
            .setTitle("**Commands:**")
    
        client.commands.forEach(element => { //loops over all commands
            embed.addField(`${element.name}`, `${element.description}\n\`${element.usage}\``, true); //adds a field containing the description and ussage to the embed
        });

        message.channel.send(embed);
    }
} 
