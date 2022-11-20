require('dotenv').config()
const { Client, Events, GatewayIntentBits } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require(path.join(__dirname, 'deploy_commands.js')).deploy(client);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(`${event.name} se registro`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);