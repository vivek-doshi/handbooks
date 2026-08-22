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

  setupDynamicHandbookArt();
  setupTopicGroupingAndFilters();
  setupHandbookLinkAudioNavigation();

  function setupDynamicHandbookArt() {
    const cards = document.querySelectorAll('.handbook-card');

    if (!cards.length) {
      return;
    }

    cards.forEach((card) => {
      const artHost = card.querySelector('.handbook-art');
      const title = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').trim();
      const topic = (card.querySelector('.card-tag') ? card.querySelector('.card-tag').textContent : '').trim();
      const file = (card.querySelector('.card-file') ? card.querySelector('.card-file').textContent : '').trim();

      if (!artHost || !title) {
        return;
      }

      artHost.innerHTML = buildHandbookSvg(title, topic, file);
    });
  }

  function buildHandbookSvg(title, topic, file) {
    const seed = `${title}|${topic}|${file}`;
    const hash = hashString(seed);
    const variant = Math.abs(hash) % 4;
    const motif = pickMotif(title, topic, file);
    const initialLetters = getInitialLetters(title);

    const hue = mod(hash, 360);
    const primary = hsla(hue, 85, 64, 0.96);
    const secondary = hsla(hue + 55, 82, 63, 0.92);
    const tertiary = hsla(hue + 120, 78, 68, 0.9);
    const soft = hsla(hue + 12, 88, 65, 0.14);
    const soft2 = hsla(hue + 85, 80, 64, 0.12);
    const ink = 'rgba(235,240,250,0.9)';
    const frame = 'rgba(235,240,250,0.22)';
    const gradId = `art-grad-${Math.abs(hash)}`;

    const motifs = {
      architecture: () => `
        <rect x="30" y="28" width="52" height="30" rx="8" fill="${soft}" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="96" y="28" width="52" height="30" rx="8" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="64" y="70" width="52" height="22" rx="7" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M82 43h14M116 43h14M90 58v12M122 58v12" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
        <path d="M90 80h20" stroke="${primary}" stroke-width="5" stroke-linecap="round"></path>
      `,
      database: () => `
        <ellipse cx="90" cy="32" rx="38" ry="13" fill="${soft}"></ellipse>
        <path d="M52 32v37c0 8 17 14 38 14s38-6 38-14V32" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></path>
        <path d="M52 49c0 8 17 14 38 14s38-6 38-14" fill="none" stroke="${ink}" stroke-width="4"></path>
        <path d="M52 66c0 8 17 14 38 14s38-6 38-14" fill="none" stroke="${secondary}" stroke-width="4"></path>
      `,
      cloud: () => `
        <path d="M58 74h66c12 0 21-8 21-19 0-10-8-18-19-19-4-12-15-19-28-19-17 0-31 12-34 29-10 1-18 9-18 20 0 11 9 20 20 20Z" fill="${soft}" stroke="${frame}" stroke-width="2.5"></path>
        <path d="M68 64h45" stroke="${ink}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M112 64l-9-9m9 9-9 9" stroke="${primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      security: () => `
        <path d="M90 20 132 34v24c0 19-13 31-42 42-29-11-42-23-42-42V34Z" fill="${soft}" stroke="${frame}" stroke-width="2.5" stroke-linejoin="round"></path>
        <path d="m72 58 12 12 24-24" fill="none" stroke="${primary}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      ai: () => `
        <circle cx="90" cy="60" r="20" fill="${soft}" stroke="${frame}" stroke-width="2.5"></circle>
        <circle cx="90" cy="60" r="7" fill="${secondary}"></circle>
        <circle cx="58" cy="44" r="6" fill="${tertiary}"></circle>
        <circle cx="122" cy="44" r="6" fill="${tertiary}"></circle>
        <circle cx="58" cy="78" r="6" fill="${tertiary}"></circle>
        <circle cx="122" cy="78" r="6" fill="${tertiary}"></circle>
        <path d="M69 50 82 56M111 56 122 50M69 70 82 64M111 64 122 70" stroke="${ink}" stroke-width="4" stroke-linecap="round"></path>
      `,
      code: () => `
        <rect x="30" y="26" width="120" height="68" rx="14" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M69 48 52 60l17 12M111 48l17 12-17 12" fill="none" stroke="${primary}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="m95 43-10 34" stroke="${ink}" stroke-width="5" stroke-linecap="round"></path>
      `,
      devops: () => `
        <rect x="26" y="48" width="34" height="24" rx="6" fill="${soft}" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="74" y="48" width="34" height="24" rx="6" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="122" y="48" width="32" height="24" rx="6" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M60 60h14M108 60h14" stroke="${ink}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M74 60l-6-6m6 6-6 6M122 60l-6-6m6 6-6 6" stroke="${primary}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      frontend: () => `
        <rect x="26" y="24" width="128" height="74" rx="12" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="26" y="24" width="128" height="14" rx="8" fill="${soft}"></rect>
        <circle cx="40" cy="31" r="3" fill="${primary}"></circle>
        <circle cx="51" cy="31" r="3" fill="${secondary}"></circle>
        <circle cx="62" cy="31" r="3" fill="${tertiary}"></circle>
        <path d="M44 54h48M44 68h32M96 52h34v24H96z" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
      `,
      analytics: () => `
        <path d="M34 84h112" stroke="${frame}" stroke-width="4" stroke-linecap="round"></path>
        <rect x="46" y="58" width="14" height="26" rx="3" fill="${primary}"></rect>
        <rect x="70" y="48" width="14" height="36" rx="3" fill="${secondary}"></rect>
        <rect x="94" y="64" width="14" height="20" rx="3" fill="${tertiary}"></rect>
        <path d="M44 52 78 38 102 50 128 34" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      network: () => `
        <circle cx="48" cy="60" r="9" fill="${primary}"></circle>
        <circle cx="90" cy="34" r="9" fill="${secondary}"></circle>
        <circle cx="132" cy="60" r="9" fill="${tertiary}"></circle>
        <circle cx="90" cy="86" r="9" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></circle>
        <path d="M56 56 82 38M98 38 124 56M56 64 82 82M98 82 124 64" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      graphql: () => `
        <polygon points="90,24 122,42 122,78 90,96 58,78 58,42" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></polygon>
        <circle cx="90" cy="24" r="6" fill="${primary}"></circle>
        <circle cx="122" cy="42" r="6" fill="${secondary}"></circle>
        <circle cx="122" cy="78" r="6" fill="${tertiary}"></circle>
        <circle cx="90" cy="96" r="6" fill="${secondary}"></circle>
        <circle cx="58" cy="78" r="6" fill="${primary}"></circle>
        <circle cx="58" cy="42" r="6" fill="${tertiary}"></circle>
      `,
      grpc: () => `
        <rect x="30" y="36" width="120" height="48" rx="12" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M44 60h26M112 60h24" stroke="${ink}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M72 60h36" stroke="${primary}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 10"></path>
        <path d="M108 60l-8-8m8 8-8 8" stroke="${secondary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      gateway: () => `
        <path d="M44 88V52l46-28 46 28v36" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5" stroke-linejoin="round"></path>
        <path d="M90 42v38" stroke="${ink}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M74 58h32" stroke="${primary}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M90 72h24" stroke="${secondary}" stroke-width="5" stroke-linecap="round"></path>
      `,
      docker: () => `
        <rect x="42" y="50" width="16" height="12" rx="2" fill="${primary}"></rect>
        <rect x="62" y="50" width="16" height="12" rx="2" fill="${secondary}"></rect>
        <rect x="82" y="50" width="16" height="12" rx="2" fill="${tertiary}"></rect>
        <rect x="102" y="50" width="16" height="12" rx="2" fill="${primary}"></rect>
        <rect x="62" y="36" width="16" height="12" rx="2" fill="${secondary}"></rect>
        <rect x="82" y="36" width="16" height="12" rx="2" fill="${tertiary}"></rect>
        <path d="M38 70h84c0 9-8 16-19 16H57c-11 0-19-7-19-16Z" fill="${soft}" stroke="${frame}" stroke-width="2.5"></path>
      `,
      kubernetes: () => `
        <circle cx="90" cy="60" r="26" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></circle>
        <circle cx="90" cy="60" r="8" fill="${primary}"></circle>
        <path d="M90 34v12M90 74v12M64 60h12M104 60h12M72 42l9 9M108 42l-9 9M72 78l9-9M108 78l-9-9" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      git: () => `
        <rect x="56" y="30" width="68" height="60" rx="10" transform="rotate(45 90 60)" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <circle cx="76" cy="52" r="6" fill="${primary}"></circle>
        <circle cx="104" cy="68" r="6" fill="${secondary}"></circle>
        <circle cx="90" cy="82" r="6" fill="${tertiary}"></circle>
        <path d="M76 52 90 66 90 82M90 66l14 2" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      python: () => `
        <rect x="54" y="34" width="34" height="24" rx="8" fill="${primary}"></rect>
        <rect x="92" y="62" width="34" height="24" rx="8" fill="${secondary}"></rect>
        <circle cx="70" cy="46" r="3" fill="${ink}"></circle>
        <circle cx="108" cy="74" r="3" fill="${ink}"></circle>
        <path d="M88 46h16c8 0 14 6 14 14v2" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      dotnet: () => `
        <rect x="30" y="30" width="120" height="60" rx="14" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <text x="90" y="65" text-anchor="middle" font-size="20" font-weight="700" fill="${primary}" font-family="'JetBrains Mono', 'Cascadia Code', monospace">.NET</text>
      `,
      spring: () => `
        <ellipse cx="90" cy="64" rx="30" ry="20" fill="${soft}" stroke="${frame}" stroke-width="2.5"></ellipse>
        <path d="M78 70c12-18 26-23 41-20-8 10-20 20-39 23" fill="none" stroke="${primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M92 44c4-8 10-12 18-14" fill="none" stroke="${secondary}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      mlflow: () => `
        <path d="M44 78h92" stroke="${frame}" stroke-width="4.5" stroke-linecap="round"></path>
        <path d="M52 74V50l16-10v34Z" fill="${primary}"></path>
        <path d="M78 74V40l16-10v44Z" fill="${secondary}"></path>
        <path d="M104 74V58l16-10v26Z" fill="${tertiary}"></path>
      `,
      langchain: () => `
        <circle cx="52" cy="60" r="8" fill="${primary}"></circle>
        <circle cx="90" cy="40" r="8" fill="${secondary}"></circle>
        <circle cx="128" cy="60" r="8" fill="${tertiary}"></circle>
        <path d="M60 56 82 44M98 44 120 56" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
        <path d="M44 74h92" stroke="${frame}" stroke-width="4" stroke-linecap="round"></path>
      `,
      langgraph: () => `
        <circle cx="60" cy="42" r="7" fill="${primary}"></circle>
        <circle cx="120" cy="42" r="7" fill="${secondary}"></circle>
        <circle cx="90" cy="76" r="7" fill="${tertiary}"></circle>
        <path d="M67 46 83 68M113 46 97 68M67 42h46" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
        <rect x="42" y="26" width="96" height="64" rx="14" fill="none" stroke="${frame}" stroke-width="2.5"></rect>
      `,
      autogen: () => `
        <rect x="36" y="30" width="46" height="24" rx="8" fill="${soft}" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="98" y="30" width="46" height="24" rx="8" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="68" y="68" width="44" height="22" rx="8" fill="rgba(255,255,255,0.05)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M82 42h16M98 42h16M90 54v12" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      adk: () => `
        <path d="M46 84 72 34h14l26 50h-14l-4-10H64l-5 10Z" fill="${soft}" stroke="${frame}" stroke-width="2.5" stroke-linejoin="round"></path>
        <path d="M67 66h24" stroke="${primary}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M112 84V34h14c12 0 20 8 20 20v10c0 12-8 20-20 20Z" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></path>
      `,
      smolagents: () => `
        <circle cx="66" cy="60" r="18" fill="${soft}" stroke="${frame}" stroke-width="2.5"></circle>
        <circle cx="114" cy="60" r="18" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></circle>
        <circle cx="66" cy="60" r="5" fill="${primary}"></circle>
        <circle cx="114" cy="60" r="5" fill="${secondary}"></circle>
        <path d="M84 60h12M96 60h12" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      aws: () => `
        <path d="M46 72c22 16 66 16 88 0" fill="none" stroke="${secondary}" stroke-width="5" stroke-linecap="round"></path>
        <path d="M58 60h16M80 60h16M102 60h16" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
        <path d="M66 44v8M88 44v8M110 44v8" stroke="${primary}" stroke-width="4.5" stroke-linecap="round"></path>
        <path d="M128 72l8 2-5 6" fill="none" stroke="${secondary}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      azure: () => `
        <path d="M52 88 84 32h20l24 56h-18l-10-24-10 24Z" fill="${primary}" stroke="${frame}" stroke-width="2.5" stroke-linejoin="round"></path>
        <path d="M78 72h24" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      gcp: () => `
        <path d="M64 78h52c10 0 18-7 18-16s-8-16-18-16c-3-10-12-16-24-16-14 0-25 10-27 23-8 1-15 8-15 17 0 10 8 18 18 18Z" fill="${soft}" stroke="${frame}" stroke-width="2.5"></path>
        <path d="M72 62h34" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
        <path d="M106 62l8-8m-8 8 8 8" stroke="${primary}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path>
      `,
      hld: () => `
        <rect x="30" y="28" width="120" height="64" rx="14" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <rect x="44" y="42" width="30" height="16" rx="5" fill="${soft}"></rect>
        <rect x="102" y="42" width="34" height="16" rx="5" fill="${soft2}"></rect>
        <rect x="74" y="66" width="30" height="14" rx="5" fill="rgba(255,255,255,0.06)"></rect>
        <path d="M74 50h28M90 58v8M102 50h0" stroke="${ink}" stroke-width="4" stroke-linecap="round"></path>
      `,
      lld: () => `
        <rect x="34" y="26" width="112" height="68" rx="12" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M46 40h20M46 52h20M46 64h20M90 44h42M90 56h34M90 68h28" stroke="${ink}" stroke-width="4" stroke-linecap="round"></path>
        <circle cx="78" cy="46" r="4" fill="${primary}"></circle>
        <circle cx="78" cy="58" r="4" fill="${secondary}"></circle>
        <circle cx="78" cy="70" r="4" fill="${tertiary}"></circle>
      `,
      togaf: () => `
        <rect x="44" y="28" width="92" height="64" rx="14" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M54 78h72M62 66h56M70 54h40M78 42h24" stroke="${primary}" stroke-width="5" stroke-linecap="round"></path>
      `,
      dsa: () => `
        <circle cx="54" cy="42" r="8" fill="${primary}"></circle>
        <circle cx="90" cy="42" r="8" fill="${secondary}"></circle>
        <circle cx="126" cy="42" r="8" fill="${tertiary}"></circle>
        <circle cx="72" cy="78" r="8" fill="${secondary}"></circle>
        <circle cx="108" cy="78" r="8" fill="${primary}"></circle>
        <path d="M62 46 82 46M98 46 118 46M60 48 68 72M120 48 112 72M80 78h20" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      modularMonolith: () => `
        <rect x="38" y="30" width="104" height="60" rx="12" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M72 30v60M108 30v60M38 60h104" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"></path>
        <rect x="46" y="38" width="18" height="14" rx="4" fill="${soft}"></rect>
        <rect x="116" y="68" width="18" height="14" rx="4" fill="${soft2}"></rect>
      `,
      eventDriven: () => `
        <circle cx="46" cy="60" r="8" fill="${primary}"></circle>
        <circle cx="90" cy="36" r="8" fill="${secondary}"></circle>
        <circle cx="90" cy="84" r="8" fill="${tertiary}"></circle>
        <circle cx="134" cy="60" r="8" fill="${primary}"></circle>
        <path d="M54 58 82 40M54 62 82 80M98 40 126 58M98 80 126 62" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"></path>
      `,
      book: () => `
        <path d="M40 30h42c9 0 16 7 16 16v40H56c-9 0-16-7-16-16Z" fill="${soft}" stroke="${frame}" stroke-width="2.5"></path>
        <path d="M140 30H98v56h42c9 0 16-7 16-16V46c0-9-7-16-16-16Z" fill="${soft2}" stroke="${frame}" stroke-width="2.5"></path>
        <path d="M98 30v56M58 50h24M114 50h24" stroke="${ink}" stroke-width="4" stroke-linecap="round"></path>
      `,
      observability: () => `
        <rect x="30" y="26" width="120" height="68" rx="14" fill="rgba(255,255,255,0.04)" stroke="${frame}" stroke-width="2.5"></rect>
        <path d="M40 68h16l8-20 12 34 12-24 10 18h30" fill="none" stroke="${primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
        <circle cx="126" cy="48" r="10" fill="none" stroke="${secondary}" stroke-width="4"></circle>
        <path d="M133 55l10 10" stroke="${secondary}" stroke-width="4" stroke-linecap="round"></path>
      `
    };

    const motifRenderer = motifs[motif] || motifs.book;
    const motifMarkup = motifRenderer();

    const cornerX = variant % 2 === 0 ? 34 : 146;
    const cornerY = variant < 2 ? 26 : 94;

    return `
      <svg viewBox="0 0 180 120" aria-hidden="true" role="img">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${hsla(hue + 8, 84, 60, 0.18)}"></stop>
            <stop offset="100%" stop-color="${hsla(hue + 110, 84, 62, 0.12)}"></stop>
          </linearGradient>
        </defs>
        <rect x="14" y="14" width="152" height="92" rx="20" fill="url(#${gradId})" stroke="${frame}" stroke-width="2"></rect>
        ${motifMarkup}
        <circle cx="${cornerX}" cy="${cornerY}" r="13" fill="rgba(8,12,20,0.45)" stroke="${hsla(hue + 50, 80, 72, 0.62)}" stroke-width="2"></circle>
        <text x="${cornerX}" y="${cornerY + 4}" text-anchor="middle" font-size="8" font-weight="700" fill="${ink}" font-family="'JetBrains Mono', 'Cascadia Code', monospace">${initialLetters}</text>
      </svg>
    `;
  }

  function pickMotif(title, topic, file) {
    const text = `${title} ${topic} ${file}`.toLowerCase();

    if (/(graphql)/.test(text)) {
      return 'graphql';
    }

    if (/(grpc|protocol buffer|protobuf)/.test(text)) {
      return 'grpc';
    }

    if (/(api gateway|gateway)/.test(text)) {
      return 'gateway';
    }

    if (/(docker|containerization)/.test(text)) {
      return 'docker';
    }

    if (/(kubernetes|kubeflow)/.test(text)) {
      return 'kubernetes';
    }

    if (/(git|version control)/.test(text)) {
      return 'git';
    }

    if (/(mlflow|weights & biases|wandb)/.test(text)) {
      return 'mlflow';
    }

    if (/(langgraph)/.test(text)) {
      return 'langgraph';
    }

    if (/(langchain)/.test(text)) {
      return 'langchain';
    }

    if (/(autogen)/.test(text)) {
      return 'autogen';
    }

    if (/(google adk|\badk\b)/.test(text)) {
      return 'adk';
    }

    if (/(smolagent|smolagents)/.test(text)) {
      return 'smolagents';
    }

    if (/(aws|amazon web services)/.test(text)) {
      return 'aws';
    }

    if (/(azure)/.test(text)) {
      return 'azure';
    }

    if (/(gcp|google cloud)/.test(text)) {
      return 'gcp';
    }

    if (/(hld|high level design)/.test(text)) {
      return 'hld';
    }

    if (/(lld|low level design)/.test(text)) {
      return 'lld';
    }

    if (/(togaf)/.test(text)) {
      return 'togaf';
    }

    if (/(dsa|data structures|algorithms)/.test(text)) {
      return 'dsa';
    }

    if (/(modular monolith)/.test(text)) {
      return 'modularMonolith';
    }

    if (/(event-driven|event driven)/.test(text)) {
      return 'eventDriven';
    }

    if (/(dotnet|\.net|c#)/.test(text)) {
      return 'dotnet';
    }

    if (/(spring|springboot)/.test(text)) {
      return 'spring';
    }

    if (/(python)/.test(text)) {
      return 'python';
    }

    if (/(postgres|mysql|mssql|sql|database|warehouse|etl|elt|pandas|data engineering|spark)/.test(text)) {
      return 'database';
    }

    if (/(aws|azure|gcp|cloud|landing zone|disaster recovery|multi-cloud)/.test(text)) {
      return 'cloud';
    }

    if (/(guardrail|security|secure|compliance|governance|risk|policy|iam|zero trust)/.test(text)) {
      return 'security';
    }

    if (/(llm|gen ai|ai |machine learning|neural|deep learning|transformer|fine-tuning|prompt)/.test(text)) {
      return 'ai';
    }

    if (/(observability|monitor|telemetry|tracing|logging|sre|incident|chaos|grafana|prometheus)/.test(text)) {
      return 'observability';
    }

    if (/(devops|docker|kubernetes|kubeflow|mlops|container|devcontainer|platform engineering|cicd|git)/.test(text)) {
      return 'devops';
    }

    if (/(frontend|css|tailwind|react|html|ui|ux)/.test(text)) {
      return 'frontend';
    }

    if (/(network|grpc|graphql|api gateway|gateway|event-driven|microservices|distributed)/.test(text)) {
      return 'network';
    }

    if (/(evaluation|testing|benchmark|metrics|kpi|analytics|cost)/.test(text)) {
      return 'analytics';
    }

    if (/(architecture|hld|lld|togaf|dsa|pattern|modular monolith|enterprise)/.test(text)) {
      return 'architecture';
    }

    if (/(python|java|dotnet|spring|coding|programming|tooling|script)/.test(text)) {
      return 'code';
    }

    return 'book';
  }

  function getInitialLetters(title) {
    const stopWords = new Set(['and', 'to', 'the', 'of', 'for', 'with', 'in', 'on']);
    const initials = title
      .split(/\s+/)
      .map((token) => token.replace(/[^a-zA-Z0-9]/g, ''))
      .filter((token) => token && !stopWords.has(token.toLowerCase()))
      .slice(0, 2)
      .map((token) => token[0].toUpperCase())
      .join('');

    return initials || 'HB';
  }

  function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(index);
      hash |= 0;
    }
    return hash;
  }

  function mod(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function hsla(h, s, l, a) {
    return `hsla(${mod(h, 360)}, ${s}%, ${l}%, ${a})`;
  }

  function setupTopicGroupingAndFilters() {
    const cardGrid = document.querySelector('.card-grid');
    const topicFiltersHost = document.querySelector('[data-topic-filters]');
    const filterCount = document.querySelector('[data-topic-filter-count]');
    const clearFiltersButton = document.querySelector('[data-topic-filter-clear]');
    const randomButton = document.querySelector('[data-lookup-random]');
    const topicMoreButton = document.querySelector('[data-topic-more]');
    const sidebarTotal = document.querySelector('[data-sidebar-total]');
    const lookupInput = document.querySelector('[data-lookup-input]');
    const lookupStatus = document.querySelector('[data-lookup-status]');
    const lookupResult = document.querySelector('[data-lookup-result]');
    const lookupTopics = document.querySelector('[data-lookup-topics]');
    const lookupShortcut = document.querySelector('[data-lookup-shortcut]');
    const lookupClearButton = document.querySelector('[data-lookup-clear]');

    if (!cardGrid || !topicFiltersHost || !filterCount || !clearFiltersButton) {
      return;
    }

    const cards = Array.from(cardGrid.querySelectorAll('.handbook-card'));
    const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

    if (!cards.length) {
      filterCount.textContent = 'No handbooks available';
      clearFiltersButton.disabled = true;
      if (lookupStatus) {
        lookupStatus.textContent = 'No handbooks available';
      }
      if (lookupResult) {
        lookupResult.textContent = '0';
      }
      if (lookupTopics) {
        lookupTopics.textContent = '0';
      }
      return;
    }

    if (sidebarTotal) {
      sidebarTotal.textContent = `${cards.length} handbooks`;
    }

    cards.forEach((card, index) => {
      card.style.setProperty('--card-stagger', String(index % 16));
    });

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const getCardTitle = (card) => {
      const title = card.querySelector('h3');
      return (title ? title.textContent : '').trim();
    };
    const cardsByTopic = new Map();
    const cardSearchIndex = new Map();

    cards.forEach((card) => {
      const cardTag = card.querySelector('.card-tag');
      const cardTitle = card.querySelector('h3');
      const cardFile = card.querySelector('.card-file');
      const cardDesc = card.querySelector('.handbook-copy p');
      const topic = (cardTag ? cardTag.textContent : '').trim() || 'Other';
      if (!cardsByTopic.has(topic)) {
        cardsByTopic.set(topic, []);
      }
      cardsByTopic.get(topic).push(card);

      const lookupText = [
        cardTitle ? cardTitle.textContent : '',
        cardTag ? cardTag.textContent : '',
        cardFile ? cardFile.textContent : '',
        cardDesc ? cardDesc.textContent : ''
      ].join(' ');
      cardSearchIndex.set(card, normalize(lookupText));
    });

    cardsByTopic.forEach((topicCards) => {
      topicCards.sort((leftCard, rightCard) => collator.compare(getCardTitle(leftCard), getCardTitle(rightCard)));
    });

    cards.sort((leftCard, rightCard) => collator.compare(getCardTitle(leftCard), getCardTitle(rightCard)));
    cardGrid.textContent = '';
    cards.forEach((card) => cardGrid.append(card));

    const topics = Array.from(cardsByTopic.entries())
      .map(([topic, topicCards]) => ({
        key: topic,
        count: topicCards.length
      }))
      .sort((leftTopic, rightTopic) => {
        if (leftTopic.count !== rightTopic.count) {
          return rightTopic.count - leftTopic.count;
        }
        return collator.compare(leftTopic.key, rightTopic.key);
      });

    const topicButtons = new Map();
    const topicPreviewSize = 6;
    let isTopicListExpanded = false;
    let selectedTopic = '__all__';

    const allTopicsCount = topics.reduce((sum, topic) => sum + topic.count, 0);
    const lookupState = {
      query: ''
    };

    const createTopicButton = (topicKey, count, label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topic-filter';
      button.dataset.topic = topicKey;

      const labelTag = document.createElement('span');
      labelTag.className = 'topic-filter-label';
      labelTag.textContent = label;

      const countTag = document.createElement('span');
      countTag.className = 'topic-filter-count-tag';
      countTag.textContent = String(count);

      button.append(labelTag, countTag);
      return button;
    };

    const renderTopicButtons = () => {
      topicFiltersHost.textContent = '';
      topicButtons.clear();
      topicFiltersHost.classList.toggle('is-expanded', isTopicListExpanded);

      const allButton = createTopicButton('__all__', allTopicsCount, 'All topics');
      topicFiltersHost.append(allButton);
      topicButtons.set('__all__', allButton);

      const visibleTopics = isTopicListExpanded ? topics : topics.slice(0, topicPreviewSize);
      visibleTopics.forEach((topic) => {
        const button = createTopicButton(topic.key, topic.count, topic.key);
        topicFiltersHost.append(button);
        topicButtons.set(topic.key, button);
      });

      if (!topicMoreButton) {
        return;
      }

      const hiddenCount = Math.max(topics.length - topicPreviewSize, 0);
      topicMoreButton.hidden = hiddenCount === 0;
      topicMoreButton.textContent = isTopicListExpanded ? 'Show fewer topics' : `+ ${hiddenCount} more`;
    };

    const syncTopicButtons = () => {
      topicButtons.forEach((button, topicKey) => {
        button.classList.toggle('is-active', selectedTopic === topicKey);
      });
    };

    const setSelectedTopic = (nextTopic) => {
      selectedTopic = nextTopic;
      syncTopicButtons();
    };

    const cardLinkByCard = new Map();
    cards.forEach((card) => {
      const link = card.querySelector('.card-link');
      if (!link) {
        return;
      }

      cardLinkByCard.set(card, link);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `Open ${getCardTitle(card)}`);

      card.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('a, button, input, textarea')) {
          return;
        }
        link.click();
      });

      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        event.preventDefault();
        link.click();
      });
    });

    const updateUI = () => {
      let visibleHandbookCount = 0;
      let visibleTopicCount = 0;

      cards.forEach((card) => {
        const topicTag = card.querySelector('.card-tag');
        const topic = (topicTag ? topicTag.textContent : '').trim() || 'Other';
        const topicMatches = selectedTopic === '__all__' || selectedTopic === topic;
        const queryMatches = !lookupState.query || cardSearchIndex.get(card).includes(lookupState.query);
        const isVisible = topicMatches && queryMatches;

        card.classList.toggle('is-hidden', !isVisible);
        if (queryMatches && lookupState.query) {
          card.setAttribute('data-match', 'true');
        } else {
          card.removeAttribute('data-match');
        }

        if (isVisible) {
          visibleHandbookCount += 1;
        }
      });

      topics.forEach((topicItem) => {
        const hasVisible = (cardsByTopic.get(topicItem.key) || []).some((card) => !card.classList.contains('is-hidden'));
        if (hasVisible) {
          visibleTopicCount += 1;
        }
      });

      const allTopicsSelected = selectedTopic === '__all__';
      const hasLookupQuery = lookupState.query.length > 0;

      if (allTopicsSelected && !hasLookupQuery) {
        filterCount.textContent = `Showing all ${visibleHandbookCount} handbooks`;
      } else if (allTopicsSelected && hasLookupQuery) {
        filterCount.textContent = `Showing ${visibleHandbookCount} matches across ${visibleTopicCount} topic${visibleTopicCount === 1 ? '' : 's'}`;
      } else {
        const inTopicLabel = selectedTopic === '__all__' ? 'all topics' : selectedTopic;
        filterCount.textContent = `Showing ${visibleHandbookCount} in ${inTopicLabel}`;
      }

      clearFiltersButton.disabled = allTopicsSelected;
      if (lookupClearButton) {
        lookupClearButton.disabled = !hasLookupQuery;
      }

      if (lookupStatus) {
        if (!allTopicsSelected) {
          lookupStatus.textContent = `Showing ${visibleHandbookCount} in ${selectedTopic}`;
        } else if (hasLookupQuery) {
          lookupStatus.textContent = `Showing ${visibleHandbookCount} matching "${lookupState.query}"`;
        } else {
          lookupStatus.textContent = 'Showing all handbooks';
        }
      }

      if (lookupResult) {
        lookupResult.textContent = String(visibleHandbookCount);
      }

      if (lookupTopics) {
        lookupTopics.textContent = String(visibleTopicCount);
      }

      syncTopicButtons();
    };

    const setLookupQuery = (nextQuery) => {
      lookupState.query = normalize(nextQuery);
      updateUI();
    };

    const wireTopicButtonEvents = () => {
      topicButtons.forEach((button, topicKey) => {
        button.addEventListener('click', () => {
          setSelectedTopic(topicKey);
          updateUI();
        });
      });
    };

    if (topicMoreButton) {
      topicMoreButton.addEventListener('click', () => {
        isTopicListExpanded = !isTopicListExpanded;
        renderTopicButtons();
        wireTopicButtonEvents();
        syncTopicButtons();
      });
    }

    clearFiltersButton.addEventListener('click', () => {
      setSelectedTopic('__all__');
      updateUI();
    });

    if (lookupInput) {
      lookupInput.addEventListener('input', () => {
        setLookupQuery(lookupInput.value);
      });
    }

    if (lookupClearButton) {
      lookupClearButton.addEventListener('click', () => {
        if (!lookupInput) {
          return;
        }
        lookupInput.value = '';
        lookupInput.focus();
        setLookupQuery('');
      });
    }

    document.addEventListener('keydown', (event) => {
      const target = event.target;
      const isTypingTarget = target instanceof HTMLElement
        && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (!isTypingTarget && event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (!lookupInput) {
          return;
        }
        event.preventDefault();
        lookupInput.focus();
        lookupInput.select();
      }

      if (lookupInput && event.key === 'Escape' && document.activeElement === lookupInput && lookupInput.value) {
        event.preventDefault();
        lookupInput.value = '';
        setLookupQuery('');
      }
    });

    if (lookupShortcut) {
      const isMac = /Mac|iPhone|iPad|iPod/i.test(window.navigator.platform);
      lookupShortcut.textContent = isMac ? 'Shortcut: Cmd+/' : 'Shortcut: /';
    }

    if (randomButton) {
      randomButton.addEventListener('click', () => {
        const visibleCards = cards.filter((card) => !card.classList.contains('is-hidden'));
        if (!visibleCards.length) {
          return;
        }

        const selectedCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
        const link = cardLinkByCard.get(selectedCard);
        if (link) {
          link.click();
        }
      });
    }

    renderTopicButtons();
    wireTopicButtonEvents();
    syncTopicButtons();

    cards.forEach((card) => {
      const topicTag = card.querySelector('.card-tag');
      const topic = (topicTag ? topicTag.textContent : '').trim() || 'Other';
      card.dataset.topic = topic;
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