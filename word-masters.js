const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;

async function init() {
    const currentGuess = '';

    const string = 'BRIAN';
    


    function addLetter(letter) {
        if(currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0 , currentGuess.length - 1) + letter;
        }

        letters[currentGuess.length - 1].innerText = letter;
    }

    document.addEventListener('keydown', async (e) => {
        const action = e.key.toLowerCase();
        
        console.log(action);

        if (action === 'enter') {
            commit();
        } else if (action === 'backspace') {
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

init();