const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "reply",
    catigory: 'config',
    description: "Sets up replies to certain words ",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}reply`,
    async execute (message, client) {
        let filter = (m) => m.author.id === message.author.id;

        trigger = await getTrigger();
        reply = await getContent();
        guildID = message.guild.id;

        json = JSON.parse(fs.readFileSync('./supplementaryFiles/replies.json', 'utf-8'));
        if (json[guildID]) {
            json[guildID][trigger] = reply;
        }
        else {
            json[guildID] = {};
            json[guildID][trigger] = reply;
        };
    
        fs.writeFileSync('./supplementaryFiles/replies.json', JSON.stringify(json, null, 4));
        message.channel.send("Replied added!");

        async function getTrigger () {
            message.channel.send('What word would you like reply to be triggered by?');
            let replyWord = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']});
            replyWord = replyWord.first().content;
            if (replyWord.includes(' ')) {
                message.channel.send('Trigger word may not include space');
                replyWord = await getTrigger();
            };
            return replyWord.toLowerCase();
        };
    
        async function getContent () {
            message.channel.send('What do you want the reply to be?');
            let reply = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']});
            reply = reply.first().content;
            return reply;
        };

    }
} 
