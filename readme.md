# Pong

A browser Pong game built with vanilla JavaScript and the HTML canvas. I made it for a quick holiday vibe-coding workshop at Meta.

**Play it:** https://pong-tau.vercel.app

## Controls

| Player | Up | Down |
| ------ | ----- | ------ |
| Left   | `W`   | `S`    |
| Right  | `↑`   | `↓`    |

Both paddles are controlled by people. Single mode doesn't include a computer opponent.

## Features

- **Single and double modes.** Double mode lets you name both players.
- **Six color themes** (Coral, Twilight, Dawn, Dark, Light, Rainbow), switchable at the start screen or mid-game.
- **Ball speed slider** from 0.5x to 2x. The ball also speeds up 10% with every point scored.
- **Play, pause, and stop** controls.
- **High scores.** The top five winning scores are shown after each game. They're kept in memory only, so they reset when you reload the page.

## Run it locally

There's no build step, but the code uses ES modules, so it has to be served over HTTP. Opening `index.html` directly from disk won't work.

```bash
# from the project folder, either of these works
python3 -m http.server 8000
npx serve .
```

Then open the address it prints (for example, `http://localhost:8000`).

## Project layout

```
index.html        # start screen, controls, and high-score screen
styles.css        # layout and theme styles
js/
  main.js         # UI wiring: start screen, controls, high scores
  game.js         # game loop, scoring, speed scaling, rendering
  ball.js         # ball movement and collisions
  paddle.js       # paddle movement
  input.js        # keyboard input
  config.js       # sizes, speeds, and theme colors
```

## Tech

HTML, CSS, JavaScript (ES modules), and the Canvas API. Deployed on Vercel.
