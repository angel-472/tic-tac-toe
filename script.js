const resultDisplay = document.querySelector('.result');
const playerScoreDisplay = document.querySelector('.score .player');
const computerScoreDisplay = document.querySelector('.score .computer');

let playerScore = 0;
let computerScore = 0;
let maxScore = 5;
let playerSelection = "X"
let computerSelection = "O"

let grid = [0,1,2,3,4,5,6,7,8]
let empty = [...grid]
let patterns = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]

let resetting = false

playerScoreDisplay.innerText = "👤: 0"
computerScoreDisplay.innerText = "🤖: 0"



function markWinnerSelection(a, b, c){
  let className = "lost-line";
  if(grid[a] == playerSelection){
    className = "won-line"
  }
  document.getElementById(a).classList.add(className);
  document.getElementById(b).classList.add(className);
  document.getElementById(c).classList.add(className);
}

function getWinnerSelection(){
  let val = ["X","O"]
  let pattern = ""
  for(i = 0; i <= 1; i++){
    for(p = 0; p < patterns.length; p++){
      pattern = patterns[p]
      if(grid[pattern[0]] == val[i] && grid[pattern[1]] == val[i] && grid[pattern[2]] == val[i] ){
        markWinnerSelection(...pattern);
        return val[i];
      }
    }
  }
}

function selectGridBox(id, selection){
  let element = document.getElementById(id)
  element.innerText = selection;
  element.classList.add(selection);

  grid[id] = selection
  empty.splice(empty.indexOf(parseFloat(id)),1)
}


//computer mind

function computerPlay(){
  id = computerThink(0)
  selectGridBox(id,computerSelection)
}

function computerThink(mode){
  if(mode == 0){
    let threat = 0;
    let available;
    let shuffledPatterns = patterns.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value) //makes thinking random
    for(p = 0; p < patterns.length; p++){
      pattern = shuffledPatterns[p];
      threat = 0;
      good = 0;
      for(a = 0; a <= 2; a++){
        if(grid[pattern[a]] == computerSelection){
          threat--;
        }
        if(grid[pattern[a]] == playerSelection){
          threat++;
        } else if(grid[pattern[a]] !== computerSelection) {
          available = pattern[a]
        }
      }
      if(threat >= 2){
        return available;
      }
    }
    return available;
  }
}


//user input

for(i = 0; i <= 8; i++){
  document.getElementById(i).addEventListener('click', event => {
    let element = event.currentTarget; //gets the actual button, not the child icon
    let id = element.id;

    if(resetting){
      return;
    }

    if(element.classList.contains("X") || element.classList.contains("O")) {
      return;
    }
    else {
      selectGridBox(id,playerSelection)
    }


    if(getWinnerSelection() == playerSelection){
      playerScore++;
      resetGame();
      return;
    }
    if(empty.length == 0){
      resetGame();
      return;
    }

    computerPlay();
    if(getWinnerSelection() == computerSelection){
      computerScore++;
      resetGame();
      return;
    }
  });
  document.getElementById(i).addEventListener('mouseenter', boxHoverEnter);
  document.getElementById(i).addEventListener('mouseleave', boxHoverLeave);

}

function resetGame(){
  resetting = true
  if(playerScore >= maxScore || computerScore >= maxScore){
    endGame();
    return;
  }
  setTimeout(() => {
    resetGrid();
    resetting = false;
  }, 1000)
}

function resetGrid(){
  for(i = 0; i <= 8; i++){
    let element = document.getElementById(i);
    element.innerText = "";
    element.classList.remove(...element.classList);
    grid = [0,1,2,3,4,5,6,7,8];
    empty = [...grid];

    playerScoreDisplay.innerText = `👤: ${playerScore}`;
    computerScoreDisplay.innerText = `🤖: ${computerScore}`;
  }
}


function boxHoverEnter(event) {
  if(resetting){
    return;
  }
  let element = event.target;
  element.classList.add("hovering");
}

function boxHoverLeave(event) {
  let element = event.target;
  element.classList.remove("hovering");
}


function endGame(){
  [".game-header",".game"].forEach(function(className) {
    let element = document.querySelector(className);
    element.remove();
  });
  let endCard = document.querySelector('.end-card');
  let endCardTitle = document.querySelector('.end-card h1');
  let endCardText = document.querySelector('.end-card p');
  if(playerScore > computerScore){
    endCardTitle.innerText = "You won the game!";
  } else {
    endCardTitle.innerText = "You lost the game!";
  }
  endCardText.innerText = `You scored ${playerScore}, the computer scored ${computerScore}`
  endCard.style.display = "flex";
}

const playAgainButton = document.querySelector('.play-again')
playAgainButton.addEventListener('click', function(e) {
  location.reload();
});
