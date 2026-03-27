import { audioManager } from '../utils/AudioManager.js';

export class GameView {
    constructor() {
        // Screens
        this.screenHome = document.getElementById('screen-home');
        this.screenGame = document.getElementById('screen-game');

        // Home Elements
        this.themeGrid = document.getElementById('theme-grid');
        this.difficultyBtns = document.querySelectorAll('.btn-diff');

        // Game Elements
        this.gameBoard = document.getElementById('game-board');
        this.statP1Score = document.getElementById('score-p1');
        this.statP2Score = document.getElementById('score-p2');
        this.statP1 = document.getElementById('player1-stat');
        this.statP2 = document.getElementById('player2-stat');
        this.btnBack = document.getElementById('btn-back');
        this.btnRestart = document.getElementById('btn-restart');

        // Modal Elements
        this.modalClear = document.getElementById('modal-clear');
        this.finalResultText = document.getElementById('final-result-text');
        this.btnModalRestart = document.getElementById('btn-modal-restart');
        this.btnModalHome = document.getElementById('btn-modal-home');

        // Countdown
        this.countdownOverlay = document.getElementById('countdown-overlay');
        this.countdownText = document.getElementById('countdown-text');

        // Global UI Audio Click logic
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.theme-card') || e.target.closest('.card')) {
                audioManager.init();
            }
            if (e.target.closest('button') || e.target.closest('.theme-card')) {
                audioManager.playClick();
            }
        });

        this.btnAudioToggle = document.getElementById('btn-audio-toggle');
        if (this.btnAudioToggle) {
            this.btnAudioToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                audioManager.init();
                const isMuted = audioManager.toggleMute();
                this.btnAudioToggle.textContent = isMuted ? '🔇' : '🔊';
            });
        }
    }

    // --- Home Screen ---
    renderThemes(themes, selectedThemeId, onSelectTheme) {
        this.themeGrid.innerHTML = '';
        themes.forEach(theme => {
            const card = document.createElement('div');
            card.className = `theme-card ${theme.id === selectedThemeId ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="icon">${theme.icon}</div>
                <div class="name">${theme.name}</div>
            `;
            card.addEventListener('click', () => onSelectTheme(theme.id));
            this.themeGrid.appendChild(card);
        });
    }

    updateDifficultySelection(pairsCount) {
        this.difficultyBtns.forEach(btn => {
            if (parseInt(btn.dataset.pairs) === pairsCount) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    bindDifficultyButtons(onSelectDifficulty) {
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pairs = parseInt(e.currentTarget.dataset.pairs);
                onSelectDifficulty(pairs);
            });
        });
    }

    // --- Game Screen ---
    renderGameScreen(totalPairs, themeCssClass) {
        this.screenHome.classList.remove('active');
        this.screenGame.classList.add('active');
        this.statP1Score.textContent = '0';
        this.statP2Score.textContent = '0';
        this.updateTurnIndicator(1);

        // 게임 보드 클래스 초기화 후 테마 클래스 추가
        this.gameBoard.className = `game-board ${themeCssClass}`;

        // 그리드 템플릿 열 개수 계산 (반응형)
        // 8장(4쌍 -> 2x4 또는 4x2 등), 12장(6쌍 -> 3x4), 16장(8쌍 -> 4x4)
        if (totalPairs === 8) {
            this.gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else if (totalPairs === 6) {
            this.gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            // 기본 4장(8개)의 경우
            this.gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }

    renderBoard(cards, onCardClick) {
        this.gameBoard.innerHTML = '';
        cards.forEach((cardData, index) => {
            const wrapperEl = document.createElement('div');
            wrapperEl.className = 'card-wrapper';
            
            // Random Jitter: between -4 and 4 degrees, -3 and 3 px
            const rotate = (Math.random() * 8 - 4).toFixed(1);
            const translateX = (Math.random() * 6 - 3).toFixed(1);
            const translateY = (Math.random() * 6 - 3).toFixed(1);
            wrapperEl.style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;

            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.index = index;

            cardEl.innerHTML = `
                <div class="card-face card-front">${cardData.value}</div>
                <div class="card-face card-back"></div>
            `;

            cardEl.addEventListener('click', () => onCardClick(index));
            wrapperEl.appendChild(cardEl);
            this.gameBoard.appendChild(wrapperEl);
        });
    }

    updateStats(scores) {
        this.statP1Score.textContent = scores[1];
        this.statP2Score.textContent = scores[2];
    }
    
    updateTurnIndicator(currentPlayer) {
        const gameHeader = document.querySelector('.game-header');
        if (currentPlayer === 1) {
            this.statP1.classList.add('active');
            this.statP2.classList.remove('active');
            gameHeader.classList.remove('turn-p2');
            gameHeader.classList.add('turn-p1');
        } else {
            this.statP2.classList.add('active');
            this.statP1.classList.remove('active');
            gameHeader.classList.remove('turn-p1');
            gameHeader.classList.add('turn-p2');
        }
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

        const matchClass = matchedBy === 1 ? 'p1-match' : 'p2-match';

        if (cardEl1) {
            cardEl1.classList.add('matched', matchClass);
        }
        if (cardEl2) {
            cardEl2.classList.add('matched', matchClass);
        }
    }

    // --- Navigation & Modals ---
    showHomeScreen() {
        this.screenGame.classList.remove('active');
        this.modalClear.classList.add('hidden');
        this.screenHome.classList.add('active');
    }

    showClearModal(scores) {
        let resultText = '';
        if (scores[1] > scores[2]) {
            resultText = `🎉 Player 1 승리! (${scores[1]} : ${scores[2]})`;
        } else if (scores[2] > scores[1]) {
            resultText = `🎉 Player 2 승리! (${scores[2]} : ${scores[1]})`;
        } else {
            resultText = `🤝 무승부! (${scores[1]} : ${scores[2]})`;
        }
        this.finalResultText.textContent = resultText;
        this.modalClear.classList.remove('hidden');
    }

    hideModal() {
        this.modalClear.classList.add('hidden');
    }

    bindGameNav(onRestart, onBackToHome) {
        this.btnRestart.addEventListener('click', onRestart);
        this.btnBack.addEventListener('click', onBackToHome);
    }

    bindModalNav(onRestart, onBackToHome) {
        this.btnModalRestart.addEventListener('click', onRestart);
        this.btnModalHome.addEventListener('click', onBackToHome);
    }

    // --- Pre-game Animations ---
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
                this.countdownText.textContent = "GO!";
                audioManager.playGo();
                setTimeout(() => {
                    this.countdownOverlay.classList.add('hidden');
                    onComplete();
                }, 500); // 0.5초간 GO 표시 후 시작
            }
        }, 1000);
    }

    peekAllCards(duration, callback) {
        const cards = this.gameBoard.querySelectorAll('.card');
        
        // 뒤집기
        cards.forEach(c => c.classList.add('flipped'));
        
        // 보여준 후 다시 뒤집기
        setTimeout(() => {
            cards.forEach(c => c.classList.remove('flipped'));
            // 뒤집히는 애니메이션 시간(0.4s) 이후에 게임 시작
            setTimeout(callback, 400); 
        }, 400 + duration);
    }
}
