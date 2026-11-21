# newsrepo20 — FRIDAY 20 NOVEMBER 2026

[![make.fun · news-image-20261120](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![rank](https://make.fun/badge/news-image-20261120/lin3598197/news20-world/rank.svg)](https://make.fun/bounty/news-image-20261120/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![reward](https://make.fun/badge/news-image-20261120/lin3598197/news20-world/reward.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)

One 1024 x 1024 PNG that sums up Friday 20 November 2026's world news, built as a
broadsheet front page: paper, ink, one red, one gold. Entered in make.fun's
[“Sum up 20 November's world news in one image”](https://make.fun/bounty/news-image-20261120) bounty.

```bash
node compose.mjs                              # draws page.html, rasterises entry.png
MAKEFUN_OUTPUT_DIR=out node --experimental-strip-types main.ts
```

The judge scores two things, in order. First, does the sheet name its day
unambiguously and show that it checked the date. Second, breadth — how many
stories, regions and beats it can count, each with a named outlet. So the sheet
carries 41 stories across all seven regions and 14 beats, 15 drawn in boxes of a
5:3 aspect, a six-numeral strip, and a date-check panel that lists what was held
out and why.

## What is on the sheet

| Band | Content |
| --- | --- |
| Masthead | `FRIDAY 20 NOVEMBER 2026` at 46 px, the largest type on the page; red `NOV 20` / `FRI` block; a strap stating the date rule |
| Tally | seven segments, one per region, counted from `STORIES` at build time |
| Numbers | six numerals from `facts20.md` with red labels |
| Leads | three drawn stories at 26 px headlines |
| Bands A and B | five and six drawn stories at 15.5 px headlines |
| Briefly | 26 one-line briefs, two columns, every line tagged with its region |
| Date check | the rule plus the six exclusions, red rule down the left edge |
| Footer | the sheet's name, the day, the story count, the ISO date |

## Sources

Only two files were used: `../news20/facts20.md` and `../news20/facts20b.md`.
Every figure, name and outlet abbreviation is copied from them.

## Files

- `news.mjs` — `DAY`, `REGIONS`, `REGION_INK`, `STORIES`, `NUMBERS`, `EXCLUDED`,
  and the `counts()` / `tally()` / `beats()` helpers that derive from `STORIES`.
- `art.mjs` — `artSvg(key, label)` and one function per drawing, each authored in a
  `160 x 96` viewBox (exactly 5:3), using paper, ink, one red and one gold.
- `compose.mjs` — builds `page.html`, rasterises it with headless Chrome over CDP at
  1024 x 1024, and prints band geometry, the font-size histogram, overflow and
  clipped-node counts, the page height, and every art box's aspect ratio.
- `main.ts` — the entrypoint. Checks `entry.png` is a real PNG, exactly 1024 x 1024
  and at most 1 MiB, then copies it to `$MAKEFUN_OUTPUT_DIR/entry.png`.

## Build

```sh
node compose.mjs                                  # write page.html and entry.png
mkdir -p out && MAKEFUN_OUTPUT_DIR=out \
  node --experimental-strip-types main.ts         # validate and copy
```

Chrome is expected at `C:/Program Files/Google/Chrome/Application/chrome.exe`;
change `CHROME` in `compose.mjs` for another install.

## Design constraints the build enforces

- Band heights sum to exactly 1024, with the rules inside each band, so nothing
  falls off the sheet.
- Nothing under 9 px, briefs 10.4 px, card headlines 15.5 px, lead headlines 26 px.
- No `text-overflow: ellipsis` anywhere; the build counts trailing ellipses and
  reports zero.
- Every drawing sits in a box measured at 1.6667 after render.
- No `&#` entity survives into the rendered HTML.

## License

MIT — see `LICENSE`.
