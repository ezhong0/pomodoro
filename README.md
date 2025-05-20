# Pomodoro Timer App

A modern, themeable Pomodoro timer built with React and Vite.

## Features

- **Beautiful, Calm UI**: Minimal, cute, and distraction-free design.
- **Dark & Light Modes**: Toggle between dark and light themes for comfort.
- **Multiple Color Themes**: Choose from Classic, Forest, Ocean, Sunset, Minimal, and Purple themes.
- **Editable Timer**: Click the timer to type a custom duration (like Google timer input).
- **Auto Start Toggle**: Optionally auto-start the next session or break.
- **Volume Control**: Minimalist volume button with a popover slider, theme-colored fill.
- **Settings Panel**: Adjust focus/break durations, long break interval, and more.
- **Reset Pomodoros**: Reset your total pomodoro count from the settings panel.
- **Persistent Settings**: All preferences are saved in your browser.
- **Cute Sounds**: Gentle chimes for session transitions.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Customization

- **Themes:**
  - Edit `src/themes.js` to add or modify color themes.
- **Sounds:**
  - Change sound URLs in `src/App.jsx` under the `cuteSounds` object.
- **Timer Defaults:**
  - Adjust default durations in `src/App.jsx` (see useState hooks for work/break times).

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) (for smooth animations)

---

Enjoy a focused, delightful Pomodoro experience! 🍅
