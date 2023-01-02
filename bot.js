import { Client, Events, GatewayIntentBits } from 'discord.js';
import { useAppData } from './data.js';
import { useBehavior } from "./botBehavior.js";

export function useBot() {
    const { version, token } = useAppData();
    const client = { value: null };
    const status = { connected: { value: false } };

    async function startBot() {
        console.log('Starting the bot...');

        client.value = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

        const { connected, onReady, onGuildJoin, onInteraction, onMessage } = useBehavior(version, client.value);

        status.connected = connected;

        client.value.on(Events.ClientReady, onReady);

        client.value.on(Events.GuildCreate, onGuildJoin)

        client.value.on(Events.InteractionCreate, onInteraction);

        client.value.on(Events.MessageCreate, onMessage);

        await client.value.login(token);
    }

    async function stopBot() {
        if (status.connected.value) {
            console.log('Disconnecting the client...');
            await client.value.destroy();
            console.log('Client disconnected.');
            status.connected.value = false;
        } else {
            console.log('No client connected.');
        }
        return status.connected.value;
    }

    function getStatus() {
        return status.connected.value;
    }

    return {
        startBot,
        stopBot,
        getStatus
    }
}
