import { audioManager } from '../utils/AudioManager.js';

export class GameController {
    constructor(model, view, themesData) {
        this.model = model;
        this.view = view;
        this.themesData = themesData;

        this.selectedThemeId = this.themesData[0].id;
        this.selectedPairs = 8;
        this.selectedPlayerCount = 2;
        this.currentLanguage = localStorage.getItem('memorygame-language') ?? 'ko';
        this.currentScreen = 'home';
        this.isOpeningFilePicker = false;

        this.init();
    }

    init() {
        window.history.replaceState({ screen: 'home' }, '');

        this.view.bindSetupButtons(
            this.handleSelectDifficulty.bind(this),
            this.handleSelectPlayerCount.bind(this),
            this.handleSetupStart.bind(this)
        );
        this.view.bindDifficultyBackdrop(this.handleBackToHome.bind(this));
        this.view.bindLanguageToggle(this.handleToggleLanguage.bind(this));

        this.view.bindGameNav(
            this.startGame.bind(this),
            this.handleBackToHome.bind(this)
        );

        this.view.bindModalNav(
            this.startGame.bind(this),
            this.handleBackToHome.bind(this)
        );

        const uploadInput = document.getElementById('custom-image-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', this.handleCustomImageUpload.bind(this));
        }

        window.addEventListener('popstate', this.handlePopState.bind(this));

