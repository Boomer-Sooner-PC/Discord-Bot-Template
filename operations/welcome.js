const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "welcome",
    description: "Sends the welcome message..",
    async execute (member, client) {

        const json = JSON.parse(fs.readFileSync('./supplementaryFiles/welcome.json', 'utf-8'));
        if (!json[member.guild.id]) return;
        const info = json[member.guild.id];
        const icon = await member.avatarURL;
        const color = await client.color;
        let embed = new Discord.MessageEmbed()
            .setTitle(`**Welcome ${member.user.username} to the ${member.guild.name}!**`)
            .setDescription(info["msg"])
            .addField("Total Members:", member.guild.memberCount, true)
            .setThumbnail(icon)
            .setColor(color)
        member.guild.channels.cache.get(info["channel"]).send(embed);

        if (info["role"]) {
            const role = member.guild.roles.cache.get(info["role"]);
            member.roles.add(role);
        };

    }
} 
