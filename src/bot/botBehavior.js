import { stylizedStringify } from "../utils/object.js";
import { useCommands } from './discordCommands.js';
import { useAppData } from "./data.js";

const charactersToIgnoreAtEnd = 'etpsdh';

export function useBehavior(client) {
    const { version, adminIds, framedIds, theFireDragonId, jokes, refreshJokes, clearCache } = useAppData();
    const { commandsBehavior } = useCommands();
    const connected = { value: false };

    function onReady() {
        connected.value = true;
        console.log(`Logged in as ${client.user.tag}.`);
        console.log(`Bot running (v${version}).\n`);
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
        console.log(`[${new Date().toISOString()}] ${interaction.user.tag} tried to use command ${interaction.commandName} with parameters :\n${stylizedStringify(interaction.options)}`)
        if (commandsBehavior[interaction.commandName].protected && !adminIds.includes(interaction.user.id)) {
            console.log(`Access denied for ${interaction.user.tag} on command ${interaction.commandName}\n`);
            try {
                await interaction.reply('L\'accès à cette commande vous est interdit');
                return;
            } catch (e) {
                console.error(e);
                return;
            }
        }
        console.log(`Access authorized for ${interaction.user.tag} on command ${interaction.commandName}\n`);

        if (Object.keys(commandsBehavior).includes(interaction.commandName)) {
            await commandsBehavior[interaction.commandName].behavior(interaction, client);
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

        const content = message.content.sanitize();
        const isFramed = framedIds.includes(message.author.id.toString());

        refreshJokes();

        for (const [trigger, answers] of Object.entries(jokes.value)) {
            let regex = '^.*' + trigger.replace(/at_end/g, charactersToIgnoreAtEnd) + '$';

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
