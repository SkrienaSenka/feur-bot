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

app.get('/version', async (req, res) => {
    res.send({ version: version });
})

app.get('/bot/start', async (req, res) => {
    await startBot();
    res.send({ code: '200', message: 'Bot started' });
})

app.get('/bot/stop', async (req, res) => {
    await stopBot();
    res.send({ code: '200', message: 'Bot stopped' });
})

app.get('/bot/status', async (req, res) => {
    res.send({ code: '200', status: getStatus() ? 'Running' : 'Stopped' });
})

app.get('/reload-commands', async (req, res) => {
    await reloadCommands();
    res.send({ code: '200', message: 'Commands reloaded successfully' });
})

app.listen(PORT);

console.log("Listening on port " + PORT);
