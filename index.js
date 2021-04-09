const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.operations = new Discord.Collection();
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const prefix = config['prefix'];
const token = config['bot token'];
const perm = config['perm'];
const status = config['status'];
const welcomeMsg = config['enable welcome message'];
client.xp = {};
client.stopwatch = {};
client.perm = perm;
client.prefix = prefix;
client.leave = {};
client.color = config['embed color'];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // makes sure that files inside of the ./commands folder are ending with '.js'

for(const file of commandFiles) {   //sets up the command files
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
} 

client.operations = new Discord.Collection();
const operationsFiles = fs.readdirSync('./operations').filter(file => file.endsWith('.js')); // makes sure that files inside of the ./operations folder are ending with '.js'

for(const file of operationsFiles) {
    
    const operations = require(`./operations/${file}`);

    client.operations.set(operations.name, operations);
}

client.on('ready', () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity(status)

    client.guilds.cache.forEach(guild => {
        client.xp[guild.id] = []; // sets up the XP system
    });

    setInterval(function addXP () {
        client.operations.get('xp').execute(client);
    }, 1000)
    setInterval(function checkIfLeave () {
        let date = new Date();
        date = date.valueOf()
        
        for (guildID in client.leave) {
            let obj = client.leave[guildID];
            if (obj.time <= date) {
                let connection = obj.connection;
                connection.disconnect();
            }
        }
    }, 1000)
    setInterval(function serverStats () {
        client.operations.get('server stats').execute(client);
    }, 10000);

})

client.on('messageDelete', msg => {
    client.operations.get('logs').execute(msg, client, true);
})
client.on('messageUpdate', msg => {
    client.operations.get('logs').execute(msg, client, false);
})

client.on('guildMemberAdd', member => {
    if (welcomeMsg) client.operations.get('welcome').execute(member, client);
})

client.on('raw', event => {
    const eventName = event.t;
    if (eventName === 'MESSAGE_REACTION_ADD') {
        client.operations.get('reaction role').execute(event, client, true);
    }
    if (eventName === 'MESSAGE_REACTION_REMOVE') {
        client.operations.get('reaction role').execute(event, client, false);
    }
})

client.on('message', (message) => {
    const excludeXP = JSON.parse(fs.readFileSync('supplementaryFiles/XPCooldown.json', 'utf-8'))
    try {
        if (!client.xp[message.guild.id].includes(message.member.id) && !excludeXP['channels'].includes(message.channel.id) && !excludeXP['members'].includes(message.member.id)) {
            client.xp[message.guild.id].push(message.author.id); // adds the user id to an the XP object
        };
    }
    catch {}

    if (!message.content.toLowerCase().startsWith(prefix)) return;
    command = message.content.toLowerCase().split(/ /)[0].replace(prefix, '');
    if (!client.commands.get(command)) return;
    client.commands.get(command).execute(message, client);

})

client.login(token);