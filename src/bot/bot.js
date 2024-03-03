import { Client, Events, GatewayIntentBits } from 'discord.js';
import { useBehavior } from './botBehavior.js';
import { LOG_TYPES, ACTION_TYPES, useLogger } from '../utils/logger.js';

const { log } = useLogger(LOG_TYPES.BOT);

export function useBot() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    const { connected, onReady, onGuildJoin, onInteraction, onMessage } = useBehavior(client);
    client.on(Events.ClientReady, onReady);
    client.on(Events.GuildCreate, onGuildJoin)
    client.on(Events.InteractionCreate, onInteraction);
    client.on(Events.MessageCreate, onMessage);

    async function startBot() {
        log(ACTION_TYPES.BOOTING, 'Starting the bot...');
        await client.login(process.env.APPLICATION_TOKEN);
        log(ACTION_TYPES.START, 'Bot started');
    }

    async function stopBot() {
        await client.destroy();
        connected.value = false;
        log(ACTION_TYPES.STOP, 'Client disconnected.');
    }

    function isActive() {
        return connected.value;
    }

    return {
        startBot,
        stopBot,
        isActive
    }
}
