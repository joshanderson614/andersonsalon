/* ============================================================
   Anderson Beauty — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navigation ----------
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll behavior — transparent→solid + hide-on-down / show-on-up
  let lastScrollY = window.scrollY;

  function handleScroll() {
    if (!nav) return;
    const currentY = window.scrollY;

    // Transparent → solid on home page
    if (nav.classList.contains('transparent') && currentY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    }

    // Hide nav when scrolling down past 120px; reveal when scrolling back up
    if (currentY > 120) {
      if (currentY > lastScrollY) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      mobileMenu?.classList.toggle('open');
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Scroll animations ----------
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on position
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach((el, i) => {
      // Auto-stagger siblings
      const siblings = el.parentElement?.querySelectorAll('.fade-up');
      if (siblings) {
        siblings.forEach((s, idx) => {
          if (!s.dataset.delay) s.dataset.delay = idx * 100;
        });
      }
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ---------- Stats counter ----------
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ---------- Close mobile menu on link click ----------
  document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
    });
  });

});
