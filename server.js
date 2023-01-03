import express from 'express';
import { loadUtils } from "./utils.js";
import { useAppData } from "./data.js";
import { useCommands } from './discordCommands.js';
import { useBot } from './bot.js';

loadUtils();

const app = express();
app.use(express.json());
let PORT = parseInt(process.argv[process.argv.length - 1], 10);
if (isNaN(PORT)) {
    PORT = 9000;
    console.error('Program should give a port, defaulting to ' + PORT);
}

const { version, token, clientId } = useAppData();
const { reloadCommands } = useCommands(token, clientId);
const { startBot, stopBot, getStatus } = useBot();

app.get('/', (req, res) => {
    res.send({ inviteLink: 'https://discord.com/api/oauth2/authorize?client_id=1057419962827940001&permissions=68608&scope=bot' });
})

app.get('/version', (req, res) => {
    res.send({ version: version });
})

app.get('/bot/start', async (req, res) => {
    try {
        await startBot();
        res.send({ code: '200', message: 'Bot started' });
    } catch (e) {
        res.send({ code: '500', message: 'Unknown error' });
    }
})

app.get('/bot/stop', async (req, res) => {
    if (getStatus()) {
        await stopBot();
        res.send({ code: '200', message: 'Bot stopped' });
    } else {
        res.send({ code: '400', message: 'Bot not running' });
    }
})

app.get('/bot/status', async (req, res) => {
    res.send({ code: '200', status: getStatus() ? 'Running' : 'Stopped' });
})

app.get('/reload-commands', async (req, res) => {
    await reloadCommands();
    res.send({ code: '200', message: 'Commands reloaded successfully' });
})

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
