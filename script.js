
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WINDOW_WIDTH = 1000;
const WINDOW_HEIGHT = 800;
const COIN_SIZE = 100;
const MAX_COINS = 1500;
const AUTO_FILL_TIME = 3000; 
const SHRINK_TIME = 200; 

canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;


const coinImage = new Image();
coinImage.src = 'kyat.png';
const boomCoinImage = new Image();
boomCoinImage.src = 'boom.png';
const bonusCoinImage = new Image();
bonusCoinImage.src = 'bonus_coin.png';


let coinCount = MAX_COINS;
let score = 0;
let lastAutoFillTime = Date.now();
let shrinkEndTime = 0;
let isShrunk = false;
let boomCoinPos = null;
let bonusCoinPos = null;
let lastBoomCoinTime = Date.now();
let lastBonusCoinTime = Date.now();
const BOOM_COIN_INTERVAL = 1000;
const BONUS_COIN_INTERVAL = 20000;


canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

   
    const coinRect = { x: WINDOW_WIDTH / 2 - COIN_SIZE / 2, y: WINDOW_HEIGHT / 2 - COIN_SIZE / 2, width: COIN_SIZE, height: COIN_SIZE };
    if (mouseX > coinRect.x && mouseX < coinRect.x + coinRect.width && mouseY > coinRect.y && mouseY < coinRect.y + coinRect.height && coinCount > 0) {
        coinCount -= 1;
        score += 1;
        isShrunk = true;
        shrinkEndTime = Date.now() + SHRINK_TIME;
    }

   
    if (boomCoinPos) {
        const boomCoinRect = { x: boomCoinPos.x, y: boomCoinPos.y, width: 50, height: 50 };
        if (mouseX > boomCoinRect.x && mouseX < boomCoinRect.x + boomCoinRect.width && mouseY > boomCoinRect.y && mouseY < boomCoinRect.y + boomCoinRect.height) {
            score = Math.max(0, score - 100);
            boomCoinPos = null;
        }
    }


    if (bonusCoinPos) {
        const bonusCoinRect = { x: bonusCoinPos.x, y: bonusCoinPos.y, width: 40, height: 40 };
        if (mouseX > bonusCoinRect.x && mouseX < bonusCoinRect.x + bonusCoinRect.width && mouseY > bonusCoinRect.y && mouseY < bonusCoinRect.y + bonusCoinRect.height) {
            score += 100;
            bonusCoinPos = null;
        }
    }
});


function gameLoop() {
    const currentTime = Date.now();

    
    if (isShrunk && currentTime >= shrinkEndTime) {
        isShrunk = false;
    }

    
    if (currentTime - lastAutoFillTime >= AUTO_FILL_TIME && coinCount < MAX_COINS) {
        coinCount += 1;
        lastAutoFillTime = currentTime;
    }

    
    if (currentTime - lastBoomCoinTime >= BOOM_COIN_INTERVAL) {
        boomCoinPos = { x: Math.random() * (WINDOW_WIDTH - 50), y: Math.random() * (WINDOW_HEIGHT - 50) };
        lastBoomCoinTime = currentTime;
    }

    
    if (currentTime - lastBonusCoinTime >= BONUS_COIN_INTERVAL) {
        bonusCoinPos = { x: Math.random() * (WINDOW_WIDTH - 40), y: Math.random() * (WINDOW_HEIGHT - 40) };
        lastBonusCoinTime = currentTime;
    }

    
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    
    ctx.drawImage(coinImage, WINDOW_WIDTH / 2 - (isShrunk ? 80 : COIN_SIZE) / 2, WINDOW_HEIGHT / 2 - (isShrunk ? 80 : COIN_SIZE) / 2, isShrunk ? 80 : COIN_SIZE, isShrunk ? 80 : COIN_SIZE);


    if (boomCoinPos) {
        ctx.drawImage(boomCoinImage, boomCoinPos.x, boomCoinPos.y, 50, 50);
    }

    if (bonusCoinPos) {
        ctx.drawImage(bonusCoinImage, bonusCoinPos.x, bonusCoinPos.y, 40, 40);
    }


    ctx.fillStyle = 'gold';
    ctx.font = '36px Arial';
    ctx.fillText(`Coins: ${coinCount}`, 10, 40);
    ctx.fillText(`Score: ${score}`, 10, 80);


    requestAnimationFrame(gameLoop);
}


gameLoop();