        this.renderHome();
    }

    getGameContext() {
        const state = this.model.getState();
        return {
            playerCount: state.playerCount,
            scores: state.scores,
            currentPlayer: state.currentPlayer
        };
    }

    refreshLanguage() {
        const context = this.currentScreen === 'game' ? this.getGameContext() : {};
        this.view.applyTranslations(this.currentLanguage, context);

        if (this.currentScreen === 'home') {
            this.renderHome();
        } else if (this.currentScreen === 'setup') {
            this.renderHome();
            this.view.showDifficultyModal();
        } else if (this.currentScreen === 'game') {
            this.view.renderPlayerStats(
                context.playerCount,
                this.currentLanguage,
                context.scores,
                context.currentPlayer
            );
            this.view.renderBoard(this.model.cards, this.handleCardClick.bind(this));
            this.view.syncBoardState(this.model.cards);

            if (this.view.isClearModalVisible()) {
                this.view.showClearModal(context.scores, this.currentLanguage);
            }
        }
    }

    renderHome() {
        this.view.applyTranslations(this.currentLanguage);
        this.view.updateDifficultySelection(this.selectedPairs);
        this.view.updatePlayerCountSelection(this.selectedPlayerCount);
        this.view.renderThemes(
            this.themesData,
            this.selectedThemeId,
            this.currentLanguage,
            this.handleSelectTheme.bind(this)
        );
    }

    handleToggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
        localStorage.setItem('memorygame-language', this.currentLanguage);
        this.refreshLanguage();
    }

    handleSelectTheme(themeId) {
        this.selectedThemeId = themeId;
        this.renderHome();
        window.history.pushState({ screen: 'setup' }, '');
        this.currentScreen = 'setup';
        this.view.showDifficultyModal();
    }

    handleSelectDifficulty(pairsCount) {
        this.selectedPairs = pairsCount;
        this.view.updateDifficultySelection(this.selectedPairs);
    }

    handleSelectPlayerCount(playerCount) {
        this.selectedPlayerCount = playerCount;
        this.view.updatePlayerCountSelection(this.selectedPlayerCount);
    }

    handleSetupStart() {
        this.view.hideDifficultyModal();

        if (this.selectedThemeId === 'custom') {
            const uploadInput = document.getElementById('custom-image-upload');
            if (uploadInput) {
                this.isOpeningFilePicker = true;
                uploadInput.click();
            }
            return;
        }

        this.startGame();
    }

    handleCustomImageUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) {
            this.isOpeningFilePicker = false;
            this.view.showDifficultyModal();
            return;
        }

        this.model.setProcessing(true);
        const processFiles = files.slice(0, 16);
        const imagePromises = processFiles.map((file) => this.processImageFile(file));

        Promise.all(imagePromises).then((dataUrls) => {
            const customTheme = this.themesData.find((theme) => theme.id === 'custom');
            if (customTheme) {
                let items = dataUrls.map((url) => `<div class="custom-image-container" style="width:100%; height:100%;"><img src="${url}" class="custom-image" alt="custom"></div>`);
                while (items.length < this.selectedPairs) {
                    items = items.concat(items);
                }
                customTheme.items = items;
                this.startGame();
            }
            this.model.setProcessing(false);
            this.isOpeningFilePicker = false;
        }).catch((error) => {
            console.error(error);
            alert(this.currentLanguage === 'ko' ? '이미지 처리 중 오류가 발생했습니다.' : 'An error occurred while processing the images.');
            this.model.setProcessing(false);
            this.isOpeningFilePicker = false;
            this.view.showDifficultyModal();
        });

        event.target.value = '';
    }

    processImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const size = 200;
                    canvas.width = size;
                    canvas.height = size;

                    const minDim = Math.min(img.width, img.height);
                    const sx = (img.width - minDim) / 2;
                    const sy = (img.height - minDim) / 2;

                    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = reject;
                img.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    resolveGameThemeId() {
        let actualThemeId = this.selectedThemeId;
        if (actualThemeId === 'random') {
            const availableThemes = this.themesData.filter((theme) => theme.id !== 'random' && theme.id !== 'custom');
            const randomPick = availableThemes[Math.floor(Math.random() * availableThemes.length)];
            actualThemeId = randomPick.id;
        }

        if (actualThemeId === 'numbers') {
            const themeNode = this.themesData.find((theme) => theme.id === 'numbers');
            if (themeNode) {
                const numSet = new Set();
                while (numSet.size < 16) {
                    numSet.add(Math.floor(Math.random() * 100).toString());
                }
                themeNode.items = Array.from(numSet);
            }
        }

        return actualThemeId;
    }

    startGame() {
        this.view.hideModal();
        this.view.hideDifficultyModal();

        const themeId = this.resolveGameThemeId();
        const theme = this.themesData.find((item) => item.id === themeId);
        if (!theme) return;

        this.model.init(theme.items, this.selectedPairs, this.selectedPlayerCount);
        const state = this.model.getState();
        this.view.applyTranslations(this.currentLanguage, this.getGameContext());
        this.view.renderGameScreen(
            this.selectedPairs,
            theme.cssClass,
            state.playerCount,
            this.currentLanguage,
            state.scores
        );
        this.view.renderBoard(this.model.cards, this.handleCardClick.bind(this));

        if (this.currentScreen === 'setup') {
            window.history.replaceState({ screen: 'game' }, '');
        } else if (this.currentScreen !== 'game') {
            window.history.pushState({ screen: 'game' }, '');
        }
        this.currentScreen = 'game';

        this.model.setProcessing(true);
        this.view.showCountdown(() => {
            this.view.peekAllCards(200, () => {
                this.model.setProcessing(false);
            });
        });
    }

    handleBackToHome() {
        if (this.currentScreen === 'game' && window.history.state?.screen === 'game') {
            window.history.back();
            return;
        }

        if (this.currentScreen === 'setup' && window.history.state?.screen === 'setup') {
            window.history.back();
            return;
        }

        this.currentScreen = 'home';
        this.view.showHomeScreen();
        this.renderHome();
    }

    handlePopState(event) {
        const nextScreen = event.state?.screen ?? 'home';
        if (nextScreen === 'home') {
            this.currentScreen = 'home';
            this.isOpeningFilePicker = false;
            this.view.showHomeScreen();
            this.renderHome();
            return;
        }

        if (nextScreen === 'setup') {
            this.currentScreen = 'setup';
            this.view.showHomeScreen();
            this.renderHome();
            if (!this.isOpeningFilePicker) {
                this.view.showDifficultyModal();
            }
            return;
        }

        this.currentScreen = 'game';
        this.view.showExistingGameScreen();
        this.view.updateTurnIndicator(this.model.getState().currentPlayer);
    }

    handleCardClick(index) {
        const result = this.model.flipCard(index);
        if (!result) return;

        audioManager.playFlip();

        if (result.type === 'flip' || result.type === 'check') {
            this.view.flipCard(index);
        }

        if (result.type === 'check') {
            this.model.setProcessing(true);

            if (result.isMatch) {
                this.view.updateStats(this.model.getState().scores);
                setTimeout(() => audioManager.playMatch(), 400);
            } else {
                setTimeout(() => audioManager.playMismatch(), 400);
            }

            setTimeout(() => {
                if (result.isMatch) {
                    this.view.setMatchedCards(result.index1, result.index2, result.matchedBy);

                    if (result.isCleared) {
                        setTimeout(() => {
                            this.view.showClearModal(this.model.getState().scores, this.currentLanguage);
                        }, 500);
                    }
                } else {
                    this.model.unflipCards(result.index1, result.index2);
                    this.view.unflipCards(result.index1, result.index2);
                    this.view.updateTurnIndicator(this.model.getState().currentPlayer);
                }

                this.model.setProcessing(false);
            }, 800);
        }
    }
}
