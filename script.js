const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const statusDisplay = document.getElementById('status');
const vsPlayerButton = document.getElementById('vsPlayer');
const vsComputerButton = document.getElementById('vsComputer');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let againstComputer = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame(vsComputer) {
    againstComputer = vsComputer;
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = `Speler ${currentPlayer} is aan de beurt`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    board.style.pointerEvents = 'auto';
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
    );

    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && againstComputer && currentPlayer === 'O') {
        setTimeout(() => {
            makeComputerMove();
            handleResultValidation();
        }, 500);
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.classList.add('pop');
    setTimeout(() => clickedCell.classList.remove('pop'), 300);
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Speler ${currentPlayer} wint!`;
        gameActive = false;
        board.style.pointerEvents = 'none';
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Gelijkspel!';
        gameActive = false;
        board.style.pointerEvents = 'none';
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Speler ${currentPlayer} is aan de beurt`;
}

function makeComputerMove() {
    const emptyCells = gameState.reduce((acc, cell, index) => 
        cell === '' ? acc.concat(index) : acc, []);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerMove = emptyCells[randomIndex];
    const computerCell = cells[computerMove];
    handleCellPlayed(computerCell, computerMove);
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', handleCellClick);
    cell.setAttribute('data-cell-index', index);
});

restartButton.addEventListener('click', () => startGame(againstComputer));
vsPlayerButton.addEventListener('click', () => startGame(false));
vsComputerButton.addEventListener('click', () => startGame(true));

// Start het spel in de speler-tegen-speler modus
startGame(false);
