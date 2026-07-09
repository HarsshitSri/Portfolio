/**
 * Renders education and experience from data/experience.json.
 * Hides the section when both lists are empty.
 */
(function () {
  'use strict';

  const section = document.getElementById('experience');
  const container = document.getElementById('experience-content');
  if (!section || !container) return;

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderTimelineItem(item) {
    const bullets = item.bullets && item.bullets.length
      ? `<ul class="timeline__bullets">
          ${item.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>`
      : '';

    return `
      <article class="timeline__item">
        <div class="timeline__header">
          <h3 class="timeline__role">${escapeHtml(item.title)}</h3>
          <p class="timeline__meta">
            <span class="timeline__org">${escapeHtml(item.organization)}</span>
            <span class="timeline__sep" aria-hidden="true">&middot;</span>
            <span class="timeline__dates">${escapeHtml(item.dates)}</span>
          </p>
        </div>
        ${bullets}
      </article>
    `;
  }

  function renderBlock(title, items) {
    if (!items.length) return '';

    return `
      <div class="timeline-block">
        <h3 class="timeline-block__title">${escapeHtml(title)}</h3>
        <div class="timeline">
          ${items.map(renderTimelineItem).join('')}
        </div>
      </div>
    `;
  }

  fetch('data/experience.json')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load experience');
      return response.json();
    })
    .then((data) => {
      const education = data.education || [];
      const experience = data.experience || [];

      if (!education.length && !experience.length) {
        section.hidden = true;
        return;
      }

      section.hidden = false;

      const navLink = document.getElementById('nav-experience');
      if (navLink) navLink.hidden = false;

      container.innerHTML =
        renderBlock('Education', education) +
        renderBlock('Experience', experience);
    })
    .catch(() => {
      section.hidden = true;
    });
})();
