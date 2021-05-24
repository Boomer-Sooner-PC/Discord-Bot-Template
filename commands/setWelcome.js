const fs = require('fs');

module.exports = {
    name: "welcome",
    description: "Sets up all the information for a welcome message.",
    catigory: 'config',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}welcome`,
    async execute (message, client) {

        if (!message.member.hasPermission(client.perm) || !client.welcomeMsg) {
            message.channel.send('Insufficient Permissions');
            return;
        };

        let filter = (m) => m.author.id === message.author.id;
        info = {
            channel: await getChannelID(),
            msg: await getMessage(),
            role: await role()
        }
        
        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/welcome.json', 'utf-8'));
        json[message.guild.id] = info;
        fs.writeFileSync('./supplementaryFiles/welcome.json', JSON.stringify(json, null, 4));

        message.channel.send("Done! Welcome message is set up!");

        async function getChannelID () {
            message.channel.send('What is the channel that the welcome message should go in (mention or ID)?');
            let msg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']}); 
            msg = msg.first();
            const channelID = msg.content.replace(`${client.prefix}setlogs `, '').replace('<#', '').replace('>', '');
            return channelID;
        }
        async function getMessage () {
            message.channel.send('What should the message be?');
            let msg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']}); 
            msg = msg.first();
            const content = msg.content;
            return content;
        }
        async function role () {
            message.channel.send('Would you like to give a role on join (`yes` or `no`)?');
            let msg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']}); 
            msg = msg.first();
            
            if (msg.content.includes('yes')) {
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
            else {
                return false;
            }   
        }
    }
} 