import { boot } from './boot/index.js';
import { useServer } from './server/server.js';

boot();

console.log(`Starting application...\n`);

const portArgIndex = process.argv.findIndex(arg => arg.startsWith('--PORT='));
const PORT = { value: null };
if (portArgIndex === -1) {
    PORT.value = process.env.DEFAULT_PORT;
    console.error('No port given, defaulting to ' + PORT.value);
} else {
    PORT.value = parseInt(process.argv[portArgIndex].split('=')[1]);
}

useServer(PORT).startServer();

console.log('App started\n');
