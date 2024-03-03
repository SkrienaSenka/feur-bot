import express from 'express';
import { useAppData } from '../bot/data.js';
import { useCommands } from '../bot/discordCommands.js';
import { useBot } from '../bot/bot.js';
import { LOG_TYPES, ACTION_TYPES, useLogger } from '../utils/logger.js';

const { log } = useLogger(LOG_TYPES.SERVER);

export function useServer(PORT) {
    const app = express();
    app.use(express.json());

    const { version } = useAppData();
    const { reloadCommands } = useCommands();
    const { startBot, stopBot, isActive } = useBot();

    app.get('/', (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/');
        log(ACTION_TYPES.ACCESS_GRANTED, '/');
        res.send({ inviteLink: 'https://discord.com/api/oauth2/authorize?client_id=1057419962827940001&permissions=68608&scope=bot' });
    })

    app.get('/version', (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/version');
        log(ACTION_TYPES.ACCESS_GRANTED, '/version');
        res.send({ version: version });
    })

    app.post('/start', async (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/start');

        if (isActive()) {
            log(ACTION_TYPES.ACCESS_DENIED, '/start');
            res.send({ code: '400', message: 'Bot already running' });
        }

        log(ACTION_TYPES.ACCESS_GRANTED, '/start');

        try {
            await startBot();
            res.send({ code: '200', message: 'Bot started' });
        } catch (e) {
            log(ACTION_TYPES.ERROR, e);
            res.send({ code: '500', message: 'Unknown error' });
        }
    })

    app.post('/stop', async (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/stop');

        if (!isActive()) {
            log(ACTION_TYPES.ACCESS_DENIED, '/stop');
            res.send({ code: '400', message: 'Bot not running' });
        }

        log(ACTION_TYPES.ACCESS_GRANTED, '/stop');
        await stopBot();
        res.send({ code: '200', message: 'Bot stopped' });
    })

    app.post('/restart', async (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/restart');

        if (!isActive()) {
            log(ACTION_TYPES.ACCESS_DENIED, '/restart');
            res.send({ code: '400', message: 'Bot not running' });
        }

        log(ACTION_TYPES.ACCESS_GRANTED, '/restart');
        await stopBot();
        await startBot();
        res.send({ code: '200', message: 'Bot restarted' });
    })

    app.get('/status', (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/status');
        log(ACTION_TYPES.ACCESS_GRANTED, '/status');
        res.send({ code: '200', status: isActive() ? 'Running' : 'Stopped' });
    })

    app.post('/reload-commands', async (req, res) => {
        log(ACTION_TYPES.ACCESS_ASKED, '/reload-commands');
        log(ACTION_TYPES.ACCESS_GRANTED, '/reload-commands');
        await reloadCommands();
        res.send({ code: '200', message: 'Commands reloaded successfully' });
    })

    function startServer() {
        log(ACTION_TYPES.BOOTING, 'Starting server');
        app.listen(PORT.value);
        console.log(`Listening on port ${PORT.value}\n`);
        log(ACTION_TYPES.START, `Listening on port ${PORT.value}`);
    }

    return {
        startServer,
    }
}
