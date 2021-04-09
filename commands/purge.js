const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "purge",
    catigory: 'moderation',
    description: "Deletes a large amount of messages.",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}purge <amount>`,
    async execute (message, client) {

        if (!message.member.hasPermission(client.perm)) {
            message.channel.send('Insufficient Permissions');
            return;
        };

        const amount = parseInt(message.content.slice((client.prefix.length + 6)));

        if (isNaN(amount)) {
            message.channel.send('Please specify an amount!');
            return;
        };
        
        if (amount > 99) {
            message.channel.send("Max amount to clear is 99");
            return;
        }
        message.channel.bulkDelete(amount + 1, true);

        message.channel.send(`**_Successfully_** deleted ${amount} messages!`)

    }
} 
