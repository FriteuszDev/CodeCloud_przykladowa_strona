(function () {
  'use strict';

  const translations = {
    pl: {
      'nav.creators': 'Twórcy',
      'nav.portfolio': 'Portfolio',
      'nav.reviews': 'Opinie',
      'nav.viewPortfolio': 'Zobacz portfolio',
      'hero.badge1': 'Najwyższa jakość',
      'hero.badge2': 'Szybka realizacja',
      'hero.title1': 'Montaż wideo',
      'hero.title2': 'który wciąga.',
      'hero.desc': 'Ponad 3 lata doświadczenia we współpracy z czołowymi twórcami. Tworzę narracje, które trzymają uwagę widza.',
      'hero.ctaPrimary': 'Zobacz portfolio →',
      'hero.ctaSecondary': 'Mój Discord',
      'hero.scroll': 'Zobacz prace ↓',
      'creators.label': '83+ twórców już mi zaufało',
      'works.title1': 'Wybrane',
      'works.title2': 'prace',
      'works.cta': 'Zobacz pełne portfolio',
      'reviews.title': 'Co mówią klienci',
      'reviews.subtitle': 'Oto opinie zadowolonych twórców',
      'reviews.role': 'YouTuber',
      'discord.title': 'Sprawdź mojego Discorda',
      'discord.desc': 'Zamów montaż przez wygodny system ticketów albo po prostu wpadnij pogadać z innymi twórcami!',
      'discord.cta': 'Dołącz na serwer',
      'footer.copy': '© 2026 Portfolio. Wszelkie prawa zastrzeżone.'
    },
    en: {
      'nav.creators': 'Creators',
      'nav.portfolio': 'Portfolio',
      'nav.reviews': 'Reviews',
      'nav.viewPortfolio': 'View Portfolio',
      'hero.badge1': 'Best Quality',
      'hero.badge2': 'Fast Turnaround',
      'hero.title1': 'Video editing',
      'hero.title2': 'that hooks.',
      'hero.desc': 'Over 3 years of experience working with top creators. I craft narratives that hold the viewer\'s attention.',
      'hero.ctaPrimary': 'View Portfolio →',
      'hero.ctaSecondary': 'My Discord',
      'hero.scroll': 'See works ↓',
      'creators.label': '83+ creators already trusted me',
      'works.title1': 'Selected',
      'works.title2': 'Works',
      'works.cta': 'View Full Portfolio',
      'reviews.title': 'What my clients say',
      'reviews.subtitle': 'Here\'s what my satisfied clients have to say',
      'reviews.role': 'YouTuber',
      'discord.title': 'Check out my Discord',
      'discord.desc': 'Order your edit through the convenient ticket system, or just stop by to chat with other creators!',
      'discord.cta': 'Join the server',
      'footer.copy': '© 2026 Portfolio. All rights reserved.'
    }
  };

  const STORAGE_KEY = 'portfolio-lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'pl';

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    setLanguage(currentLang);
  }

  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration = 1100) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 72;
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        smoothScrollTo(targetY, 1200);
      });
    });
  }

  function initCustomCursor() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || prefersReduced) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-custom-cursor');

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let rafId = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    const hoverTargets = 'a, button, .btn, .nav__link, .lang-btn, .work-card, .review-card, .logo, .badge';
    const strongTargets = '.btn--primary, .btn--outline';

    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (el.matches(strongTargets)) document.body.classList.add('cursor-hover-strong');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-hover-strong');
      });
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  window.portfolioRefresh = function () {
    setLanguage(currentLang);
    initRevealAnimations();
  };

  function init() {
    initLangSwitcher();
    initRevealAnimations();
    initSmoothScroll();
    initCustomCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();