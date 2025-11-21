let size = 450;
let board = [];
let boxSize = size / 9;
let selected = { r: -1, c: -1 };
let wrongCells = new Set();
let boardLock = [];

function handleFile(file) {
    if (file.type === 'text') {
        let lines = file.data.split("\n");
        board = [];
        for (let r = 0; r < 9; r++) {
            board[r] = lines[r].trim().split("").map(Number);
            boardLock[r] = board[r].map(v => v !== 0);
        }
    }
}

function setup() {
    createCanvas(size, size);
    initEmpty();

    let input = createFileInput(handleFile);
    input.position(569, size + 100);

    let saveBut = createButton("Save Game");
    saveBut.position((windowWidth - saveBut.width) / 1.4, size - 300);
    saveBut.mousePressed(saveGame);

    let cnv = createCanvas(size, size);
    cnv.parent('canvas-container');
}

function draw() {
    background(255);
    drawTable();
    drawNumbers();
    drawSelected();
    drawWrong();
    selectRow();
    updateRowInfo();
    correctAns();

    let count = findEmty();

    document.getElementById('Emtycells').innerText = `Emty cells: ${count} cells`;
}

function initEmpty() {
    boardLock = [];
    board = [];
    for (let r = 0; r < 9; r++) {
        board[r] = Array(9).fill(0);
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
    fill(0);
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let v = board[r][c];
            if (v === 0) { // ถ้าช่องนี้ว่าง (เป็น 0 หรือไม่มีค่า) ให้ข้ามไป
                continue;
            }

            if (wrongCells.has(r + "," + c)) {
                fill(255, 0, 0); 
            } else if (boardLock[r][c]) {
                fill(100);       
            } else {
                fill(0);         
            }

            let x = c * boxSize + boxSize / 2; //สร้างตัวแปล ลดความยาวใน text()
            let y = r * boxSize + boxSize / 2;
            text(v, x, y);
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
        stroke(0, 100, 200);
        strokeWeight(2);
        rect(selected.c * boxSize, selected.r * boxSize, boxSize, boxSize);
    }
}

function keyPressed() {
    if (selected.c >= 0 && selected.r >= 0) {
        let r = selected.r;
        let c = selected.c;

        if (boardLock[r][c] && !wrongCells.has(r + "," + c)) return;

        if (key >= '1' && key <= '9') {
            board[selected.r][selected.c] = int(key);
            checkSolution();
        } else if (key === '0' || keyCode === BACKSPACE || keyCode === DELETE) {
            board[selected.r][selected.c] = 0;
        }
    }
}

function solveSudoku(b) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (b[r][c] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(b, r, c, num)) {
                        b[r][c] = num;
                        if (solveSudoku(b)) return true;
                        b[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
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
                if (i !== c && board[r][i] === val) wrongCells.add(r + "," + c);
            }

            for (let j = 0; j < 9; j++) {
                if (j !== r && board[j][c] === val) wrongCells.add(r + "," + c);
            }

            let startR = Math.floor(r / 3) * 3;
            let startC = Math.floor(c / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let rr = startR + i;
                    let cc = startC + j;
                    if ((rr !== r || cc !== c) && board[rr][cc] === val)
                        wrongCells.add(r + "," + c);
                }
            }
        }
    }

    if (wrongCells.size === 0) {
        console.log("Good JOB!");
    } else {
        console.log("Found " + wrongCells.size + " incorrect cell(s)!");
    }
}

function drawWrong() {
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    wrongCells.forEach(function(key) {
        var parts = key.split(",");
        var r = Number(parts[0]);
        var c = Number(parts[1]);
        rect(c * boxSize, r * boxSize, boxSize, boxSize);
    });
}

function saveGame() {
    let lines = board.map(row => row.join(''));
    saveStrings(lines, 'sudoku_save.txt');
}

function findEmty(){  
    let count = 0;
    for(let r = 0; r < 9; r++){
        for(let c = 0; c < 9; c++){
            if(board[r][c] === 0){
              count ++;
            }
        }
    }
    return count;
}

function selectRow(){
    if (selected.c >= 0 && selected.r >= 0) {
        noFill();
        stroke(200, 0, 0);
        strokeWeight(3);
        rect(0, selected.r * boxSize, width, boxSize);
    }
}

function findEmRow(){
    let EmRow = [];
    for(let r = 0; r < 9; r++){
        let count = 0;
        for(let c = 0; c < 9; c++){
            if(board[r][c] === 0) count++;
        }
        EmRow.push(count);
    }
    return EmRow;
}

function updateRowInfo() {
    let info = findEmRow();
    let html = "";

    for (let r = 0; r < 9; r++) {
        html += `Row ${r+1}: ${info[r]} empty<br>`;
    }

    document.getElementById("rowInfo").innerHTML = html;
}

function isValidInBoard(r, c, val) {
    // ตรวจ row
    for (let i = 0; i < 9; i++) {
        if (i !== c && board[r][i] === val) return false;
    }
    // ตรวจ column
    for (let i = 0; i < 9; i++) {
        if (i !== r && board[i][c] === val) return false;
    }
    // ตรวจ 3x3 block
    let startR = Math.floor(r / 3) * 3;
    let startC = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let rr = startR + i;
            let cc = startC + j;
            if ((rr !== r || cc !== c) && board[rr][cc] === val) return false;
        }
    }
    return true;
}

function correctAns(){
    if (selected.c < 0 || selected.r < 0) return;
    
    const rSelected = selected.r;
    
    let correctRow = [];
    for (let c = 0; c < 9; c++) {
        let val = board[rSelected][c];
        if (val === 0) {
            correctRow.push(" "); 
        } else if (isValidInBoard(rSelected, c, val)) {
            correctRow.push(val); 
            //boardLock[rSelected][c] = true
        } else {
            correctRow.push(" "); 
        }
    }

    document.getElementById("rowCorrect").innerHTML =
        `Row ${rSelected + 1} correct: ${correctRow.join(" ")}`;
}
