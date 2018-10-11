/* 
Project 2: Matching Game
Author: Andrea P. Patella
Udacity Nanodegree Program
Front-end Developer
Javascript file
*/

// SHUFFLE DECK ****************************************************************

/**
* @description Shuffle an array elements
* @param {array} array
* @returns shuffled array
*/
function shuffle(array) {
    console.log('Shuffle cards');
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// VARIABLES & ARRAYS **********************************************************
// 
// Cards array
const cards = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb', 'birthday-cake', 'birthday-cake', 'bug', 'bug', 'bath', 'bath', 'cutlery', 'cutlery', 'eye', 'eye', 'gavel', 'gavel', 'paw', 'paw', 'plane', 'plane', 'plug', 'plug', 'rocket', 'rocket', 'bell', 'bell', 'book', 'book', 'car', 'car', 'cog', 'cog', 'coffee', 'coffee', 'futbol-o', 'futbol-o'];

 // Difficulty level array [name, n. cards, css grid, 4 stars time, 3 star time, 2 stars time, 1 star time]
const levels = [
    ['easy', 20, 'grid20', 30, 40, 50, 60],
    ['medium', 30, 'grid30', 55, 70, 85, 100],
    ['hard', 42, 'grid42', 100, 120, 140, 160]
];

// Confucio rating array
const confucio = [
    'Your journey to wisdom has just started.',
    'This is the right path, just walk faster',
    'Always make efforts to improve your spirit.',
    'You are really close to reach your full potential',
    'Only the enlighted can do better than you.'
];

// Set variables
let matches = 0;
let moves = 0;
let level = 0;
let rating = 5;
let seconds = 0;

// DIFFICULTY LEVEL SELECTION **************************************************

/**
* @description Set difficulty level buttons
* @param {number} lev
*/
const levelSelection = document.querySelectorAll('.level');
levelSelection.forEach(function (lev) {
    lev.addEventListener('click', function () {
        let getLevel = lev.dataset.level; // Read data-level attribute of HTML tag
        level = getLevel;
        resetGame();
    });
});

// SET DATA ********************************************************************

/**
* @description Update data like Moves, Matches and Rating.
* @param {number} mov
* @param {number} mat
* @param {number} rat
*/
function updateData(mov, mat, rat) { // Update moves matches and rating variables
    console.log('Update moves, matches and rating data');
    moves = mov;
    matches = mat;
    rating = rat;
    document.querySelector('.moves').innerHTML = mov; // Print moves
    document.querySelector('.matches').innerHTML = mat + '/' + (levels[level][1] / 2); // Print matches
}

// TIMER ***********************************************************************

const minField = document.getElementById('minutes');
const secField = document.getElementById('seconds');
let begin; // Set global time interval

// Start timer
const startTimer = function () {
    console.log('Start timer');
    begin = window.setInterval(counter, 1000);
};

// Reset timer
const resetTimer = function () {
    console.log('Reset timer');
    window.clearInterval(begin);
    seconds = 0;
    secField.textContent = '000';
    begin = window.setInterval(counter, 1000);
};

// Set seconds field and rating stars
const counter = function () { 
    seconds++;
    if (seconds < 10) { // Set seconds field
        secField.textContent = '00' + seconds;
    } else if (seconds >= 10 && seconds < 100) {
        secField.textContent = '0' + seconds;
    } else {
        secField.textContent = seconds;
    }
    if (seconds === 666) { // Time's up
        endGame(2);
    }
    switch (seconds) { // Calculate rating level depending on seconds
        case levels[level][3]:
            lightStars(4);
            rating = 4;
            break;
        case levels[level][4]:
            lightStars(3);
            rating = 3;
            break;
        case levels[level][5]:
            lightStars(2);
            rating = 2;
            break;
        case levels[level][6]:
            lightStars(1);
            rating = 1;
            break;
    }
};

// DECK CREATION ***************************************************************

function deckCreation() {
    console.log('Create deck');
    let cardsCut = cards.slice(0, levels[level][1]); // Cut cards array according to difficulty level
    shuffle(cardsCut); // Shuffle cards
    const deck = document.querySelector('#deck');
    deck.className = levels[level][2]; // Add grid class to deck
    cardsCut.forEach(function (card) {
        let li = document.createElement('li');
        li.classList.add(card, 'card');
        deck.appendChild(li);
        li.innerHTML = '<i class="fa fa-' + card + '"></i>';
    });
}

// CARDS ENGINE ****************************************************************

function cardsEngine() {
    console.log('Initiate cards engine');
    const allCards = document.querySelectorAll('.card');
    let openCards = [];
    allCards.forEach(function (card) {
        card.addEventListener('click', function () { // Add click function to every card
            if (openCards.length <= 1 && !card.classList.contains('match') && !card.classList.contains('show')) {
                card.classList.add('show'); // Turn card
                openCards.push(card); // Push card in array
                if (openCards.length === 2) { // If 2 cards turn
                    moves++;
                    if (openCards[0].classList[0] === openCards[1].classList[0]) { // Compare class for matching
                        openCards.forEach(function (card) { // Paint card green if matching
                            card.classList.remove('show');
                            card.classList.add('match');
                            openCards = [];
                        });
                        matches++;
                        if (matches === (levels[level][1] / 2)) { // End of the game
                            endGame(1);
                        }
                    } else {
                        // Hide cards if not matching and reset array
                        openCards.forEach(function (card) {
                            card.classList.remove('show');
                            card.classList.add('nomatch');
                            setTimeout(function () {
                                card.classList.remove('nomatch');
                                openCards = [];
                            }, 1000);
                        });
                        updateData(moves, matches, rating);
                    }
                    updateData(moves, matches, rating);
                }
            }
        });
    });
}

// SET STARS *******************************************************************

/**
* @description Light a number of stars according to rate level
* @param {number} num
*/
function lightStars(num) {
    console.log('Update performance rating');
    const allStars = document.querySelectorAll('.fa-star');
    allStars.forEach(function (star) { // Remove 'painted' class to all stars
        star.classList.remove('painted');
    });
    for (let n = 0; n < num; n++) { // Add 'painted' class to a number of stars
        allStars[n].classList.add('painted');
    }

}

// END OF THE GAME *************************************************************

/**
* @description Stop the game and pup up a window with some informations, like moves, time and rating
* @param {number} cond
*/
function endGame(cond) {
    console.log('End of game');
    window.clearInterval(begin); // Stop timer
    const title = document.getElementById('title');
    const rate = document.getElementById('rating');
    if (cond === 1) { // Winning the game
        title.textContent = 'Congratulations, you won the game!';
        rate.innerHTML = 'You finished the game in <strong>' + seconds + 
                ' seconds</strong>, using <strong>' + moves + 
                ' moves</strong>.<br>Confucio says: "' + confucio[(rating-1)] + '"';
        document.querySelector('.starsF').innerHTML = document.querySelector('.stars').innerHTML; // Copy game stars to modal stars
    } else if (cond === 2) { // Time's up
        title.textContent = 'You reached 666 seconds';
        rate.innerHTML = 'I\'m sorry, you didn\'t take this game seriously enough.<br>' + 
                'So Satan decided to <strong>take your soul</strong> to hell!';
        rate.innerHTML += '<img src="img/satan.jpg" class="satan">';
    }
    document.getElementById('modal').className = ('on'); // Display end game modal window
}

// SET *************************************************************************

/**
* @description Set the game parameters
*/
function setGame() {
    deckCreation();
    cardsEngine();
    updateData(0, 0, rating);
    lightStars(rating);
    startTimer();
}

// RESET ***********************************************************************

var reset = document.querySelectorAll('.restart');
reset.forEach(function (button) {
    button.addEventListener('click', resetGame);
});
/**
* @description Reset the game parameters
*/
function resetGame() {
    console.log('Reset game');
    document.getElementById('modal').className = (''); // Hide winner popup
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(function (card) { // Remove all cards
        card.remove();
    });
    deckCreation();
    cardsEngine();
    updateData(0, 0, 5);
    lightStars(rating);
    resetTimer();
}

// INITIALIZE GAME**************************************************************

setGame();