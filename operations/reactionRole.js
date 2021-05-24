const fs = require('fs');
const { join } = require('path');

module.exports = {
    name: "reaction role",
    description: "Executes a reaction role",
    async execute (event, client, add) {
        const json = JSON.parse(fs.readFileSync('./supplementaryFiles/reactionRolesData.json', 'utf-8'));
        const emoji = event.d.emoji.name;
        const message = event.d.message_id;
        const guild = event.d.guild_id;
        if (!json[guild]) return
        if (!json[guild][message]) return
        const roleID = json[guild][message][emoji];
        if (!roleID) return;
        const memberID = event.d.user_id;
        const role = client.guilds.cache.get(guild).roles.cache.get(roleID);
        const member = await client.guilds.cache.get(guild).members.cache.get(memberID)

        if (add) {
            member.roles.add(role);
        }
        else {
            member.roles.remove(role);
        }
    }
};
