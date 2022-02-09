const fs = require("fs");
const path = require("path");
const dictionary = require("../resources/dictionary.json");

async function getDictionary() {
    let words = Object.keys(dictionary);
    words = words.filter(
        (word) => word.length == 5 && word[0] != "-" && word[4] != "-"
    );
    return [...new Set(words.map((wordObj) => wordObj.toLowerCase()))];
}

getDictionary().then((wordList) => {
    wordList = { words: wordList };
    fs.writeFile(
        path.resolve(__dirname, "../resources/words.json"),
        JSON.stringify(wordList),
        (err) => {
            if (err) throw err;
        }
    );
});
