import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export const LOG_TYPES = Object.freeze({
    APP: 'app',
    SERVER: 'server',
    BOT: 'bot',
    GUILD: 'guild',
    USER: 'user'
});

export const ACTION_TYPES = Object.freeze({
    BOOTING: 'booting',
    START: 'start',
    STOP: 'stop',
    REFRESH: 'refresh',
    NEW_MESSAGE: 'message',
    ACCESS_ASKED: 'access_asked',
    ACCESS_GRANTED: 'access_granted',
    ACCESS_DENIED: 'access_denied',
    ERROR: 'error',
    WARNING: 'warning',
    OTHER: 'other'
});

/**
 * Function that gives access to the log file of given type and eventually id
 * @param logType Type of log file, must be one described in LOG_TYPES
 * @param id Id of entity if type is a user or a guild
 * @returns {{ readLogs: (function(): string), log: (function(string, string): void) }}
 */
export function useLogger(logType, id = null) {
    if (!Object.values(LOG_TYPES).includes(logType)) {
        throw new TypeError(`type argument must be one of these [${Object.values(LOG_TYPES).join(', ')}], ${logType} given`);
    }

    const logDir = resolve(process.cwd(), 'var', 'logs');

    if (!existsSync(logDir)){
        mkdirSync(logDir, { recursive: true });
    }

    const logFile = resolve(logDir, `${logType + (id ?? '')}.log`);

    /**
     * Log the message with its type and a timestamp in corresponding log file, this function can be used before .env
     * config is finished. Do NOT use environment variables
     * @param actionType Type of action, must be one described in ACTION_TYPES
     * @param message Message that will be written in the logs
     */
    function log(actionType, message) {
        if (!Object.values(ACTION_TYPES).includes(actionType)) {
            throw new TypeError(`type argument must be one of these [${Object.values(ACTION_TYPES).join(', ')}], ${actionType} given`);
        }
        if (!existsSync(logFile)) {
            writeFileSync(logFile, '', { encoding: 'utf-8' });
        }

        appendFileSync(
            logFile,
            `[${new Date().toISOString()}] ${actionType} ${message}\n`,
            { encoding: 'utf-8' }
        );
    }

    function readLogs() {
        return readFileSync(logFile, { encoding: 'utf-8' });
    }

    return {
        log,
        readLogs
    };
}
