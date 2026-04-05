import { audioManager } from '../utils/AudioManager.js';
import { t } from '../data/i18n.js';

export class GameView {
    constructor() {
        this.screenHome = document.getElementById('screen-home');
        this.screenGame = document.getElementById('screen-game');

        this.themeGrid = document.getElementById('theme-grid');
        this.modalDifficulty = document.getElementById('modal-difficulty');
        this.modalAlbum = document.getElementById('modal-album');
        this.difficultyBtns = document.querySelectorAll('#difficulty-buttons-modal .btn-diff');
        this.playerCountBtns = document.querySelectorAll('#player-count-buttons .btn-player-count');
        this.btnSetupStart = document.getElementById('btn-setup-start');

        this.homeTitle = document.getElementById('home-title');
        this.homeCredit = document.getElementById('home-credit');
        this.homeSubtitle = document.getElementById('home-subtitle');
        this.btnLangToggle = document.getElementById('btn-lang-toggle');
        this.btnAlbum = document.getElementById('btn-album');
        this.btnAlbumClose = document.getElementById('btn-album-close');
        this.btnAlbumAdd = document.getElementById('btn-album-add');
        this.albumTitle = document.getElementById('album-title');
        this.albumSubtitle = document.getElementById('album-subtitle');
        this.albumCount = document.getElementById('album-count');
        this.albumGrid = document.getElementById('album-grid');
        this.albumEmpty = document.getElementById('album-empty');

        this.gameBoard = document.getElementById('game-board');
        this.playerStats = document.getElementById('player-stats');
        this.turnCounter = document.getElementById('turn-counter');
        this.btnBack = document.getElementById('btn-back');
        this.btnRestart = document.getElementById('btn-restart');

        this.modalClear = document.getElementById('modal-clear');
        this.clearTitle = document.getElementById('clear-title');
        this.clearMessage = document.getElementById('clear-message');
        this.finalResultText = document.getElementById('final-result-text');
        this.clearTurnsText = document.getElementById('clear-turns-text');
        this.btnModalRestart = document.getElementById('btn-modal-restart');
        this.btnModalHome = document.getElementById('btn-modal-home');

        this.setupTitle = document.getElementById('setup-title');
        this.setupSubtitle = document.getElementById('setup-subtitle');
        this.setupCardsLabel = document.getElementById('setup-cards-label');
        this.setupPlayersLabel = document.getElementById('setup-players-label');

        this.countdownOverlay = document.getElementById('countdown-overlay');
        this.countdownText = document.getElementById('countdown-text');

        this.textThemePalettes = {
            'theme-abc': ['#5d4f86', '#5468a4', '#4b8a6d', '#a05a7f', '#4f7ca0', '#9a6f47', '#6860a7', '#8a5ea2', '#458884', '#a06a55', '#57639a', '#5f8b5e'],
            'theme-kr': ['#3f8579', '#6a57a0', '#93814c', '#3f7faa', '#9a5870', '#548c62', '#6f63aa', '#a06b47', '#3f8f8a', '#8b5d90', '#4e72a2', '#788a45'],
            'theme-numbers': ['#4d6fa4', '#8a5d96', '#5d8d4a', '#a86f42', '#4684a0', '#9a5d76', '#4d8b8f', '#96664f', '#5c61a2', '#6f8d46', '#7b62aa', '#5c778d']
        };
        this.currentLanguage = 'ko';

        document.body.addEventListener('pointerdown', (event) => {
            if (event.target.closest('button') || event.target.closest('.theme-card') || event.target.closest('.card')) {
                audioManager.init();
            }
        }, { passive: true });

        document.body.addEventListener('click', (event) => {
            if (event.target.closest('button') || event.target.closest('.theme-card')) {
                audioManager.playClick();
            }
        });
    }

    bindPress(element, handler) {
        let handledByPointer = false;

        element.addEventListener('pointerdown', (event) => {
            if (!event.isPrimary) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;

            handledByPointer = true;
            if (event.pointerType !== 'mouse') {
                event.preventDefault();
            }

            handler(event);
        });

        element.addEventListener('click', (event) => {
            if (handledByPointer && event.detail !== 0) {
                handledByPointer = false;
                return;
            }

            handledByPointer = false;
            handler(event);
        });
    }

