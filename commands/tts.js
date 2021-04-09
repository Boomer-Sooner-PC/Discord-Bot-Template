const fs = require('fs');
const Discord = require('discord.js');
const DiscordTTS = require("discord-tts");

module.exports = {
    name: "tts",
    description: "Sends a message through voice chat.",
    catigory: 'fun',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}tts <message>`,
    async execute (message, client) {

        const broadcast = client.voice.createBroadcast();
        let channelID = message.member.voice.channelID;
        if (!channelID) {
            message.channel.send("Please be in a voice channel.");
            return;
        };
        let channel = client.channels.cache.get(channelID);
        const msg = message.content.replace(`${client.prefix}tts `, '');
        channel.join().then(connection => {
            broadcast.play(DiscordTTS.getVoiceStream(msg));
            const dispatcher = connection.play(broadcast);
            client.leave[message.guild.id] = {
                time: message.createdTimestamp + (JSON.parse(fs.readFileSync('./config.json', 'utf-8'))["time to disconnect"] * 60 * 1000),
                connection: connection
            };

        });

    }
} 
