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

  function setupTextNormalization() {
    if (!document.body || !document.body.hasAttribute('data-fix-mojibake')) {
      return;
    }

    const replacements = [
      ['ðŸ¦¥', '\uD83E\uDDA5'],
      ['ðŸš€', '\uD83D\uDE80'],
      ['ðŸ’¾', '\uD83D\uDCBE'],
      ['ðŸŽ¯', '\uD83C\uDFAF'],
      ['ðŸ”Œ', '\uD83D\uDD0C'],
      ['ðŸ“–', '\uD83D\uDCD6'],
      ['ðŸ“¦', '\uD83D\uDCE6'],
      ['ðŸ”„', '\uD83D\uDD04'],
      ['ðŸ—„ï¸', '\uD83D\uDDC4\uFE0F'],
      ['ðŸ”§', '\uD83D\uDD27'],
      ['ðŸ”—', '\uD83D\uDD17'],
      ['ðŸ”', '\uD83D\uDD0D'],
      ['ðŸŒ²', '\uD83C\uDF32'],
      ['ðŸ“Š', '\uD83D\uDCCA'],
      ['ðŸ”', '\uD83D\uDD01'],
      ['ðŸŽ›ï¸', '\uD83C\uDF9B\uFE0F'],
      ['ðŸ·ï¸', '\uD83C\uDFF7\uFE0F'],
      ['ðŸ“ˆ', '\uD83D\uDCC8'],
      ['ðŸ”µ', '\uD83D\uDD35'],
      ['ðŸ’¬', '\uD83D\uDCAC'],
      ['ðŸ“‹', '\uD83D\uDCCB'],
      ['ðŸ—’ï¸', '\uD83D\uDDD2\uFE0F'],
      ['ðŸ‹ï¸', '\uD83C\uDFCB\uFE0F'],
      ['ðŸ“š', '\uD83D\uDCDA'],
      ['ðŸ–¥ï¸', '\uD83D\uDDA5\uFE0F'],
      ['ðŸ—ƒï¸', '\uD83D\uDDC3\uFE0F'],
      ['ðŸ’¡', '\uD83D\uDCA1'],
      ['ðŸ”¥', '\uD83D\uDD25'],
      ['ðŸ—‚ï¸', '\uD83D\uDDC2\uFE0F'],
      ['ðŸŒ±', '\uD83C\uDF31'],
      ['ðŸ§ ', '\uD83E\uDDE0'],
      ['ðŸŒ¡ï¸', '\uD83C\uDF21\uFE0F'],
      ['ðŸ“', '\uD83D\uDCC1'],
      ['ðŸ³', '\uD83D\uDC33'],
      ['âœ…', '\u2705'],
      ['âŒ', '\u274C'],
      ['âš ï¸', '\u26A0\uFE0F'],
      ['âš¡', '\u26A1'],
      ['â­', '\u2B50'],
      ['âœ‚ï¸', '\u2702\uFE0F'],
      ['â€”', '\u2014'],
      ['â€“', '\u2013'],
      ['â†’', '\u2192'],
      ['â”€', '\u2500'],
      ['â‰¤', '\u2264'],
      ['Â±', '\u00B1'],
      ['Ã—', '\u00D7'],
      ['Î±', '\u03B1'],
      ['Â·', '\u00B7'],
      ['Â½', '\u00BD'],
    ];

    function normalizeText(value) {
      let output = value;

      replacements.forEach(function (pair) {
        output = output.split(pair[0]).join(pair[1]);
      });

      return output;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        const parent = node.parentElement;

        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent.closest('script, style, noscript, template')) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let currentNode = walker.nextNode();

    while (currentNode) {
      const normalizedValue = normalizeText(currentNode.nodeValue || '');

      if (normalizedValue !== currentNode.nodeValue) {
        currentNode.nodeValue = normalizedValue;
      }

      currentNode = walker.nextNode();
    }

    document.title = normalizeText(document.title);
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

  function setupGroupedCardSections() {
    const cardGrid = document.querySelector('.card-grid');

    if (!cardGrid || cardGrid.dataset.grouped === 'true') {
      return;
    }

    const cards = Array.from(cardGrid.querySelectorAll(':scope > .handbook-card'));

    if (cards.length === 0) {
      return;
    }

    const grouped = new Map();

    cards.forEach(function (card) {
      const tagElement = card.querySelector('.card-tag');
      const tagLabel = tagElement ? tagElement.textContent.trim() : 'Other';
      const key = tagLabel.toLowerCase();

      card.dataset.tag = key;

      if (!grouped.has(key)) {
        grouped.set(key, { label: tagLabel, cards: [] });
      }

      grouped.get(key).cards.push(card);
    });

    const fragment = document.createDocumentFragment();

    grouped.forEach(function (group, key) {
      const section = document.createElement('section');
      section.className = 'topic-group';
      section.dataset.topicGroup = key;

      const heading = document.createElement('button');
      heading.type = 'button';
      heading.className = 'topic-group-toggle';
      heading.setAttribute('aria-expanded', 'true');
      heading.innerHTML =
        '<span class="topic-group-title">' + group.label + '</span>' +
        '<span class="topic-group-meta">' +
          '<span class="topic-group-count" data-topic-group-count>' + group.cards.length + ' handbooks</span>' +
          '<span class="topic-group-chevron" aria-hidden="true">▾</span>' +
        '</span>';

      const groupGrid = document.createElement('div');
      groupGrid.className = 'topic-group-grid';

      group.cards.forEach(function (card) {
        groupGrid.appendChild(card);
      });

      heading.addEventListener('click', function () {
        const shouldExpand = section.classList.contains('is-collapsed');
        section.classList.toggle('is-collapsed', !shouldExpand);
        heading.setAttribute('aria-expanded', String(shouldExpand));
      });

      section.appendChild(heading);
      section.appendChild(groupGrid);
      fragment.appendChild(section);
    });

    cardGrid.replaceChildren(fragment);
    cardGrid.classList.add('is-grouped');
    cardGrid.dataset.grouped = 'true';

    const filterMeta = document.querySelector('.topic-filter-meta');

    if (filterMeta && !filterMeta.querySelector('[data-topic-group-actions]')) {
      const actions = document.createElement('div');
      actions.className = 'topic-group-actions';
      actions.setAttribute('data-topic-group-actions', '');

      const expandButton = document.createElement('button');
      expandButton.type = 'button';
      expandButton.className = 'topic-filter-clear';
      expandButton.textContent = 'Expand all groups';

      const collapseButton = document.createElement('button');
      collapseButton.type = 'button';
      collapseButton.className = 'topic-filter-clear';
      collapseButton.textContent = 'Collapse all groups';

      expandButton.addEventListener('click', function () {
        cardGrid.querySelectorAll('.topic-group').forEach(function (groupSection) {
          groupSection.classList.remove('is-collapsed');
          const toggle = groupSection.querySelector('.topic-group-toggle');

          if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      });

      collapseButton.addEventListener('click', function () {
        cardGrid.querySelectorAll('.topic-group').forEach(function (groupSection) {
          if (groupSection.classList.contains('is-filter-visible')) {
            groupSection.classList.remove('is-collapsed');
          } else {
            groupSection.classList.add('is-collapsed');
          }

          const toggle = groupSection.querySelector('.topic-group-toggle');

          if (toggle) {
            toggle.setAttribute('aria-expanded', String(!groupSection.classList.contains('is-collapsed')));
          }
        });
      });

      actions.appendChild(expandButton);
      actions.appendChild(collapseButton);
      filterMeta.appendChild(actions);
    }

    window.refreshTopicGroups = function () {
      const groups = Array.from(cardGrid.querySelectorAll('.topic-group'));
      let firstVisibleGroup = null;

      groups.forEach(function (groupSection) {
        const groupCards = Array.from(groupSection.querySelectorAll('.handbook-card'));
        const visibleCount = groupCards.filter(function (card) {
          return !card.classList.contains('is-hidden');
        }).length;

        const countElement = groupSection.querySelector('[data-topic-group-count]');
        if (countElement) {
          const noun = visibleCount === 1 ? 'handbook' : 'handbooks';
          countElement.textContent = visibleCount + ' ' + noun;
        }

        const isVisible = visibleCount > 0;
        groupSection.classList.toggle('is-filter-visible', isVisible);
        groupSection.classList.toggle('is-hidden', !isVisible);

        if (isVisible && !firstVisibleGroup) {
          firstVisibleGroup = groupSection;
        }
      });

      const visibleGroups = groups.filter(function (groupSection) {
        return !groupSection.classList.contains('is-hidden');
      });

      if (visibleGroups.length <= 2) {
        visibleGroups.forEach(function (groupSection) {
          groupSection.classList.remove('is-collapsed');
          const toggle = groupSection.querySelector('.topic-group-toggle');

          if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      } else if (firstVisibleGroup) {
        visibleGroups.forEach(function (groupSection, index) {
          const shouldExpand = index === 0;
          groupSection.classList.toggle('is-collapsed', !shouldExpand);
          const toggle = groupSection.querySelector('.topic-group-toggle');

          if (toggle) {
            toggle.setAttribute('aria-expanded', String(shouldExpand));
          }
        });
      }
    };

    window.refreshTopicGroups();
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

      if (typeof window.refreshTopicGroups === 'function') {
        window.refreshTopicGroups();
      }
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

    setupTextNormalization();
    setupSectionNavigation();
    setupGroupedCardSections();
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