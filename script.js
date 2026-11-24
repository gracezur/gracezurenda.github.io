/* ========================================
   Grace Zurenda — Portfolio Scripts
   Canva-Inspired Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. Side nav active link highlighting ----
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      navLinks.forEach(link => {
        if (link.getAttribute('data-section') === id) {
          link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        }
      });
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav(); // Run on load

  // ---- 2. Smooth scroll for nav links ----
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      // Close mobile nav if open
      const sideNav = document.getElementById('sideNav');
      const mobileToggle = document.getElementById('mobileNavToggle');
      if (sideNav) sideNav.classList.remove('mobile-open');
      if (mobileToggle) mobileToggle.classList.remove('active');
      document.body.style.overflow = '';

      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    });
  });

  // ---- 3. Mobile nav toggle ----
  const mobileToggle = document.getElementById('mobileNavToggle');
  const sideNav = document.getElementById('sideNav');

  if (mobileToggle && sideNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      sideNav.classList.toggle('mobile-open');
      document.body.style.overflow = sideNav.classList.contains('mobile-open') ? 'hidden' : '';
    });
  }

  // ---- 4. Scroll reveal (Intersection Observer) ----
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');

      // Trigger counter animation if stat
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach(counter => {
        if (!counter.dataset.counted) {
          animateCounter(counter);
          counter.dataset.counted = 'true';
        }
      });

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---- 5. Counter animation ----
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target) || target <= 0) return;

    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  }

  // ---- 6. Decorative parallax on mouse ----
  const decos = document.querySelectorAll('.deco');

  if (decos.length && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      decos.forEach((deco, i) => {
        const speed = ((i % 5) + 1) * 4;
        const direction = i % 2 === 0 ? 1 : -1;
        deco.style.transform = `translate(${x * speed * direction}px, ${y * speed}px)`;
      });
    });
  }

  // ---- 7. Project carousels ----
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let current = 0;
    const total = slides.length;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch / swipe support
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  });

});
