let size = 450;
let board = [];
let boxSize = size / 9;
let selected = { r: -1, c: -1 };
let wrongCells = new Set();

// player
let player = 1;
let score = { 1: 0, 2: 0 };
let colors = {
    1: [0, 150, 255],
    2: [0, 200, 100]
};
let ownerBoard = [];
let boardLock = [];

function handleFile(file) {
    if (file.type === 'text') {
        let lines = file.data.split("\n");
        board = [];
        ownerBoard = [];
        boardLock = [];
        for (let r = 0; r < 9; r++) {
            board[r] = lines[r].trim().split("").map(Number);
            ownerBoard[r] = Array(9).fill(0);
            boardLock[r] = board[r].map(v => v !== 0);
        }
    }
}

function setup() {
    let cnv = createCanvas(size, size);
    cnv.parent('canvas-container');

    let input = createFileInput(handleFile);
    input.position(569, size + 100);

    let saveBut = createButton("Save Game");
    saveBut.position((windowWidth - saveBut.width) / 1.4, size - 300);
    saveBut.mousePressed(saveGame);

    initEmpty();
}

function draw() {
    background(255);
    drawTable();
    drawNumbers();
    drawSelected();
    drawWrong();

    // update scoreboard (HTML)
    document.getElementById('player1').innerText = `Player 1: ${score[1]} pts`;
    document.getElementById('player2').innerText = `Player 2: ${score[2]} pts`;
    document.getElementById('turn').innerText = `Turn: Player ${player}`;
}

function initEmpty() {
    board = [];
    ownerBoard = [];
    boardLock = [];
    for (let r = 0; r < 9; r++) {
        board[r] = Array(9).fill(0);
        ownerBoard[r] = Array(9).fill(0);
        boardLock[r] = Array(9).fill(false);
    }
}

function drawTable() {
    stroke(0);
    for (let i = 0; i <= 9; i++) {
        strokeWeight(i % 3 === 0 ? 3 : 1);
        line(i * boxSize, 0, i * boxSize, size);
        line(0, i * boxSize, size, i * boxSize);
    }
}

function drawNumbers() {
    textAlign(CENTER, CENTER);
    textSize(boxSize * 0.5);
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let v = board[r]?.[c];
            if (v && v !== 0) {
                if (wrongCells.has(`${r},${c}`)) {
                    fill(255, 0, 0);
                } else if (boardLock[r][c]) {
                    fill(100);
                } else {
                    fill(colors[ownerBoard[r][c]] || 0);
                }
                text(v, c * boxSize + boxSize / 2, r * boxSize + boxSize / 2);
            }
        }
    }
}

function mousePressed() {
    let c = floor(mouseX / boxSize);
    let r = floor(mouseY / boxSize);
    if (c >= 0 && c < 9 && r >= 0 && r < 9) {
        selected.r = r;
        selected.c = c;
    }
}

function drawSelected() {
    if (selected.c >= 0 && selected.r >= 0) {
        noFill();
        stroke(colors[player]);
        strokeWeight(2);
        rect(selected.c * boxSize, selected.r * boxSize, boxSize, boxSize);
    }
}

function keyPressed() {
    if (selected.c >= 0 && selected.r >= 0) {
        let r = selected.r;
        let c = selected.c;

        if (boardLock[r][c] && !wrongCells.has(`${r},${c}`)) return;

        if (key >= '1' && key <= '9') {
            board[r][c] = int(key);
            ownerBoard[r][c] = player;
            checkSolution();

            if (wrongCells.has(`${r},${c}`)) {
                score[player] -= 1; // wrong
            } else {
                score[player] += 1; // correct
            }

            player = player === 1 ? 2 : 1; // change turn
        } else if (key === '0' || keyCode === BACKSPACE || keyCode === DELETE) {
            board[r][c] = 0;
            ownerBoard[r][c] = 0;
        }
    }
}

function isValid(b, r, c, num) {
    for (let i = 0; i < 9; i++) {
        if (b[r][i] == num || b[i][c] == num) return false;
    }

    let startR = floor(r / 3) * 3;
    let startC = floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (b[startR + i][startC + j] === num) return false;
        }
    }
    return true;
}

function checkSolution() {
    wrongCells.clear();
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let val = board[r][c];
            if (val === 0) continue;

            for (let i = 0; i < 9; i++) {
                if (i !== c && board[r][i] === val) wrongCells.add(`${r},${c}`);
            }

            for (let j = 0; j < 9; j++) {
                if (j !== r && board[j][c] === val) wrongCells.add(`${r},${c}`);
            }

            let startR = Math.floor(r / 3) * 3;
            let startC = Math.floor(c / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let rr = startR + i;
                    let cc = startC + j;
                    if ((rr !== r || cc !== c) && board[rr][cc] === val) {
                        wrongCells.add(`${r},${c}`);
                    }
                }
            }
        }
    }

    if (wrongCells.size === 0) {
        console.log("Good JOB!");
    } else {
        console.log(`Found ${wrongCells.size} incorrect cell(s)!`);
    }
}

function drawWrong() {
    noStroke();
    fill(255, 0, 0, 150);
    wrongCells.forEach(key => {
        let [r, c] = key.split(",").map(Number);
        rect(c * boxSize, r * boxSize, boxSize, boxSize);
    });
}

function saveGame() {
    let lines = board.map(row => row.join(''));
    saveStrings(lines, 'sudoku_save.txt');
}
