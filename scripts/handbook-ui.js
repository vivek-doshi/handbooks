(function () {
  const storageKey = 'handbooks-theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: light)');

  function resolveTheme() {
    const savedTheme = window.localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return media.matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');
      toggle.setAttribute('title', 'Switch to ' + nextTheme + ' mode');
    });
  }

  function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  }

  applyTheme(resolveTheme());

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      toggle.addEventListener('click', toggleTheme);
    });
  });

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', function (event) {
      if (!window.localStorage.getItem(storageKey)) {
        applyTheme(event.matches ? 'light' : 'dark');
      }
    });
  }
}());