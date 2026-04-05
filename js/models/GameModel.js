export class GameModel {
    constructor() {
        this.cards = [];
        this.moves = 0;
        this.matches = 0;
        this.totalPairs = 0;
        this.firstCardIndex = null;
        this.isProcessing = false;
        this.currentTheme = null;
        this.currentPlayer = 1;
        this.playerCount = 2;
        this.scores = {};
    }

    init(themeItems, totalPairs, playerCount = 2) {
        this.moves = 0;
        this.matches = 0;
        this.totalPairs = totalPairs;
        this.firstCardIndex = null;
        this.isProcessing = false;
        this.currentTheme = themeItems;
        this.currentPlayer = 1;
        this.playerCount = playerCount;
        this.scores = Object.fromEntries(
            Array.from({ length: playerCount }, (_, index) => [index + 1, 0])
        );

        this._generateCards(themeItems, totalPairs);
        this._shuffleCards();
    }

    _generateCards(themeItems, totalPairs) {
        const selectedItems = this._getRandomItems(themeItems, totalPairs);

        this.cards = [];
        for (let index = 0; index < totalPairs; index++) {
            const item = selectedItems[index];
            const card1 = { id: index * 2, value: item, isFlipped: false, isMatched: false, matchedBy: null, index: index * 2 };
            const card2 = { id: index * 2 + 1, value: item, isFlipped: false, isMatched: false, matchedBy: null, index: index * 2 + 1 };
            this.cards.push(card1, card2);
        }
    }

    _getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    _shuffleCards() {
        for (let index = this.cards.length - 1; index > 0; index--) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [this.cards[index], this.cards[swapIndex]] = [this.cards[swapIndex], this.cards[index]];
        }

        this.cards.forEach((card, index) => {
            card.index = index;
        });
    }

    canFlipCard(index) {
        const card = this.cards[index];
        return !this.isProcessing && !card.isMatched && !card.isFlipped;
    }

    flipCard(index) {
        if (!this.canFlipCard(index)) return null;

        const card = this.cards[index];
        card.isFlipped = true;

        if (this.firstCardIndex === null) {
            this.firstCardIndex = index;
            return { type: 'flip', index };
        }

        this.moves++;
        const firstCard = this.cards[this.firstCardIndex];
        const isMatch = firstCard.value === card.value;

        if (isMatch) {
            firstCard.isMatched = true;
            card.isMatched = true;
            firstCard.matchedBy = this.currentPlayer;
            card.matchedBy = this.currentPlayer;
            this.matches++;
            this.scores[this.currentPlayer]++;
        }

        const result = {
            type: 'check',
            index1: this.firstCardIndex,
            index2: index,
            isMatch,
            matchedBy: isMatch ? this.currentPlayer : null,
            moves: this.moves,
            isCleared: this.isGameCleared()
        };

        if (!isMatch) {
            this.currentPlayer = this.currentPlayer % this.playerCount + 1;
        }

        this.firstCardIndex = null;
        return result;
    }

    unflipCards(index1, index2) {
        this.cards[index1].isFlipped = false;
        this.cards[index2].isFlipped = false;
    }

    setProcessing(status) {
        this.isProcessing = status;
    }

    isGameCleared() {
        return this.matches === this.totalPairs;
    }

    getCurrentTurnNumber() {
        return this.isGameCleared() ? this.moves : this.moves + 1;
    }

    getState() {
        return {
            moves: this.moves,
            matches: this.matches,
            totalPairs: this.totalPairs,
            currentPlayer: this.currentPlayer,
            playerCount: this.playerCount,
            scores: this.scores,
            turnsCompleted: this.moves,
            currentTurn: this.getCurrentTurnNumber()
        };
    }
}
