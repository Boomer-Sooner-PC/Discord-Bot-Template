const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const prefix = config['prefix'];
const token = config['bot token'];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // makes sure that files inside of the ./commands folder are ending with '.js'

for(const file of commandFiles) {   //sets up the command files
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
} 

client.on('ready', () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity(`${prefix}help for a list of commands`)
})

client.on('message', (message) => {
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    command = message.content.toLowerCase().split(/ /)[0].replace(prefix, '');
    if (!client.commands.get(command)) return;
    client.commands.get(command).execute(message, client);

})

client.login(token);