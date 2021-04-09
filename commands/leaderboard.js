const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "leaderboard",
    catigory: 'fun',
    description: "Displays the leaderboard for the server.",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}leaderboard`,
    async execute (message, client) {

        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/levels.json', 'utf-8'))[message.guild.id];
        let reversed = [];

        for (id in json) {
            reversed[json[id]] = id;
        };

        json = sortObject(reversed);
        reversed = [];

        for (level in json) {
            reversed.push(`**<@${json[level]}> | ${await client.operations.get('xp to level').execute(level)}**\n`);
        };
        reversed = reversed.reverse();
        let str = '';
        e = 0
        const ammount = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['leaderboard list amount']
        for (let e = 0; e < ammount; e++) {
            if (reversed[e]) {
                str+=reversed[e];
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`**${message.guild.name}'s** Leaderboard:`)
            .setDescription(str)
            .setThumbnail(await message.guild.iconURL())
            .setColor(client.color)
        
        message.channel.send(embed);

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
} 
