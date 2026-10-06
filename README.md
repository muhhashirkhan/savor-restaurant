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

## Verification

The October 2026 update checks all five routes at mobile, tablet and desktop widths, category filtering after cards mount, keyboard navigation, required-field focus, closed-day validation, weekend brunch selection and honest preview confirmations. Reduced-motion preferences disable reveal effects; content also remains readable without IntersectionObserver.

Existing Unsplash photographs are served from `public/images` to avoid runtime image-server dependencies. Their original Unsplash photo IDs are preserved in the filenames.

Automated WCAG A/AA scans found no violations on the five routes at 390px and 1440px after contrast fixes. This is an automated check, not a full accessibility certification.
