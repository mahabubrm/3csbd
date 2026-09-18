/* ============================================
   3C SOLUTION — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Year in footer --- */
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  /* --- Navbar scroll effect --- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* --- Mobile nav toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      if (navCta) navCta.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        if (navCta) navCta.classList.remove('open');
      });
    });
  }

  /* --- Active nav link on scroll --- */
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...navItems].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  window.addEventListener('scroll', () => {
    let current = sections[0];
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s; });
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  });

  /* --- Scroll reveal animations --- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* --- Animated counter --- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        if (target.includes('+') || target.includes('/')) {
          // Non-numeric like "25+" or "24/7"
          animateText(el, target);
        } else {
          animateCounter(el, parseInt(target));
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + (el.getAttribute('data-suffix') || '');
    }, 30);
  }

  function animateText(el, target) {
    const numPart = parseInt(target);
    const suffix = target.replace(/\d+/, '');
    let current = 0;
    const step = Math.ceil(numPart / 50);
    const timer = setInterval(() => {
      current += step;
      if (current >= numPart) { current = numPart; clearInterval(timer); }
      el.textContent = current + suffix;
    }, 30);
  }

  /* --- Video autoplay fallback --- */
  const heroVideo = document.querySelector('.video-hero video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      // Autoplay blocked — show poster or muted fallback
      heroVideo.muted = true;
      heroVideo.play().catch(() => {});
    });
  }

  /* --- FormSubmit success message --- */
  const url = new URL(window.location.href);
  if (url.searchParams.get('status') === 'success') {
    alert('Thank you! Your request has been sent successfully. We will contact you soon.');
  }

  /* --- Smooth scroll for anchor links (fallback for older browsers) --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});