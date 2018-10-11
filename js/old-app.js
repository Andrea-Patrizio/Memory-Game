// SHUFFLE DECK ****************************************************************
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
var cards = ['diamond','diamond','paper-plane-o','paper-plane-o','anchor','anchor','bolt','bolt','cube','cube','leaf','leaf','bicycle','bicycle','bomb','bomb','birthday-cake','birthday-cake','bug','bug','bath','bath','cutlery','cutlery','eye','eye','gavel','gavel','paw','paw','plane','plane','plug','plug','rocket','rocket']; // Cards array
var levels = [['easy', 20, 'grid20', 35, 50], ['medium', 30, 'grid30', 55, 75], ['hard', 36, 'grid36', 80, 110]]; // Difficulty level array [name, n. cards, css grid, 2 stars time, 1 star time]
var confucio = [['Only the enlighted can do better than you.'], ['Always make efforts to improve your spirit.'],['Your journey to wisdom has just started.']]; // Rating array
var matches = 0;
var moves = 0;
var level = 0;
var rating = 3;
var seconds = 0;

// DIFFICULTY LEVEL SELECTION **************************************************
var levelSelection = document.querySelectorAll('.level');
levelSelection.forEach(function(lev){
    lev.addEventListener('click',function(){
        var getLevel = lev.dataset.level;
        level = getLevel;
        resetGame();
    });
});

// SET DATA ********************************************************************
function updateData(mov, mat, rat) { // Update moves matches and rating variables
    console.log('Update moves, matches and rating data');
    moves = mov; 
    matches = mat;
    rating = rat;
    document.querySelector('.moves').innerHTML = mov;
    document.querySelector('.matches').innerHTML = mat + '/' + (levels[level][1] / 2);
}

// TIMER ***********************************************************************
var minField = document.getElementById('minutes');
var secField = document.getElementById('seconds');
var startTimer = function () { // Start timer
    console.log('Start timer');
    begin = window.setInterval(counter, 1000);
};
var resetTimer = function () { // Reset timer
    console.log('Reset timer');
    window.clearInterval(begin);
    seconds = 0;
    secField.textContent = '000';
    begin = window.setInterval(counter, 1000);
};
var counter = function () { // Set seconds field and rating stars
    seconds++;
    if (seconds < 10) { // Set seconds field
            secField.textContent = '00' + seconds;
        } else if (seconds >= 10 && seconds < 100) {
            secField.textContent = '0' + seconds;
        } else {
            secField.textContent = seconds;
        }
    if (seconds === levels[level][3]) { // Set rating
        lightStars(2);
        rating = 2;
    } else if (seconds === levels[level][4]) {
        lightStars(1);
        rating = 1;
    }
};

// DECK CREATION ***************************************************************
function deckCreation() {
    console.log('Create deck');
    var cardsCut = cards.slice(0, levels[level][1]); // Cut cards array according to difficulty level
    shuffle(cardsCut); // Shuffle cards
    var deck = document.querySelector('#deck');
    deck.className = levels[level][2]; // Add grid class to deck
    cardsCut.forEach(function (card) {
            var li = document.createElement('li');
            li.classList.add(card, 'card');
            deck.appendChild(li);
            li.innerHTML = '<i class="fa fa-' + card + '"></i>';
    });
}

// CARDS ENGINE ****************************************************************
function cardsEngine() {
    console.log('Initiate cards engine');
    var allCards = document.querySelectorAll('.card');
    var openCards = [];
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
                            endGame();
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
                        });updateData(moves,matches,rating);
                    }
                    updateData(moves,matches,rating);
                }
            }
        });
    });
}

// SET STARS *******************************************************************
function lightStars(num) {
    console.log('Update performance rating');
    var allStars = document.querySelectorAll('.fa-star');
    allStars.forEach(function (star) {
        star.classList.remove('painted');
    });
    for (var n = 0; n < num; n++) {
        allStars[n].classList.add('painted');
    }

}

// END OF THE GAME *************************************************************
function endGame() {
    console.log('End of game');
    window.clearInterval(begin); // Stop timer
    var title = document.getElementById('title');
    var rate = document.getElementById('rating');
    title.textContent = "Congratulations, you won the game!";
    switch (rating) { // Set rating message
        case 3:
            rate.innerHTML = 'You finished the game in <strong>' + seconds + ' seconds</strong>, using <strong>' + moves + ' moves</strong>.<br>Confucio says: "' + confucio[0][0] + '"';
            break;
        case 2:
            rate.innerHTML = 'You finished the game in <strong>' + seconds + ' seconds</strong>, using <strong>' + moves + ' moves</strong>.<br>Confucio says: "' + confucio[1][0] + '"';
            break;
        case 1:
            rate.innerHTML = 'You finished the game in <strong>' + seconds + ' seconds</strong>, using <strong>' + moves + ' moves</strong>.<br>Confucio says: "' + confucio[2][0] + '"';
            break;
    }
    document.querySelector('.starsF').innerHTML = document.querySelector('.stars').innerHTML; // Copy game stars to modal stars
    document.getElementById('modal').className = ('on'); // Display end game modal window
}

// SET *************************************************************************
function setGame() {
    deckCreation();
    cardsEngine();
    updateData(0,0,rating);
    lightStars(rating);
    startTimer();
}

// RESET ***********************************************************************
var reset = document.querySelectorAll('.restart');
reset.forEach(function(button){
    button.addEventListener('click', resetGame);
});

function resetGame() {
    console.log('Reset game');
    document.getElementById('modal').className = (''); // Hide winner popup
    var allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card){ // Remove all cards
        card.remove();
    });    
    deckCreation();
    cardsEngine();
    updateData(0,0,3);
    lightStars(rating);
    resetTimer();
}

// INITIALIZE GAME**************************************************************
setGame();