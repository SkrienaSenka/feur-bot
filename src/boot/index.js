import { config } from 'dotenv';
import { arrays } from './arrays.js';
import { objects } from './objects.js';
import { strings } from './strings.js';
import { LOG_TYPES, ACTION_TYPES, useLogger } from '../utils/logger.js';

const { log } = useLogger(LOG_TYPES.APP);

export function boot() {
    log(ACTION_TYPES.BOOTING, 'Starting application');
    config();
    console.log(`Loaded ${process.env.NODE_ENV} environment\n`);
    arrays();
    console.log('Loaded arrays utils');
    objects();
    console.log('Loaded objects utils');
    strings();
    console.log('Loaded strings utils\n');
}
