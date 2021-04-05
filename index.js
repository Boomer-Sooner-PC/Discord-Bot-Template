const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.operations = new Discord.Collection();
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const prefix = config['prefix'];
const token = config['bot token'];
const perm = config['perm'];
client.xp = {};
client.stopwatch = {};
client.perm = perm;
client.prefix = prefix;
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
    client.user.setActivity(`${prefix}help for a list of commands`)

    client.guilds.cache.forEach(guild => {
        client.xp[guild.id] = []; // sets up the XP system
    });

    setInterval(function () {
        client.operations.get('xp').execute(client);
    }, 1000)

})

client.on('messageDelete', msg => {
    client.operations.get('logs').execute(msg, client, true);
})
client.on('messageUpdate', msg => {
    client.operations.get('logs').execute(msg, client, false);
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
    if (!client.xp[message.guild.id].includes(message.member.id) && !excludeXP['channels'].includes(message.channel.id) && !excludeXP['members'].includes(message.member.id)) {
        client.xp[message.guild.id].push(message.author.id); // adds the user id to an the XP object
    };

    if (!message.content.toLowerCase().startsWith(prefix)) return;
    command = message.content.toLowerCase().split(/ /)[0].replace(prefix, '');
    if (!client.commands.get(command)) return;
    client.commands.get(command).execute(message, client);

})

client.login(token);