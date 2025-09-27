let size = 450;
let board = [];
let boxSize = size / 9;
let selected = {r:-1, c:-1};
let wrongCells = new Set();

function handleFile(file) {
  if (file.type === 'text') {
    let lines = file.data.split("\n");
    board = [];
    for (let r = 0; r < 9; r++) {
      board[r] = lines[r].trim().split("").map(Number);
    }
  }
}

function setup(){
  createCanvas(size,size);
  let input = createFileInput(handleFile);
  input.position(569,size + 100);
  
  let solveBut = createButton("Solve");
  solveBut.position((windowWidth - solveBut.width) / 1.4, size - 350);
  solveBut.mousePressed(() => {
    if(solveSudoku(board)){
      console.log("Sudoku Solved!");
    }else{
      console.log("Sudoku didn't Solved YET!");
    }
  });
  
  let checkBut = createButton("Check Solution");
  checkBut.position((windowWidth - solveBut.width) / 1.4, size - 300);
  checkBut.mousePressed(checkSolution);
  
  let saveBut = createButton("Save Game");
  saveBut.position((windowWidth - solveBut.width) /2.6, size + 140);
  saveBut.mousePressed(saveGame);
  
  let cnv = createCanvas(size,size);
  cnv.parent('canvas-container');

}

function draw(){
  background(255);
  drawTable();
  drawNumbers();
  drawSelected();
  drawWrong();
  
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
      let v = board[r]?.[c];
      if (v && v !== 0) {
        text(v, c * boxSize + boxSize / 2, r * boxSize + boxSize / 2);
      }
    }
  }
}

function mousePressed(){
  let c = floor(mouseX / boxSize);
  let r = floor(mouseY / boxSize);
  if(c >= 0 && c < 9 && r >= 0 && r < 9){
    selected.r = r;
    selected.c = c;
  }
}

function drawSelected(){
  if(selected.c >= 0 && selected.r >= 0){
    noFill();
    stroke(0,100,200);
    strokeWeight(2);
    rect(selected.c*boxSize, selected.r*boxSize, boxSize, boxSize);
  }
}

function keyPressed(){
  if(selected.c >= 0 && selected.r >= 0){
    if( key >= '1' && key <= '9' ){
      board[selected.r][selected.c] = int(key);
    }
    else if( key === '0' || keyCode === BACKSPACE || keyCode === DELETE ){
      board[selected.r][selected.c] = 0;
    }
  }
}

function solveSudoku(b){
  for(let r=0; r<9; r++){
    for(let c=0; c<9; c++){
      if(b[r][c] === 0){
        for(let num=1; num<=9; num++){
          if(isValid(b,r,c,num)){
            b[r][c] = num;
            if(solveSudoku(b)) return true;
            b[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(b,r,c,num){
  for(let i=0; i<9; i++){ // checl r & c
    if(b[r][i] == num || b[i][c] == num) return false;
  }
  
  let startR = floor(r/3)*3;
  let startC = floor(c/3)*3;
  for(let i=0; i<3; i++){ // check block
    for(let j=0; j<3; j++){
      if(b[startR+i][startC+j] === num) return false;
    }
  }
  return true;
}

function checkSolution(){
  wrongCells.clear();
  for(let r=0; r<9; r++){
    for(let c=0; c<9; c++){
      let val = board[r][c];
      if(val === 0) continue;
      for(let i=0; i<9; i++){ // check r
        if (i !== c && board[r][i] === val) wrongCells.add(`${r},${c}`);
      }
        
      for(let j=0; j<9; j++){ // check c
        if (j !== r && board[j][c] === val) wrongCells.add(`${r},${c}`);
      }
        
      let startR = Math.floor(r/3)*3;
      let startC = Math.floor(c/3)*3;
      for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
          let rr = startR + i;
          let cc = startC + j;
          if ((rr !== r || cc !== c) && board[rr][cc] === val) wrongCells.add(`${r},${c}`);
          }
        }
      }
    }
  if(wrongCells.size === 0){
    console.log("Good JOB!");
    alert("Keep Going");
  }else{
    console.log(`Found ${wrongCells.size} incorrect cell(s)!`);
    alert(`${wrongCells.size} wrong Try Again!`);
  }
}

function drawWrong(){
  noStroke();
  fill(255,0,0,150);
  wrongCells.forEach(key => {
    let [r, c] = key.split(",").map(Number);
    rect(c * boxSize, r * boxSize, boxSize, boxSize);
  });
}

function saveGame(){
  let lines = board.map(row => row.join(''));
  saveStrings(lines, 'sudoku_save.txt');
}
  
