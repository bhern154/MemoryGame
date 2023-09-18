let startGame = document.querySelector("#startGame");
let input = document.querySelector(".card-input");
let restartBtn = document.querySelector("#restartGame");
let gameContainer = document.getElementById("game");
let scoreP = document.getElementById("score");
let score = 0;
let colorsClicked = 0;
let blocksSelected = [];
let colorsMatched = [];
let numOfColors = 8; //if no input, enter 8 colors

initializeGame();

function initializeGame(){
  document.getElementById("menu-sec").innerHTML = '<div class="fullHeight"><p class="menu-title">MEMORY GAME</p><form action id="startGame"><label class="card-title" for="numCards">NUMBER OF PAIRS: </label><input class="card-input" type="number" id="numCards" name="numCards" placeholder="8"><br><button class="start">START GAME</button></form></div>';

  score = 0;
  colorsClicked = 0;
  blocksSelected = [];
  colorsMatched = [];
  numOfColors = 8;
  input = document.querySelector(".card-input");
  
  startGame = document.querySelector("#startGame");
  startGame.addEventListener('submit', function(e){
    e.preventDefault();
    startGameHandleEvent();
  });
}

function gameSetup(){
  document.getElementById("menu-sec").innerHTML = "";
  document.getElementById("game-sec").innerHTML = '<div><div class="gameBanner"><h1 class="bannerTitle">MEMORY GAME</h1><h1 class="scoreTitle">SCORE: <span id="score">0</span></h1></div><div id="game"></div><div class="restartContent"><form action id="restartGame"><button class="restartButton">RESTART</button></form><h1 class="GameHistory">GAME HISTORY</h1></div>';

  gameContainer = document.getElementById("game");
  scoreP = document.getElementById("score");
  restartBtn = document.querySelector("#restartGame");
  restartBtn.addEventListener('submit', function(e){
    e.preventDefault();
    restartGame();
  });
}

function startGameHandleEvent() {
  input = document.querySelector(".card-input");

  console.log("button pressed");

  gameSetup();

  gameContainer = document.getElementById("game");
  scoreP = document.getElementById("score");

  if(input.value > 0){
    numOfColors = parseInt(input.value);
  }

  const COLORS = generateArray(numOfColors); //generate random color array

  const shuffledColors = shuffle(COLORS);

  createDivsForColors(shuffledColors); // when the DOM loads
}

function generateArray(size){
  const COLORLIST = [];

  for(let i = 0; i < size; i++){

    const randHex = "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

    COLORLIST[i] = randHex;
    COLORLIST[i+size] = randHex;
  }

  console.log(COLORLIST)

  return COLORLIST;
}

// it returns the same array with values shuffled (Fisher Yates)
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {

  if(colorsClicked <= 1){

    const block = event.target;
    const color = block.classList;

    //remove event listener to avoid double clicking
    //event listener will be added again if no match is found
    block.removeEventListener("click", handleCardClick);

    //track number of blocks clicked
    colorsClicked++;

    //track score
    score++;
    scoreP.innerText = score;

    //assign temporary color 2
    if(blocksSelected.length == 1){
      blocksSelected[1] = color.toString();
    }

    //assign temporary color 1
    if(blocksSelected.length == 0){
      blocksSelected[0] = color.toString();
    }

    console.log(colorsClicked);
    console.log("array: " + blocksSelected);

    //set block color before timer resets
    block.style.backgroundColor = color;

    setTimeout(function() {
      //if not a match, flip blocks back
      //else, keep blocks flipped over
      if(blocksSelected.length < 1){
        block.style.backgroundColor = "transparent";
        //add event listener to make it clickable again
        block.addEventListener("click", handleCardClick);
      } else if (blocksSelected[0] != blocksSelected[1]){
        block.style.backgroundColor = "transparent";
        //add event listener to make it clickable again
        block.addEventListener("click", handleCardClick);
      } else if (blocksSelected[0] === blocksSelected[1]){
        colorsMatched.push(color.toString());
        if(colorsMatched.length === numOfColors){
          // alert("YOU WIN!");
          // restartGame();
        }
      }

      //fill in matching colors
      for(let item in colorsMatched){
        let fill = document.getElementsByClassName(colorsMatched[item]);
        fill[0].style.backgroundColor = colorsMatched[item];
        fill[1].style.backgroundColor = colorsMatched[item];
      }

      //remove color from array
      blocksSelected.shift();

      //subtract click after 1 sec
      colorsClicked--;

    }, 1000);

  }
  
}

function restartGame() {
  document.getElementById("game-sec").innerHTML = '';
  initializeGame();
}