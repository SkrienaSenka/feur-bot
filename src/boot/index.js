import { config } from 'dotenv';
import { arrays } from './arrays.js';
import { objects } from "./objects.js";
import { strings } from "./strings.js";

export function boot() {
    config();
    console.log(`Loaded ${process.env.NODE_ENV} environment`);
    arrays();
    console.log('Loaded arrays utils\n');
    objects();
    console.log('Loaded objects utils\n');
    strings();
    console.log('Loaded strings utils\n');
}
