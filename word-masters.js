const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;

async function init() {
    let currentGuess = '';
    let currentRow = 0;


    const res = await fetch('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();

    console.log(word);


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

        currentRow++;
        currentGuess = '';
    }

    function backspace() {
        if(currentGuess.length === 0) {
            return;
        }

        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
    }

    document.addEventListener('keydown', async (e) => {
        const action = e.key.toLowerCase();
        
        console.log(action);

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

init();