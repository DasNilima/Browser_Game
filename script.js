// create a AudioAssets class that add five properties of sound as input to its constructor
// Add methods to five properties that extends the functionality of those sounds
class AudioAssets {
    constructor() {
        this.bgMusic = new Audio('Assets/Audio/bgMusic.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.winSound = new Audio('Assets/Audio/win.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
        this.bgMusic.volume = 0.5; 
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    win() {
        this.stopMusic();
        this.winSound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}
// Create another class peekBoo that take two parameter totalTime and cards
// Add 3 properties cardsArray, totalTime, time that call the properties itself
class PeekABoo {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeLeft = totalTime;
        this.timer = document.getElementById('time-left')
        this.ticker = document.getElementById('flips');
        this.audioAssets = new AudioAssets();
    }
    startGame() {
        this.totalClicks = 0;
        this.timeLeft = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioAssets.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeLeft;
        this.ticker.innerText = this.totalClicks;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeLeft--;
            this.timer.innerText = this.timeLeft;
            if(this.timeLeft === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioAssets.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    win() {
        clearInterval(this.countDown);
        this.audioAssets.win();
        document.getElementById('win-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioAssets.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card); // check for match
            } else {
                this.cardToCheck = card; 
            }
        }
    } 
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck); //match
        else 
            this.cardMismatch(card, this.cardToCheck); //mismatch

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioAssets.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.win();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    /* Fisher-Yates Shuffle Algorithm.-- 
        To shuffle an array a of n elements (indices 0..n-1):
        for i from n−1 downto 1 do
        j ← random integer such that 0 ≤ j ≤ i
        exchange a[j] and a[i]*/
    shuffleCards() { 
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}
//document.readyState is the state of loading process, once DOM content or everything inside HTML file content loaded, its
//going to call whatever function it is! 
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new PeekABoo(120, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}