import { writeFileSync, readFileSync } from 'fs';

const packageFile = './package.json';
const botConfigFile = './data/usersConfig.json';
const jokesFile = './data/jokes.json';

export function useAppData() {
    const { version, description } = JSON.parse(readFileSync(packageFile, { encoding: "utf-8" }));
    const { adminIds, framedIds, theFireDragonId } = JSON.parse(readFileSync(botConfigFile, { encoding: "utf-8" }));
    const jokes = { value: {} };

    function addOrReplaceJoke(trigger, answer) {
        refreshJokes();
        jokes.value[trigger] ? jokes.value[trigger].push(answer) : jokes.value[trigger] = [answer];
        jokes.value[trigger] = jokes.value[trigger].unique();
        writeFileSync(jokesFile, jokes.value.stylizedStringify(), { encoding: "utf-8" });
        clearCache();
    }

    function refreshJokes() {
        jokes.value = JSON.parse(readFileSync(jokesFile, { encoding: "utf-8" }));
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
