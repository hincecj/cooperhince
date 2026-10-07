# cooperhince

Cooper's personal site: actuarial science, data analysis and numerical
analysis work. Plain HTML/CSS/JS, no build step, made to run on GitHub Pages.

## Structure

```
index.html                  the home page (nav + all sections)
css/style.css               all styling, including the colour tokens at the top
js/main.js                  nav behaviour, renders the papers list
js/papers-data.js           the list of papers: edit this to add a new one
js/project.js               used by every "Read more" page: loads KaTeX (LaTeX maths)
js/sim.js                   the simulation toolkit (no simulations in it)
js/sims/                    one file per simulation (starts with just _template.js)
projects/                   one "Read more" page per project
projects/_template.html     copy this to start a new page
papers/                     put the actual PDF files in here
assets/                     profile photo
assets/figures/             images used inside Read more pages (create it when needed)
```

Files and folders starting with an underscore (`_template.html`,
`_template.js`) are skipped by GitHub Pages' default build, so the templates
stay in the repo but are not published on the live site.

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
3. Commit and push. No build step, the page picks it up on refresh.

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

This renders the entry with a "View GitHub Code" link instead of "View PDF".
An entry can also have both `file` and `repo` at once (a write-up plus its
code), and both links will show. Whichever you leave out just won't render a
link.

## Read more pages

Each project can have its own page with a longer summary, equations, figures
and interactive simulations. An entry gets a "Read more" link when it has a
`page` field in `js/papers-data.js`. Entries without one are unchanged, so you
only make a page when a project deserves one.

The link order on an entry is always: Read more, View PDF, View GitHub Code
(whichever of those the entry has).

### Making a new page

1. Copy `projects/_template.html` to a new name with no spaces, e.g.
   `projects/my-project.html`. (Use the GitHub "Add file > Create new file"
   button if you are working in the browser: type `projects/my-project.html`
   and paste the template in.)
2. Edit the page, following the numbered comments in the file:
   - the `<title>` and description at the top (browser tab and search results)
   - the date, heading, overview and links in `project-header`
   - the write-up inside `<article class="project-body">`
3. In `js/papers-data.js`, add `page: "my-project.html"` to the project's entry:

   ```js
   {
     title: "My project",
     date: "2026-10",
     description: "One or two sentences.",
     page: "my-project.html",        // a file in /projects
     file: "my-project.pdf",         // optional
     repo: "https://github.com/hincecj/my-project"   // optional
   },
   ```
4. Commit and push.

Every page already has the "Back to projects" link at the top, the site
header, and the footer. They come from the template, so keep them when you
copy it.

### Writing the summary

Everything inside `<article class="project-body">` is the write-up. It is plain
HTML. The tags you will use most:

| You want | Write |
| --- | --- |
| A section heading | `<h2>Heading</h2>` (use `<h3>` for a sub heading) |
| A paragraph | `<p>Text here.</p>` |
| Bullet points | `<ul><li>One</li><li>Two</li></ul>` |
| Numbered points | `<ol><li>One</li><li>Two</li></ol>` |
| A link | `<a href="https://example.com">text</a>` |
| Code in a sentence | `<code>np.zeros(3)</code>` |
| A block of code | `<pre><code>x = 1</code></pre>` |
| A figure | see "Figures" below |

Paragraphs and headings stay at a comfortable reading width. Figures and
simulations use the full width of the page. To change the reading width, edit
`--prose-width` at the top of `css/style.css`.

### Writing LaTeX

Maths is typeset by KaTeX. Write it inside the paragraphs, like this:

| You want | Write |
| --- | --- |
| Maths inside a sentence | `$x_k = x_{k-1} + h$` or `\( x_k \)` |
| An equation on its own line | `$$ \sum_{i=1}^{n} i = \frac{n(n+1)}{2} $$` or `\[ ... \]` |

Put a display equation in its own `<p>`:

```html
<p>
  $$ y_k = h^n f(x_{k-n}, y_{k-n}) + \sum_{i=1}^{n} \binom{n}{i} (-1)^{i+1} y_{k-i} $$
</p>
```

Multi line working uses `aligned`:

```html
<p>
  $$
  \begin{aligned}
  \Delta &amp;= E - 1 \\
  \Delta^n &amp;= (E - 1)^n
  \end{aligned}
  $$
</p>
```

Because the page is HTML, three characters need care:

- **`<`**: write `\lt` (and `\gt` for `>`) inside maths, e.g. `$0 \lt h \ll 1$`.
  A bare `<` can be mistaken for the start of an HTML tag.
- **`&`**: write `&amp;` inside maths (this is the `&amp;` in the `aligned`
  example above).
- **A literal dollar sign** in normal text, like a price, would start a
  formula. Wrap it: `costs <span>$</span>5`.

Maths inside `<code>` and `<pre>` is left alone on purpose, so you can show raw
LaTeX in a code block.

The full list of supported commands is at https://katex.org/docs/supported.html.

**Your own shortcuts.** If you type the same thing often, define it once in
`js/project.js` (the `MACROS` list near the top) and it works on every page:

