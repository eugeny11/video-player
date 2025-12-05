# 🎬 HLS Video Player (React + HLS.js)

A custom-designed **HLS video player** built with **React** and **HLS.js**, featuring smooth UI animations, dynamic controls, playlist support, and fullscreen interactions.
This project demonstrates how to build a modern media player from scratch with full UI/UX polish.

👉 **Live Demo:**
[https://eugeny11.github.io/video-player/](https://eugeny11.github.io/video-player/)

---

## 🚀 Features

### 🎥 Core Playback

* HLS streaming via **HLS.js**
* Auto-play on video switch
* Smooth fade-in / fade-out transitions between videos
* Responsive layout, adaptable to desktop and mobile

### 🎚 Custom Controls

* Play / Pause
* Seek bar with custom thumb
* Volume slider + mute toggle
* Auto-hide control panel
* Spinner (preloader) during buffering
* Double-tap fullscreen for mobile
* Click-to-pause on video area

### 🖥 Fullscreen Support

* Proper handling for Chrome, Firefox, Edge, Safari
* Vendor-prefixed API fallbacks included
* Double-click (desktop) and double-tap (mobile) fullscreen toggle

### 📄 Playlist

* Video playlist with:

  * Poster thumbnails
  * Active item highlighting
  * Hover micro-animation
* Click to instantly switch tracks with fade transition

### 🎨 UI & Styling

* Custom CSS animations
* Neuomorphic-inspired control bar
* Blur + glow effects
* Dark theme
* Sleek polished design for portfolio-level presentation

---

## 🧩 Technologies Used

* **React** (Vite)
* **HLS.js**
* **SCSS Modules**
* **GitHub Pages** for deployment

---

## 📁 Project Structure

```
src/
 ├── components/
 │    └── HLSPlayer/
 │         ├── HLSPlayer.jsx
 │         ├── HLSPlayer.module.scss
 │
 ├── assets/
 │     └── poster.jpg
 │
 ├── App.jsx
 ├── main.jsx
```

---

## 🏗 How to Run Locally

```bash
git clone https://github.com/eugeny11/video-player.git
cd video-player
npm install
npm run dev
```

---

## 🌐 Deployment (GitHub Pages)

This project is deployed via:

```bash
npm run build
npm run deploy
```

Generated files automatically publish to the `gh-pages` branch.

---

## 📌 Future Improvements (optional)

* Quality selector (HLS variants)
* Chapters / markers
* Keyboard shortcuts
* Light theme toggle

---
