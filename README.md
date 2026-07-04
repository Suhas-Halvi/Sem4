# Our Little Love Story 💗

A complete, premium, single-page romantic experience built with **only vanilla HTML, CSS, and JavaScript** — no frameworks, no backend.

## How to run it

No build step needed. Just open `index.html` in any modern browser, or serve the folder with any static file server:

```bash
# Option 1: just double-click index.html

# Option 2: quick local server
npx serve .
# or
python3 -m http.server 8080
```

## Folder structure

```
love-story/
│── index.html            All screens/sections (single-page flow)
│── css/
│     ├── style.css        Design tokens, layout, components
│     ├── animations.css   All @keyframes and motion rules
│     └── responsive.css   Tablet + mobile breakpoints
│── js/
│     ├── app.js           Screen navigation + all page logic
│     ├── effects.js       Ambient background (stars, petals, cursor glow)
│     ├── confetti.js      Confetti / fireworks / heart-explosion effects
│     └── music.js         Background music play/pause handling
│── assets/
│     ├── music/           Put your .mp3 track here (see below)
│     ├── icons/           Optional custom icons
│     └── images/          Optional custom images
└── README.md
```

## The experience, in order

1. **Loading screen** — heartbeat icon + progress bar.
2. **Landing page** — glass card with an opening line and an "Open My Heart" button.
3. **The question** — "Do you love me?" The NO button playfully runs from the cursor, the messages escalate, and YES grows and glows the more it's chased.
4. **Heart explosion** — confetti, fireworks, and a hand-drawn heart-particle burst.
5. **Envelope** — a 3D envelope flies in; tapping it opens the flap and reveals the letter.
6. **Love letter** — a heartfelt letter types itself out, handwritten-style, with soft blooming flowers.
7. **100 Reasons** — a grid of 100 hearts, each one revealing a different reason, shuffled randomly.
8. **Date invitations** — 13 flippable invitation cards (movie night, ramen date, stargazing, and more).
9. **Final page** — a constellation slowly connects into the shape of a heart over a night sky, then "Forever" triggers heart rain, fireworks, and a closing "I Love You ❤️".

## Adding your own touches

- **Music**: drop a royalty-free romantic instrumental (mp3) into `assets/music/` named `romantic-theme.mp3`, or update the `<source>` path in `index.html`. Playback begins on the first tap/click anywhere on the page (required by browser autoplay policies) and can be muted from the floating widget.
- **Letter text**: edit the `loveLetterText` string near the top of the "LOVE LETTER" section in `js/app.js`.
- **100 Reasons**: edit the `reasons` array in `js/app.js` — add, remove, or personalize any of the 100 entries.
- **Date ideas**: edit the `dateIdeas` array in `js/app.js` to swap in your real plans, times, and locations.
- **Colors**: everything flows from the CSS custom properties at the top of `css/style.css` (`--blush`, `--lavender`, `--rose-gold`, etc.) — change those and the whole palette updates.

## Libraries used

- [canvas-confetti](https://github.com/catdad/canvas-confetti) (via CDN) for confetti and fireworks bursts.
- Google Fonts: Cormorant Garamond (display), Quicksand (body), Caveat (handwritten letter).
- Everything else — stars, petals, cursor sparkles, the heart-particle explosion, and the constellation — is hand-rolled with the Canvas API and CSS, no extra dependencies.

## Browser support

Built and tested against modern evergreen browsers (Chrome, Safari, Firefox, Edge) on desktop, iPhone, and Android. Respects `prefers-reduced-motion`.
