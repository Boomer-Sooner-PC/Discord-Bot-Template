const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "stats",
    catigory: 'fun',
    description: "Displays the statistics for the server.",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}stats`,
    async execute (message, client) {
        const json = JSON.parse(fs.readFileSync('./supplementaryFiles/stats.json', 'utf-8'));


        const embed = new Discord.MessageEmbed()
            .setTitle(`Statistics for **${message.guild.name}:**`)
            .setColor(client.color)
            .setThumbnail(await message.guild.iconURL())
            .addFields([
                {name: "Server Boost Amounts", value: await boosters(message.guild), inline: true},
                {name: "Member Amount", value: await members(message.guild), inline: true},
                {name: "Roles", value: await roles(message.guild), inline: true},
                {name: "Channels", value: await channels(message.guild), inline: true},
                {name: "Emojis", value: await emojis(message.guild), inline: true},
                {name: "Invite", value: await invite(message.guild), inline: true},
                {name: "Most Used Emojis", value: await mostEmojis(message.guild), inline: true},
                {name: "Most Used Channels", value: await mostChannels(message.guild), inline: true},
                {name: "Most Mentioned Roles", value: await mostRoles(message.guild), inline: true}
            ])
        
        message.channel.send(embed)


        function mostEmojis (guild) {
            let original = json["emojis"][guild.id];
            let obj = {};
            for (emj in original) {
                obj[original[emj]] = emj;
            }
            obj = sortObject(obj);
            array = [];
            for (i in obj) {
                array.push(`**${obj[i]} | ${i}**\n`)
            };
            array.reverse();
            str = '';
            i = 0;
            for (st of array) {
                if (i > 10) return;
                str+=st;
            };
            if (str.length < 1) str = 'No data :(';
            return str;
        }
        
        function mostRoles (guild) {
            let original = json["roles"][guild.id];
            let obj = {};
            for (emj in original) {
                obj[original[emj]] = emj;
            }
            obj = sortObject(obj);
            array = [];
            for (i in obj) {
                array.push(`**${obj[i]} | ${i}**\n`)
            };
            array.reverse();
            str = '';
            i = 0;
            for (st of array) {
                if (i > 10) return;
                str+=st;
            };
            if (str.length < 1) str = 'No data :(';
            return str;
        }
        function mostChannels (guild) {
            let original = json["channels"][guild.id];
            let obj = {};
            for (emj in original) {
                obj[original[emj]] = emj;
            }
            obj = sortObject(obj);
            array = [];
            for (i in obj) {
                array.push(`**${obj[i]} | ${i}**\n`)
            };
            array.reverse();
            str = '';
            i = 0;
            for (st of array) {
                if (i > 10) return;
                str+=st;
            };
            if (str.length < 1) str = 'No data :(';
            return str;
        }

        async function invite (guild) {
            const channel = await guild.channels.cache 
                .filter((channel) => channel.type === 'text')
                .first();
            
            let invite = await channel.createInvite({ maxAge: 0, maxUses: 0 })

            invite = await invite.url;

            return invite;

        }

        function emojis (guild) {
            i = 0;
            guild.emojis.cache.forEach(element => {
                i++;
            })
            return i;
        }
        
        function channels (guild) {
            i = 0;
            guild.channels.cache.forEach(element => {
                i++;
            })
            return i;
        }
        
        function roles (guild) {
            i = 0;
            guild.roles.cache.forEach(element => {
                i++;
            });
            return i;
        }

        function members (guild) {
            return `${guild.memberCount}/${guild.maximumMembers}`
        }

        function boosters (guild) {
            return guild.premiumSubscriptionCount;
        }

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
