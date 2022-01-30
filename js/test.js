function letterCount(word) {
    letters = word.split("");
    uniqueLetters = [...new Set(letters)];
    console.log(uniqueLetters);

    let letterCount = {};
    uniqueLetters.forEach((letter) => {
        letterCount[letter] = word.split(letter).length - 1;
    });

    return letterCount;
}

test();
