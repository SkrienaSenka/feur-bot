import { REST, DefaultRestOptions, Routes } from 'discord.js';
import { useAppData } from './data.js';

export function useCommands() {
    const { addOrReplaceJoke } = useAppData();
    const rest = new REST({ version: DefaultRestOptions.version }).setToken(process.env.APPLICATION_TOKEN);
    const commandsDescription = [
        {
            name: 'addjoke',
            description: 'Add an answer based on a trigger',
            options: [
                {
                    name: 'trigger',
                    description: 'Regex to detect, see `/help addjoke` for more details',
                    type: 3,
                    required: true
                },
                {
                    name: 'answer',
                    description: 'The answer to the trigger',
                    type: 3,
                    required: true
                }
            ]
        }
    ];
    const commandsBehavior = {
        addjoke: {
            protectionLevel: true,
            behavior: async (interaction) => {
                try {
                    addOrReplaceJoke(interaction.options.getString('trigger'), interaction.options.getString('answer'));
                    await interaction.reply('Blague ajoutée avec succès !');
                } catch (e) {
                    try {
                        await interaction.reply('Une erreur innatendue est survenue (sah Senka sait pas coder).');
                        console.error(e);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    };

    async function reloadCommands() {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), { body: commandsDescription });

            console.log('Successfully reloaded application (/) commands.\n');
        } catch (e) {
            console.error(e);
        }
    }

    return {
        commandsDescription,
        commandsBehavior,
        reloadCommands
    };
}
