const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gooseImg = new Image();
gooseImg.src = "goose_rocket.png";

let starImg = new Image();
starImg.src = "star.png"; // Add a floating star graphic for visual flair

let goose = { x: 50, y: 150, width: 60, height: 60, velocity: 0 };
let gravity = 0.5, lift = -8;
let pipes = [];
let stars = [];
let score = 0, gameOver = false;

function drawGoose() {
    ctx.drawImage(gooseImg, goose.x, goose.y, goose.width, goose.height);
}

function drawPipes() {
    ctx.fillStyle = "lime";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let top = Math.random() * 200 + 50;
        let gap = 200;
        let bottom = canvas.height - top - gap;
        pipes.push({ x: canvas.width, width: 50, top: top, bottom: bottom });
    }
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function updateStars() {
    if (Math.random() < 0.02) {
        stars.push({ x: canvas.width, y: Math.random() * canvas.height, size: Math.random() * 20 + 10 });
    }
    stars.forEach(star => {
        star.x -= 1;
    });
    stars = stars.filter(star => star.x + star.size > 0);
}

function drawStars() {
    stars.forEach(star => {
        ctx.drawImage(starImg, star.x, star.y, star.size, star.size);
    });
}

function checkCollision() {
    for (let pipe of pipes) {
        if (goose.x < pipe.x + pipe.width &&
            goose.x + goose.width > pipe.x &&
            (goose.y < pipe.top || goose.y + goose.height > canvas.height - pipe.bottom)) {
            return true;
        }
    }
    return goose.y + goose.height > canvas.height;
}

function updateScore() {
    pipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + pipe.width < goose.x) {
            pipe.passed = true;
            score++;
            document.getElementById("score").innerText = "Score: " + score;
        }
    });
}

function draw() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    goose.velocity += gravity;
    goose.y += goose.velocity;
    updatePipes();
    updateStars();
    drawStars();
    drawGoose();
    drawPipes();
    updateScore();
    if (checkCollision()) {
        document.getElementById("message").style.display = "block";
        gameOver = true;
        return;
    }
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", () => {
    goose.velocity = lift;
});
document.addEventListener("mousedown", () => {
    goose.velocity = lift;
});

gooseImg.onload = () => {
    draw();
};
