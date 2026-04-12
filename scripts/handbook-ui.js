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

  function setupSectionNavigation() {
    const links = Array.from(document.querySelectorAll('.nav-link[href^="#"], .sidebar-link[href^="#"]'));

    if (links.length === 0) {
      return;
    }

    const sectionMap = new Map();

    links.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const id = href.slice(1);

      if (!id) {
        return;
      }

      const section = document.getElementById(id);

      if (section) {
        sectionMap.set(id, section);
      }
    });

    if (sectionMap.size === 0) {
      return;
    }

    function setActiveLink(id) {
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }

    function resolveInitialSection() {
      const hashId = window.location.hash ? window.location.hash.slice(1) : '';

      if (hashId && sectionMap.has(hashId)) {
        return hashId;
      }

      return sectionMap.keys().next().value;
    }

    let activeId = resolveInitialSection();

    if (activeId) {
      setActiveLink(activeId);
    }

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        const href = link.getAttribute('href') || '';
        const id = href.slice(1);

        if (!id) {
          return;
        }

        activeId = id;
        setActiveLink(id);
      });
    });

    window.addEventListener('hashchange', function () {
      const hashId = window.location.hash ? window.location.hash.slice(1) : '';

      if (hashId && sectionMap.has(hashId)) {
        activeId = hashId;
        setActiveLink(hashId);
      }
    });

    const observer = new IntersectionObserver(function (entries) {
      let nextActiveId = activeId;

      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nextActiveId = entry.target.id;
        }
      });

      if (nextActiveId && nextActiveId !== activeId) {
        activeId = nextActiveId;
        setActiveLink(activeId);
      }
    }, {
      rootMargin: '-12% 0px -70% 0px',
      threshold: [0.1, 0.25, 0.5],
    });

    sectionMap.forEach(function (section) {
      observer.observe(section);
    });
  }

  function setupTopicFilters() {
    const filterHost = document.querySelector('[data-topic-filters]');
    const filterCount = document.querySelector('[data-topic-filter-count]');
    const filterClear = document.querySelector('[data-topic-filter-clear]');
    const cards = Array.from(document.querySelectorAll('.card-grid .handbook-card'));

    if (!filterHost || cards.length === 0) {
      return;
    }

    const tagMap = new Map();

    cards.forEach((card) => {
      const tagElement = card.querySelector('.card-tag');
      const tag = tagElement ? tagElement.textContent.trim() : '';

      if (!tag) {
        return;
      }

      const key = tag.toLowerCase();
      card.dataset.tag = key;

      if (!tagMap.has(key)) {
        tagMap.set(key, tag);
      }
    });

    const filters = [{ key: 'all', label: 'All Topics' }].concat(
      Array.from(tagMap.entries())
        .sort(function (left, right) {
          return left[1].localeCompare(right[1]);
        })
        .map(function (entry) {
          return { key: entry[0], label: entry[1] };
        })
    );

    const selectedFilters = new Set();

    function syncUrl() {
      const url = new URL(window.location.href);
      url.searchParams.delete('tag');

      Array.from(selectedFilters)
        .sort()
        .forEach(function (key) {
          url.searchParams.append('tag', key);
        });

      const nextUrl = url.pathname + url.search + url.hash;
      window.history.replaceState({}, '', nextUrl);
    }

    function seedFiltersFromUrl() {
      const url = new URL(window.location.href);
      const queryTags = url.searchParams.getAll('tag');

      queryTags.forEach(function (key) {
        const normalizedKey = key.trim().toLowerCase();

        if (tagMap.has(normalizedKey)) {
          selectedFilters.add(normalizedKey);
        }
      });
    }

    function renderButtons() {
      const fragment = document.createDocumentFragment();

      filters.forEach(function (filter) {
        const isActive = filter.key === 'all'
          ? selectedFilters.size === 0
          : selectedFilters.has(filter.key);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'topic-filter' + (isActive ? ' is-active' : '');
        button.dataset.filter = filter.key;
        button.textContent = filter.label;
        button.setAttribute('aria-pressed', String(isActive));
        fragment.appendChild(button);
      });

      filterHost.replaceChildren(fragment);
    }

    function updateCount(visibleCount) {
      if (!filterCount) {
        if (filterClear) {
          filterClear.disabled = selectedFilters.size === 0;
        }
        return;
      }

      if (selectedFilters.size === 0) {
        filterCount.textContent = 'Showing all ' + cards.length + ' handbooks';
      } else {
        const activeLabels = filters
          .filter(function (filter) {
            return filter.key !== 'all' && selectedFilters.has(filter.key);
          })
          .map(function (filter) {
            return filter.label;
          });

        filterCount.textContent = 'Showing ' + visibleCount + ' of ' + cards.length + ' handbooks for ' + activeLabels.join(', ');
      }

      if (filterClear) {
        filterClear.disabled = selectedFilters.size === 0;
      }
    }

    function applyFilter() {
      let visibleCount = 0;

      cards.forEach(function (card) {
        const matches = selectedFilters.size === 0 || selectedFilters.has(card.dataset.tag);
        card.classList.toggle('is-hidden', !matches);

        if (matches) {
          visibleCount += 1;
        }
      });

      syncUrl();
      updateCount(visibleCount);
      renderButtons();
    }

    filterHost.addEventListener('click', function (event) {
      const button = event.target.closest('.topic-filter');

      if (!button) {
        return;
      }

      const key = button.dataset.filter || 'all';

      if (key === 'all') {
        selectedFilters.clear();
      } else if (selectedFilters.has(key)) {
        selectedFilters.delete(key);
      } else {
        selectedFilters.add(key);
      }

      applyFilter();
    });

    if (filterClear) {
      filterClear.addEventListener('click', function () {
        selectedFilters.clear();
        applyFilter();
      });
    }

    seedFiltersFromUrl();
    applyFilter();
  }

  applyTheme(resolveTheme());

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      toggle.addEventListener('click', toggleTheme);
    });

    setupSectionNavigation();
    setupTopicFilters();
  });

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', function (event) {
      if (!window.localStorage.getItem(storageKey)) {
        applyTheme(event.matches ? 'light' : 'dark');
      }
    });
  }
}());