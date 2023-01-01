import { useCommands } from './discordCommands.js';
import { useAppData } from "./data.js";

const { commandsBehavior } = useCommands();
const { jokes, refreshJokes, clearCache } = useAppData();

export function useBehavior(client) {
    const charactersToIgnoreInBetween = '~"#' + "'" + '{([\\-|`_\\\\^@)\\]°}¨$¤£%*<>,?;.:\\/!§';
    const charactersToIgnoreAtEnd = 'etpsdh';
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

        const isFireDragon = message.author.id.toString() === '317279640354029569';
        const content = message.content.toLowerCase();

        if (isFireDragon && message.content.match(/.*quoi.*/)) {
            await message.reply({
                content: 'trivialement feur',
                allowedMentions: {
                    repliedUser: isFireDragon
                }
            });
            return;
        }

        refreshJokes();

        for (const [bait, answers] of Object.entries(jokes.value)) {
            let regex = '^.*' + bait.replace(/in_between/g, charactersToIgnoreInBetween) + '$';
            regex = regex.replace(/at_end/g, charactersToIgnoreAtEnd);

            if (content.match(regex)) {
                await message.reply({
                    content: answers.sample(),
                    allowedMentions: {
                        repliedUser: isFireDragon
                    }
                });
                break;
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
