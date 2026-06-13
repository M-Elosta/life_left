# Your Life in Weeks ⏳

A tiny static website that shows your whole life as a grid of boxes — **one box per week**.
The filled boxes are the weeks you've already lived; the empty ones are what's left.
Enter your date of birth, set a life expectancy (default **70**), and watch the
progress bar fill up.

> What are you waiting for?

## Features

- 📅 Enter your **date of birth** and **life expectancy** (defaults to 70 years).
- 🟧 A grid of **52 boxes per row** (one row = one year). Lived weeks are gold,
  the current week pulses red, future weeks are dim.
- 📊 A **progress bar** and quick stats: weeks lived, weeks remaining, years left.
- 💾 Remembers your inputs in the browser (localStorage) — nothing is sent anywhere.
- 📱 Fully responsive and dependency-free (plain HTML/CSS/JS).

## Run it locally

It's a static site, so just open `index.html` in a browser. Or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Push this repository to GitHub (the files must live in the repo **root**).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch you want to serve (e.g. `main`) and the `/ (root)` folder, then **Save**.
5. Wait a minute, then visit `https://<your-username>.github.io/<repo-name>/`.

> Tip: GitHub Pages can deploy from any branch. If you want to serve directly
> from this feature branch, select it in step 4 instead of `main`.

## Files

| File         | Purpose                                  |
|--------------|------------------------------------------|
| `index.html` | Page structure                           |
| `style.css`  | Dark theme, grid, progress bar styling   |
| `script.js`  | Week math, grid rendering, persistence   |

## How the math works

Each box represents `1/52` of a year, so a year is treated as exactly 52 weeks.
Weeks lived = `floor(ageInYears × 52)`, and the total number of boxes is
`lifeExpectancy × 52`. This keeps the grid tidy and makes the progress bar hit
**100%** exactly at your chosen life expectancy.
