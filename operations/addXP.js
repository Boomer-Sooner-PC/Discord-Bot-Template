const fs = require('fs');

module.exports = {
    name: "xp",
    description: "Adds XP to a member if they have sent a message that minute",
    async execute (client) {
        
        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/levels.json', 'utf-8'));

        for (guildID in client.xp) {

            if (!json[guildID]) json[guildID] = {};

            for (memberID of client.xp[guildID]) {
                let ammount = Math.round(Math.random() * 10);
                if (!json[guildID][memberID]) json[guildID][memberID] = ammount;
                else {json[guildID][memberID] = json[guildID][memberID] + ammount};
            };
            
        };

        client.guilds.cache.forEach(guild => {
            client.xp[guild.id] = []; // sets up the XP system
        });

        fs.writeFileSync('./supplementaryFiles/levels.json', JSON.stringify(json, null, 4))

    }
};
