const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Инициализация переменных
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

const paddleHeight = 15;
let paddleWidth = 120; // Изменение ширины платформы
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
let score = 0;
let level = 1;
let speedMultiplier = 1;
let extraBalls = 1;
const scoreDisplay = document.getElementById("scoreValue");
const levelDisplay = document.getElementById("levelValue");

// Создание массива кирпичей
function initBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

initBricks();

// Обработчики событий для клавиш
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Функции отрисовки элементов игры
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#1B5E20";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#1B5E20";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#1B5E20";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Обнаружение коллизий
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    scoreDisplay.textContent = score;
                    if (score === 30) {
                        document.getElementById("speedButton").disabled = false;
                    }
                    if (score === 50) {
                        document.getElementById("extraBallButton").disabled = false;
                    }
                    if (score === 80) {
                        level++;
                        levelDisplay.textContent = level;
                        speedMultiplier++;
                        extraBalls++;
                        initBricks();
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = level * 3 * speedMultiplier;
                        dy = -level * 3 * speedMultiplier;
                        paddleWidth -= 10;
                        if (paddleWidth < 60) {
                            paddleWidth = 60;
                        }
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }
        }
    }
}

// Основная функция отрисовки и логики игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            // Конец игры
            alert("Game Over");
            document.location.reload();
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function startGame() {
    document.getElementById("startButton").style.display = "none";
    draw();
}

function restartGame() {
    document.location.reload();
}

function buySpeed() {
    if (score >= 30) {
        score -= 30;
        scoreDisplay.textContent = score;
        speedMultiplier++;
        dx = level * 3 * speedMultiplier;
        dy = -level * 3 * speedMultiplier;
        document.getElementById("speedButton").disabled = true;
    } else {
        alert("Not enough points to buy speed upgrade.");
    }
}

function buyExtraBall() {
    if (score >= 50) {
        score -= 50;
        scoreDisplay.textContent = score;
        extraBalls++;
        document.getElementById("extraBallButton").disabled = true;
    } else {
        alert("Not enough points to buy extra ball.");
    }
}
