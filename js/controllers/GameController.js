import { audioManager } from '../utils/AudioManager.js';

export class GameController {
    constructor(model, view, themesData) {
        this.model = model;
        this.view = view;
        this.themesData = themesData;

        // 기본값 설정
        this.selectedThemeId = this.themesData[0].id; // 첫번째 테마 기본
        this.selectedPairs = 6; // 기본 12장 (6쌍)

        this.init();
    }

    init() {
        // 난이도 버튼 이벤트 초기화
        this.view.bindDifficultyButtons(this.handleSelectDifficulty.bind(this));

        // 게임 내비게이션 버튼 (재시작, 돌아가기)
        this.view.bindGameNav(
            this.startGame.bind(this),
            this.handleBackToHome.bind(this)
        );

        // 모달 버튼 (재시작, 돌아가기)
        this.view.bindModalNav(
            this.startGame.bind(this),
            this.handleBackToHome.bind(this)
        );

        // 커스텀 이미지 업로드
        const uploadInput = document.getElementById('custom-image-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', this.handleCustomImageUpload.bind(this));
        }

        // 첫 홈 화면 렌더링
        this.renderHome();
    }

    renderHome() {
        this.view.updateDifficultySelection(this.selectedPairs);
        this.view.renderThemes(
            this.themesData,
            this.selectedThemeId,
            this.handleSelectTheme.bind(this)
        );
    }

    handleSelectTheme(themeId) {
        this.selectedThemeId = themeId;
        // 선택 시 화면 상에서 업데이트
        this.renderHome();

        if (themeId === 'custom') {
            const uploadInput = document.getElementById('custom-image-upload');
            if (uploadInput) {
                uploadInput.click();
            }
            return;
        }

        let actualThemeId = themeId;
        if (themeId === 'random') {
            const availableThemes = this.themesData.filter(t => t.id !== 'random' && t.id !== 'custom');
            const randomPick = availableThemes[Math.floor(Math.random() * availableThemes.length)];
            actualThemeId = randomPick.id;
        }

        if (actualThemeId === 'numbers') {
            const themeNode = this.themesData.find(t => t.id === 'numbers');
            if (themeNode) {
                const numSet = new Set();
                while (numSet.size < 16) {
                    numSet.add(Math.floor(Math.random() * 100).toString());
                }
                themeNode.items = Array.from(numSet);
            }
        }

        // 선택된 테마 ID 임시 저장
        this.selectedThemeId = actualThemeId;

        // 모바일 사용성을 위해 테마 선택 시 약간의 딜레이 후 게임 시작
        // 아이들이 메뉴를 눌렀을 때 즉시 반응하도록.
        setTimeout(() => {
            this.startGame();
        }, 150);
    }

    handleCustomImageUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        this.model.setProcessing(true); // 입력 블록
        const processFiles = files.slice(0, 16); // 최대 16장
        const imagePromises = processFiles.map(file => this.processImageFile(file));

        Promise.all(imagePromises).then(dataUrls => {
            const customTheme = this.themesData.find(t => t.id === 'custom');
            if (customTheme) {
                // 이미지가 적으면 복제해서 쌍의 수를 맞춤
                let items = dataUrls.map(url => `<div class="custom-image-container" style="width:100%; height:100%;"><img src="${url}" class="custom-image" alt="custom"></div>`);
                while (items.length < this.selectedPairs) {
                    items = items.concat(items);
                }
                customTheme.items = items;
                this.startGame();
            }
            this.model.setProcessing(false);
        }).catch(err => {
            console.error(err);
            alert('이미지 처리 중 오류가 발생했습니다.');
            this.model.setProcessing(false);
        });
        
        event.target.value = ''; // 같은 파일 다시 선택 가능하도록 리셋
    }

    processImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
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
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    handleSelectDifficulty(pairsData) {
        this.selectedPairs = pairsData;
        this.view.updateDifficultySelection(this.selectedPairs);
    }

    startGame() {
        this.view.hideModal();

        // 선택된 테마 객체 찾기
        const theme = this.themesData.find(t => t.id === this.selectedThemeId);
        if (!theme) return;

        // Model 초기화
        this.model.init(theme.items, this.selectedPairs);

        // View 게임 보드 준비
        this.view.renderGameScreen(this.selectedPairs, theme.cssClass);

        // 카드 렌더링
        this.view.renderBoard(
            this.model.cards,
            this.handleCardClick.bind(this)
        );

        // 카운트다운 및 미리보기 진행 중 입력 블록
        this.model.setProcessing(true);
        this.view.showCountdown(() => {
            // 카운트다운 후 0.2초간 전체 확인
            this.view.peekAllCards(200, () => {
                this.model.setProcessing(false); // 게임 시작!
            });
        });
    }

    handleBackToHome() {
        this.view.showHomeScreen();
    }

    handleCardClick(index) {
        // 모델에서 카드 상태 변경 시도
        const result = this.model.flipCard(index);

        // 뒤집을 수 없는 상태면 아무것도 안 함
        if (!result) return;

        audioManager.playFlip();

        // 1. 첫 번째 카드거나 두 번째 카드일 때 일단 화면을 뒤집음
        if (result.type === 'flip' || result.type === 'check') {
            this.view.flipCard(index);
        }

        // 2. 짝 검사 결과가 있는 경우
        if (result.type === 'check') {
            this.model.setProcessing(true); // 입력 블록
            
            // 맞췄을 경우 점수 즉시 반영
            if (result.isMatch) {
                this.view.updateStats(this.model.getState().scores);
                setTimeout(() => audioManager.playMatch(), 400); // 카드 뒤집힌 직후 성공음
            } else {
                setTimeout(() => audioManager.playMismatch(), 400); // 카드 뒤집힌 직후 실패음
            }

            setTimeout(() => {
                if (result.isMatch) {
                    // 매치 성공
                    this.view.setMatchedCards(result.index1, result.index2, result.matchedBy);

                    // 게임 클리어 체크
                    if (result.isCleared) {
                        setTimeout(() => {
                            this.view.showClearModal(this.model.getState().scores);
                        }, 500);
                    }
                } else {
                    // 매치 실패
                    this.model.unflipCards(result.index1, result.index2);
                    this.view.unflipCards(result.index1, result.index2);
                    // 턴 변경 시각적 업데이트
                    this.view.updateTurnIndicator(this.model.getState().currentPlayer);
                }

                this.model.setProcessing(false); // 입력 블록 해제
            }, 800); // 0.8초 후 틀림/맞음 표시 (아이들이 그림을 인지할 시간 확보)
        }
    }
}
