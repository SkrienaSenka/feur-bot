import { Client, Events, GatewayIntentBits } from 'discord.js';
import { useAppData } from './data.js';
import { useCommands } from './discordCommands.js';
import { useBehavior } from "./botBehavior.js";
import { useUtils } from "./utils.js";

(async() => {
    console.log('Starting the app...');

    useUtils();
    const { token, clientId } = useAppData();
    const { reloadCommands } = useCommands(token, clientId);

    await reloadCommands();

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

    const { onReady, onInteraction, onMessage } = useBehavior(client);

    client.on(Events.ClientReady, onReady);

    client.on(Events.InteractionCreate, onInteraction);

    client.on(Events.MessageCreate, onMessage);

    client.login(token);
})();
