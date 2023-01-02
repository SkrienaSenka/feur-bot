import emojiRegex from 'emoji-regex'
import { useCommands } from './discordCommands.js';
import { useAppData } from "./data.js";

const { adminIds, framedIds, theFireDragonId, jokes, refreshJokes, clearCache } = useAppData();
const { commandsBehavior } = useCommands();

export function useBehavior(version, client) {
    const charactersToIgnoreAtEnd = 'etpsdh';
    const connected = { value: false };

    function onReady() {
        console.log(`Logged in as ${client.user.tag}.`);
        connected.value = true;
        console.log(`Bot running (v${version}).`);
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
        // TODO Better options management
        console.log(`[${new Date().toISOString()}] ${interaction.user.tag} tried to use command ${interaction.commandName} with parameters "${interaction.options.getString('trigger')}" "${interaction.options.getString('answer')}"\n`)
        if (!adminIds.includes(interaction.user.id)) return;

        if (Object.keys(commandsBehavior).includes(interaction.commandName)) {
            await commandsBehavior[interaction.commandName](interaction, client);
        }
    }

    async function onMessage(message) {
        if (message.author.id === client.user.id) return;
        const guildOwner = client.users.cache.get(message.guild.ownerId);
        console.log(`[${new Date().toISOString()}] ${message.author.tag} in channel "${message.channel.name}" of "${message.guild.name}" owned by ${guildOwner ? guildOwner.tag : 'Idk bro'} :\n${message.content}\n`)

        const isFireDragon = message.author.id.toString() === theFireDragonId;

        if (isFireDragon && message.content.match(/.*quoi.*/)) {
            try {
                await message.reply({
                    content: 'trivialement feur',
                    allowedMentions: {
                        repliedUser: true
                    }
                });
                return;
            } catch (e) {
                console.error(e);
            }
        }

        const content = message.content.toLowerCase()
            .replace(emojiRegex(), '')
            .replace(/(<:[^:]*:[^>]*>)*/g, '')
            .replace(/[ ~"#'{([\-|`_\\^@)\]°}¨$¤£%*<>,?;.:/!§]*/g, '');
        const isFramed = framedIds.includes(message.author.id.toString());

        refreshJokes();

        for (const [bait, answers] of Object.entries(jokes.value)) {
            let regex = '^.*' + bait.replace(/at_end/g, charactersToIgnoreAtEnd) + '$';

            if (content.match(regex)) {
                try {
                    await message.reply({
                        content: answers.sample(),
                        allowedMentions: {
                            repliedUser: isFramed
                        }
                    });
                    break;
                } catch (e) {
                    console.error(e);
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
