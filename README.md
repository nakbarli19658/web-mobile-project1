# Spotlight — Interactive Venue Ticketing System

A front-end venue ticket selection project for Web & Mobile I.

## Run
Open `index.html` in a modern browser. No installation or backend required.

## Features
- 240 dynamically generated seats in 12 rows and 3 pricing categories
- Available, inspected, in-cart and unavailable seat states
- Inspect first, explicit Add to Cart action
- Remove tickets, prevent duplicates, calculate totals
- localStorage persistence after refresh
- Zoom, directional movement, reset, wheel zoom and drag panning
- Responsive desktop and mobile layout

## File structure
- `index.html` — semantic page structure
- `style.css` — styling and responsive layouts
- `script.js` — venue model, rendering, cart state and navigation

## Testing
1. Click a seat: details appear but cart stays unchanged.
2. Add the seat; it changes color and appears in the cart.
3. Click the same seat: duplicate addition is blocked.
4. Remove it: its seat state returns to available.
5. Add two seats and refresh: both are restored.
6. Check an unavailable seat cannot be selected.
7. Test zoom, directional controls, reset, wheel and drag.
8. Resize the browser to a mobile width.

## Submission reminder
Use a **real** public GitHub repository with at least 3 meaningful commits per project week over 4 weeks. Do not fabricate history. Record your own 4–6 minute narrated demo and prepare the 1–2 page PDF report with final commit hash, venue screenshot, and links.
