# Hong Khai Nguyen — personal site

Next.js (App Router), no UI libraries. Two pages:

- `/` — name, short bio, work, projects. The portrait on the left is drawn as small
  squares; hovering it dissolves into the latest year of the photo journal.
- `/photos` — the photo journal: one photo for every month, a row of twelve per year.

## Run it

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Edit things

| What | Where |
| --- | --- |
| Bio, work, projects, links, hover cards | `src/data/site.ts` (bio sentence is in `src/app/page.tsx`) |
| Journal photos | `public/photos/` + `src/data/photos.ts` |
| Colours (light and dark) | top of `src/app/globals.css` |
| Resume | `public/hong-khai-nguyen-resume.pdf` |
| Portrait | `public/portrait-cutout.png` (a PNG with a transparent background) |

### Adding a journal photo

1. Export it as JPG, about 2000px on the long side, and save it as
   `public/photos/YYYY-MM.jpg` (e.g. `2021-03.jpg`).
2. Add a line to `journal` in `src/data/photos.ts`:
   ```ts
   { month: "2021-03", src: "/photos/2021-03.jpg", place: "San Jose", alt: "Cherry blossoms on campus" },
   ```

Months without a photo show as empty dashed frames, so you can fill the years in any order.

### Adding a screenshot to a hover card

Save a 2:1 screenshot (e.g. 800×400) to `public/previews/` and add `image: "/previews/name.jpg"` to that
entry's `preview` in `src/data/site.ts`.

## Deploy

Push to GitHub, import the repo on [Vercel](https://vercel.com/new), then add your domain under
Project → Settings → Domains. Social previews pick up the production domain automatically.
