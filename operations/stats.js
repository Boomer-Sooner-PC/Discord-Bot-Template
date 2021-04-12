const fs = require('fs');

module.exports = {
    name: "stats",
    description: "logs stats",
    async execute (message, client) {

        let content = message.content;
        const guildID = message.guild.id;
        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/stats.json', 'utf-8'));

        if (getEmoji(content)) {
            emoji = getEmoji(content);
            
            if (!json["emojis"][guildID]) json["emojis"][guildID] = {};
            if (!json["emojis"][guildID][emoji]) json["emojis"][guildID][emoji] = 0;
            
            json["emojis"][guildID][emoji]++;

        }
        if (getRole(content)) {
            role = getRole(content);
            
            if (!json["roles"][guildID]) json["roles"][guildID] = {};
            if (!json["roles"][guildID][role]) json["roles"][guildID][role] = 0;
            
            json["roles"][guildID][role]++;
        }

        if (!json["channels"][guildID]) json["channels"][guildID] = {};
        if (!json["channels"][guildID][message.channel.id]) json["channels"][guildID][`<#${message.channel.id}>`] = 0;
        json["channels"][guildID][`<#${message.channel.id}>`]++;
        
        fs.writeFileSync('./supplementaryFiles/stats.json', JSON.stringify(json, null, 4));

        function getRole (content) {
            try {
                content = content.split('<@&')[1];
                content = content.split('>')[0];
                content = `<@&${content}>`;
                return content;
            }
            catch {};
        }
        function getEmoji (content) {
            try {
                content = content.split('<:')[1];
                content = content.split('>')[0];
                content = `<:${content}>`;
                return content;
            }
            catch {}
        }

    }
} 
