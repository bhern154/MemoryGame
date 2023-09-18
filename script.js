//initialize all variable to be updated in every game
let startGame = document.querySelector("#startGame"); //select #startGame to access the "start game" button
let input = document.querySelector(".card-input"); //select .card-input to access the user's input
let restartBtn = document.querySelector("#restartGame"); //select #restartGame to access "restart" button
let gameContainer = document.getElementById("game"); //select #game to append the entire game code
let scoreP = document.getElementById("score"); //select #score to display the current score
let gameHistory = document.querySelector(".GameHistory"); //select .GameHistory to append scores
let score = 0; //track score, every click adds one point to score
let colorsClicked = 0; //track how many blocks have been selected at any given time
let blocksSelected = []; //track which blocks have been selected at any given time
let colorsMatched = []; //tracked which colors have been matched
let numOfColors = 8; //number of unique colors - placeholder of 8

//access localStorage for the scores history
let localScoreHistory = JSON.parse(localStorage.getItem("scores")) || [];

//loads the first main menu screen
initializeGame();

//append html with main menu to Section #menu-sec
function initializeGame(){
  document.getElementById("menu-sec").innerHTML = '<div class="fullHeight"><p class="menu-title">MEMORY GAME</p><form action id="startGame"><label class="card-title" for="numCards">NUMBER OF PAIRS: </label><input class="card-input" type="number" id="numCards" name="numCards" placeholder="8"><br><button class="start">START GAME</button></form></div>';

  //re-initialize variables from new main menu
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

//get grid information form main menu and set up game
function startGameHandleEvent() {
  
  //contians the number of unique colors from user input
  input = document.querySelector(".card-input");

  gameSetup();

  gameContainer = document.getElementById("game");
  scoreP = document.getElementById("score");

  //if user did not enter a number input, keep the value at 8 unique colors
  if(input.value > 0){
    numOfColors = parseInt(input.value);
  }

  //generate random color array
  const COLORS = generateArray(numOfColors);

  //shuffle random color array
  const shuffledColors = shuffle(COLORS);

  //append blocks for each color
  createDivsForColors(shuffledColors);
}

//append html with game to Section #game-sec
//remove html with main menu from Section #menu-sec
function gameSetup(){
  document.getElementById("menu-sec").innerHTML = "";
  document.getElementById("game-sec").innerHTML = '<div><div class="gameBanner"><h1 class="bannerTitle">MEMORY GAME</h1><h1 class="scoreTitle">SCORE: <span id="score">0</span></h1></div><div id="game"></div><div class="restartContent"><form action id="restartGame"><button class="restartButton">RESTART</button></form><h1 class="GameHistory">GAME HISTORY</h1></div>';

  //re-initialize variables from new game
  gameContainer = document.getElementById("game");
  scoreP = document.getElementById("score");
  gameHistory = document.querySelector(".GameHistory");
  restartBtn = document.querySelector("#restartGame");

  restartBtn.addEventListener('submit', function(e){
    e.preventDefault();
    restartGame();
  });

  // retrieve score history from local storage and append to score section
  for (let i = 0; i < localScoreHistory.length; i++) {
    let scoreItem = document.createElement('p');
    scoreItem.innerText = localScoreHistory[i].score;
    gameHistory.appendChild(scoreItem);
  }
}

function restartGame() {
  document.getElementById("game-sec").innerHTML = '';
  initializeGame();
}

function generateArray(size){
  const COLORLIST = [];

  for(let i = 0; i < size; i++){

    const randHex = "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

    COLORLIST[i] = randHex;
    COLORLIST[i+size] = randHex;
  }

  return COLORLIST;
}

// it returns the same array with values shuffled (Fisher Yates)
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

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

// this function handles the card click
function handleCardClick(event) {

  if(colorsClicked <= 1){

    const block = event.target;
    const color = block.classList;

    //remove event listener to avoid double clicking
    // the event listener will be added again later if no match is found
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

    //set block color before timer resets
    block.style.backgroundColor = color;

    //functionality during the one second click period
    setTimeout(function() {

      //if not a match flip blocks back - otherwise, keep blocks flipped over
      if(blocksSelected.length < 1){ // only one block selected
        block.style.backgroundColor = "transparent";
        block.addEventListener("click", handleCardClick); //add event listener to make it clickable again
      } else if (blocksSelected[0] != blocksSelected[1]){ // two blocks selected but they do not match
        block.style.backgroundColor = "transparent";
        block.addEventListener("click", handleCardClick); //add event listener to make it clickable again
      } else if (blocksSelected[0] === blocksSelected[1]){ // two blocks selected and they match
        
        colorsMatched.push(color.toString()); // keep track of what numbers colors have been matched
        
        if(colorsMatched.length === numOfColors){ // if all blocks have been matched (game is over)
          //add score to localStorage
          localScoreHistory.push({ score: `SCORE: ${score} | COLORS: ${numOfColors}`});
          localStorage.setItem("scores", JSON.stringify(localScoreHistory));

          //temportarily append new score to history
          let scoreItem = document.createElement('p');
          scoreItem.innerText = `SCORE: ${score} | COLORS: ${numOfColors}`;
          gameHistory.appendChild(scoreItem);
        }
      }

      //fill in matching colors and remove event listeners
      for(let item in colorsMatched){
        let fill = document.getElementsByClassName(colorsMatched[item]);
        fill[0].style.backgroundColor = colorsMatched[item];
        fill[1].style.backgroundColor = colorsMatched[item];
        fill[0].removeEventListener("click", handleCardClick);
        fill[1].removeEventListener("click", handleCardClick);
      }

      //remove color from array
      blocksSelected.shift();

      //subtract click after 1 sec
      colorsClicked--;

    }, 1000);

  }
  
}