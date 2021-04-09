const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "invite",
    catigory: 'utility',
    description: "Generates an invite link for the bot",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}invite`,
    async execute (message, client) {

        message.channel.send(`Here is my link:\n${await client.generateInvite()}`);

    }
} 
