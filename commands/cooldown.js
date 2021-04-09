const fs = require('fs');

module.exports = {
    name: "noxp",
    description: "Toggles if a channel gives XP (default is true)",
    catigory: 'config',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}cooldown <channel ID or mention channel>`,
    async execute (message, client) {
        if (!message.member.hasPermission(client.perm)) {
            message.channel.send("Insufficient permissions");
            return;
        };

        const channelID = message.content.replace(`${client.prefix}noxp `, '').replace('<#', '').replace('>', '');
        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/XPCooldown.json', 'utf-8'));

        if (isNaN(parseInt(channelID))) {
            message.channel.send("Please correctly mention a channel or channel ID");
            return;
        }

        if (!json['channels'].includes(channelID)) {
            json['channels'].push(channelID);
            pass = '**_Added_**';
        }
        else {
            i = 0;
            pass = '**_Removed_**';
            const index = json['channels'].indexOf(channelID);
            if (index > -1) {
                json['channels'].splice(index, 1);
            }

        }

        fs.writeFileSync('./supplementaryFiles/XPCooldown.json', JSON.stringify(json, null, 4));
        
        message.channel.send(`${pass} <#${channelID}> from the list of no XP channels.`);

    }
}