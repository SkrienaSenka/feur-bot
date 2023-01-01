import { REST, DefaultRestOptions, Routes } from 'discord.js';
import { useAppData } from './data.js';

const { addOrReplaceJoke } = useAppData();

export function useCommands(token, clientId) {
    const rest = new REST({ version: DefaultRestOptions.version }).setToken(token);
    const commandsDescription = [
        {
            name: 'addjoke',
            description: 'Add a joke based on a trigger',
            options: [
                {
                    name: 'trigger',
                    description: 'Regex to detect, see /help for more details',
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
        addjoke: async (interaction) => {
            try {
                addOrReplaceJoke(interaction.options.getString('trigger'), interaction.options.getString('answer'));
                await interaction.reply('Blague ajoutée avec succès !');
            } catch (e) {
                await interaction.reply('Une erreur innatendue est survenue (sah Senka sait pas coder).');
                console.error(e);
            }
        }
    };

    async function reloadCommands() {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(clientId), { body: commandsDescription });

            console.log('Successfully reloaded application (/) commands.');
        } catch (e) {
            console.error(e);
        }
    }

    return {
        commandsBehavior,
        reloadCommands
    };
}
