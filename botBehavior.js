import { useCommands } from './discordCommands.js';
import { useAppData } from "./data.js";

const { commandsBehavior } = useCommands();
const {
    jokes,
    refreshQuoiJokes,
    refreshPourquoiJokes,
    refreshBasicJokes,
    clearCache
} = useAppData();

export function useBehavior(client) {
    const connected = { value: false }

    function onReady() {
        console.log(`Logged in as ${client.user.tag}.`);
        connected.value = true;
        console.log('App running.');
    }

    async function onGuildJoin(guild) {
        const systemChannel = guild.systemChannel;
        if (systemChannel) {
            try {
                await systemChannel.send('Ça va ou quoi ?');
            } catch (e) {
                console.error(e);
            }
        }
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
        const content = message.content.toLowerCase();

        if (content.match(/.*[p]our.{0,3}([q].{0,3}[u*]|[k]).{0,3}[o0*].{0,3}[i1*].*/)) {
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
        } else if (content.match(/.*quoi.*/)) {
            await message.reply({
                content: shouldMention ? 'trivialement feur' : 'feur',
                allowedMentions: {
                    repliedUser: shouldMention
                }
            });
            return;
        } else if (content.match(/.*([q].{0,3}[u*]|[k]).{0,3}[o0*].{0,3}[i1*].*/)) {
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
        } else {
            refreshBasicJokes();
            for (const [bait, answers] of Object.entries(jokes.basic)) {
                if (content.match('.*' + bait + '.{0,1}$')) {
                    await message.reply({
                        content: answers.sample(),
                        allowedMentions: {
                            repliedUser: shouldMention
                        }
                    });
                }
            }
        }
        clearCache();
    }

    return {
        connected,
        onReady,
        onGuildJoin,
        onInteraction,
        onMessage
    };
}
