const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;

// Bot connection arguments
const botArgs = {
    host: 'KRIPESH007.aternos.me',  // Your server IP or hostname
    port: '29015',      // Minecraft server port
    username: "Hello_world",  // Bot's username
    version: '1.20.1'   // Minecraft version
};

let bot;

// Initialize and reconnect the bot
const initBot = () => {
    bot = mineflayer.createBot(botArgs);

    bot.loadPlugin(pathfinder);

    // When the bot logs in
    bot.on('login', () => {
        console.log(`Logged in to server`);
    });

    // When the bot spawns into the world
    bot.on('spawn', () => {
        console.log("Bot spawned in the game!");

        // Make the bot chat and move around randomly
        bot.chat("Hello! I'm a bot.");
        moveBotRandomly();
    });

    // Reconnection logic if bot is disconnected
    bot.on('end', () => {
        console.log('Disconnected from server, attempting to reconnect...');
        
        // Reconnect after 10 seconds
        setTimeout(() => {
            initBot();
        }, 10000);
    });

    // Error handling
    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`Failed to connect to ${err.address}:${err.port}`);
        } else {
            console.log(`Unhandled error: ${err}`);
        }
        
        // Retry connecting after 10 seconds
        setTimeout(() => {
            initBot();
        }, 10000);
    });
};

// Function to move the bot randomly
function moveBotRandomly() {
    // Move or jump at random intervals
    setInterval(() => {
        if (Math.random() > 0.5) {
            bot.setControlState('jump', true);
            setTimeout(() => {
                bot.setControlState('jump', false);
            }, 1000);  // Jump for 1 second
        }

        // Move forward randomly for 2 seconds
        bot.setControlState('forward', true);
        setTimeout(() => {
            bot.setControlState('forward', false);
        }, 2000);
    }, Math.random() * 5000 + 3000); // Random movement every 3-8 seconds
}

// Function to move the bot to specific coordinates (x, y, z)
function moveToCoordinates(x, y, z) {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    const goal = new GoalNear(x, y, z, 1);  // Goal coordinates and tolerance of 1 block
    bot.pathfinder.setGoal(goal);
}

// Example command to move bot to specific location
bot.on('chat', (username, message) => {
    if (username === bot.username) return;  // Ignore the bot's own messages

    const args = message.split(' ');
    if (args[0] === 'goto' && args.length === 4) {
        const x = parseFloat(args[1]);
        const y = parseFloat(args[2]);
        const z = parseFloat(args[3]);

        moveToCoordinates(x, y, z);  // Move to specified x, y, z
        bot.chat(`Moving to (${x}, ${y}, ${z})`);
    }
});

// Start the bot for the first time
initBot();
