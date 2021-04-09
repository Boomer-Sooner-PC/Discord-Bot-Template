const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: "serverstats",
    description: "Toggles server stats.",
    catigory: 'config',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}serverstats`,
    async execute (message, client) {

        if (!message.member.hasPermission(client.perm)) {
            message.channel.send('Insufficient Permissions');
            return;
        }

        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/serverStats.json', 'utf-8'));

        if (!json[message.guild.id]) {

            json[message.guild.id] = {};
            json = await createChans(json);
        }
        else {
            json = await deleteChans(json);
            delete json[message.guild.id];
        }

        fs.writeFileSync('./supplementaryFiles/serverStats.json', JSON.stringify(json, null, 4));

        async function deleteChans (json) {

            for (i in json[message.guild.id]) {
                channel = await message.guild.channels.cache.get(json[message.guild.id][i]);
                channel.delete();
            };

            return json;
        }

        async function createChans (json) {

            let channels = message.guild.channels;
            const parent = await channels.create('📊〰Server Stats〰📊', {
                reason: 'Created the parent for the server stats channels.',
                type: 'category'
            });

            parent.overwritePermissions([{
                id: message.guild.id,
                deny: ['CONNECT'],
                allow: ['VIEW_CHANNEL']
            }]);

            const total = await channels.create('⭐️Total Members: ', {
                reason: 'Created the total members display channel.',
                type: 'voice',
                parent: parent
            });

            const humans = await channels.create('👤Humans: ', {
                reason: 'Created the total humans display channel.',
                type: 'voice',
                parent: parent
            });


            const bots = await channels.create('🤖Bots: ', {
                reason: 'Created the total bots display channel.',
                type: 'voice',
                parent: parent
            });

            json[message.guild.id] = {
                parent: parent.id,
                total: total.id,
                humans: humans.id,
                bots: bots.id
            };

            return json;
        }

    }
} 