    applyTranslations(language, context = {}) {
        this.currentLanguage = language;
        document.documentElement.lang = language;
        document.title = t(language, 'appTitle');

        this.homeTitle.textContent = t(language, 'homeTitle');
        this.homeCredit.textContent = t(language, 'homeCredit');
        this.homeSubtitle.textContent = t(language, 'homeSubtitle');
        this.btnBack.innerHTML = '🏠';
        this.btnBack.setAttribute('aria-label', t(language, 'home'));
        this.btnBack.setAttribute('title', t(language, 'home'));
        this.btnRestart.innerHTML = '🔄';
        this.btnRestart.setAttribute('aria-label', t(language, 'restart'));
        this.btnRestart.setAttribute('title', t(language, 'restart'));
        this.clearTitle.textContent = t(language, 'clearTitle');
        this.clearMessage.textContent = t(language, 'clearMessage');
        this.finalResultText.textContent = t(language, 'clearPending');
        this.clearTurnsText.textContent = '';
        this.btnModalRestart.textContent = t(language, 'restart');
        this.btnModalHome.textContent = t(language, 'playAnother');
        this.setupTitle.textContent = t(language, 'setupTitle');
        this.setupSubtitle.textContent = t(language, 'setupSubtitle');
        this.setupCardsLabel.textContent = t(language, 'setupCardsLabel');
        this.setupPlayersLabel.textContent = t(language, 'setupPlayersLabel');
        this.btnSetupStart.textContent = t(language, 'start');
        this.btnLangToggle.textContent = `🌐 ${t(language, 'langButton')}`;
        this.btnLangToggle.setAttribute('aria-label', t(language, 'langAria'));
        this.btnLangToggle.setAttribute('title', t(language, 'langAria'));
        this.btnAlbum.textContent = t(language, 'albumButton');
        this.btnAlbum.setAttribute('aria-label', t(language, 'albumTitle'));
        this.btnAlbum.setAttribute('title', t(language, 'albumTitle'));
        this.btnAlbumClose.setAttribute('aria-label', 'Close');
        this.btnAlbumClose.setAttribute('title', 'Close');
        this.albumTitle.textContent = t(language, 'albumTitle');
        this.albumSubtitle.textContent = t(language, 'albumSubtitle');
        this.btnAlbumAdd.textContent = t(language, 'albumAdd');

        const cardLabels = {
            6: t(language, 'cards12'),
            8: t(language, 'cards16'),
            10: t(language, 'cards20'),
            12: t(language, 'cards24')
        };
        this.difficultyBtns.forEach((button) => {
            button.textContent = cardLabels[parseInt(button.dataset.pairs, 10)] ?? button.textContent;
        });

        const playerLabels = {
            1: t(language, 'playerCount1'),
            2: t(language, 'playerCount2'),
            3: t(language, 'playerCount3'),
            4: t(language, 'playerCount4')
        };
        this.playerCountBtns.forEach((button) => {
            button.textContent = playerLabels[parseInt(button.dataset.players, 10)] ?? button.textContent;
        });

        if (typeof context.albumCount === 'number') {
            this.setAlbumButtonCount(context.albumCount, language);
            this.albumCount.textContent = t(language, 'albumCount', { count: context.albumCount });
        }

        if (typeof context.currentTurn === 'number') {
            this.updateTurnCounter(context.currentTurn, language);
        }

        if (context.playerCount && context.scores && context.currentPlayer) {
            this.renderPlayerStats(context.playerCount, language, context.scores, context.currentPlayer);
        }
    }

    renderThemes(themes, selectedThemeId, language, onSelectTheme) {
        this.themeGrid.innerHTML = '';

        const fixedThemeIds = ['random', 'custom'];
        const orderedFixedThemes = themes.filter((theme) => fixedThemeIds.includes(theme.id));
        const otherThemes = themes.filter((theme) => !fixedThemeIds.includes(theme.id));

        const priorityRow = document.createElement('div');
        priorityRow.className = 'theme-priority-row';

        const themeListGrid = document.createElement('div');
        themeListGrid.className = 'theme-list-grid';

        [...orderedFixedThemes, ...otherThemes].forEach((theme, index) => {
            const card = document.createElement('div');
            card.className = `theme-card ${theme.id === selectedThemeId ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="icon">${theme.icon}</div>
                <div class="name">${theme.name[language] ?? theme.name.ko}</div>
            `;

            this.bindPress(card, () => onSelectTheme(theme.id));

            if (index < orderedFixedThemes.length) {
                priorityRow.appendChild(card);
            } else {
                themeListGrid.appendChild(card);
            }
        });

        if (priorityRow.children.length > 0) {
            this.themeGrid.appendChild(priorityRow);
        }
        if (themeListGrid.children.length > 0) {
            this.themeGrid.appendChild(themeListGrid);
        }
    }

