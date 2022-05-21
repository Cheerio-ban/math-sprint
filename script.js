// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');

// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
const buttons = document.querySelector('.buttons')

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh splash page best scores
function bestScoresToDOM() {
  bestScores.forEach((type, i) => {
    type.textContent = `${bestScoreArray[i].bestScore}s`;
  })
}


// Check localStorage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}


// Update best score array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // select correct best score to update
    if (questionAmount == score.questions) {
      // return best score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // update splash page
  bestScoresToDOM();
  // save to localStorage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  splashPage.hidden = false;
  scorePage.hidden = true;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Show score page
function showScorePage() {
  scorePage.hidden = false;
  gamePage.hidden = true;
  // Show play again button after 1 sec
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
}


// Format & display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to top, go to score page
  itemContainer.scrollTo({top: 0, behavior: 'instant'});
  showScorePage();
}



// Stop Timer and process result, go to Score Page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log('player guess array is: ', playerGuessArray)
    clearInterval(timer);
    // check for wrong guesses, add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty 
      } else {
        // Incorrect Guess, No Penalty
        penaltyTime += 3; 
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('time', timePlayed, 'penalty: ', penaltyTime, 'final: ',finalTime);
    scoresToDOM();
  }
} 

//Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

//start timer when game page is clicked
function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
} 


//Scroll and store the user selection in the playerGuessArray
function select(guessedTrue) {
  // select is the function that gets called by the right and wrong buttons
  
  // Using 'element.scroll' 
  // scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');

}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Number up to a max Number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong equations:', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(15);
    secondNumber = getRandomInt(15);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(15);
    secondNumber = getRandomInt(15);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
//   console.log('equations array:', equationsArray);
//   equationsToDOM();
}

function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text 
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append the values from the array
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Countdown and displays 3, 2, 1 and go. 
function countdownStart() {
  countdown.textContent = '3';
  setTimeout(() => {
    countdown.textContent = '2';
  }, 400);
  setTimeout(() => {
    countdown.textContent = '1';
  }, 1100);
  setTimeout(() => {
    countdown.textContent = 'GO!';
  }, 1600);
}

// Navigate from splash page to Countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 2400)
}

//Get the value from selected value button

function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
     
    }
  });
  return radioValue;
}

//Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amount: ' , questionAmount);
  if (questionAmount) { 
    showCountdown();
  }
  


}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  });
});

// Event Listeners

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);
playAgainBtn.addEventListener('click', playAgain)

// On load
getSavedBestScores();