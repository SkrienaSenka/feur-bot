import { REST, Routes } from 'discord.js';
import { useAppData } from './data.js';

const {
    addQuoiJoke,
    addPourquoiJoke,
    addOrReplaceBasicJoke
} = useAppData();

export function useCommands(token, clientId) {
    const rest = new REST({ version: '10' }).setToken(token);
    const commandsDescription = [
        {
            name: 'addquoi',
            description: 'Add a "Quoi" joke',
            options: [
                {
                    name: 'joke',
                    description: 'Adds this answer to the "Quoi" trigger',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'addpourquoi',
            description: 'Add a "Pourquoi" joke',
            options: [
                {
                    name: 'joke',
                    description: 'Adds this answer to the "Pourquoi" trigger',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'addbasic',
            description: 'Add a basic joke like "non bril"',
            options: [
                {
                    name: 'trigger',
                    description: 'The word that triggers the answer',
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
        addquoi: async (interaction) => {
            try {
                addQuoiJoke(interaction.options.getString('joke'));
                await interaction.reply('Blague ajoutée avec succès !');
            } catch (e) {
                await interaction.reply('Une erreur innatendue est survenue (sah Senka sait pas coder).');
                console.error(e);
            }
        },
        addpourquoi: async (interaction) => {
            try {
                addPourquoiJoke(interaction.options.getString('joke'));
                await interaction.reply('Blague ajoutée avec succès !');
            } catch (e) {
                await interaction.reply('Une erreur innatendue est survenue (sah Senka sait pas coder).');
                console.error(e);
            }
        },
        addbasic: async (interaction) => {
            try {
                addOrReplaceBasicJoke(interaction.options.getString('trigger'), interaction.options.getString('joke'));
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
