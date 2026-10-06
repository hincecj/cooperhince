# cooperhince

Cooper's personal site — actuarial science, data analysis and numerical
analysis work. Plain HTML/CSS/JS, no build step, made to run on GitHub Pages.

## Structure

```
index.html          the whole site (nav + all sections)
css/style.css        all styling
js/main.js           nav behaviour, renders the papers list
js/papers-data.js     ← the list of papers, edit this to add a new one
papers/               ← put the actual PDF files in here
assets/               ← put your profile photo in here
```

## Adding a new paper

1. Drop the PDF into `papers/`, e.g. `papers/my-new-paper.pdf`.
2. Open `js/papers-data.js` and add an entry to the top of the array:

   ```js
   {
     title: "Title of the paper",
     date: "2026-09",              // YYYY-MM, for display only (entries render in the order you add them)
     description: "One or two sentences on what it covers.",
     file: "my-new-paper.pdf"      // must match the filename in /papers
   },
   ```
3. Commit and push. No build step — the page picks it up on refresh.

## Adding a GitHub code entry

Same array, same steps, but use `repo` instead of `file`:

```js
{
  title: "Title of the project",
  date: "2026-09",
  description: "One or two sentences on what it does.",
  repo: "https://github.com/hincecj/your-repo-name"
},
```

This renders the entry with a "View GitHub Code" link instead of "View PDF."
An entry can also have both `file` and `repo` at once (a write-up plus its
code) — both links will show. Whichever of the two you leave out just won't
render a link for that one.

## Adding a new section

Each section in `index.html` is a `<section id="…">` with its own block in
`style.css`. To add one: copy an existing `<section>`, give it a new `id`,
add a matching link in the `<nav>` list, and style it under a new heading in
`style.css`.

## Running locally

No dependencies — just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```
