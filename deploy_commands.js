const { REST, Collection, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    deploy(client) {
        client.commands = new Collection();
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Construct and prepare an instance of the REST module
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                console.log(`${command.data.name} se cargo`);
                client.commands.set(command.data.name, command);
            } else {
                console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${client.commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: [...(client.commands.map(cmd => cmd.data.toJSON()).values())] },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}}