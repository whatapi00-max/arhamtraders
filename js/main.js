/* ================================================
   Arham Traders — Main JavaScript
   arhamtraders.shop
   ================================================ */

(function () {
  'use strict';

  /* ===== Navbar scroll effect ===== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ===== Mobile hamburger menu ===== */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when any link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ===== Active nav link based on current page ===== */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentFile || (currentFile === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ===== Smooth scroll for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== Scroll reveal animations ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ===== Counter animation ===== */
  function animateCount(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800;
    const step    = 16;
    const inc     = target / (dur / step);
    let current   = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, step);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ===== Gallery filter ===== */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.g-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.cat === filter;
          item.classList.toggle('hidden', !match);
        });
      });
    });
  }

  /* ===== Lightbox ===== */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');

  let lbImages = [];
  let lbIndex  = 0;

  if (lightbox && lbImg) {
    // Collect all gallery images
    const gItems = document.querySelectorAll('.g-item img');
    lbImages = Array.from(gItems);

    function openLightbox(index) {
      lbIndex = index;
      lbImg.src = lbImages[lbIndex].src;
      lbImg.alt = lbImages[lbIndex].alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    function showNext() {
      lbIndex = (lbIndex + 1) % lbImages.length;
      lbImg.src = lbImages[lbIndex].src;
    }
    function showPrev() {
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      lbImg.src = lbImages[lbIndex].src;
    }

    gItems.forEach((img, i) => {
      img.parentElement.addEventListener('click', () => openLightbox(i));
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbNext)  lbNext.addEventListener('click', showNext);
    if (lbPrev)  lbPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft')  showPrev();
    });
  }

  /* ===== Form validation helper ===== */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('err');
      const errEl = field.parentElement.querySelector('.err-msg');
      if (errEl) errEl.textContent = '';

      if (!field.value.trim()) {
        valid = false;
        field.classList.add('err');
        if (errEl) errEl.textContent = 'This field is required.';
      } else if (field.type === 'email') {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(field.value)) {
          valid = false;
          field.classList.add('err');
          if (errEl) errEl.textContent = 'Please enter a valid email address.';
        }
      } else if (field.type === 'tel') {
        const re = /^[0-9+\-\s()]{7,15}$/;
        if (!re.test(field.value)) {
          valid = false;
          field.classList.add('err');
          if (errEl) errEl.textContent = 'Please enter a valid phone number.';
        }
      }
    });
    return valid;
  }

  function showSuccess(id, duration = 5000) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), duration);
    }
  }

  /* ===== Contact Form ===== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(this)) {
        // ── Connect to your email API or backend here ──
        // e.g. EmailJS: emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', this)
        showSuccess('contact-success');
        this.reset();
      }
    });
  }

  /* ===== Quote Form ===== */
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(this)) {
        showSuccess('quote-success');
        this.reset();
      }
    });
  }

  /* ===== Inline field validation (real-time) ===== */
  document.querySelectorAll('.f-input, .f-textarea, .f-select').forEach(field => {
    field.addEventListener('blur', function () {
      if (this.hasAttribute('required') && !this.value.trim()) {
        this.classList.add('err');
      } else {
        this.classList.remove('err');
      }
    });
    field.addEventListener('input', function () {
      this.classList.remove('err');
      const errEl = this.parentElement.querySelector('.err-msg');
      if (errEl) errEl.textContent = '';
    });
  });

})();
