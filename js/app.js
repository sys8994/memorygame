import { themes } from './data/themes.js';
import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';

// DOMContentLoaded 이벤트를 통해 HTML 구조 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // MVC 인스턴스화
    const model = new GameModel();
    const view = new GameView();

    // 컨트롤러에 의존성 주입하여 초기화
    const controller = new GameController(model, view, themes);
});
