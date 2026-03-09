export const BASE_WIDTH = 1280;
export const BASE_HEIGHT = 720;

export const PADDLE_WIDTH = 12;
export const PADDLE_HEIGHT = 90;
export const PADDLE_SPEED = 400; // pixels per second

export const BALL_RADIUS = 8;
export const BALL_SPEED = 360;

export const THEMES = {
  coral: {
    background: "#1a0a12",
    centerLine: "#d161a2",
    leftPaddle: "#d42c00",
    rightPaddle: "#d161a2",
    ball: "#ffffff"
  },
  twilight: {
    background: "#0a0a1a",
    centerLine: "#9B4F96",
    leftPaddle: "#D60270",
    rightPaddle: "#0038A8",
    ball: "#ffffff"
  },
  dawn: {
    background: "#0f1a22",
    centerLine: "#F5A9B8",
    leftPaddle: "#5BCEFA",
    rightPaddle: "#F5A9B8",
    ball: "#ffffff"
  },
  dark: {
    background: "#050814",
    centerLine: "#1f2b5d",
    leftPaddle: "#ff4136",
    rightPaddle: "#0074d9",
    ball: "#ffffff"
  },
  light: {
    background: "#fdfdfd",
    centerLine: "#c7c7d5",
    leftPaddle: "#ff4136",
    rightPaddle: "#0074d9",
    ball: "#111111"
  },
  rainbow: {
    background: "#0d0612",
    centerLine: "#7B2CBF",
    leftPaddle: "#E63946",
    rightPaddle: "#457B9D",
    ball: "#FFD166"
  }
};

export function getThemeColors(themeName) {
  return THEMES[themeName] || THEMES.dark;
}