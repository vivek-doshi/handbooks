document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    return;
  }

  const streaksContainer = preloader.querySelector('.streaks');
  const introAudio = new Audio('intro.mp3');
  let finished = false;
  let audioStarted = false;

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

  requestAnimationFrame(() => {
    preloader.classList.add('is-stage-1');
  });

  setTimeout(() => {
    preloader.classList.add('is-stage-2');
    if (streaksContainer) {
      generateStreaks(streaksContainer, { min: 95, max: 125 });
    }
  }, 900);

  setTimeout(() => {
    preloader.classList.add('is-stage-3');
  }, 2200);

  setTimeout(() => {
    finishIntro();
  }, 4100);

  function finishIntro() {
    if (finished) {
      return;
    }

    finished = true;
    preloader.classList.add('is-exiting');
    document.body.classList.remove('is-loading');

    setTimeout(() => {
      preloader.remove();
    }, 650);

    window.removeEventListener('pointerdown', unlockAndPlayAudio);
    window.removeEventListener('keydown', unlockAndPlayAudio);
    window.removeEventListener('touchstart', unlockAndPlayAudio);
  }

  function generateStreaks(container, { min = 30, max = 50 } = {}) {
    container.textContent = '';
    const total = Math.floor(Math.random() * (max - min + 1)) + min;
    const palette = [
      ['#ff2d1e', '#ff5a27', '#9d0015'],
      ['#ff6a00', '#ffb347', '#ff2d1e'],
      ['#ff2f57', '#ff1760', '#8d0038'],
      ['#8a2be2', '#ba6cff', '#355cff'],
      ['#2bbcff', '#5ae1ff', '#2268ff']
    ];

    const sample = (minValue, maxValue) => minValue + Math.random() * (maxValue - minValue);

    for (let index = 0; index < total; index += 1) {
      const colors = palette[Math.floor(Math.random() * palette.length)];
      const streak = document.createElement('span');
      streak.className = 'streak';

      const width = Math.random() > 0.78 ? sample(5, 10) : sample(1.2, 3.8);
      const height = sample(88, 186);
      const xPosition = sample(-2, 102);
      const bottomPosition = sample(-12, 10);
      const delay = sample(0, 480);
      const duration = sample(1400, 2480);
      const drift = sample(-42, 42);
      const blur = Math.random() > 0.74 ? '0.7px' : '0px';

      streak.style.setProperty('--x', `${xPosition}%`);
      streak.style.setProperty('--bottom', `${bottomPosition}%`);
      streak.style.setProperty('--w', `${width}px`);
      streak.style.setProperty('--h', `${height}vh`);
      streak.style.setProperty('--delay', `${delay}ms`);
      streak.style.setProperty('--dur', `${duration}ms`);
      streak.style.setProperty('--drift', `${drift}px`);
      streak.style.setProperty('--blur', blur);
      streak.style.setProperty('--glow', colors[1]);
      streak.style.setProperty('--c1', colors[0]);
      streak.style.setProperty('--c2', colors[1]);
      streak.style.setProperty('--c3', colors[2]);

      if (Math.random() > 0.5) {
        streak.style.opacity = '0.95';
      }

      container.appendChild(streak);
    }

    for (let index = 0; index < 18; index += 1) {
      const colors = palette[(index + 1) % palette.length];
      const streak = document.createElement('span');
      streak.className = 'streak';
      streak.style.setProperty('--x', `${56 + index * 2.3}%`);
      streak.style.setProperty('--bottom', `${sample(-6, 8)}%`);
      streak.style.setProperty('--w', `${sample(2.4, 5.4)}px`);
      streak.style.setProperty('--h', `${sample(130, 210)}vh`);
      streak.style.setProperty('--delay', `${sample(120, 520)}ms`);
      streak.style.setProperty('--dur', `${sample(1650, 2700)}ms`);
      streak.style.setProperty('--drift', `${sample(-18, 22)}px`);
      streak.style.setProperty('--blur', '0px');
      streak.style.setProperty('--glow', colors[1]);
      streak.style.setProperty('--c1', colors[0]);
      streak.style.setProperty('--c2', colors[1]);
      streak.style.setProperty('--c3', colors[2]);
      container.appendChild(streak);
    }
  }
});