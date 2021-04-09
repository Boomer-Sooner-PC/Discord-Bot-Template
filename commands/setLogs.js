const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "setlogs",
    description: "Sets the channel to log messages in.",
    catigory: 'config',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}setlogs`,
    async execute (message, client) {

        if (!message.member.hasPermission(client.perm)) {
            message.channel.send("Insufficient Permissions");
            return;
        };

        const channelID = message.content.replace(`${client.prefix}setlogs `, '').replace('<#', '').replace('>', '');
        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/logChannels.json', 'utf-8'));

        json[message.guild.id] = channelID;
        fs.writeFileSync('./supplementaryFiles/logChannels.json', JSON.stringify(json, null, 4));
        message.channel.send(`Changed logs channel to <#${channelID}>`);
    }
} 
