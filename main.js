import { Game } from "./game.js";

const canvas = document.getElementById("game-canvas");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const ballSpeedInput = document.getElementById("ball-speed");
const ballSpeedValue = document.getElementById("ball-speed-value");
const modeInputs = document.querySelectorAll('input[name="mode"]');
const themeSelectStart = document.getElementById("theme-select-start");
const themeSelectInGame = document.getElementById("theme-select-ingame");
const gameTopBar = document.getElementById("game-top-bar");
const playerNamesRow = document.getElementById("player-names-row");
const playerLeftNameInput = document.getElementById("player-left-name");
const playerRightNameInput = document.getElementById("player-right-name");

const controlsBar = document.getElementById("controls-bar");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");

const highscoreScreen = document.getElementById("highscore-screen");
const highscoreList = document.getElementById("highscore-list");
const highscoreContinueButton = document.getElementById(
"highscore-continue-button"
);

let game = null;
let highScores = []; // { name, score }

const getSelectedMode = () => {
const selected = Array.from(modeInputs).find((input) => input.checked);
return selected ? selected.value : "single";
};

const getSelectedTheme = () => {
if (game && themeSelectInGame) return themeSelectInGame.value;
if (themeSelectStart) return themeSelectStart.value;
return "dark";
};

const applyThemeToBody = () => {
const theme = getSelectedTheme();
document.body.dataset.theme = theme;
};

const updateNameRowVisibility = () => {
if (!playerNamesRow) return;
const mode = getSelectedMode();
playerNamesRow.style.display = mode === "double" ? "flex" : "none";
};

modeInputs.forEach((input) => {
input.addEventListener("change", updateNameRowVisibility);
});

if (themeSelectStart) {
themeSelectStart.addEventListener("change", () => applyThemeToBody());
}
if (themeSelectInGame) {
themeSelectInGame.addEventListener("change", () => {
applyThemeToBody();
if (game) game.setTheme(themeSelectInGame.value);
});
}

// Initial UI state
updateNameRowVisibility();
applyThemeToBody();

// Keep the "1.0×" label in sync with the slider
if (ballSpeedInput && ballSpeedValue) {
const updateLabel = () => {
const value = Number(ballSpeedInput.value) || 1;
ballSpeedValue.textContent = value.toFixed(1) + "×";
};
ballSpeedInput.addEventListener("input", updateLabel);
updateLabel();
}

const setControlsState = (state) => {
if (!playButton || !pauseButton || !stopButton) return;

if (state === "playing") {
playButton.disabled = true;
pauseButton.disabled = false;
stopButton.disabled = false;
} else if (state === "paused") {
playButton.disabled = false;
pauseButton.disabled = true;
stopButton.disabled = false;
} else {
// "stopped" or initial
playButton.disabled = true;
pauseButton.disabled = true;
stopButton.disabled = true;
}
};

// Only the winner (higher score) is eligible for high scores
const updateHighScores = (result) => {
const left = result.left || { name: "Left", score: 0 };
const right = result.right || { name: "Right", score: 0 };

let winner = null;

if (left.score > right.score && left.score > 0) {
winner = left;
} else if (right.score > left.score && right.score > 0) {
winner = right;
} else {
// tie or no points -> no high score
return new Set();
}

const entry = { name: winner.name, score: winner.score };
highScores.push(entry);

// Sort & keep top 5
highScores.sort((a, b) => b.score - a.score);
if (highScores.length > 5) {
highScores = highScores.slice(0, 5);
}

const highlights = new Set();
if (highScores.includes(entry)) {
highlights.add(entry);
}

return highlights;
};

const showHighscoreScreen = (result) => {
const highlights = updateHighScores(result);

highscoreList.innerHTML = "";
highScores.forEach((entry) => {
const li = document.createElement("li");
li.textContent = `${entry.name}: ${entry.score}`;
if (highlights.has(entry)) {
li.classList.add("highlight");
}
highscoreList.appendChild(li);
});

if (gameTopBar) gameTopBar.classList.add("hidden");
highscoreScreen.classList.remove("hidden");
};

const backToStartScreen = () => {
highscoreScreen.classList.add("hidden");
startScreen.classList.remove("hidden");
if (gameTopBar) gameTopBar.classList.add("hidden");
controlsBar.classList.add("hidden");
setControlsState("stopped");
game = null;
};

startButton.addEventListener("click", () => {
applyThemeToBody();

const theme = themeSelectStart ? themeSelectStart.value : "dark";
if (themeSelectInGame) themeSelectInGame.value = theme;

const mode = getSelectedMode();

let leftName = "Left";
let rightName = "Right";

if (mode === "double") {
leftName =
(playerLeftNameInput && playerLeftNameInput.value.trim()) || "Player 1";
rightName =
(playerRightNameInput && playerRightNameInput.value.trim()) ||
"Player 2";
}

const multiplier = ballSpeedInput ? Number(ballSpeedInput.value) || 1 : 1;

game = new Game(canvas, theme);
game.setTheme(theme);
game.setModeAndNames(mode, leftName, rightName);
game.setBallSpeedMultiplier(multiplier);

startScreen.classList.add("hidden");
if (gameTopBar) gameTopBar.classList.remove("hidden");
controlsBar.classList.remove("hidden");
setControlsState("playing");
game.start();
});

playButton.addEventListener("click", () => {
if (!game) return;
game.resume();
setControlsState("playing");
});

pauseButton.addEventListener("click", () => {
if (!game) return;
game.pause();
setControlsState("paused");
});

stopButton.addEventListener("click", () => {
if (!game) return;
const result = game.stop();
setControlsState("stopped");
showHighscoreScreen(result);
});

highscoreContinueButton.addEventListener("click", () => {
backToStartScreen();
});