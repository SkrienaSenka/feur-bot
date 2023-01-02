import { writeFileSync, readFileSync } from 'fs';

export function useAppData() {
    const { version, description } = JSON.parse(readFileSync('./package.json', { encoding: "utf-8" }));
    const { token, clientId, adminIds, framedIds, skrienaSenkaId, theFireDragonId } = JSON.parse(readFileSync('./data/botConfig.json', { encoding: "utf-8" }));
    const jokesFile = './data/jokes.json';
    const jokes = { quoi: [], pourquoi: [], basic: {}, value: {} };

    function addOrReplaceJoke(trigger, answer) {
        refreshJokes();
        jokes.value[trigger] ? jokes.value[trigger].push(answer) : jokes.value[trigger] = [answer];
        jokes.value[trigger] = jokes.value[trigger].unique();
        writeFileSync(jokesFile, JSON.stringify(jokes.value), { encoding: "utf-8" });
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
        token,
        clientId,
        adminIds,
        framedIds,
        skrienaSenkaId,
        theFireDragonId,
        jokes,
        addOrReplaceJoke,
        refreshJokes,
        clearCache
    };
}
