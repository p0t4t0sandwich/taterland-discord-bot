/**
 * @author p0t4t0sandwich
 * @description Various API functions
 */

/**
 * @function apiCall
 * @description Makes an API call to the specified URL
 * @param url The URL to make the API call to
 * @returns The data returned from the API call
 */
async function apiCall(url: string): Promise<any> {
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

/**
 * @function getDadjoke
 * @returns A random dad joke
 */
async function getDadjoke(): Promise<string> {
    return (await apiCall("https://icanhazdadjoke.com/")).joke;
}

/**
 * @function getFortune
 * @returns A random fortune
 */
async function getFortune(): Promise<string> {
    return await apiCall("https://fortuneapi.herokuapp.com/");
}

/**
 * @function getMeowFact
 * @returns A random meow fact
 */
async function getMeowFact(): Promise<string> {
    return (await apiCall("https://meowfacts.herokuapp.com/")).data[0];
}

/**
 * @function getUselessFact
 * @returns A random useless fact
 */
async function getUselessFact(): Promise<string> {
    return (await apiCall("https://uselessfacts.jsph.pl/random.json?language=en")).text;
}

export { getDadjoke, getFortune, getMeowFact, getUselessFact };
