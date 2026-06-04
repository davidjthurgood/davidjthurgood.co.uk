# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is
A static HTML/CSS/JS implementation of an Adidas x Wales Bonner partner page, built from a Figma design using the Figma MCP server.

**Figma source:** https://www.figma.com/design/ZfIep7D5tW5j609Ui8b8cC/Figma-MCP-Exploration?node-id=1-1121

## Development

```bash
# Serve locally (required — file:// breaks HLS video)
python3 -m http.server
# → open http://localhost:8000
```

No build step, no package manager, no linter. Plain HTML / CSS / vanilla JS.

## Architecture

```
index.html        Single page — all sections in source order
css/styles.css    All styles (font-faces → reset → shared utilities → sections → responsive)
js/main.js        Product carousel: 5 cards, 4 visible, 250px wide, 270px step
js/nav.js         Mobile hamburger toggle (toggles .nav-open on .nav-header)
fonts/            Self-hosted Adidas custom fonts (copied from ~/Library/Fonts)
img/              Local SVG icons/logos — permanent, no CDN expiry
```

Editorial/product photos are Figma CDN URLs (`figma.com/api/mcp/asset/…`) — they expire ~7 days after export. Re-export via `get_design_context` on node `1:1121` (full page) or `1:1133` (past drops).

## Responsive system

The page is fully fluid. No fixed-width containers. Key techniques:

- **Typography**: `clamp(min, Xvw, max)` on all large sizes (e.g. masthead title: `clamp(28px, 10.2vw, 140px)`)
- **Aspect-ratio scaling**: sections with complex internal layouts use `aspect-ratio` instead of fixed heights — lookbook (`1366/770`), brand story newsletter (`683/767`), past-drop rows (`1306/287`)
- **Past-drop media zone**: all positions are percentages of the row width; panel sizes use `aspect-ratio` so images are always taller than the 197px clip zone at any viewport
- **Breakpoints**: `max-width: 1199px` (tablet), `max-width: 767px` (mobile — stacks everything, hamburger nav, past-drops become stacked cards)

## Fonts

All fonts are self-hosted in `fonts/` — do not substitute with Google Fonts.

| CSS family            | Used for                                          |
|-----------------------|---------------------------------------------------|
| `Denton`              | Masthead "WALES BONNER" + WB lockup span          |
| `adidasFG Compressed` | Section headings, buttons, labels, counter        |
| `adidasFG`            | Past-drop season labels, carousel counter         |
| `AdihausDIN`          | Body text, nav links, footer                      |
| `adineue PRO`         | Footer column headings                            |

## SVG rendering — critical rule

All Figma-exported SVGs have `width="100%"` `height="100%"` in the root element. As `<img>`, `height: auto` collapses to 0. **Always set explicit `width` and `height` HTML attributes** on every SVG `<img>`, derived from the viewBox.

Icon inventory in `img/`:

| File | viewBox | Rendered size |
|------|---------|---------------|
| `logo-adidas.svg` | 0 0 59.083 37.097 | 59×37 |
| `logo-adiclub.svg` | 0 0 88.488 15 | 88×15 — white fill, NO `scaleY(-1)` |
| `logo-wb-lockup.svg` | 0 0 152.404 124.73 | 152×125 — contains its own divider line |
| `icon-hotspot.svg` | 0 0 21 21 | 17×17 inside a 35×35 circle button |
| `btn-base-prev.svg` / `btn-base-next.svg` | 0 0 46 46 | 46×46 — rotated ±90° via CSS |
| `icon-wishlist-stroke4.svg` | 0 0 18.521 14.414 | 18×14 — black stroke (light bg cards) |
| `icon-wishlist-stroke3.svg` | 0 0 18.521 14.414 | 18×14 — white stroke (past-drop cards) |

## CSS selector gotcha

Any `img` selector inside a container that also holds `.hotspot` buttons **must** use the direct child combinator `>`, or it overrides the hotspot icon size:

```css
/* WRONG */  .pd-panel img { width: 100%; height: 100%; }
/* CORRECT */ .pd-panel > img { width: 100%; height: 100%; }
```

## Past drops layout

Each row scales proportionally via `aspect-ratio: 1306/287`. Internal positions are all percentages:

- **Info panel**: `left: 0; top: 16.4%; width: 30.16%`
- **Media zone**: `left: 34.76%; top: 31%; width: 65.24%; height: 68.6%` — clips contents with `overflow: hidden`
- **Panels** (`.pd-panel--fw26-bg`, `--fw26-main`, `--ss26-*`, `--fw25-a/b/c`): percentage `left` + `width`, `aspect-ratio` sets height so panels always overflow the clip zone
- FW25 panels use `object-position: center bottom` to replicate Figma's counter-rotation crop
- Hotspot positions inside panels are `%` of the panel dimensions

## Hero video

HLS stream: `https://cdn.shopify.com/videos/c/vp/fc7eb70f48c247ffb5c2cb38fa28419d/…m3u8`

Detection order in `index.html`: `Hls.isSupported()` first → `canPlayType` fallback for Safari. Must use `python3 -m http.server` (not `file://`) for HLS to work.

## Figma MCP servers

Two servers configured:
- `claude.ai Figma` — cloud MCP at `mcp.figma.com`
- `figma-desktop` — local Figma desktop at `localhost:3845`

Use `get_design_context` with `fileKey: ZfIep7D5tW5j609Ui8b8cC` to re-export expired image assets.
