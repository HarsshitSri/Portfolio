/**
 * Renders project cards from data/projects.json
 */
(function () {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderProject(project) {
    const stackTags = project.stack
      .map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`)
      .join('');

    const metrics = project.metrics
      ? `<p class="project-card__metrics">${escapeHtml(project.metrics)}</p>`
      : '';

    const highlights = project.highlights
      ? `
        <div class="project-card__highlights">
          <p class="project-card__highlights-title">Highlights</p>
          <ul class="project-card__highlights-list">
            ${project.highlights.map((h) => `<li class="project-card__highlight">${escapeHtml(h)}</li>`).join('')}
          </ul>
        </div>`
      : '';

    const links = [];
    if (project.github) {
      links.push(`<a href="${escapeHtml(project.github)}" class="project-card__link" target="_blank" rel="noopener noreferrer">GitHub</a>`);
    }
    if (project.apiDocs) {
      links.push(`<a href="${escapeHtml(project.apiDocs)}" class="project-card__link" target="_blank" rel="noopener noreferrer">API Docs</a>`);
    }
    if (project.architecture) {
      links.push(`<a href="${escapeHtml(project.architecture)}" class="project-card__link" target="_blank" rel="noopener noreferrer">Architecture</a>`);
    }
    if (project.demo) {
      links.push(`<a href="${escapeHtml(project.demo)}" class="project-card__link" target="_blank" rel="noopener noreferrer">Live Demo</a>`);
    }
    if (project.readme) {
      links.push(`<a href="${escapeHtml(project.readme)}" class="project-card__link" target="_blank" rel="noopener noreferrer">README</a>`);
    }

    return `
      <article class="card project-card">
        <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
        ${metrics}
        <p class="project-card__description">${escapeHtml(project.description)}</p>
        ${highlights}
        <div class="project-card__stack tags">${stackTags}</div>
        <div class="project-card__links">${links.join('')}</div>
      </article>
    `;
  }

  function showError(message) {
    grid.innerHTML = `<p class="error-message">${escapeHtml(message)}</p>`;
  }

  fetch('data/projects.json')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load projects');
      return response.json();
    })
    .then((projects) => {
      if (!projects.length) {
        showError('No projects to display yet.');
        return;
      }
      grid.innerHTML = projects.map(renderProject).join('');
    })
    .catch(() => {
      showError('Could not load projects. Check data/projects.json.');
    });
})();
