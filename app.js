import { Client, GatewayIntentBits } from 'discord.js';
import { useAppData } from './data.js';
import { useCommands } from './discordCommands.js';
import { useBehavior } from "./botBehavior.js";

(async() => {
    console.log('Starting the app...');

    const { token, clientId } = useAppData();
    const { reloadCommands } = useCommands(token, clientId);

    await reloadCommands();

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

    const { onReady, onInteraction, onMessage } = useBehavior(client);

    client.on('ready', onReady);

    client.on('interactionCreate', onInteraction);

    client.on('messageCreate', onMessage);

    client.login(token);
})();
