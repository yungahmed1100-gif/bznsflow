/**
 * BznsFlow — script.js
 * Smooth Scroll · Mobile Menu · Scroll Animations · Navbar Behavior
 * Vanilla JS — No frameworks, no dependencies.
 */

'use strict';

/* ============================================================
   DOM REFERENCES
============================================================ */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const fadeEls      = document.querySelectorAll('.fade-in');

/* ============================================================
   NAVBAR — Scroll-triggered class toggle
============================================================ */
let lastScrollY = window.scrollY;
let ticking     = false;

function handleNavbarScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleNavbarScroll);
    ticking = true;
  }
}, { passive: true });

// Run once on load in case page is already scrolled
handleNavbarScroll();

/* ============================================================
   MOBILE MENU — Hamburger toggle
============================================================ */
function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close menu when a nav link is clicked
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close menu on backdrop click (clicking outside nav links area)
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

/* ============================================================
   SMOOTH SCROLL — Internal anchor links
   (CSS scroll-behavior handles most of this, but this ensures
   consistent behavior across all browsers and offsets for navbar)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navbarHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
    ) || 72;

    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver fade-in
============================================================ */
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Once visible, stop observing for performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeEls.forEach(el => {
  observer.observe(el);
});

/* ============================================================
   HERO — Immediate visibility (no delay for above-the-fold)
============================================================ */
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  // Small delay for cinematic entrance after page load
  setTimeout(() => {
    heroContent.classList.add('visible');
  }, 180);
}

/* ============================================================
   ACTIVE NAV LINK — Highlight based on scroll position
============================================================ */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY;
  const navbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
  ) || 72;

  let current = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - navbarHeight - 80;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      current = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateActiveLink);
}, { passive: true });

/* ============================================================
   WHATSAPP FLOAT — Appear after scroll
============================================================ */
const whatsappFloat = document.getElementById('whatsappFloat');

if (whatsappFloat) {
  // Initially visible but subtle entrance after short delay
  whatsappFloat.style.opacity = '0';
  whatsappFloat.style.transform = 'translateY(16px)';
  whatsappFloat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  setTimeout(() => {
    whatsappFloat.style.opacity = '1';
    whatsappFloat.style.transform = 'translateY(0)';
  }, 1500);
}

/* ============================================================
   PERFORMANCE — Passive video handling
   Ensure video plays on mobile devices that may pause it
============================================================ */
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
  // Attempt to play video on user interaction if autoplay was blocked
  document.addEventListener('touchstart', () => {
    if (heroVideo.paused) {
      heroVideo.play().catch(() => {
        // Video play was rejected; this is expected on some browsers
        // The hero overlay still renders correctly without the video
      });
    }
  }, { once: true, passive: true });

  // Handle video load error gracefully — hero remains functional
  heroVideo.addEventListener('error', () => {
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.style.backgroundImage = 'linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1117 100%)';
    }
  });
}

/* ============================================================
   RESIZE HANDLER — Close mobile menu on desktop resize
============================================================ */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
    closeMenu();
  }
}, { passive: true });

/* ============================================================
   INIT LOG
============================================================ */
console.log('%cBznsFlow — AI Solutions', 'font-size:18px; font-weight:800; color:#4f8ef7;');
console.log('%cBuilt for performance. Engineered to convert.', 'font-size:12px; color:#8b99b5;');
