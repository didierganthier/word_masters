const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');

async function init() {
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

init();