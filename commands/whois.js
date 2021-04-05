const Discord = require("discord.js");
const fs = require('fs');
const { isNull } = require("util");

module.exports = {
    name: 'whois',
    description: 'gives information about a users',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}whois <mention user>`,
    execute(message, client){
        const target = message.mentions.members.first();
        const user = message.mentions.users.first();
        if(!target) return message.channel.send("Please mention a user");

        let d = new Date(target.joinedTimestamp);
        date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();

        d = new Date(target.user.createdAt);
        registeredDate = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();

        let roles = []
        let numberOfRoles = 0
        for (role of target._roles) {
            roles += `<@&${role}>`
            numberOfRoles += 1
        }

        const information = {
            nickname: target.nickname,
            id: target.id,
            roles: roles,
            joinedAt: date,
            username: target.user.username,
            discriminator: target.user.discriminator,
            pfp: user.avatarURL(),
            registered: registeredDate
        }

        if (isNull(information.nickname)) {
            information.nickname = target.user.username;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`Who is ${information.nickname}?`)
            .addField(`**Roles[${numberOfRoles}]:**`, information.roles)
            .addField('**User:**', `<@${information.id}>`)
            .addField('**Joined At:**', information.joinedAt, true)
            .addField('**Registered:**', information.registered, true)
            .setColor(client.color)
            .setFooter(`ID: ${information.id}`)
            .setThumbnail(information.pfp)
        
        message.channel.send(embed)
    }
}

