let board = [];
let fixed = [];
let a = 450;
let size = a/9;
let selected = {r:-1, c:-1};

function setup() {
  createCanvas(a,a);
  //size = width / 9;
  randomBoard();
  //createCanvas(500,500);
  //fill(0);
  //text(board[row] , 100,100);
}


function draw() {
  background(225);
  draw_table();
  random_num();
  //randomBoard();
}

function draw_table() {
  stroke(0);
  for(let i=0; i<=9; i++){
    strokeWeight(i%3 === 0? 3 : 1);
    line(i*size, 0, i*size, height);
    line(0, i*size, width, i*size);
  }
  //if(selected.r>=0){
  //  noFill();
  //  stroke(0,120,200);
  //  strokeWeight(3);
  //  rect(selected.c*size+1, selected.r*size+1, size-2, size-2, 6);
  //}
}

function random_num() {
  textAlign(CENTER,CENTER);
  textSize(size*0.5);
  for(let r=0; r<9; r++){
    for(let c=0; c<9; c++){
      let v = board[r][c];
      if(v!== 0){
        //if(fixed[r][c]) fill(30);else fill(40,120,220);
        //noStroke();
        fill(0);
        text(v, c*size+size/2, r*size+size/2+2);
      }
    }
  }
}

function randomBoard() {
  board = [];
  let baseRow = [1,2,3,4,5,6,7,8,9];
  //shuffle(baseRow, true);
  for( let r=0; r<3; r++){
    for( let c=0; c<3; c++){
      //for(let i=0; i<3; i++){
      let row = (int)random.baseRow
        
  //for (let r = 0; r < 9; r++) {
  //  let row = baseRow.slice(r).concat(baseRow.slice(0, r));
  //  board.push(row);
  }
}

function blanknum() {
  let b = [];
  for (let r = 0; r < 9; r++) {
    b.push(new Array(9).fill(0));
  }
  return b;
}


//function keyPressed() {
//  if (key === ' ') {
//    randomBoard();
//  }
//}
  
