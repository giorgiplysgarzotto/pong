import { BALL_RADIUS, BALL_SPEED } from "./config.js";

export class Ball {
constructor(x, y, color) {
this.x = x;
this.y = y;
this.radius = BALL_RADIUS;
this.color = color;
this.vx = 0;
this.vy = 0;
this.speedMultiplier = 1;
}

setColor(color) {
this.color = color;
}

setSpeedMultiplier(multiplier) {
this.speedMultiplier = multiplier;

const currentSpeed = Math.hypot(this.vx, this.vy);
const targetSpeed = BALL_SPEED * this.speedMultiplier;

if (currentSpeed > 0) {
const scale = targetSpeed / currentSpeed;
this.vx *= scale;
this.vy *= scale;
}
}

serve(direction = 1) {
const angle = (Math.random() * 0.6 - 0.3) * Math.PI; // small up/down variation
const speed = BALL_SPEED * this.speedMultiplier;
this.vx = Math.cos(angle) * speed * direction;
this.vy = Math.sin(angle) * speed;
}

reset(x, y, direction = 1) {
this.x = x;
this.y = y;
this.serve(direction);
}

update(dt, width, height, paddles) {
this.x += this.vx * dt;
this.y += this.vy * dt;

// Collide with top/bottom
if (this.y - this.radius < 0) {
this.y = this.radius;
this.vy *= -1;
} else if (this.y + this.radius > height) {
this.y = height - this.radius;
this.vy *= -1;
}

// Collide with paddles
for (const paddle of paddles) {
if (this._collidesWithPaddle(paddle)) {
// Move ball out of paddle to avoid sticking
if (this.x < paddle.x + paddle.width / 2) {
this.x = paddle.x - paddle.width / 2 - this.radius;
} else {
this.x = paddle.x + paddle.width / 2 + this.radius;
}

this.vx *= -1;

// Add a bit of "spin" based on hit position
const offset = (this.y - paddle.y) / (paddle.height / 2);
this.vy += offset * 80;

break;
}
}
}

_collidesWithPaddle(paddle) {
const paddleLeft = paddle.x;
const paddleRight = paddle.x + paddle.width;
const paddleTop = paddle.y - paddle.height / 2;
const paddleBottom = paddle.y + paddle.height / 2;

const closestX = Math.max(paddleLeft, Math.min(this.x, paddleRight));
const closestY = Math.max(paddleTop, Math.min(this.y, paddleBottom));

const dx = this.x - closestX;
const dy = this.y - closestY;

return dx * dx + dy * dy <= this.radius * this.radius;
}

draw(ctx) {
ctx.fillStyle = this.color;
ctx.beginPath();
ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
ctx.fill();
}
}