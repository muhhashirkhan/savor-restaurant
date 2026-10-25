# SAVOR Restaurant

Modern restaurant website built with React and Vite.

## Live website

[Open SAVOR Restaurant](https://muhhashirkhan.github.io/savor-restaurant/)

## Run locally

```bash
npm install
npm run dev
```

## Publish updates

Push changes to the `main` branch. The included GitHub Actions workflow builds and deploys the site to GitHub Pages.

## Portfolio behavior

SAVOR is a fictional restaurant concept. The menu, address, opening hours and chef story are sample content. Both forms validate input and show a local preview; they do not send emails or create bookings. Form details are kept only in the current page state and disappear when you leave that page. A real launch needs verified business details, an enquiry delivery service and an availability/confirmation workflow.

## Design refinement — 25 October 2026

This revision preserves the original palette, typefaces, copy, dishes and photography. It adds a persistent header, accessible mobile navigation, restrained page and filter transitions, more readable forms, refined menu cards and responsive WebP photographs. Reduced-motion preferences disable animations. The home-page quote now grows with its content instead of clipping on small phones.

The original JPEGs remain in `public/images`. The site uses WebP versions plus 640px variants selected through `srcSet`. Full-size WebP assets total 1,368,512 bytes versus 3,300,709 bytes for the original JPEGs (59% smaller). This is an asset-size comparison, not a measured loading-time claim. Hero images receive high fetch priority; other photographs load lazily.

## Verify locally

```bash
npm ci
npm run build -- --base=/savor-restaurant/
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort --base=/savor-restaurant/
```

Open `http://127.0.0.1:4174/savor-restaurant/#/menu`.

All five pages were checked in the Codex browser at 320, 390, 768, 1024 and 1440px. Category filters, keyboard navigation, mobile menu focus/scroll locking, Escape, desktop breakpoint cleanup, browser history, required fields, Monday closure, weekend brunch and preview/edit flows were exercised. No horizontal page overflow was detected. Separate checks found no overflow inside the principal copy, card and form containers at 320, 768, 1024 and 1440px. Browser warnings and errors were empty in the final interaction check.

Physical iOS/Android devices, additional browser engines, network-throttled performance benchmarks and a full accessibility audit were not run. Reduced-motion behavior was reviewed in the CSS and observer guard. Both forms remain local portfolio previews.

The existing deployment workflow is unchanged: pushes to `main` build and deploy to GitHub Pages.
