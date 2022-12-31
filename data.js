import { writeFileSync, readFileSync } from 'fs';

export function useAppData() {
    const token = 'MTA1NzQxOTk2MjgyNzk0MDAwMQ.Gi0iCw.qbSaYcmjbz9Mexwwj2ASvyuVDbUdcQLXdXT0GA';
    const clientId = '1057419962827940001';
    const quoiJokesFile = './data/quoiJokes.txt';
    const pourquoiJokesFile = './data/pourquoiJokes.txt';
    const basicJokesFile = './data/basicJokes.txt';
    const jokes = { quoi: [], pourquoi: [], basic: {} };

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function addQuoiJoke(joke) {
        refreshQuoiJokes();
        jokes.quoi.push(joke);
        jokes.quoi = jokes.quoi.filter(onlyUnique);
        writeFileSync(quoiJokesFile, JSON.stringify(jokes.quoi), { encoding: "utf-8" });
    }

    function refreshQuoiJokes() {
        jokes.quoi = JSON.parse(readFileSync(quoiJokesFile, { encoding: "utf-8" }));
    }

    function addPourquoiJoke(joke) {
        refreshPourquoiJokes();
        jokes.pourquoi.push(joke);
        jokes.pourquoi = jokes.pourquoi.filter(onlyUnique);
        writeFileSync(pourquoiJokesFile, JSON.stringify(jokes.pourquoi), { encoding: "utf-8" });
    }

    function refreshPourquoiJokes() {
        jokes.pourquoi = JSON.parse(readFileSync(pourquoiJokesFile, { encoding: "utf-8" }));
    }

    function addOrReplaceBasicJoke(trigger, joke) {
        refreshBasicJokes();
        jokes.basic[trigger] = joke;
        writeFileSync(basicJokesFile, JSON.stringify(jokes.basic), { encoding: "utf-8" });
    }

    function refreshBasicJokes() {
        jokes.basic = JSON.parse(readFileSync(basicJokesFile, { encoding: "utf-8" }));
    }

    return {
        token,
        clientId,
        jokes,
        addQuoiJoke,
        refreshQuoiJokes,
        addPourquoiJoke,
        refreshPourquoiJokes,
        addOrReplaceBasicJoke,
        refreshBasicJokes
    };
}
