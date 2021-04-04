const fs = require('fs');
const { isNull } = require('util');
const Discord = require('discord.js');

module.exports = {
    name: "rank",
    description: "Displays you or a mentioned user's rank and level.",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}rank <mention (optional)>`,
    async execute (message, client) {

        if (message.mentions.members.first()) {
            targetID = message.mentions.members.first().id;
            targetNick = message.mentions.members.first().user.username;
            pfp = message.mentions.members.first().user.avatarURL();
        }
        else {
            targetID = message.author.id;
            targetNick = message.member.user.username;
            pfp = message.member.user.avatarURL();
        }

        const xpFromGuild = JSON.parse(fs.readFileSync('./supplementaryFiles/levels.json', 'utf-8'))[message.guild.id];
        let list = {};
        
        for (id in xpFromGuild) {
            list[xpFromGuild[id]] = id
        }
        list = sortObject(list)
        
        listObj = [];
        for (rank in list) {
            listObj.push(list[rank]);
        };
        list = listObj.reverse();

        i = 1;
        rank = ''
        for (id of list) {
            if (id === targetID) {
                rank = i
            }
            i++
        }
        xp = xpFromGuild[targetID];
        level = await client.operations.get('xp to level').execute(xp);

        if (!rank) {
            embed = new Discord.MessageEmbed()
                .setTitle(`**${targetNick}'s Rank!**`)
                .setDescription("**User has no points :(** ")
                .setColor('RANDOM')
                .setThumbnail(pfp)
        }
        else {
            embed = new Discord.MessageEmbed()
                .setTitle(`**${targetNick}'s Rank!**`)
                .addField("**Rank:**", rank, true)
                .addField("**Level:**", level, true)
                .addField("**XP:**", xp, true)
                .setColor('RANDOM')
                .setThumbnail(pfp)
        }
         
        message.channel.send(embed)

        function sortObject (object) {
            //get the keys
            var keys = Object.keys(object)
            var testArray = [] ;
            // get a new array to work on 
            keys.forEach(key=>{
            testArray.push(key)  
            })
            // sort the keys 
            var sortedKeys = testArray.sort()

            // get the right values of the sorted keys
            var sortedVals = []
            sortedKeys.forEach(Skey =>{
            sortedVals.push(object[Skey])
            })

            //clear the old object 
            object = {}
            var i = 0;
            // get the new object json
            sortedKeys.forEach(key=>{
            object[key] = sortedVals[i]
            i++
        })
        return object;
        }

    }
};
