const util = require('minecraft-server-util');
const fs = require('fs');

module.exports = {
    name: "enter",
    description: "Enters the main IP for the bot",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}enter mc.hypixel.net`,
    async execute (message, client) {
        let json = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
        const ip = message.content.split('enter ')[1]; 
        
        message.channel.send(`Are you sure you want to change the main IP to ${ip}? \`yes\` or \`no\``); 
        
        const filter = (m) => m.author.id === message.author.id; //makes sure reply to the qustion is from the original message author
        let responce = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']}); //awaits reply
        responce = (responce.first().content.includes('yes')); 
        
        if (responce) {
            json['mainIP'] = ip;
            fs.writeFileSync('./config.json', JSON.stringify(json, null, 4)); //writes the new IP to config.json
            message.channel.send(`**_Successfully_** entered \`${ip}\` as the main IP.`);
        }
        else if (!responce) {
            message.channel.send('Canceled');
        };
    }
};
