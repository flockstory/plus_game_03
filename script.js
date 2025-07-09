// 게임 상태 관리
const gameState = {
    score: 0,
    timer: null,
    currentAnswer: 0,
    isPlaying: false
};

// DOM 요소
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen'),
    coupon: document.getElementById('couponScreen')
};

const elements = {
    score: document.getElementById('score'),
    timerProgress: document.getElementById('timerProgress'),
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    answerInput: document.getElementById('answerInput'),
    resultMessage: document.getElementById('resultMessage'),
    couponCanvas: document.getElementById('couponCanvas')
};

const sounds = {
    success: document.getElementById('successSound'),
    fail: document.getElementById('failSound'),
    coupon: document.getElementById('couponSound')
};

// 이벤트 리스너 설정
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('submitButton').addEventListener('click', checkAnswer);
document.getElementById('retryButton').addEventListener('click', startGame);
document.getElementById('homeButton').addEventListener('click', showStartScreen);
document.getElementById('couponHomeButton').addEventListener('click', showStartScreen);
document.getElementById('saveCouponButton').addEventListener('click', saveCoupon);

// 게임 시작
function startGame() {
    resetGame();
    showScreen('game');
    generateProblem();
    startTimer();
    elements.answerInput.focus();
}

// 게임 초기화
function resetGame() {
    gameState.score = 0;
    gameState.isPlaying = true;
    elements.score.textContent = gameState.score;
    elements.answerInput.value = '';
}

// 문제 생성
function generateProblem() {
    const num1 = Math.floor(Math.random() * 41) + 10; // 10-50
    const num2 = Math.floor(Math.random() * 41) + 10; // 10-50
    
    elements.num1.textContent = num1;
    elements.num2.textContent = num2;
    gameState.currentAnswer = num1 + num2;
}

// 타이머 시작
function startTimer() {
    elements.timerProgress.style.width = '100%';
    // Reset transition
    elements.timerProgress.style.transition = 'none';
    elements.timerProgress.offsetHeight; // Force reflow
    elements.timerProgress.style.transition = 'width 5s linear';
    elements.timerProgress.style.width = '0%';

    gameState.timer = setTimeout(() => {
        if (gameState.isPlaying) {
            handleWrongAnswer();
        }
    }, 5000);
}

// 답 체크
function checkAnswer() {
    const userAnswer = parseInt(elements.answerInput.value);
    
    if (userAnswer === gameState.currentAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

// 정답 처리
function handleCorrectAnswer() {
    clearTimeout(gameState.timer);
    gameState.score++;
    elements.score.textContent = gameState.score;
    sounds.success.play();

    if (gameState.score === 3) {
        showCouponScreen();
    } else {
        elements.answerInput.value = '';
        generateProblem();
        startTimer();
    }
}

// 오답 처리
function handleWrongAnswer() {
    clearTimeout(gameState.timer);
    gameState.isPlaying = false;
    sounds.fail.play();
    
    // 실패 이미지 애니메이션
    const failImg = new Image();
    failImg.src = 'assets/images/ggg.png';
    failImg.style.position = 'absolute';
    failImg.style.left = '-100px';
    failImg.style.top = '50%';
    failImg.style.transform = 'translateY(-50%)';
    failImg.style.transition = 'left 4s linear';
    
    screens.game.appendChild(failImg);
    setTimeout(() => failImg.style.left = '100%', 100);
    
    elements.resultMessage.textContent = '틀렸습니다! 다시 도전해보세요!';
    setTimeout(() => {
        failImg.remove();
        showScreen('result');
    }, 4000);
}

// 쿠폰 화면 표시
function showCouponScreen() {
    sounds.coupon.play();
    showScreen('coupon');
    drawCoupon();
}

// 쿠폰 그리기
function drawCoupon() {
    const canvas = elements.couponCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // 배경
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // 테두리
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // 텍스트
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 24px Black Han Sans';
    ctx.textAlign = 'center';
    ctx.fillText('🥤 음료수 1잔 무료 쿠폰', width / 2, height / 2);

    // 발급 날짜
    const date = new Date().toLocaleDateString();
    ctx.font = '16px Black Han Sans';
    ctx.fillText(`발급일: ${date}`, width / 2, height - 30);
}

// 쿠폰 저장
function saveCoupon() {
    const link = document.createElement('a');
    link.download = '음료수쿠폰.png';
    link.href = elements.couponCanvas.toDataURL();
    link.click();
}

// 화면 전환
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// 시작 화면으로
function showStartScreen() {
    showScreen('start');
}

// 엔터 키로 답 제출
elements.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
}); 