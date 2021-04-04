const fs = require('fs');

module.exports = {
    name: "addrr",
    description: "Adds a reaction role to a message",
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}addrr`,
    async execute (message, client) {

        if (!message.member.hasPermission(client.perm)) {
            message.channel.send("Insufficent Permissions");
            return;
        }
        
        let filter = (m) => m.author.id === message.author.id;

        async function getMsgID () {
           message.channel.send('What is the message ID or message link?');
           let linkMsg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']}); 
           
           let content = linkMsg.first().content;
           if (content.includes('/')) {
               content = content.split('/');
               msgID = content[content.length - 1];
            }
            else {
                msgID = content;
            }
            
            if (parseInt(msgID) < 10000000 || isNaN(parseInt(msgID))) {
                
                
                message.channel.send('What is the message ID or message link?');
                let linkMsg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']}); 
                
                let content = linkMsg.first().content;
                if (content.includes('/')) {
                    content = content.split('/');
                    msgID = content[content.length - 1];
                }
                else {
                    msgID = content;
                }
                if (parseInt(msgID) < 10000000 || isNaN(parseInt(msgID))) {
                    return false;
                }
                else {
                    return msgID;
                }
            }
            else {
                return msgID;
            }
        }
        
        async function getEmoji () {
            message.channel.send('What emoji should be used?');
            let emojiMsg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']});
            emojiMsg = emojiMsg.first().content;
            emoji = emojiMsg.replace(' ', '');
            return emoji
        }
        
        async function getRoleID () {
            
            message.channel.send('What is the role you want to use? (id, name, mention)');
            let roleMsg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']});
            roleMsg = roleMsg.first();

            if (roleMsg.mentions.roles.first()) {
                roleID = roleMsg.mentions.roles.first().id;
            }
            else if (parseInt(roleMsg.content) > 22351) {
                roleID = roleMsg.content;
            }
            else {
                role = message.guild.roles.cache.find((role) => {
                    return role.name.toLowerCase() === roleMsg.content.toLowerCase()
                })

                if (!role) {
                    message.channel.send('What is the role you want to use? (id, name, mention)');
                    let roleMsg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']});
                    roleMsg = roleMsg.first();
                            
                    if (roleMsg.mentions.roles.first()) {
                        roleID = roleMsg.mentions.roles.first().id;
                    }
                    else if (parseInt(roleMsg.content) > 22351) {
                        roleID = roleMsg.content;
                    }
                    else {
                        role = message.guild.roles.cache.find((role) => {
                            return role.name.toLowerCase() === roleMsg.content.toLowerCase()
                        })
        
                        if (!role) {
                            return false
                        }
                        else {
                            roleID = role.id;
                        }
        
                    }
                    return roleID;
                }
                else {
                    roleID = role.id;
                }

            }
            return roleID;
        }
        
        msgID = await getMsgID();
        emoji = await getEmoji();
        roleID = await getRoleID();

        if (!msgID || !emoji || !roleID) {
            message.channel.send('Please make sure you did everything correctly because there has been an error.\n`canceled`');
            return;
        }
        const guildID = message.guild.id;

        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/reactionRolesData.json', 'utf-8'));

        if (json[guildID]) {
            if (json[guildID][msgID]) {
                json[guildID][msgID][emoji] = roleID;
            }
            else {
                json[guildID][msgID] = {};
                json[guildID][msgID][emoji] = roleID;
            }
        }
        else {
            json[guildID] = {};
            json[guildID][msgID] = {};
            json[guildID][msgID][emoji] = roleID;
        }

        fs.writeFileSync('./supplementaryFiles/reactionRolesData.json', JSON.stringify(json, null, 4))

    }
};