    updateDifficultySelection(pairsCount) {
        this.difficultyBtns.forEach((button) => {
            button.classList.toggle('active', parseInt(button.dataset.pairs, 10) === pairsCount);
        });
    }

    updatePlayerCountSelection(playerCount) {
        this.playerCountBtns.forEach((button) => {
            button.classList.toggle('active', parseInt(button.dataset.players, 10) === playerCount);
        });
    }

    bindSetupButtons(onSelectDifficulty, onSelectPlayers, onStart) {
        this.difficultyBtns.forEach((button) => {
            button.addEventListener('click', (event) => {
                onSelectDifficulty(parseInt(event.currentTarget.dataset.pairs, 10));
            });
        });

        this.playerCountBtns.forEach((button) => {
            button.addEventListener('click', (event) => {
                onSelectPlayers(parseInt(event.currentTarget.dataset.players, 10));
            });
        });

        this.btnSetupStart.addEventListener('click', onStart);
    }

    bindDifficultyBackdrop(onClose) {
        this.modalDifficulty.addEventListener('click', (event) => {
            if (event.target === this.modalDifficulty) {
                onClose();
            }
        });
    }

    bindLanguageToggle(onToggleLanguage) {
        this.btnLangToggle.addEventListener('click', onToggleLanguage);
    }

