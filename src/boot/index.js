import { config } from 'dotenv';
import { arrays } from './arrays.js';

export function boot() {
    config();
    console.log(`Loaded ${process.env.NODE_ENV} environment`);
    arrays();
    console.log('Loaded array utils\n');
}
