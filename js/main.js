/**
 * Main site interactions: nav, theme, scroll spy, footer year
 */
(function () {
  'use strict';

  const THEME_KEY = 'portfolio-theme';
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const themeToggle = document.querySelector('.theme-toggle');
  const sections = document.querySelectorAll('section[id]');
  const yearEl = document.getElementById('year');

  /* Footer year */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Theme */
  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* Mobile nav */
  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
  }

  function openMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Active nav link on scroll */
  function updateActiveLink() {
    const scrollY = window.scrollY + 100;

    let current = '';
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* Resume link — enable when PDF exists */
  const resumeLink = document.getElementById('resume-link');
  if (resumeLink) {
    fetch('assets/resume.pdf', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          resumeLink.href = 'assets/resume.pdf';
          resumeLink.removeAttribute('aria-disabled');
          resumeLink.setAttribute('download', 'resume.pdf');
          resumeLink.title = 'Download resume PDF';
        }
      })
      .catch(() => {});
  }
})();
