// Shared script for every "Read more" page in /projects.
//
// Loads KaTeX from a CDN and typesets any LaTeX found inside <main>.
// To upgrade KaTeX, change KATEX_VERSION below (this is the only place).
//
// Write maths in the page like this:
//   inline:   $x_{k} = x_{k-1} + h$      or   \( x_k \)
//   display:  $$ \sum_{i=1}^{n} i $$     or   \[ \sum_{i=1}^{n} i \]
//
// If the CDN cannot be reached the page still works, the LaTeX is just shown as text.

(function () {
  const KATEX_VERSION = '0.19.0';
  const BASE = 'https://cdn.jsdelivr.net/npm/katex@' + KATEX_VERSION + '/dist/';

  // Shortcuts available on every page. Add your own, for example:
  //   '\\R': '\\mathbb{R}',
  //   '\\d': '\\mathrm{d}',
  // After that, $\R$ and $\d x$ work in all project pages.
  const MACROS = {};

  function loadStyle(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.crossOrigin = 'anonymous';
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  Promise.all([
    loadStyle(BASE + 'katex.min.css'),
    loadScript(BASE + 'katex.min.js').then(() => loadScript(BASE + 'contrib/auto-render.min.js'))
  ]).then(() => {
    const root = document.querySelector('main') || document.body;
    window.renderMathInElement(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      macros: MACROS,
      throwOnError: false
    });
  }).catch(() => {
    // CDN unreachable: leave the raw LaTeX in place.
  });
})();
