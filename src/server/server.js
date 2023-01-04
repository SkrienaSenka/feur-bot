import express from 'express';
import { useAppData } from "../bot/data.js";
import { useCommands } from '../bot/discordCommands.js';
import { useBot } from '../bot/bot.js';

export function useServer(PORT) {
    const app = express();
    app.use(express.json());

    const { version } = useAppData();
    const { reloadCommands } = useCommands();
    const { startBot, stopBot, isActive } = useBot();

    app.get('/', (req, res) => {
        res.send({ inviteLink: 'https://discord.com/api/oauth2/authorize?client_id=1057419962827940001&permissions=68608&scope=bot' });
    })

    app.get('/version', (req, res) => {
        res.send({ version: version });
    })

    app.get('/start', async (req, res) => {
        try {
            await startBot();
            res.send({ code: '200', message: 'Bot started' });
        } catch (e) {
            res.send({ code: '500', message: 'Unknown error' });
        }
    })

    app.get('/stop', (req, res) => {
        if (isActive()) {
            stopBot();
            res.send({ code: '200', message: 'Bot stopped' });
        } else {
            res.send({ code: '400', message: 'Bot not running' });
        }
    })

    app.get('/status', (req, res) => {
        res.send({ code: '200', status: isActive() ? 'Running' : 'Stopped' });
    })

    app.get('/reload-commands', async (req, res) => {
        await reloadCommands();
        res.send({ code: '200', message: 'Commands reloaded successfully' });
    })

    function startServer() {
        app.listen(PORT.value);
        console.log(`Listening on port ${PORT.value}\n`);
    }

    return {
        startServer,
    }
}
