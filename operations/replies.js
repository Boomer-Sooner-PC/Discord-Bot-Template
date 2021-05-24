const fs = require('fs');

module.exports = {
    name: "replies",
    description: "Replies to a message if it is set up.",
    async execute (message, client) {
        
        let json = JSON.parse(fs.readFileSync('./supplementaryFiles/replies.json', 'utf-8'));

        content = message.content;
        listOfWords = content.split(' ');
        replies = json[message.guild.id];
        for (word of listOfWords) {
            reply = replies[word.toLowerCase()];
            if (reply) {
                message.channel.send(reply);
            };
        }

    }
};
