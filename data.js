import { writeFileSync, readFileSync } from 'fs';

export function useAppData() {
    const { token, clientId } = JSON.parse(readFileSync('./data/botLogin.txt', { encoding: "utf-8" }));
    const quoiJokesFile = './data/quoiJokes.txt';
    const pourquoiJokesFile = './data/pourquoiJokes.txt';
    const basicJokesFile = './data/basicJokes.txt';
    const jokes = { quoi: [], pourquoi: [], basic: {} };

    function addQuoiJoke(joke) {
        refreshQuoiJokes();
        jokes.quoi.push(joke);
        jokes.quoi = jokes.quoi.unique();
        writeFileSync(quoiJokesFile, JSON.stringify(jokes.quoi), { encoding: "utf-8" });
    }

    function refreshQuoiJokes() {
        jokes.quoi = JSON.parse(readFileSync(quoiJokesFile, { encoding: "utf-8" }));
    }

    function addPourquoiJoke(joke) {
        refreshPourquoiJokes();
        jokes.pourquoi.push(joke);
        jokes.pourquoi = jokes.pourquoi.unique();
        writeFileSync(pourquoiJokesFile, JSON.stringify(jokes.pourquoi), { encoding: "utf-8" });
    }

    function refreshPourquoiJokes() {
        jokes.pourquoi = JSON.parse(readFileSync(pourquoiJokesFile, { encoding: "utf-8" }));
    }

    function addOrReplaceBasicJoke(trigger, answer) {
        refreshBasicJokes();
        jokes.basic[trigger] ? jokes.basic[trigger].push(answer) : jokes.basic[trigger] = [answer];
        jokes.basic[trigger] = jokes.basic[trigger].unique();
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
