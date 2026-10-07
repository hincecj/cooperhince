// ---------- mobile nav ----------
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', () => {
    const open = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  list.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      list.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------- papers list ----------
(function () {
  const container = document.getElementById('papers-list');
  if (!container) return;

  const list = (typeof papers !== 'undefined' ? papers : []).slice();

  if (list.length === 0) {
    container.innerHTML = '<p class="papers-empty">No papers published yet. The first one is on its way.</p>';
    return;
  }

  const monthFormatter = (value) => {
    // Accepts "YYYY-MM" or "YYYY-MM-DD"; falls back to the raw string.
    const parts = String(value).split('-');
    if (parts.length < 2) return value;
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
    if (isNaN(date)) return value;
    return date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
  };

  container.innerHTML = '<ol class="timeline papers-timeline">' + list.map((paper) => {
    const title = escapeHtml(paper.title || 'Untitled');
    const description = escapeHtml(paper.description || '');
    const date = paper.date ? monthFormatter(paper.date) : '';
    const page = encodeURIComponent(paper.page || '');
    const file = encodeURIComponent(paper.file || '');
    const repo = paper.repo ? encodeURI(paper.repo) : '';

    const links = [
      paper.page ? `<a class="paper-link" href="projects/${page}">Read more</a>` : '',
      paper.file ? `<a class="paper-link" href="papers/${file}" target="_blank" rel="noopener">View PDF</a>` : '',
      paper.repo ? `<a class="paper-link" href="${repo}" target="_blank" rel="noopener">View GitHub</a>` : ''
    ].filter(Boolean).join('');

    return `
      <li>
        ${date ? `<div class="timeline-meta">${date}</div>` : ''}
        <h3>${title}</h3>
        ${description ? `<p>${description}</p>` : ''}
        ${links ? `<div class="paper-links">${links}</div>` : ''}
      </li>
    `;
  }).join('') + '</ol>';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
