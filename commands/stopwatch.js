const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "stopwatch",
    description: "Stops and starts a stopwatch. Individual stopwatches for each member.",
    catigory: 'fun',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}stopwatch`,
    async execute (message, client) {
        
        if (!client.stopwatch[message.author.id]) {
            client.stopwatch[message.author.id] = message.createdTimestamp;
            message.channel.send("**Started** stopwatch");
        }
        else {
            time = message.createdTimestamp - client.stopwatch[message.author.id];
            message.channel.send(`**Stopped** stopwatch\nTime: **_${time / 1000}s_**`);
            delete client.stopwatch[message.author.id];
        }
    }
} 
