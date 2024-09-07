const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

// Bot configuration
const botArgs = {
    host: 'KRIPESH007.aternos.me', // Change this to your Minecraft server IP or hostname
    port: 29015,       // Change this to your Minecraft server port
    username: 'Hello_world', // Change this to your desired bot username
    version: '1.20.1' // Change this to your Minecraft server version
};

// Function to initialize the bot
const initBot = () => {
    // Create the bot
    const bot = mineflayer.createBot(botArgs);

    // Load pathfinder plugin
    bot.loadPlugin(pathfinder);

    // Event handler for when the bot logs in
    bot.on('login', () => {
        console.log('Bot logged in!');
    });

    // Event handler for chat messages
    bot.on('chat', (username, message) => {
        console.log(`${username}: ${message}`);
        if (message === 'hello') {
            bot.chat('Hello! How can I help you?');
        }
    });

    // Event handler for errors
    bot.on('error', (err) => {
        console.error('An error occurred:', err);
    });

    // Event handler for disconnection
    bot.on('end', () => {
        console.log('Bot disconnected, reconnecting...');
        setTimeout(initBot, 5000); // Reconnect after 5 seconds
    });

    // Event handler for bot spawn
    bot.on('spawn', () => {
        console.log('Bot spawned!');
        // Example of moving to a specific location
        moveToCoordinates(100, 64, 100); // Replace with desired coordinates
    });

    // Function to move the bot to specific coordinates
    function moveToCoordinates(x, y, z) {
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
    }
};

// Initialize the bot
initBot();