    bindAlbumControls(onOpen, onClose, onAdd, onDelete) {
        this.btnAlbum.addEventListener('click', onOpen);
        this.btnAlbumClose.addEventListener('click', onClose);
        this.btnAlbumAdd.addEventListener('click', onAdd);

        this.modalAlbum.addEventListener('click', (event) => {
            if (event.target === this.modalAlbum) {
                onClose();
            }
        });

        this.albumGrid.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('[data-photo-id]');
            if (!deleteButton) return;

            onDelete(deleteButton.dataset.photoId);
        });
    }

    showDifficultyModal() {
        this.modalDifficulty.classList.remove('hidden');
    }

    hideDifficultyModal() {
        this.modalDifficulty.classList.add('hidden');
    }

    showAlbumModal() {
        this.modalAlbum.classList.remove('hidden');
    }

    hideAlbumModal() {
        this.modalAlbum.classList.add('hidden');
    }

    renderGameScreen(totalPairs, themeCssClass, playerCount, language, scores, currentTurn) {
        this.screenHome.classList.remove('active');
        this.screenGame.classList.add('active');
        this.btnLangToggle.hidden = true;
        this.btnAlbum.hidden = true;
        this.renderPlayerStats(playerCount, language, scores, 1);
        this.updateTurnCounter(currentTurn, language);

        this.gameBoard.className = `game-board ${themeCssClass}`;
        if (totalPairs === 8) {
            this.gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else if (totalPairs === 6) {
            this.gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            this.gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }

    showExistingGameScreen() {
        this.screenHome.classList.remove('active');
        this.screenGame.classList.add('active');
        this.btnLangToggle.hidden = true;
        this.btnAlbum.hidden = true;
    }

    renderPlayerStats(playerCount, language, scores, currentPlayer) {
        this.playerStats.innerHTML = '';
        this.playerStats.style.gridTemplateColumns = `repeat(${playerCount}, minmax(0, 1fr))`;

        for (let player = 1; player <= playerCount; player++) {
            const stat = document.createElement('div');
            stat.className = `player-stat player-${player} ${player === currentPlayer ? 'active' : ''}`;
            stat.dataset.player = player;
            stat.innerHTML = `
                <span class="player-name">${t(language, 'player', { number: player })}</span>
                <div class="score-badge"><span class="player-score">${scores[player] ?? 0}</span></div>
            `;
            this.playerStats.appendChild(stat);
        }

        this.updateTurnIndicator(currentPlayer);
    }

    updateTurnCounter(turn, language = this.currentLanguage) {
        this.turnCounter.dataset.turn = turn;
        this.turnCounter.textContent = t(language, 'turnLabel', { turn });
    }

    setAlbumButtonCount(count, language = this.currentLanguage) {
        this.btnAlbum.textContent = t(language, 'albumButton');
        this.btnAlbum.dataset.count = count;
    }

    renderAlbumPhotos(photos, language) {
        this.albumGrid.innerHTML = '';
        this.albumCount.textContent = t(language, 'albumCount', { count: photos.length });
        this.albumEmpty.textContent = t(language, 'albumEmpty');
        this.albumEmpty.classList.toggle('hidden', photos.length > 0);

        photos.forEach((photo) => {
            const photoEl = document.createElement('div');
            photoEl.className = 'album-photo';
            photoEl.innerHTML = `
                <img src="${photo.dataUrl}" alt="">
                <button class="album-photo-delete" type="button" data-photo-id="${photo.id}" aria-label="${t(language, 'albumDeleteAria')}" title="${t(language, 'albumDeleteAria')}">X</button>
            `;
            this.albumGrid.appendChild(photoEl);
        });
    }

    getActiveTextPalette() {
        const activeThemeClass = Array.from(this.gameBoard.classList)
            .find((className) => Object.hasOwn(this.textThemePalettes, className));

        return activeThemeClass ? this.textThemePalettes[activeThemeClass] : null;
    }

    renderCardFaceValue(item) {
        if (typeof item === 'string') {
            return item;
        }

        if (item?.type === 'labeled') {
            return `
                <div class="theme-item-labeled">
                    <span class="emoji">${item.emoji}</span>
                    <span class="label">${item.label[this.currentLanguage] ?? item.label.ko}</span>
                </div>
            `;
        }

        if (item?.type === 'flag') {
            return `
                <div class="flag-item">
                    <img src="https://flagcdn.com/w80/${item.code}.png" alt="${item.code.toUpperCase()}">
                    <span>${item.label[this.currentLanguage] ?? item.label.ko}</span>
                </div>
            `;
        }

        return '';
    }

    renderBoard(cards, onCardClick) {
        this.gameBoard.innerHTML = '';
        const textPalette = this.getActiveTextPalette();
        const textColorMap = new Map();
        let paletteIndex = 0;

        cards.forEach((cardData, index) => {
            const wrapperEl = document.createElement('div');
            wrapperEl.className = 'card-wrapper';

            const rotate = (Math.random() * 8 - 4).toFixed(1);
            const translateX = (Math.random() * 6 - 3).toFixed(1);
            const translateY = (Math.random() * 6 - 3).toFixed(1);
            wrapperEl.style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;

            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.index = index;
            cardEl.innerHTML = `
                <div class="card-face card-front">${this.renderCardFaceValue(cardData.value)}</div>
                <div class="card-face card-back"></div>
            `;

            if (textPalette && typeof cardData.value === 'string' && !cardData.value.includes('<')) {
                if (!textColorMap.has(cardData.value)) {
                    textColorMap.set(cardData.value, textPalette[paletteIndex % textPalette.length]);
                    paletteIndex++;
                }

                const frontEl = cardEl.querySelector('.card-front');
                if (frontEl) {
                    frontEl.style.color = textColorMap.get(cardData.value);
                }
            }

            this.bindPress(cardEl, () => onCardClick(index));
            wrapperEl.appendChild(cardEl);
            this.gameBoard.appendChild(wrapperEl);
        });
    }

    syncBoardState(cards) {
        cards.forEach((cardData, index) => {
            const cardEl = this.gameBoard.querySelector(`.card[data-index="${index}"]`);
            if (!cardEl) return;

            cardEl.classList.remove('flipped', 'matched', 'p1-match', 'p2-match', 'p3-match', 'p4-match');

            if (cardData.isFlipped) {
                cardEl.classList.add('flipped');
            }

            if (cardData.isMatched) {
                cardEl.classList.add('matched', `p${cardData.matchedBy}-match`);
            }
        });
    }

    updateStats(scores) {
        this.playerStats.querySelectorAll('.player-stat').forEach((stat) => {
            const player = parseInt(stat.dataset.player, 10);
            const scoreNode = stat.querySelector('.player-score');
            if (scoreNode) {
                scoreNode.textContent = scores[player] ?? 0;
            }
        });
    }

    updateTurnIndicator(currentPlayer) {
        const gameHeader = document.querySelector('.game-header');
        if (!gameHeader) return;

        ['turn-p1', 'turn-p2', 'turn-p3', 'turn-p4'].forEach((className) => gameHeader.classList.remove(className));
        gameHeader.classList.add(`turn-p${currentPlayer}`);

        this.playerStats.querySelectorAll('.player-stat').forEach((stat) => {
            stat.classList.toggle('active', parseInt(stat.dataset.player, 10) === currentPlayer);
        });
    }

    flipCard(index) {
        const cardEl = this.gameBoard.querySelector(`.card[data-index="${index}"]`);
        if (cardEl) {
            cardEl.classList.add('flipped');
        }
    }

    unflipCards(index1, index2) {
        const cardEl1 = this.gameBoard.querySelector(`.card[data-index="${index1}"]`);
        const cardEl2 = this.gameBoard.querySelector(`.card[data-index="${index2}"]`);

        if (cardEl1) cardEl1.classList.remove('flipped');
        if (cardEl2) cardEl2.classList.remove('flipped');
    }

    setMatchedCards(index1, index2, matchedBy) {
        const cardEl1 = this.gameBoard.querySelector(`.card[data-index="${index1}"]`);
        const cardEl2 = this.gameBoard.querySelector(`.card[data-index="${index2}"]`);
        const matchClass = `p${matchedBy}-match`;

        if (cardEl1) cardEl1.classList.add('matched', matchClass);
        if (cardEl2) cardEl2.classList.add('matched', matchClass);
    }

    showHomeScreen() {
        this.screenGame.classList.remove('active');
        this.modalClear.classList.add('hidden');
        this.hideDifficultyModal();
        this.hideAlbumModal();
        this.screenHome.classList.add('active');
        this.btnLangToggle.hidden = false;
        this.btnAlbum.hidden = false;
    }

    showClearModal(scores, language, turnsCompleted, playerCount) {
        const scoreEntries = Object.entries(scores).map(([player, score]) => ({
            player: parseInt(player, 10),
            score
        }));
        const maxScore = Math.max(...scoreEntries.map((entry) => entry.score));
        const winners = scoreEntries.filter((entry) => entry.score === maxScore);

        if (playerCount === 1) {
            this.finalResultText.textContent = t(language, 'clearTurns', { turns: turnsCompleted });
            this.clearTurnsText.textContent = '';
        } else if (winners.length === 1) {
            this.finalResultText.textContent = t(language, 'winnerSingle', {
                player: t(language, 'player', { number: winners[0].player }),
                score: maxScore
            });
            this.clearTurnsText.textContent = t(language, 'clearTurns', { turns: turnsCompleted });
        } else {
            this.finalResultText.textContent = t(language, 'winnerTie', {
                players: winners.map((winner) => t(language, 'player', { number: winner.player })).join(', '),
                score: maxScore
            });
            this.clearTurnsText.textContent = t(language, 'clearTurns', { turns: turnsCompleted });
        }

        this.modalClear.classList.remove('hidden');
    }

    hideModal() {
        this.modalClear.classList.add('hidden');
    }

    isClearModalVisible() {
        return !this.modalClear.classList.contains('hidden');
    }

    isAlbumModalVisible() {
        return !this.modalAlbum.classList.contains('hidden');
    }

    bindGameNav(onRestart, onBackToHome) {
        this.btnRestart.addEventListener('click', onRestart);
        this.btnBack.addEventListener('click', onBackToHome);
    }

    bindModalNav(onRestart, onBackToHome) {
        this.btnModalRestart.addEventListener('click', onRestart);
        this.btnModalHome.addEventListener('click', onBackToHome);
    }

    showCountdown(onComplete) {
        this.countdownOverlay.classList.remove('hidden');
        let count = 3;
        this.countdownText.textContent = count;
        audioManager.playCountdown();

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                this.countdownText.textContent = count;
                audioManager.playCountdown();
            } else {
                clearInterval(interval);
                this.countdownText.textContent = 'GO!';
                audioManager.playGo();
                setTimeout(() => {
                    this.countdownOverlay.classList.add('hidden');
                    onComplete();
                }, 500);
            }
        }, 1000);
    }

    peekAllCards(duration, callback) {
        const cards = this.gameBoard.querySelectorAll('.card');
        cards.forEach((card) => card.classList.add('flipped'));

        setTimeout(() => {
            cards.forEach((card) => card.classList.remove('flipped'));
            setTimeout(callback, 400);
        }, 400 + duration);
    }
}
