document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const handbookTotal = document.querySelector('[data-handbook-total]');
  const introAudio = new Audio('intro.mp3');
  let audioStarted = false;

  if (handbookTotal) {
    handbookTotal.textContent = String(document.querySelectorAll('.handbook-card').length);
  }

  document.body.classList.add('is-loading');
  introAudio.preload = 'auto';
  introAudio.volume = 0.72;

  const unlockAndPlayAudio = () => {
    if (audioStarted) {
      return;
    }

    introAudio.currentTime = 0;
    introAudio.play().then(() => {
      audioStarted = true;
      window.removeEventListener('pointerdown', unlockAndPlayAudio);
      window.removeEventListener('keydown', unlockAndPlayAudio);
      window.removeEventListener('touchstart', unlockAndPlayAudio);
    }).catch(() => {});
  };

  window.addEventListener('pointerdown', unlockAndPlayAudio, { once: true });
  window.addEventListener('keydown', unlockAndPlayAudio, { once: true });
  window.addEventListener('touchstart', unlockAndPlayAudio, { once: true });
  unlockAndPlayAudio();

  if (preloader) {
    const loaderDurationMs = 4250;

    setTimeout(() => {
      preloader.classList.add('is-exiting');
      document.body.classList.remove('is-loading');
      setTimeout(() => {
        preloader.remove();
      }, 110);

      window.removeEventListener('pointerdown', unlockAndPlayAudio);
      window.removeEventListener('keydown', unlockAndPlayAudio);
      window.removeEventListener('touchstart', unlockAndPlayAudio);
    }, loaderDurationMs);
  } else {
    document.body.classList.remove('is-loading');
  }

  setupTopicGroupingAndFilters();
  setupHandbookLinkAudioNavigation();

  function setupTopicGroupingAndFilters() {
    const cardGrid = document.querySelector('.card-grid');
    const topicFiltersHost = document.querySelector('[data-topic-filters]');
    const filterCount = document.querySelector('[data-topic-filter-count]');
    const clearFiltersButton = document.querySelector('[data-topic-filter-clear]');
    const filterMeta = document.querySelector('.topic-filter-meta');

    if (!cardGrid || !topicFiltersHost || !filterCount || !clearFiltersButton) {
      return;
    }

    const cards = Array.from(cardGrid.querySelectorAll('.handbook-card'));

    if (!cards.length) {
      filterCount.textContent = 'No handbooks available';
      clearFiltersButton.disabled = true;
      return;
    }

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const getCardTitle = (card) => {
      const title = card.querySelector('h3');
      return (title ? title.textContent : '').trim();
    };
    const cardsByTopic = new Map();

    cards.forEach((card) => {
      const cardTag = card.querySelector('.card-tag');
      const topic = (cardTag ? cardTag.textContent : '').trim() || 'Other';
      if (!cardsByTopic.has(topic)) {
        cardsByTopic.set(topic, []);
      }
      cardsByTopic.get(topic).push(card);
    });

    cardsByTopic.forEach((topicCards) => {
      topicCards.sort((leftCard, rightCard) => collator.compare(getCardTitle(leftCard), getCardTitle(rightCard)));
    });

    const topics = Array.from(cardsByTopic.keys()).sort((leftTopic, rightTopic) => collator.compare(leftTopic, rightTopic));
    const groupsByTopic = new Map();
    const activeTopics = new Set(topics);

    cardGrid.classList.add('is-grouped');
    cardGrid.textContent = '';

    topics.forEach((topic) => {
      const topicCards = cardsByTopic.get(topic) || [];
      const topicGroup = document.createElement('section');
      topicGroup.className = 'topic-group is-collapsed';
      topicGroup.dataset.topic = topic;

      const topicToggle = document.createElement('button');
      topicToggle.type = 'button';
      topicToggle.className = 'topic-group-toggle';
      topicToggle.setAttribute('aria-expanded', 'false');

      const title = document.createElement('span');
      title.className = 'topic-group-title';
      title.textContent = topic;

      const meta = document.createElement('span');
      meta.className = 'topic-group-meta';

      const count = document.createElement('span');
      count.className = 'topic-group-count';
      count.textContent = `${topicCards.length} handbook${topicCards.length === 1 ? '' : 's'}`;

      const chevron = document.createElement('span');
      chevron.className = 'topic-group-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '▸';

      meta.append(count, chevron);
      topicToggle.append(title, meta);

      const topicGrid = document.createElement('div');
      topicGrid.className = 'topic-group-grid';
      topicCards.forEach((card) => topicGrid.append(card));

      topicToggle.addEventListener('click', () => {
        const isCollapsed = topicGroup.classList.toggle('is-collapsed');
        topicToggle.setAttribute('aria-expanded', String(!isCollapsed));
      });

      topicGroup.append(topicToggle, topicGrid);
      cardGrid.append(topicGroup);
      groupsByTopic.set(topic, topicGroup);
    });

    const allTopicsFilter = document.createElement('button');
    allTopicsFilter.type = 'button';
    allTopicsFilter.className = 'topic-filter is-active';
    allTopicsFilter.textContent = 'All Topics';
    allTopicsFilter.dataset.topic = '__all__';

    topicFiltersHost.textContent = '';
    topicFiltersHost.append(allTopicsFilter);

    const topicButtons = new Map();

    topics.forEach((topic) => {
      const filter = document.createElement('button');
      filter.type = 'button';
      filter.className = 'topic-filter';
      filter.textContent = topic;
      filter.dataset.topic = topic;
      topicButtons.set(topic, filter);
      topicFiltersHost.append(filter);
    });

    const topicActions = document.createElement('div');
    topicActions.className = 'topic-group-actions';

    const expandAllButton = document.createElement('button');
    expandAllButton.type = 'button';
    expandAllButton.className = 'topic-filter-clear';
    expandAllButton.textContent = 'Expand all groups';

    const collapseAllButton = document.createElement('button');
    collapseAllButton.type = 'button';
    collapseAllButton.className = 'topic-filter-clear';
    collapseAllButton.textContent = 'Collapse all groups';

    const randomButton = document.createElement('button');
    randomButton.type = 'button';
    randomButton.className = 'topic-filter-clear';
    randomButton.textContent = 'Read Random book';

    topicActions.append(expandAllButton, collapseAllButton, randomButton);
    if (filterMeta) {
      filterMeta.append(topicActions);
    }

    const syncTopicButtons = () => {
      const allSelected = activeTopics.size === topics.length;
      allTopicsFilter.classList.toggle('is-active', allSelected);
      topicButtons.forEach((button, topic) => {
        button.classList.toggle('is-active', activeTopics.has(topic));
      });
    };

    const updateUI = () => {
      let visibleHandbookCount = 0;
      groupsByTopic.forEach((group, topic) => {
        const isVisible = activeTopics.has(topic);
        group.classList.toggle('is-hidden', !isVisible);
        if (isVisible) {
          visibleHandbookCount += (cardsByTopic.get(topic) || []).length;
        }
      });

      const allTopicsSelected = activeTopics.size === topics.length;
      if (allTopicsSelected) {
        filterCount.textContent = `Showing all ${visibleHandbookCount} handbooks`;
      } else {
        filterCount.textContent = `Showing ${visibleHandbookCount} handbooks across ${activeTopics.size} topic${activeTopics.size === 1 ? '' : 's'}`;
      }

      clearFiltersButton.disabled = allTopicsSelected;
      syncTopicButtons();
    };

    allTopicsFilter.addEventListener('click', () => {
      activeTopics.clear();
      topics.forEach((topic) => activeTopics.add(topic));
      updateUI();
    });

    topicButtons.forEach((button, topic) => {
      button.addEventListener('click', () => {
        const allTopicsSelected = activeTopics.size === topics.length;

        if (allTopicsSelected) {
          activeTopics.clear();
          activeTopics.add(topic);
          updateUI();
          return;
        }

        if (activeTopics.has(topic)) {
          if (activeTopics.size === 1) {
            activeTopics.clear();
            topics.forEach((topicName) => activeTopics.add(topicName));
          } else {
            activeTopics.delete(topic);
          }
        } else {
          activeTopics.add(topic);
        }

        updateUI();
      });
    });

    clearFiltersButton.addEventListener('click', () => {
      activeTopics.clear();
      topics.forEach((topic) => activeTopics.add(topic));
      updateUI();
    });

    const getVisibleGroups = () => Array.from(groupsByTopic.entries())
      .filter(([topic]) => activeTopics.has(topic))
      .map(([, group]) => group);

    expandAllButton.addEventListener('click', () => {
      getVisibleGroups().forEach((group) => {
        group.classList.remove('is-collapsed');
        const toggle = group.querySelector('.topic-group-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    collapseAllButton.addEventListener('click', () => {
      getVisibleGroups().forEach((group) => {
        group.classList.add('is-collapsed');
        const toggle = group.querySelector('.topic-group-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    randomButton.addEventListener('click', () => {
      const visibleCards = Array.from(activeTopics).flatMap((topic) => cardsByTopic.get(topic) || []);
      if (!visibleCards.length) {
        return;
      }

      const selectedCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
      const link = selectedCard.querySelector('.card-link');
      const href = link ? link.getAttribute('href') : null;
      if (href) {
        window.location.href = href;
      }
    });

    updateUI();
  }

  function setupHandbookLinkAudioNavigation() {
    const handbookLinks = document.querySelectorAll('.card-link');

    if (!handbookLinks.length) {
      return;
    }

    let isRedirecting = false;

    handbookLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        const shouldBypass = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

        if (!href || isRedirecting || shouldBypass) {
          return;
        }

        event.preventDefault();
        isRedirecting = true;

        const navAudio = new Audio('intro.mp3');
        navAudio.preload = 'auto';
        navAudio.volume = 0.72;

        const navigate = () => {
          window.location.href = href;
        };

        const fallbackTimer = setTimeout(navigate, 1150);

        navAudio.currentTime = 0;
        navAudio.play().then(() => {
          setTimeout(() => {
            clearTimeout(fallbackTimer);
            navigate();
          }, 860);
        }).catch(() => {
          clearTimeout(fallbackTimer);
          setTimeout(navigate, 80);
        });
      });
    });
  }
});