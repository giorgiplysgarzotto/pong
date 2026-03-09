import {
BASE_WIDTH,
BASE_HEIGHT,
PADDLE_WIDTH,
PADDLE_HEIGHT,
getThemeColors
} from "./config.js";
import { InputManager } from "./input.js";
import { Paddle } from "./paddle.js";
import { Ball } from "./ball.js";

const SPEED_STEP_PER_POINT = 0.1; // +10% speed per point

export class Game {
constructor(canvas, themeName = "dark") {
this.canvas = canvas;
this.ctx = canvas.getContext("2d");

this.canvas.width = BASE_WIDTH;
this.canvas.height = BASE_HEIGHT;

this.input = new InputManager();

this.themeName = themeName;
this.colors = getThemeColors(this.themeName);

const centerY = BASE_HEIGHT / 2;

this.leftPaddle = new Paddle(
30,
centerY,
PADDLE_WIDTH,
PADDLE_HEIGHT,
this.colors.leftPaddle
);

this.rightPaddle = new Paddle(
BASE_WIDTH - 30 - PADDLE_WIDTH,
centerY,
PADDLE_WIDTH,
PADDLE_HEIGHT,
this.colors.rightPaddle
);

this.ball = new Ball(BASE_WIDTH / 2, centerY, this.colors.ball);

// Mode & players
this.mode = "single";
this.leftName = "Left";
this.rightName = "Right";

// Scoring
this.scoreLeft = 0;
this.scoreRight = 0;

// Speed scaling
this.baseBallSpeedMultiplier = 1; // from slider
this.ballSpeedMultiplier = this.baseBallSpeedMultiplier;
this.ball.setSpeedMultiplier(this.ballSpeedMultiplier);

this.running = false;
this.paused = false;
this.lastTime = 0;
this.nextServeDirection = 1; // first serve goes left -> right
}

setTheme(themeName) {
this.themeName = themeName;
this.colors = getThemeColors(this.themeName);

// Update colors of paddles and ball
this.leftPaddle.color = this.colors.leftPaddle;
this.rightPaddle.color = this.colors.rightPaddle;
this.ball.setColor(this.colors.ball);
}

setModeAndNames(mode, leftName, rightName) {
this.mode = mode === "double" ? "double" : "single";

if (this.mode === "single") {
this.leftName = "Left";
this.rightName = "Right";
} else {
this.leftName = leftName || "Player 1";
this.rightName = rightName || "Player 2";
}
}

// Called from UI: this is the "base" speed multiplier the user picked
setBallSpeedMultiplier(multiplier) {
this.baseBallSpeedMultiplier = multiplier;
this._recalculateBallSpeedMultiplier();
}

_recalculateBallSpeedMultiplier() {
const totalScore = this.scoreLeft + this.scoreRight;
const bonusFactor = 1 + SPEED_STEP_PER_POINT * totalScore;
this.ballSpeedMultiplier = this.baseBallSpeedMultiplier * bonusFactor;
this.ball.setSpeedMultiplier(this.ballSpeedMultiplier);
}

start() {
this.scoreLeft = 0;
this.scoreRight = 0;
this._recalculateBallSpeedMultiplier();
this.reset();
this.running = true;
this.paused = false;
this.lastTime = performance.now();
requestAnimationFrame(this._loop.bind(this));
}

pause() {
if (!this.running) return;
this.paused = true;
}

resume() {
if (!this.running) return;
this.paused = false;
this.lastTime = performance.now();
}

stop() {
const summary = {
left: { name: this.leftName, score: this.scoreLeft },
right: { name: this.rightName, score: this.scoreRight }
};
this.running = false;
this.paused = false;
return summary;
}

reset() {
const centerY = BASE_HEIGHT / 2;
this.leftPaddle.y = centerY;
this.rightPaddle.y = centerY;
this.ball.reset(BASE_WIDTH / 2, centerY, this.nextServeDirection);
}

_loop(timestamp) {
if (!this.running) return;

const dt = (timestamp - this.lastTime) / 1000;
this.lastTime = timestamp;

if (!this.paused) {
this.update(dt);
}

this.render();

if (this.running) {
requestAnimationFrame(this._loop.bind(this));
}
}

update(dt) {
// Left paddle: W/S
this.leftPaddle.update(dt, this.input, "KeyW", "KeyS", BASE_HEIGHT);

// Right paddle: arrow keys
this.rightPaddle.update(
dt,
this.input,
"ArrowUp",
"ArrowDown",
BASE_HEIGHT
);

this.ball.update(dt, BASE_WIDTH, BASE_HEIGHT, [
this.leftPaddle,
this.rightPaddle
]);

// Out-of-bounds: score + speed increase + re-serve
if (this.ball.x + this.ball.radius < 0) {
// Left missed -> right scores
this.scoreRight += 1;
this.nextServeDirection = 1; // serve left-to-right
this._recalculateBallSpeedMultiplier();
this.reset();
} else if (this.ball.x - this.ball.radius > BASE_WIDTH) {
// Right missed -> left scores
this.scoreLeft += 1;
this.nextServeDirection = -1; // serve right-to-left
this._recalculateBallSpeedMultiplier();
this.reset();
}
}

render() {
const ctx = this.ctx;

// Clear background
ctx.fillStyle = this.colors.background;
ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

// Center dashed line
ctx.strokeStyle = this.colors.centerLine;
ctx.setLineDash([8, 16]);
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(BASE_WIDTH / 2, 0);
ctx.lineTo(BASE_WIDTH / 2, BASE_HEIGHT);
ctx.stroke();
ctx.setLineDash([]);

// Draw paddles and ball
this.leftPaddle.draw(ctx);
this.rightPaddle.draw(ctx);
this.ball.draw(ctx);

// Draw player names and scores
ctx.fillStyle = "#ffffff";
if (this.themeName === "light") {
ctx.fillStyle = "#111111";
}
ctx.font =
"20px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
ctx.textBaseline = "top";

// Left side
ctx.textAlign = "left";
ctx.fillText(`${this.leftName}: ${this.scoreLeft}`, 40, 20);

// Right side
ctx.textAlign = "right";
ctx.fillText(`${this.rightName}: ${this.scoreRight}`, BASE_WIDTH - 40, 20);
}
}
