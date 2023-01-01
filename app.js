import { Client, Events, GatewayIntentBits } from 'discord.js';
import { useAppData } from './data.js';
import { useCommands } from './discordCommands.js';
import { useBehavior } from "./botBehavior.js";
import { useUtils } from "./utils.js";

(async() => {
    console.log('Starting the app...');

    useUtils();
    const { token, clientId } = useAppData();

    if (process.argv[2] && ['--reload-commands', '-r'].includes(process.argv[2])) {
        const { reloadCommands } = useCommands(token, clientId);
        await reloadCommands();
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

    process.on('SIGINT', async function() {
        if (connected.value) {
            console.log('Disconnecting the client...');
            await client.destroy();
            console.log('Client disconnected.');
        }
        process.exit();
    });

    const { connected, onReady, onGuildJoin, onInteraction, onMessage } = useBehavior(client);

    client.on(Events.ClientReady, onReady);

    client.on(Events.GuildCreate, onGuildJoin)

    client.on(Events.InteractionCreate, onInteraction);

    client.on(Events.MessageCreate, onMessage);

    await client.login(token);
})();
