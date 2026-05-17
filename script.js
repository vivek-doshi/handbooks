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

  setupHandbookLinkAudioNavigation();

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