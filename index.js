const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder');

const botArgs = {
    host: 'KRIPESH007.aternos.me',
    port: '29015',
    username: "Hello_world",
    version: '1.8.9'
};

const initBot = () => {

    // Setup bot connection
    let bot = mineflayer.createBot(botArgs);

    bot.loadPlugin(pathfinder);  // Load pathfinder plugin

    bot.on('login', () => {
        let botSocket = bot._client.socket;
        console.log(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
    });

    bot.on('end', () => {
        console.log(`Disconnected`);

        // Attempt to reconnect
        setTimeout(initBot, 5000);
    });

    bot.on('spawn', async () => {
        console.log("Spawned in");
        bot.chat("Hello!");

        await bot.waitForTicks(60);
        bot.chat("Goodbye");
        bot.quit();
    });

    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`Failed to connect to ${err.address}:${err.port}`)
        }
        else {
            console.log(`Unhandled error: ${err}`);
        }
    });

    // Function to make the bot jump at random intervals
    const randomJump = () => {
        const jumpInterval = Math.random() * 4000 + 1000;
        setTimeout(() => {
            if (bot.entity) {
                console.log('Jumping');
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 100); 
            }
            randomJump(); 
        }, jumpInterval);
    };

    // Function to make the bot walk in random directions at random intervals
    const randomWalk = () => {
        const walkInterval = Math.random() * 8000 + 2000;
        setTimeout(() => {
            if (bot.entity) {
                const directions = ['forward', 'back', 'left', 'right'];
                const randomDirection = directions[Math.floor(Math.random() * directions.length)];
                console.log(`Walking ${randomDirection}`);
                bot.setControlState(randomDirection, true);
                setTimeout(() => bot.setControlState(randomDirection, false), Math.random() * 2000 + 1000);
            }
            randomWalk(); 
        }, walkInterval);
    };

    // Function to navigate the bot to given x, y, z coordinates
    const moveToLocation = (x, y, z) => {
        const mcData = require('minecraft-data')(bot.version); // Minecraft data for bot's version
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);

        const goal = new GoalBlock(x, y, z);
        bot.pathfinder.setGoal(goal);

        console.log(`Moving to location: x=${x}, y=${y}, z=${z}`);
    };

    bot.on('spawn', () => {
        randomJump();
        randomWalk();
    });

    // Example: Move the bot to specific coordinates after 10 seconds
    setTimeout(() => {
        moveToLocation(100, 64, 100);  // Replace with desired coordinates (x, y, z)
    }, 10000);
};

initBot();
