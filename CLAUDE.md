# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site for David J Thurgood. Static HTML/CSS/JS — no build step, no package manager, no compilation. Edit files and open directly in a browser.

Deployed via GitHub Pages from the `gh-pages` branch at `davidjthurgood.co.uk`.

## Development

Open `index.html` directly in a browser. There is no dev server.

To preview changes on mobile, use browser DevTools device emulation. The responsive breakpoint is `53em` (~848px): below it is mobile layout, above is desktop.

## Architecture

### Pages
- `index.html` — main portfolio page (the only live one)
- `usa-trip-2026.html` — USA trip 2026 page
- `cv.html` — outdated CV page, not linked from the main site, can be ignored

### CSS (`css/base.css`)
Single stylesheet with two layout modes separated by one media query:

- **Mobile (default, `< 53em`)**: `.frame` is a normal block at 80% width centered. `.content__title` uses `calc(100% - 20px)` max-width (10px margins each side).
- **Desktop (`min-width: 53em`)**: `.frame` becomes a `position: fixed` full-viewport grid overlay for the nav links. `body` is `overflow: hidden`. `.content__title` reverts to `max-width: 65%`.

`cv.html` references `css/cv_style.css` which does not exist in this repo.

### JavaScript (`js/demo.js`)
Implements a mouse-following image trail effect (sourced from Codrops, MIT licensed):

- **`ImageTrail`** — manages the pool of `img.content__img` elements. On each animation frame, checks how far the mouse has moved; if it exceeds `threshold` (100px), calls `showNextImage()` and advances `imgPosition` through the array cyclically.
- **`Image`** — wraps a single `<img>` element, tracks its bounding rect, and exposes `isActive()` to detect ongoing tweens.
- **`showNextImage()`** — uses `TimelineMax` to snap the image to the cached mouse position, animate it toward the current mouse position (`Expo.easeOut`, 0.9s), then fade and scale it out.
- Images are preloaded via `imagesLoaded` before the trail is initialised; the `loading` class on `<body>` is removed once ready.

Vendor libs (vendored, do not upgrade casually):
- `js/TweenMax.min.js` — GreenSock GSAP v2 (provides `TweenMax`, `TimelineMax`, easings)
- `js/imagesloaded.pkgd.min.js` — image preloader

### Images
`img/1.jpg` – `img/27.jpg` are the trail images. `img/old/` and `img/v1/` are archived sets, not referenced by the live page.

## Git Workflow

After every working session, commit all changes with a descriptive message and push to GitHub so there is always a saved, revertable version:

```bash
git add <changed files>
git commit -m "Short description of what changed"
git push
```

Commit message conventions used in this repo:
- `Site Update - <what changed>` for content/copy edits
- `Fix: <what was fixed>` for bug fixes
- `Style: <what changed>` for CSS/visual changes
- `Add: <what was added>` for new files or features

Always push immediately after committing — the `gh-pages` branch is the live site.
