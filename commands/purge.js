const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "purge",
    description: "Deletes a large ammount of messages.",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}purge <ammount>`,
    async execute (message, client) {

        if (!message.member.hasPermission(client.perm)) {
            message.channel.send('Insufficent Permissions');
            return;
        };

        const ammount = parseInt(message.content.slice((client.prefix.length + 6)));

        if (isNaN(ammount)) {
            message.channel.send('Please specify an ammount!');
            return;
        };
        
        if (ammount > 99) {
            message.channel.send("Max ammount to clear is 99");
            return;
        }
        message.channel.bulkDelete(ammount + 1, true);

        message.channel.send(`**_Successfully_** deleted ${ammount} messages!`)

    }
} 
