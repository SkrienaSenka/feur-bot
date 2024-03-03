import { boot } from './boot/index.js';
import { LOG_TYPES, ACTION_TYPES, useLogger } from './utils/logger.js';
import { useServer } from './server/server.js';

const { log } = useLogger(LOG_TYPES.APP);

try {
    console.log(`Starting application...\n`);
    boot();

    const portArgIndex = process.argv.findIndex(arg => arg.startsWith('--PORT='));
    const PORT = { value: null };
    if (portArgIndex === -1) {
        PORT.value = process.env.DEFAULT_PORT;
        console.warn(`No port given, defaulting to ${PORT.value}`);
        log(ACTION_TYPES.WARNING, `No port given, defaulting to ${PORT.value}`)
    } else {
        PORT.value = parseInt(process.argv[portArgIndex].split('=')[1]);
    }

    useServer(PORT).startServer();

    console.log('Application started\n\n\n');
    log(ACTION_TYPES.START, 'Application started');
} catch (e) {
    log(ACTION_TYPES.ERROR, e);
    throw e;
}
