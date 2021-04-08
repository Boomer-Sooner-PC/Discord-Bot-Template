const fs = require('fs');
const util = require('minecraft-server-util');
const discord = require('discord.js');
const imgConvert = require('base64-to-image')

module.exports = {
    name: "status",
    description: "gets the status of the main server or other server",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}status\n${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}status mc.hypixel.net`,
    async execute (message, client) {
        const customIP = message.content.length > JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix'].length + 6;
        
        if (!customIP) {
            responce = await makeEmbed(JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['mainIP']);
            const embed = responce[0];
            message.channel.send(embed);
            return;
        }
        else {
            ip = message.content.slice(JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix'].length + 7);
            responce = await makeEmbed(ip);
            const embed = responce[0];
            const attachment = responce[1];

            if (attachment == true) {
                message.channel.send(embed);
            }
            else {
                if (attachment.length < 5) {
                    message.channel.send(embed)
                }
                else {
                    message.channel.send({embed, files: [attachment]});
                }
                
            }

        }

        async function makeEmbed (ip) {
            
            let embed = new discord.MessageEmbed();
            responce = await util.status(ip).catch(e => {
                return [embed.setTitle("Server is offline or IP is incorrect").setColor("b01328"), true]; // if no responce it returns offline embed
            }); //gets information from server
            
            if (responce.host == undefined) {// if no responce it returns offline embed
                return [embed.setTitle("Server is offline or IP is incorrect").setColor("b01328"), true];
            }
            
            players = [];
            try {
                for (player of responce.samplePlayers) { //makes an array of player names
                    players.push(player.name);
                }
            }
            catch {
                players = [''];
            }

            if (responce.favicon == null) {
                attachment = '';
                embed.setThumbnail('https://i.ibb.co/Yyj7sNc/Screen-Shot-2021-03-06-at-1-31-17-PM.png')
            }
            else {
                favicon64 = responce.favicon;

                var path1 = './supplementaryFiles/';
                var optionalObj = {'fileName': 'serverFavicon', 'type':'png'};
                imgConvert(favicon64, path1, optionalObj); //aves the favicon responce as an image

                attachment = new discord.MessageAttachment('./supplementaryFiles/serverFavicon.png', 'favicon.png');
                embed.attachFiles(attachment);
                embed.setThumbnail('attachment://favicon.png');

            }

            players.sort();
            playerString = '';
            for (player of players) playerString += `${player}\n` //makes a string with all the player names devided by a line break

            embed.setTitle(`Status of server at ${responce.host}`);
            embed.addField("Version:", responce.version, true);
            embed.addField("Online Players:", `${responce.onlinePlayers}/${responce.maxPlayers}`, true);
            if (playerString.length > 2) { //if there are players online it will add a players field
                embed.addField("Players:", playerString, true);
            }   
            embed.addField("Description:", responce.description, false);           
            embed.setFooter(`${responce.host} || ${responce.port}`);
            embed.setColor(client.color)
            return [embed, attachment];
            
        };
    }
        
}