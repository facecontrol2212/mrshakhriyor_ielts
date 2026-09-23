# mrshakhriyor_ielts

Welcome to the real IELTS world. This is a free IELTS practice website: timed reading tests, writing and speaking practice, daily articles and a band calculator.

## What's inside

| Page | What it does |
| --- | --- |
| `index.html` | Home page with your target band, quick stats and today's article |
| `reading.html` | Reading tests in the real exam layout (passage on the left, questions on the right), with a countdown timer, highlighter, automatic marking and an explanation for every answer |
| `writing.html` | Task 1 and Task 2 prompts (with a chart for Academic Task 1), exam timer, live word count, autosaved drafts and a self-check list based on the four marking criteria |
| `speaking.html` | Part 1 topics, Part 2 cue cards with a 1-minute prep and 2-minute talk timer, optional voice recording, and Part 3 follow-up questions |
| `articles.html` | Daily reading articles with key vocabulary and comprehension questions |
| `calculator.html` | Converts Listening/Reading raw scores to bands (Academic and General Training) and works out the overall band |
| `dashboard.html` | Progress page: profile, target band, reading band trend, full history, saved essays, export/import |

There is no build step, no server and no account. It's plain HTML, CSS and JavaScript. Progress is saved in the student's browser (`localStorage`), and the Export and Import buttons on **My Progress** move it between devices.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish it (GitHub Pages)

1. In the GitHub repository, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and the `/ (root)` folder, then click **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/mrshakhriyor_ielts/`.

## Adding content

All content lives in `assets/js/data/`. Nothing else needs to change.

- **New reading test**: add an object to `reading-tests.js`. Supported question types are `tfng` (True/False/Not Given), `ynng` (Yes/No/Not Given), `choice` (multiple choice or paragraph matching) and `gap` (typed answers; give an array to accept several spellings). Questions are numbered automatically.
- **New daily article**: add an object to the **top** of `articles.js`. The home page always shows the first one.
- **New writing prompt**: add to `writing-prompts.js`. Academic Task 1 prompts can include a `chart` that is drawn automatically.
- **New speaking topic**: add to `speaking-topics.js` (`part1` topics or `part2` cue cards with their Part 3 questions).

## Project structure

```
index.html  reading.html  writing.html  speaking.html
articles.html  calculator.html  dashboard.html
assets/
  css/styles.css          shared styles (light + dark mode)
  js/core.js              header/footer, storage, band-score helpers, timers
  js/data/*.js            all content (tests, articles, prompts, topics)
  js/pages/*.js           logic for each page
legacy/articles-prototype.html   the original single-page prototype
```

Band conversions are approximate: the official tables vary slightly between test versions. IELTS is a registered trademark of the University of Cambridge, the British Council and IDP. This site is an independent study resource.
