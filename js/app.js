(async () => {
    let words = await getWords(),
        right_word = "",
        current_attempt = 0,
        current_letter = 0,
        game_over = false,
        notification = document.querySelector(".notification"),
        game_board = document.querySelectorAll(".attempt");

    async function getWords() {
        const wordList = await fetch("../resources/words.json").then(
            (response) => response.json()
        );
        return wordList.words;
    }

    function setUpKeyboard() {
        const keyboard_letters = document.querySelectorAll(".key");

        keyboard_letters.forEach((letter) => {
            letter.addEventListener("click", (e) => {
                if (!game_over) {
                    processKey(letter.getAttribute("data-key"));
                }
            });
        });

        document.body.addEventListener("keydown", (e) => {
            const re = /^[A-Za-z]{0,1}$/;

            if (!game_over) {
                switch (e.key) {
                    case "Enter":
                        processKey("↵");
                        break;
                    case "Backspace":
                        processKey("←");
                        break;
                    default:
                        if (re.test(e.key)) {
                            processKey(e.key);
                        }
                }
            }
        });
    }

    function processKey(key) {
        let attempt = game_board[current_attempt],
            letter_blocks = attempt.children;

        const num_letter_blocks = letter_blocks.length;

        notification.classList = "notification hide";

        switch (key) {
            case "↵" || "Enter":
                if (letter_blocks[num_letter_blocks - 1].textContent != "") {
                    if (checkValidity(attempt)) {
                        attempt.classList.remove("current-attempt");

                        if (checkAttempt(attempt) == 5) {
                            notification.textContent = "Congratulations!";
                            notification.classList.remove("hide");
                            notification.classList.add("show", "won");
                            game_over = true;
                        } else {
                            current_letter = 0;

                            if (current_attempt < 5) {
                                current_attempt++;
                                attempt =
                                    document.querySelectorAll(".attempt")[
                                        current_attempt
                                    ];
                                attempt.classList.add("current-attempt");
                            } else {
                                notification.textContent =
                                    "The right word was " +
                                    right_word.toUpperCase();
                                notification.classList.remove("hide");
                                notification.classList.add("show", "lost");
                                game_over = true;
                            }
                        }
                    } else {
                        notification.textContent = "Invalid word!";
                        notification.classList.remove("hide");
                        notification.classList.add("show", "invalid");
                    }
                } else {
                    notification.textContent = "Not enough letters!";
                    notification.classList.remove("hide");
                    notification.classList.add("show", "notenough");
                }
                break;
            case "←" || "Backspace":
                if (current_letter > 0) current_letter--;
                letter_blocks[current_letter].textContent = "";
                break;
            default:
                if (current_letter < num_letter_blocks) {
                    letter_blocks[current_letter].textContent =
                        key.toLowerCase();
                    current_letter++;
                }
        }
    }

    function checkValidity(attempt) {
        let attempt_letters = Array.from(attempt.children),
            word_guess = [
                ...attempt_letters.map((letter) => letter.textContent),
            ].join("");

        return words.includes(word_guess);
    }

    function checkAttempt(attempt) {
        let attempt_letters = Array.from(attempt.children),
            right_letters = right_word.split(""),
            letter_count = letterCount(right_word),
            num_right_guesses = 0;

        for (let i in attempt_letters) {
            let letter = attempt_letters[i];
            letter.classList.add("flip-horizontal-bottom");

            if (letter.textContent == right_word[i]) {
                letter.classList.add("correct");
                document
                    .querySelector("#" + letter.textContent)
                    .classList.add("correct");
                letter_count[letter.textContent]--;
                num_right_guesses++;
            }
        }

        for (let i in attempt_letters) {
            let letter = attempt_letters[i];

            if (!letter.classList.contains("correct")) {
                if (
                    right_letters.includes(letter.textContent) &&
                    letter_count[letter.textContent] > 0
                ) {
                    letter.classList.add("misplaced");
                    document
                        .querySelector("#" + letter.textContent)
                        .classList.add("misplaced");
                    letter_count[letter.textContent]--;
                } else {
                    letter.classList.add("absent");
                    document
                        .querySelector("#" + letter.textContent)
                        .classList.add("absent");
                }
            }
        }

        return num_right_guesses;
    }

    function letterCount(word) {
        let letters = word.split(""),
            uniqueLetters = [...new Set(letters)],
            letterCount = {};

        uniqueLetters.forEach((letter) => {
            letterCount[letter] = word.split(letter).length - 1;
        });

        return letterCount;
    }

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    function setNewGame() {
        right_word = shuffle(words)[42];
        console.log(right_word);

        game_board.forEach(function (attempt) {
            attempt.classList = "attempt";
        });

        game_board[0].classList.add("current-attempt");

        document
            .querySelectorAll(".game .letter-block")
            .forEach(function (letter_block) {
                letter_block.classList = "letter-block";
                letter_block.textContent = "";
            });

        document.querySelectorAll(".key").forEach(function (key) {
            key.classList = "key";
        });

        document.querySelector(".notification").classList = "notification hide";

        current_attempt = 0;
        current_letter = 0;

        game_over = false;
    }

    function app() {
        document
            .querySelector("#reload_button")
            .addEventListener("click", setNewGame);

        setUpKeyboard();
        setNewGame();
    }

    app();
})();
