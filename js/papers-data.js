// Papers & Projects: add a new one by adding an object to this array.
//
//   1. Drop the PDF into the /papers folder (if there is one).
//   2. Add an entry below (newest first). "file" must match the filename
//      you just added to /papers.
//   3. For a "Read more" page, copy projects/_template.html to
//      projects/<name>.html, write your summary in it, and set "page" below
//      to that filename. See the root README for the full steps.
//
// Fields:
//   title, date, description: always used.
//   page  optional. A file in /projects. Shows a "Read more" link.
//   file  optional. A PDF in /papers. Shows a "View PDF" link.
//   repo  optional. A GitHub URL. Shows a "View GitHub Code" link.
//   Any mix of page, file and repo is fine, including all three or none.
//
// Examples (for reference, not live):
//   { title: "...", date: "YYYY-MM", description: "...", file: "some-paper.pdf" },
//   { title: "...", date: "YYYY-MM", description: "...", repo: "https://github.com/hincecj/some-repo" },
//   { title: "...", date: "YYYY-MM", description: "...", page: "some-project.html", file: "some-paper.pdf" },

const papers = [
  {
    title: "Traffic Flow Models: Stability and Emergent Dynamics",
    date: "Coming soon",
    description: "This project will build and analyse a few car-following models, with the emphasis on how they behave rather than detailed derivations. The write-up will be kept approachable and non-technical, and will focus on intuition over rigour."
  },
  {
    title: "Numerical Analysis: A Tourist's Guide Part 1",
    date: "2026-09",
    description: "Part 1 of the numerical analysis series covers a derivation of a simple numerical differential equation integrator, applied to simulate the famous three body problem and a damped pendulum in Python.",
    page: "numerical-analysis-part-1.html", file: "numerical_analysis_part_1.pdf", repo: "https://github.com/hincecj/numerical-analysis-part-1"
  },
];
