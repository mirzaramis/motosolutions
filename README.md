# Motosolutions — showcase site

A single-page, static showcase site (no cart/checkout). Every buy/reserve
action links to Instagram: https://www.instagram.com/_motosolutions

## Files
- `index.html` — the page
- `styles.css` — all styling
- `script.js` — mobile menu, scroll reveals, and the helmet gallery + lightbox
- `helmets.js` — the list of 17 helmets and their photos (edit this to rename)
- `img/` — 85 web-optimised photos (5 angles × 17 helmets) + 17 cover images

## Preview locally
Double-click `index.html` to open it in a browser.

## Publish (free, non-technical)
**Netlify:** go to https://app.netlify.com/drop and drag this whole
`motosolutions` folder onto the page. You get a live link in seconds.

**Vercel:** https://vercel.com → New Project → drag the folder in.

## The helmet gallery
The Collection section is built from `helmets.js`. There are 17 helmets, each
with 5 angles. Tap a helmet card to open a lightbox with all 5 photos
(arrows / swipe / thumbnails), plus a "Reserve on Instagram" button.

### ⚠️ Please check the names — they are auto-generated
I grouped the 85 photos into helmets by matching the paint on each shell, and
labelled each by **colour** (e.g. "Gold", "Sun & Moon", "Blue Mandala"). The
model line (AGV Pista GP RR / Alpinestars Supertech R10) is a best guess.
**Rename each helmet to its real name** — it's easy:

Open `helmets.js`. Each helmet looks like this:

```js
{
  "id": "h02",
  "name": "Gold",                    // ← change to the real edition name
  "model": "AGV Pista GP RR",        // ← fix the model if wrong
  "cover": "img/h02-cover.jpg",      // the grid thumbnail
  "shots": ["img/h02-1.jpg", ... ]   // the 5 angles, in order
}
```

- Change `name` and `model` to whatever you want shown.
- If a photo is in the wrong helmet, move that `img/...` line into the right
  helmet's `shots` list (keep 5 each, or any number — the counter adapts).
- The first entry in `shots` (and `cover`) is the card image; reorder to change it.

## Replacing / adding photos
- Photos live in `img/`. To swap one, replace the file with the same name.
- New photos should be resized (≈1400px, JPEG ~72%) so the site stays fast —
  the originals were ~10 MB each; these are ~70 KB each.

## Other things to update
- **Logo** — the nav is a text wordmark. Add an image logo if you'd like.
- **Instagram follower count** — currently `1,350+` in `index.html` (search for it).
- **Hero / authenticity photos** — set in `index.html` (`img/h02-1.jpg` for the
  hero background, `img/h06-1.jpg` for the authenticity section). Swap the paths
  to feature different helmets.

## Content rules (kept intentionally)
- No prices, star ratings, review counts, or invented edition names in the copy.
  "Message for price & availability" covers pricing on purpose.
- Every action routes to Instagram — there is no cart or checkout.
