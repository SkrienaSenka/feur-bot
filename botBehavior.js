import { useCommands } from './discordCommands.js';
import { useAppData } from "./data.js";

const { commandsBehavior } = useCommands();
const {
    jokes,
    refreshQuoiJokes,
    refreshPourquoiJokes,
    refreshBasicJokes
} = useAppData();

export function useBehavior(client) {
    function onReady() {
        console.log(`Logged in as ${client.user.tag}.`);
        console.log('App running.')
    }

    async function onInteraction(interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (Object.keys(commandsBehavior).includes(interaction.commandName)) {
            await commandsBehavior[interaction.commandName](interaction);
        }
    }

    async function onMessage(message) {
        if (message.author.id === client.user.id) return;

        const shouldMention = message.author.id.toString() === '317279640354029569';

        if (message.content.match(/.*[pP]our.{0,3}([qQ].{0,3}[uU*]|[kK]).{0,3}[oO0*].{0,3}[iI1*].*/)) {
            refreshPourquoiJokes();
            if (jokes.pourquoi.length > 0) {
                await message.reply({
                    content: jokes.pourquoi.sample(),
                    allowedMentions: {
                        repliedUser: shouldMention
                    }
                });
            } else {
                console.error('Aucune blague "Pourquoi" n\'a été setup')
            }
            return;
        }

        if (message.content.match(/.*quoi.*/)) {
            await message.reply({
                content: shouldMention ? 'trivialement feur' : 'feur',
                allowedMentions: {
                    repliedUser: shouldMention
                }
            });
            return;
        }

        if (message.content.match(/.*([qQ].{0,3}[uU*]|[kK]).{0,3}[oO0*].{0,3}[iI1*].*/)) {
            refreshQuoiJokes();
            if (jokes.quoi.length > 0) {
                await message.reply({
                    content: jokes.quoi.sample(),
                    allowedMentions: {
                        repliedUser: shouldMention
                    }
                });
            } else {
                console.error('Aucune blague "Quoi" n\'a été setup')
            }
            return;
        }

        refreshBasicJokes();
        for (const [bait, answer] of Object.entries(jokes.basic)) {
            if (message.content.match('.*' + bait + '.{0,5}$')) {
                await message.reply({
                    content: answer,
                    allowedMentions: {
                        repliedUser: shouldMention
                    }
                });
                return;
            }
        }
    }

    return {
        onReady,
        onInteraction,
        onMessage
    };
}
