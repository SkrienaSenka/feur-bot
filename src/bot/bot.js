import { Client, Events, GatewayIntentBits } from 'discord.js';
import { useBehavior } from './botBehavior.js';

export function useBot() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    const { connected, onReady, onGuildJoin, onInteraction, onMessage } = useBehavior(client);
    client.on(Events.ClientReady, onReady);
    client.on(Events.GuildCreate, onGuildJoin)
    client.on(Events.InteractionCreate, onInteraction);
    client.on(Events.MessageCreate, onMessage);

    async function startBot() {
        console.log('Starting the bot...');
        await client.login(process.env.APPLICATION_TOKEN);
    }

    function stopBot() {
        if (client.isReady()) {
            console.log('Disconnecting the client...');
            client.destroy();
            console.log('Client disconnected.\n');
        }
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
