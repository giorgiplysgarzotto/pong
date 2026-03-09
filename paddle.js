import { PADDLE_SPEED } from "./config.js";

export class Paddle {
constructor(x, y, width, height, color) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.color = color;
}

update(dt, input, upCode, downCode, boundsHeight) {
let dir = 0;
if (input.isPressed(upCode)) dir -= 1;
if (input.isPressed(downCode)) dir += 1;

this.y += dir * PADDLE_SPEED * dt;

// Clamp to canvas bounds
const halfHeight = this.height / 2;
if (this.y - halfHeight < 0) this.y = halfHeight;
if (this.y + halfHeight > boundsHeight)
this.y = boundsHeight - halfHeight;
}

draw(ctx) {
ctx.fillStyle = this.color;
ctx.fillRect(
this.x,
this.y - this.height / 2,
this.width,
this.height
);
}
}
