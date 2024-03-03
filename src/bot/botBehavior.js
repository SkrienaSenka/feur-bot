import { useCommands } from './discordCommands.js';
import { useAppData } from './data.js';
import { LOG_TYPES, ACTION_TYPES, useLogger } from '../utils/logger.js';

const { log } = useLogger(LOG_TYPES.BOT);

const charactersToIgnoreAtEnd = 'etpsdh';

export function useBehavior(client) {
    const { version, adminIds, framedIds, theFireDragonId, jokes, refreshJokes, clearCache } = useAppData();
    const { commandsBehavior } = useCommands();
    const connected = { value: false };

    function onReady() {
        connected.value = true;
        log(ACTION_TYPES.START, `Logged in as ${client.user.tag} (v${version}).`);
    }

    async function onGuildJoin(guild) {
        const { log: guildLog } = useLogger(LOG_TYPES.GUILD, guild.id.toString());
        const guildOwner = client.users.cache.get(guild.ownerId);
        guildLog(ACTION_TYPES.START, `Joined guild ${guild.name} owned by ${guildOwner?.tag ?? 'Owner offline'}`)
        const systemChannel = guild.systemChannel;
        if (systemChannel) {
            try {
                await systemChannel.send('Ça va ou quoi ?');
            } catch (e) {
                guildLog(ACTION_TYPES.ERROR, e);
            }
        }
    }

    async function onInteraction(interaction) {
        if (!interaction.isChatInputCommand()) return;
        // TODO Better options management
        log(ACTION_TYPES.ACCESS_ASKED, `${interaction.user.tag} tried to use command ${interaction.commandName} with parameters : ${JSON.stringify(interaction.options)}`);
        if (commandsBehavior[interaction.commandName].protected && !adminIds.includes(interaction.user.id)) {
            log(ACTION_TYPES.ACCESS_DENIED, `Access denied for ${interaction.user.tag} on command ${interaction.commandName}`);
            try {
                await interaction.reply('L\'accès à cette commande vous est interdit');
                return;
            } catch (e) {
                log(ACTION_TYPES.ERROR, e);
                return;
            }
        }
        log(ACTION_TYPES.ACCESS_GRANTED, `Access granted for ${interaction.user.tag} on command ${interaction.commandName}`);

        if (Object.keys(commandsBehavior).includes(interaction.commandName)) {
            await commandsBehavior[interaction.commandName].behavior(interaction, client);
        }
    }

    async function onMessage(message) {
        if (message.author.id === client.user.id) return;
        const guildOwner = client.users.cache.get(message.guild.ownerId);
        log(ACTION_TYPES.NEW_MESSAGE, `${message.author.tag} in channel "${message.channel.name}" of "${message.guild.name}" owned by ${guildOwner?.tag ?? 'Owner offline'} : ${message.content}`);

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
                log(ACTION_TYPES.ERROR, e);
            }
        }

        const content = message.content.sanitize();
        const isFramed = framedIds.includes(message.author.id.toString());

        refreshJokes();

        for (const [trigger, answers] of Object.entries(jokes.value)) {
            let regex = '^.*' + trigger.toLowerCase().replace(/at_end/g, charactersToIgnoreAtEnd) + '$';

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
                    log(ACTION_TYPES.ERROR, e);
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
