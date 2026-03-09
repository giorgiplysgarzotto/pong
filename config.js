export const BASE_WIDTH = 1280;
export const BASE_HEIGHT = 720;

export const PADDLE_WIDTH = 12;
export const PADDLE_HEIGHT = 90;
export const PADDLE_SPEED = 400; // pixels per second

export const BALL_RADIUS = 8;
export const BALL_SPEED = 360;

export const THEMES = {
dark: {
background: "#050814",
centerLine: "#1f2b5d",
leftPaddle: "#ff4136", // red
rightPaddle: "#0074d9", // blue
ball: "#ffffff"
},
light: {
background: "#fdfdfd",
centerLine: "#c7c7d5",
leftPaddle: "#ff4136",
rightPaddle: "#0074d9",
ball: "#111111"
}
};

export function getThemeColors(themeName) {
return THEMES[themeName] || THEMES.dark;
}