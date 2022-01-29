export async function getDictionary() {
    let dictionary = await fetch('./resources/dictionary.json').then(response => response.json());
    let words = Object.keys(dictionary);
    words = words.filter((word) => word.length == 5 && word[0] != '-' && word[4] != '-');
    return [... new Set(words.map((wordObj) => wordObj.toLowerCase()))];
}



