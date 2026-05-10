// ===== SWARAJ MAKHANA — MAIN JS =====

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 1600);
});

// ===== NAVBAR SCROLL =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 60);
    // Hide nav on fast scroll down, show on scroll up
    if (scrollY > lastScroll + 5 && scrollY > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = scrollY;
  }
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
}

// ===== FLOATING MAKHANA PARTICLES =====
function createParticles() {
  const container = document.getElementById('floatingMakhana');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'makhana-particle';
    const size = Math.random() * 60 + 20;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --duration: ${Math.random() * 8 + 6}s;
      --delay: ${Math.random() * -10}s;
    `;
    container.appendChild(p);
  }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(el => {
    const text = el.textContent;
    const hasK = text.includes('K');
    const hasPlus = text.includes('+');
    const num = parseInt(text.replace(/[^0-9]/g, ''));
    if (!num) return;

    let current = 0;
    const increment = num / 60;
    const timer = setInterval(() => {
      current = Math.min(current + increment, num);
      el.textContent = Math.floor(current) + (hasK ? 'K' : '') + (hasPlus ? '+' : '');
      if (current >= num) clearInterval(timer);
    }, 25);
  });
}

// Trigger counter when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

// ===== MOBILE MENU =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
}

// ===== CONTACT FORM =====
function submitContact(e) {
  e.preventDefault();
  showToast('🪷 Message sent! We\'ll reply within 24 hours.');
  e.target.reset();
}

// ===== NEWSLETTER =====
function subscribeNewsletter() {
  const input = document.querySelector('.newsletter-form input');
  if (!input || !input.value.trim()) {
    showToast('⚠️ Please enter your email');
    return;
  }
  if (!input.value.includes('@')) {
    showToast('⚠️ Enter a valid email address');
    return;
  }
  showToast('🎉 Subscribed! Check your inbox for 10% off.');
  input.value = '';
}

// ===== TOAST =====
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== TESTIMONIAL CARD SCROLL (track-only, never moves the page) =====
let testimonialInterval;
let currentTestimonial = 0;

function scrollTestimonialCard(idx) {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards[idx]) return;
  // Scroll only within the track element — never touches window scroll
  const cardLeft = cards[idx].offsetLeft - track.offsetLeft;
  track.scrollTo({ left: cardLeft, behavior: 'smooth' });
  // Update dots
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

function startTestimonialAutoScroll() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % 6;
    scrollTestimonialCard(currentTestimonial);
  }, 4000);
}

function stopTestimonialAutoScroll() {
  clearInterval(testimonialInterval);
}

// ===== PAGE LOAD INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();

  // Small delay for render
  setTimeout(() => {
    initReveal();
  }, 200);

  // Animate hero stats when hero section is visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // Start testimonial auto scroll ONLY after user scrolls or clicks — never on load
  let autoScrollStarted = false;
  function maybeStartAutoScroll() {
    if (!autoScrollStarted) {
      autoScrollStarted = true;
      startTestimonialAutoScroll();
    }
  }
  window.addEventListener('scroll', maybeStartAutoScroll, { once: true });
  window.addEventListener('click', maybeStartAutoScroll, { once: true });

  // Add reveal classes to sections
  const sectionsToReveal = [
    '.about-content', '.about-visual',
    '.products-header', '.product-card',
    '.nutrition-content', '.nutrition-visual',
    '.testimonial-card', '.testimonials .section-title',
    '.globe-content', '.contact-info', '.contact-form',
    '.nutrition-card', '.pillar'
  ];

  sectionsToReveal.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add('reveal');
      }
      revealObserver.observe(el);
    });
  });

  // Pause testimonial on hover
  const track = document.getElementById('testimonialsTrack');
  if (track) {
    track.addEventListener('mouseenter', stopTestimonialAutoScroll);
    track.addEventListener('mouseleave', startTestimonialAutoScroll);
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // Lazy-load product images effect
  document.querySelectorAll('.product-img').forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    setTimeout(() => {
      img.style.transition = 'opacity 0.5s, transform 0.5s';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 100);
  });
});

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu?.classList.contains('open')) toggleMenu();
  }
});