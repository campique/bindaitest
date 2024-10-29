const startMenu = document.getElementById('startMenu');
const gameContainer = document.getElementById('gameContainer');
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
    startMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    board.classList.remove('hidden');
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

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
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Speler ${currentPlayer} wint!`;
        gameActive = false;
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
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Speler ${currentPlayer} is aan de beurt`;
}

function makeComputerMove() {
    const bestMove = findBestMove(gameState);
    const computerCell = cells[bestMove];
    handleCellPlayed(computerCell, bestMove);
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 };
    let result = checkWinner(board);
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.includes('')) return null;
    return 'tie';
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', handleCellClick);
    cell.setAttribute('data-cell-index', index);
});

restartButton.addEventListener('click', () => {
    startMenu.classList.remove('hidden');
    gameContainer.classList.add('hidden');
});
vsPlayerButton.addEventListener('click', () => startGame(false));
vsComputerButton.addEventListener('click', () => startGame(true));
