// Basic Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let playerX = canvas.width / 2;
let playerY = canvas.height - 50;
let playerRadius = 15;
let playerSpeed = 7;
let score = 0;
let obstacles = [];
let gameOver = false;
let obstacleSpeed = 3;
let difficultyIncreaseInterval = 1000; // Increase difficulty every 1 second
let lastDifficultyIncrease = 0;

// Key press events
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
    if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
    if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
});

// Player Drawing
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6347'; // Tomato color
    ctx.fill();
    ctx.closePath();
}

// Obstacle Creation
function createObstacle() {
    let size = Math.random() * (30 - 10) + 10; // Random size
    let x = Math.random() * (canvas.width - size); // Random x position
    obstacles.push({
        x: x,
        y: -size, // Start above the screen
        size: size,
        speed: obstacleSpeed
    });
}

// Draw Obstacles
function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        ctx.beginPath();
        ctx.rect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        ctx.fillStyle = '#32cd32'; // Lime color
        ctx.fill();
        ctx.closePath();

        // Move obstacles down
        obstacle.y += obstacle.speed;

        // Remove obstacles that are off-screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
        }

        // Collision detection with player
        if (obstacle.y + obstacle.size > playerY - playerRadius && 
            obstacle.x < playerX + playerRadius &&
            obstacle.x + obstacle.size > playerX - playerRadius) {
            gameOver = true;
        }
    });
}

// Update Game Difficulty
function increaseDifficulty() {
    if (Date.now() - lastDifficultyIncrease > difficultyIncreaseInterval) {
        lastDifficultyIncrease = Date.now();
        obstacleSpeed += 0.1; // Increase obstacle speed
        difficultyIncreaseInterval -= 50; // Increase difficulty faster
    }
}

// Game Loop
function gameLoop() {
    if (gameOver) {
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER!", canvas.width / 2 - 150, canvas.height / 2);
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 130, canvas.height / 2 + 60);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Player movement logic
    if (leftPressed && playerX - playerRadius > 0) {
        playerX -= playerSpeed;
    }
    if (rightPressed && playerX + playerRadius < canvas.width) {
        playerX += playerSpeed;
    }

    // Draw everything
    drawPlayer();
    drawObstacles();
    increaseDifficulty();

    // Create obstacles periodically
    if (Math.random() < 0.02) {
        createObstacle();
    }

    // Update score
    document.getElementById('score').textContent = `Score: ${score}`;

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Start the Game
gameLoop();
