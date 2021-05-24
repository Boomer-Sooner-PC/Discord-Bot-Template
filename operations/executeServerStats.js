const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "server stats",
    description: "Updates all the channel names.",
    async execute (client) {
        
        json = JSON.parse(fs.readFileSync('./supplementaryFiles/serverStats.json','utf-8'));
        
        for (guildID in json) {
            
            const stuff = json[guildID];
            if (!stuff) continue;
            try {
            const {total, humans, bots} = await getChans(stuff, guildID);
            }
            catch {
                continue;
            }
            const trgTotal = `⭐️Total Members: ${await client.guilds.cache.get(guildID).memberCount}`;
            const trgHumans = `👤Humans: ${(await client.guilds.cache.get(guildID).memberCount) - (await getBots(guildID))}`;
            const trgBots = `🤖Bots: ${await getBots(guildID)}`;
            
            if (total.name !== trgTotal) total.setName(trgTotal);
            if (humans.name !== trgHumans) humans.setName(trgHumans);
            if (bots.name !== trgBots) bots.setName(trgBots);
        }

        async function getBots (guildID) {
            let members = client.guilds.cache.get(guildID).members.cache;
            let amount = 0;
            members.forEach(element => {
                if (element.user.bot) amount++
            });
            return amount;
        }

        async function getChans (stuff, guildID) {
            
            for (i in stuff) {
                if (i==='parent') continue;
                if (i==='total') total=client.guilds.cache.get(guildID).channels.cache.get(stuff[i]);
                if (i==='humans') humans=client.guilds.cache.get(guildID).channels.cache.get(stuff[i]);
                if (i==='bots') bots=client.guilds.cache.get(guildID).channels.cache.get(stuff[i]);
            }
            return {total, humans, bots}
        }
        
   
    }
} 
