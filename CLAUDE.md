# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site for David J Thurgood. Static HTML/CSS/JS — no build step, no package manager, no compilation. Edit files and open directly in a browser.

Deployed via GitHub Pages from the `gh-pages` branch at `davidjthurgood.co.uk`.

## Development

Open `index.html` directly in a browser. There is no dev server.

To preview changes on mobile, use browser DevTools device emulation. Breakpoints differ per page: the main page (`index.html` / `base.css`) switches at `53em` (~848px); the standalone pages use their own inline breakpoints (≈`700px`, plus a `600px` boarding-pass stack on the trip pages).

## Architecture

The repo holds two independent front-end systems that share no CSS or JS:

1. **The main page** — `index.html`, styled by the external `css/base.css` and driven by `js/demo.js` (mouse-following image trail) plus vendored GSAP / imagesLoaded.
2. **The standalone pages** — `usa-trip-2026.html`, `santa-fe.html`, `america-2024.html`. Each is a single fully self-contained file with its own inline `<style>` and `<script>`; none of them load `base.css` or `demo.js`.

So the `css/` and `js/` sections below apply **only** to `index.html`.

### Pages
- `index.html` — main portfolio page (the only live one)
- `usa-trip-2026.html` — USA trip 2026 page (full trip: New York + New Mexico)
- `santa-fe.html` — New Mexico-only subset of the trip page (Santa Fe & Taos); shares the same inline NYCTA styling, derived from `usa-trip-2026.html`
- `america-2024.html` — self-contained photography page (a 6-column JS-built masonry grid). Images live in `img/america-2024/`; the image list + layout algorithm are inlined in `<script>` blocks. Ported from the standalone Photography-Site-1 project — to add/remove photos, edit the `window.IMAGE_DATA` array inline (each entry is `{src, orientation}`).
- `cv.html` — outdated CV page, not linked from the main site, can be ignored

### Trip pages (`usa-trip-2026.html`, `santa-fe.html`)
Both are NYCTA / Vignelli-themed single files (Helvetica, zero border-radius, MTA line colours, near-black background). `santa-fe.html` is a trimmed copy of `usa-trip-2026.html` (New Mexico only, no New York or packing sections).

**The Santa Fe & Taos content is duplicated across both files** — edits to that section (flights, the Explore/Eat/Drink cards) usually need applying to both `usa-trip-2026.html` and `santa-fe.html`.

Repeated patterns to match when adding content:
- **Collapsible sections** — bottom-of-file JS wraps each `section[id]`, moves its `.section-label` + heading into a clickable header, and collapses all by default.
- **Place cards** (`.place-item`) — Explore cards are name + note + Maps link; Eat/Drink cards add `.place-badges`, `.place-ratings`, and an `.place-order` ("Order:") line, grouped under `.place-cat-label` headers. A read-more button is injected by JS only when a `.place-note` overflows.
- **Packing checklist** (`usa-trip-2026.html` only) — `<li onclick="toggle(this)">` items persist their checked state in `localStorage`.

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
