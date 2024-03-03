import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

const packageFile = resolve(process.cwd(), 'package.json');
const botConfigFile = resolve(process.cwd(), 'data', 'usersConfig.json');
const jokesFile = resolve(process.cwd(), 'data', 'jokes', 'global.json');

export function useAppData() {
    const { version, description } = JSON.parse(readFileSync(packageFile, { encoding: 'utf-8' }));
    const { adminIds, framedIds, theFireDragonId } = JSON.parse(readFileSync(botConfigFile, { encoding: 'utf-8' }));
    const jokes = { value: {} };

    function addOrReplaceJoke(trigger, answer) {
        refreshJokes();
        if (jokes.value[trigger]) {
            jokes.value[trigger].push(answer);
        } else {
            jokes.value[trigger] = [answer];
        }
        jokes.value[trigger] = jokes.value[trigger].unique();
        writeFileSync(jokesFile, jokes.value.stylizedStringify(), { encoding: 'utf-8' });
        clearCache();
    }

    function refreshJokes() {
        jokes.value = JSON.parse(readFileSync(jokesFile, { encoding: 'utf-8' }));
    }

    function clearCache() {
        delete jokes.value;
        jokes.value = {};
    }

    return {
        version,
        description,
        adminIds,
        framedIds,
        theFireDragonId,
        jokes,
        addOrReplaceJoke,
        refreshJokes,
        clearCache
    };
}
