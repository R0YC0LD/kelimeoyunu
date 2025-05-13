
const wordList = ["araba", "bilgi", "deniz", "elmas", "gizem", "huzur", "izmir", "kartal", "lemur", "muhit"];
let chosenWord;
let guessedLetters = [];
let tries = 6;

function restartGame() {
    chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
    guessedLetters = [];
    tries = 6;
    document.getElementById('message').innerText = '';
    document.getElementById('word-display').innerText = '_ '.repeat(chosenWord.length);
    updateKeyboard();
}

function updateWordDisplay() {
    let wordDisplay = '';
    for (let i = 0; i < chosenWord.length; i++) {
        if (guessedLetters.includes(chosenWord[i])) {
            wordDisplay += chosenWord[i] + ' ';
        } else {
            wordDisplay += '_ ';
        }
    }
    document.getElementById('word-display').innerText = wordDisplay.trim();
}

function updateKeyboard() {
    const keyboard = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let keyboardHTML = '';
    keyboard.forEach(letter => {
        keyboardHTML += `<button onclick="guessLetter('${letter}')">${letter}</button>`;
    });
    document.getElementById('keyboard').innerHTML = keyboardHTML;
}

function guessLetter(letter) {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    if (!chosenWord.includes(letter)) {
        tries--;
        if (tries === 0) {
            document.getElementById('message').innerText = 'Oyunu Kaybettiniz! Kelime: ' + chosenWord;
        }
    }
    updateWordDisplay();
    checkWin();
}

function checkWin() {
    if (chosenWord.split('').every(letter => guessedLetters.includes(letter))) {
        document.getElementById('message').innerText = 'Tebrikler, Kazandınız!';
    }
}

restartGame();
