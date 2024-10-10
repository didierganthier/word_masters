const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;


    const res = await fetch('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split('');
    let done = false;
    setLoading(false)
    isLoading = false;


    function addLetter(letter) {
        if(currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0 , currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if(currentGuess.length !== ANSWER_LENGTH) {
            return;
        }

        isLoading = true;
        setLoading(true);
        const res = await fetch('https://words.dev-apis.com/validate-word', {
            method: 'POST',
            body: JSON.stringify({ word: currentGuess })
        })

        const resObj = await res.json()
        const { validWord } = resObj;

        isLoading = false;
        setLoading(false);

        if(!validWord) {
            markInvalidWord();
            return;
        } else {

        }

        const guessParts = currentGuess.split('');
        const map = makeMap(wordParts);
        console.log(map);

        for(let i = 0; i < ANSWER_LENGTH; i++) {
            if(guessParts[i].toUpperCase() === wordParts[i]) {
                console.log('correct');
                letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
                map[guessParts[i]]--;
            } 
        }

        for(let i = 0; i < ANSWER_LENGTH; i++) {
            if(guessParts[i].toUpperCase() === wordParts[i]) {
                // return;
            } else if(wordParts.includes(guessParts[i].toUpperCase()) && map[guessParts[i]] > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
            } else {

                letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
            }
        }

        currentRow++;

        
        if(currentGuess.toUpperCase() === word) {
            alert('You win');
            document.querySelector('.brand').classList.add('winner');
            done = true;
            return;
        } else if(currentRow === ROUNDS) {
            alert(`You lose. The word was ${word}`);
            done = true;
        }

        currentGuess = '';
    }

    function backspace() {
        if(currentGuess.length === 0) {
            return;
        }

        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
    }

    function markInvalidWord () {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentRow * ANSWER_LENGTH + i].classList.add('invalid');

            setTimeout(() => {
                letters[currentRow * ANSWER_LENGTH + i].classList.remove('invalid');
            }, 10);
        }
    }

    document.addEventListener('keydown', async (e) => {

        if(done || isLoading) {
            return;
        }

        const action = e.key.toLowerCase();
        

        if (action === 'enter') {
            commit();
        } else if (action === 'delete' || action === 'backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action);
        } else {
            // Do nothing
        }
    });
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle('hidden', !isLoading);
}

function makeMap(array) {
    const obj = {};
    for(let i = 0; i < array.length; i++) {
        const letter = array[i].toUpperCase();
        if(obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }

    return obj;
}

init();