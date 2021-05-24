const fs = require('fs');
const Discord = require('discord.js');
module.exports = {
    name: "soko",
    description: "Starts a game of Sokobond",
    catigory: 'fun',
    usage: `${JSON.parse(fs.readFileSync('./config.json', 'utf-8'))['prefix']}soko`,
    async execute (message, client) {
        const possibilities = ['🟥', '🟧', '🟨', '🟪', '🟩', '🟦'];
        const edge = possibilities[Math.floor(Math.random() * possibilities.length)];
        let filter = (m) => m.author.id === message.author.id;
        let win = false;
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        let board = await generateMap();
        let edMSG = await message.channel.send('Game:');
        moves = 0;
        do {
            edMSG.edit(makeEmbed(board, false));
            dir = await getMove();
            moves++
            board = move(dir, board);
            let win1 = checkIfWin(board);
            if (win1) onWin(board);
        }
        while (!win);
        
        function onWin (board) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`**GAME WON!**`)
                .setColor(randomColor)
                .addField("Board:", boardToString(board))
                .addField("Taken moves:", moves, true)
                .addField("Player:", message.author, true)

            edMSG.edit(embed);
            win = true;
        }

        async function getMove() {
            let msg = await message.channel.awaitMessages(filter, {max: 1, time: 300000, errors: ['time']});
            possibleMoves = ['u', 'd', 'l', 'r', 'w', 'a', 's',' d', 'up', 'down', 'left', 'right'];
            msg = msg.first();
            if (!possibleMoves.includes(msg.content)) {
                move = await getMove();
            };
            
            const moveIndexes = {
                'u': 'u',
                'up': 'u',
                'w': 'u',
                'down': 'd',
                's': 'd',
                'l': 'l',
                'left': 'l',
                'a': 'l',
                'r': 'r',
                'right': 'r',
                'd': 'r'
            };  
            content = msg.content;
            content = moveIndexes[content];
            client.excused.push(message.author.id);
            msg.delete();
            return content;
        }

        function move (dir, board) {
            function xys() {
                let {x, y} = getLocation('😀', board);
                let x1 = x;
                let y1 = y;
                let x2 = x;
                let y2 = y;
                return {x1, y1, x2, y2}
            }
            let {x1, y1, x2, y2} = xys();

            if (dir === 'u') y1--;
            else if (dir === 'd') y1++;
            else if (dir === 'l') x1--;
            else if (dir === 'r') x1++;
            
            if (board[y1][x1] === ':black_large_square:') {
                bx = x1;
                by= y1;
                
                if (dir === 'u') by--;
                else if (dir === 'd') by++;
                else if (dir === 'l') bx--;
                else if (dir === 'r') bx++;

                if (board[by][bx] === edge) {
                    return board;
                }

                board[by][bx] = ':black_large_square:';
            }
            else if (board[y1][x1] === edge || board[y1][x1] === ' ⭐️ ') {
                invalid = true;
                return board;
            };

            board[y1][x1] = '😀';
            board[y2][x2] = ':white_large_square:';

            return board;
        }

        function getLocation (char, board) {
            let x = 0;
            let y = 0;

            for (row of board) {
                for (column of row) {
                    if (column === char) return {x, y};
                    x++;
                }
                y++;
                x=0;
            };
        };

        async function generateMap () {

            const background = ':white_large_square:';
            let board = [
                [edge, edge, edge, edge, edge, edge, edge, edge, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, background, background, background, background, background, background, background, edge],
                [edge, edge, edge, edge, edge, edge, edge, edge, edge]
            ];
            
            let x1 = randomNumber(1, 7);  
            let y1 = randomNumber(1, 7);
            let x2 = randomNumber(1, 7);  
            let y2 = randomNumber(1, 7);
            let x3 = randomNumber(2, 6);
            let y3 = randomNumber(2, 6);
            
            while (`${x1}${y1}` === `${x2}${y2}` || `${x1}${y1}` === `${x3}${y3}`) {
                x1 = randomNumber(1, 7);
                y1 = randomNumber(1, 7);
            };
            while (`${x2}${y2}` === `${x1}${y1}` || `${x2}${y2}` === `${x3}${y3}`) {
                x2 = randomNumber(1, 7);
                y2 = randomNumber(1, 7);
            };
            while (`${x3}${y3}` === `${x2}${y2}` || `${x3}${y3}` === `${x1}${y1}`) {
                x3 = randomNumber(2, 6);
                y3 = randomNumber(2, 6);
            };

            board[x1][y1] = '😀';
            board[x2][y2] = ' ⭐️ ';
            board[x3][y3] = ':black_large_square:';

            async function addWalls (board) {
                x = randomNumber(1, 7);
                y = randomNumber(1, 7);
                
                if (board[y][x] === background) {
                    board[y][x] = edge;
                }
                else {
                    board = await addWalls(board);
                };
                return board;
            };

            board = await addWalls(board);
            board = await addWalls(board);
            board = await addWalls(board);
            board = await addWalls(board);
            
            return board;
        }
        
        function boardToString (board) {
            str = '';
            for (row of board) {
                for (symbol of row) {
                    str+=symbol;
                }
                str+='\n';
            }
            return str;
        }
        
        function randomNumber(min, max) { 
            return Math.floor(Math.random() * (max - min) + min);
        }
        function makeEmbed (board, additionalInfo) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`**${message.author.username}'s Sokobond Game**`)
                .setColor(randomColor)
                .addField("Board:", boardToString(board))
                .setDescription('To play the game send commands like "w", "a", "s", "d", "right" and "left" to control the movement of 😀. Your goal is to push :black_large_square: to the ⭐️.')
            
            if (additionalInfo) {
                embed.setDescription(additionalInfo);
            }
            return embed;
        }
        function checkIfWin (board) {
            const lc = getLocation(' ⭐️ ', board) 
            if (lc) win1 = false
            else win1 = true;
            return win1;
        }
    }
}