```js
const MACROS = {
  '\\R': '\\mathbb{R}',
  '\\d': '\\mathrm{d}'
};
```

Then `$f: \R \to \R$` and `$\d x$` work everywhere.

KaTeX is loaded from a CDN, so the viewer needs an internet connection to see
formatted maths (without one the raw LaTeX shows instead, and the rest of the
page is fine). To upgrade KaTeX, change `KATEX_VERSION` at the top of
`js/project.js`.

### Figures

1. Create the folder `assets/figures/` if it does not exist and put the image in
   it, e.g. `assets/figures/three-body-orbit.png`.
2. In the page:

   ```html
   <figure>
     <img src="../assets/figures/three-body-orbit.png" alt="Describe the figure for screen readers">
     <figcaption>Figure 1: the three bodies orbiting.</figcaption>
   </figure>
   ```

Note the `../` at the start of the path: project pages live one folder down.
The same applies to PDFs: `../papers/my-paper.pdf`.

## Adding a simulation

Simulations run in the visitor's browser as JavaScript on a canvas. The toolkit
(`js/sim.js`) handles the canvas, the animation loop, Play/Pause and Reset
buttons, sliders, dropdowns and checkboxes, and pausing when the simulation is
scrolled off screen. For each simulation you only write the maths and the
drawing. There are no simulations in the toolkit yet.

### Steps

1. Copy `js/sims/_template.js` to `js/sims/my-simulation.js` and remove the
   leading `// ` from the code. Fill in the four functions (see below).
2. In your project page, put an empty div where the simulation should appear,
   inside the article:

   ```html
   <div id="sim-my-simulation"></div>
   ```
3. At the bottom of the same page, after the `project.js` line, load the
   toolkit and your file:

   ```html
   <script src="../js/main.js"></script>
   <script src="../js/project.js"></script>
   <script src="../js/sim.js"></script>
   <script src="../js/sims/my-simulation.js"></script>
   ```
4. The id in the div, `sim-my-simulation`, must match the one passed to
   `Sim.create('#sim-my-simulation', ...)` in your file.

You can have several simulations on one page: use a different div id for each
and load each file.

### The four functions

```js
Sim.create('#sim-my-simulation', {
  ariaLabel: 'What the picture shows, for screen readers',
  dt: (params) => params.h,       // simulation time advanced per step
  controls: [ /* sliders etc, see below */ ],

  init(params, view)            { return { /* a fresh state */ }; },
  step(state, dt, params)       { /* advance the state by dt, changing it in place */ },
  draw(g, state, params, view)  { /* draw the state using canvas context g */ },
  readouts(state, params, view) { return [['t =', view.time.toFixed(2)]]; }   // optional
});
```

- `init` builds the starting state. It runs on load and every time Reset is
  pressed (or a control marked `resets` changes).
- `step` is where your numerical method goes. It is called with a fixed `dt`, so
  the results do not depend on how fast the visitor's screen refreshes.
- `draw` is a normal canvas 2D context, in CSS pixels, already cleared. Use
  `view.width` and `view.height` for the size and `view.colors.accent`,
  `view.colors.text`, `view.colors.muted`, `view.colors.border` and
  `view.colors.bg` so the drawing matches the site palette.
- `readouts` is the optional line of text next to the buttons.

### Controls

```js
controls: [
  // live: the new value is used straight away
  { id: 'h', label: 'Step size h', min: 0.001, max: 0.02, step: 0.001, value: 0.005 },
  // resets: true restarts the simulation when changed (use for starting conditions)
  { id: 'm1', label: 'Mass 1', min: 0.5, max: 5, step: 0.1, value: 1, resets: true },
  // a dropdown
  { id: 'preset', label: 'Preset', type: 'select', resets: true,
    options: [{ value: 'eight', label: 'Figure eight' }, { value: 'line', label: 'In line' }] },
  // a tick box
  { id: 'trail', label: 'Show trail', type: 'checkbox', value: true }
]
```

Each control's current value is available as `params.<id>` inside `init`,
`step`, `draw` and `readouts`.

Other options: `aspect` (canvas width / height, default `16 / 9`),
`timeScale` (simulation time per real second, default 1, can be a function of
`params` too), `autoplay: false` (start paused). Visitors who have "reduce
motion" turned on in their system settings always start paused. All options are
documented at the top of `js/sim.js`.

Because `dt` can be a function of the controls, the step size from the
write-up can be a slider, so a reader can watch the error grow as `h` gets
larger.

### If something goes wrong

If your code throws an error, the simulation stops and shows the message under
the canvas instead of failing silently. The full details are in the browser
console (press F12).

## Adding a new section

Each section in `index.html` is a `<section id="...">` with its own block in
`style.css`. To add one: copy an existing `<section>`, give it a new `id`,
add a matching link in the `<nav>` list, and style it under a new heading in
`style.css`.

## Running locally

No dependencies. Serve the folder and open the address it prints:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000. (Opening `index.html` directly also works,
but serving it behaves the same as GitHub Pages.)
