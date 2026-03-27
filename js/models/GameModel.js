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
        this.scores = { 1: 0, 2: 0 };
    }

    // 게임 데이터 초기화 함수
    init(themeItems, totalPairs) {
        this.moves = 0;
        this.matches = 0;
        this.totalPairs = totalPairs;
        this.firstCardIndex = null;
        this.isProcessing = false;
        this.currentTheme = themeItems;
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };

        // 카드 쌍 생성
        this._generateCards(themeItems, totalPairs);
        // 카드 섞기
        this._shuffleCards();
    }

    _generateCards(themeItems, totalPairs) {
        // 아이템 풀에서 무작위로 totalPairs만큼 선택 (부족할 경우를 대비)
        const selectedItems = this._getRandomItems(themeItems, totalPairs);

        this.cards = [];
        // 쌍으로 카드 생성
        for (let i = 0; i < totalPairs; i++) {
            const item = selectedItems[i];
            const card1 = { id: i * 2, value: item, isFlipped: false, isMatched: false, matchedBy: null, index: i * 2 };
            const card2 = { id: i * 2 + 1, value: item, isFlipped: false, isMatched: false, matchedBy: null, index: i * 2 + 1 };
            this.cards.push(card1, card2);
        }
    }

    _getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    _shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        // 인덱스 재할당
        this.cards.forEach((card, i) => card.index = i);
    }

    getCard(index) {
        return this.cards[index];
    }

    canFlipCard(index) {
        const card = this.cards[index];
        return !this.isProcessing && !card.isMatched && !card.isFlipped;
    }

    // 카드 뒤집기 시도
    // 반환값: { type: 'flip', index } 또는 { type: 'match', index1, index2, isMatch, moves }
    flipCard(index) {
        if (!this.canFlipCard(index)) return null;

        const card = this.cards[index];
        card.isFlipped = true;

        // 첫 번째 카드를 뒤집은 경우
        if (this.firstCardIndex === null) {
            this.firstCardIndex = index;
            return { type: 'flip', index };
        }

        // 두 번째 카드를 뒤집은 경우 -> 짝 검사 로직
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
            isMatch: isMatch,
            matchedBy: isMatch ? this.currentPlayer : null,
            moves: this.moves,
            isCleared: this.isGameCleared()
        };

        if (!isMatch) {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
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

    getState() {
        return {
            moves: this.moves,
            matches: this.matches,
            totalPairs: this.totalPairs,
            currentPlayer: this.currentPlayer,
            scores: this.scores
        };
    }
}
