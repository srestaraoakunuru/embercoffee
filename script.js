/* ============================================
   EMBER CAFÉ — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============ PRELOADER ============
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 1200);
  });

  // ============ CUSTOM CURSOR ============
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.08;
      outlineY += (mouseY - outlineY) * 0.08;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, .menu-card, .gallery-item, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });
  }

  // ============ NAVBAR SCROLL ============
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    lastScroll = scrollY;
  });

  // ============ HAMBURGER / MOBILE MENU ============
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============ HERO ENTRANCE ANIMATION (snappy) ============
  setTimeout(() => {
    const heroElements = ['.hero-tag', '.hero-title', '.hero-subtitle', '.hero-buttons'];
    heroElements.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (el) {
        setTimeout(() => {
          el.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 150);
      }
    });
  }, 1300);

  // ============ SCROLL REVEAL ============
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observerOpts = { threshold: 0.08, rootMargin: '0px 0px -20px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);
  reveals.forEach(el => revealObserver.observe(el));

  // ============ COUNTER ANIMATION ============
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * ease) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ============ PARALLAX EFFECT ============
  const parallaxImages = document.querySelectorAll('.parallax-divider img');
  window.addEventListener('scroll', () => {
    parallaxImages.forEach(img => {
      const parent = img.closest('.parallax-divider');
      const rect = parent.getBoundingClientRect();
      const scrollPercent = rect.top / window.innerHeight;
      img.style.transform = `translateY(${scrollPercent * 60}px)`;
    });
  });

  // ============ HERO IMAGE PARALLAX ============
  const heroImg = document.querySelector('.hero-media img');
  window.addEventListener('scroll', () => {
    if (heroImg) {
      const scroll = window.scrollY;
      heroImg.style.transform = `scale(1.1) translateY(${scroll * 0.3}px)`;
    }
  });

  // ============ MENU TABS ============
  const tabs = document.querySelectorAll('.menu-tab');
  const menuGrid = document.querySelector('.menu-grid');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      const cards = menuGrid.querySelectorAll('.menu-card');
      cards.forEach((card, i) => {
        card.style.transition = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        }, 200);
      });
    });
  });

  // ============ TESTIMONIAL SLIDER ============
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  function showSlide(n) {
    slides.forEach(s => { s.classList.remove('active'); s.style.transform = 'translateX(60px)'; });
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  setInterval(() => showSlide(currentSlide + 1), 5000);

  // ============ AUTH SYSTEM ============
  const loginOverlay = document.querySelector('.login-overlay');
  const loginBtns = document.querySelectorAll('[data-login]');
  const loginClose = document.querySelector('.login-close');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');

  // --- Helper: get stored accounts from localStorage ---
  function getAccounts() {
    try {
      return JSON.parse(localStorage.getItem('ember_accounts')) || [];
    } catch { return []; }
  }
  function saveAccounts(accounts) {
    localStorage.setItem('ember_accounts', JSON.stringify(accounts));
  }

  // --- Helper: session management ---
  function setSession(user) {
    sessionStorage.setItem('ember_session', JSON.stringify(user));
  }
  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem('ember_session'));
    } catch { return null; }
  }
  function clearSession() {
    sessionStorage.removeItem('ember_session');
  }

  // --- Update nav UI based on auth state ---
  function updateAuthUI() {
    const session = getSession();
    const isLoggedIn = !!session;

    // Desktop nav CTA
    const navCta = document.querySelector('.nav-cta[data-login]');
    if (navCta) {
      if (isLoggedIn) {
        navCta.textContent = session.firstName;
        navCta.setAttribute('data-logged-in', 'true');
      } else {
        navCta.textContent = 'Sign In';
        navCta.removeAttribute('data-logged-in');
      }
    }

    // Mobile menu link
    const mobileLoginLink = document.querySelector('.mobile-menu a[data-login]');
    if (mobileLoginLink) {
      if (isLoggedIn) {
        mobileLoginLink.textContent = session.firstName;
        mobileLoginLink.setAttribute('data-logged-in', 'true');
      } else {
        mobileLoginLink.textContent = 'Sign In';
        mobileLoginLink.removeAttribute('data-logged-in');
      }
    }
  }

  // Run on page load to restore session
  updateAuthUI();

  // --- Open login modal (or show user menu if logged in) ---
  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const session = getSession();
      if (session) {
        // Already logged in — confirm sign out
        if (confirm(`Signed in as ${session.firstName} ${session.lastName}.\n\nDo you want to sign out?`)) {
          clearSession();
          updateAuthUI();
          showToast('👋 You have been signed out. See you soon!');
        }
      } else {
        loginOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (loginClose) {
    loginClose.addEventListener('click', () => {
      loginOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  if (loginOverlay) {
    loginOverlay.addEventListener('click', (e) => {
      if (e.target === loginOverlay) {
        loginOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Auth Tabs (Sign In / Create Account) ---
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      authPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.getElementById('auth-' + tab.getAttribute('data-auth-tab'));
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // --- SIGN IN FORM ---
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const pass = document.getElementById('login-pass').value;

      const accounts = getAccounts();
      const user = accounts.find(a => a.email === email && a.password === pass);

      if (user) {
        setSession({ firstName: user.firstName, lastName: user.lastName, email: user.email });
        updateAuthUI();
        showToast(`✓ Welcome back, ${user.firstName}!`);
        loginOverlay.classList.remove('active');
        document.body.style.overflow = '';
        loginForm.reset();
      } else {
        showToast('✗ Invalid email or password. Please try again.');
      }
    });
  }

  // --- SIGN UP FORM ---
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('signup-first').value.trim();
      const lastName = document.getElementById('signup-last').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const phone = document.getElementById('signup-phone').value.trim();
      const pass = document.getElementById('signup-pass').value;
      const confirmPass = document.getElementById('signup-confirm').value;

      if (pass !== confirmPass) {
        showToast('✗ Passwords do not match. Please try again.');
        return;
      }

      const accounts = getAccounts();

      // Check if email already registered
      if (accounts.find(a => a.email === email)) {
        showToast('✗ An account with this email already exists. Please sign in.');
        // Switch to sign-in tab
        authTabs.forEach(t => t.classList.remove('active'));
        authPanels.forEach(p => p.classList.remove('active'));
        authTabs[0].classList.add('active');
        authPanels[0].classList.add('active');
        return;
      }

      // Save new account
      accounts.push({ firstName, lastName, email, phone, password: pass });
      saveAccounts(accounts);

      // Auto-login after signup
      setSession({ firstName, lastName, email });
      updateAuthUI();

      showToast(`✓ Account created! Welcome to the Ember family, ${firstName}!`);
      loginOverlay.classList.remove('active');
      document.body.style.overflow = '';
      signupForm.reset();
    });
  }

  // ============ RESERVATION FORM (Full-page confirmation) ============
  const reservationForm = document.querySelector('.reservation-form');
  const confirmationOverlay = document.getElementById('confirmationOverlay');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Collect form data
      const name = document.getElementById('res-name').value;
      const email = document.getElementById('res-email').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const guests = document.getElementById('res-guests').value;
      // Populate confirmation page
      document.getElementById('confirm-name').textContent = name;
      document.getElementById('confirm-email').textContent = email;
      document.getElementById('confirm-date').textContent = new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      document.getElementById('confirm-time').textContent = time;
      document.getElementById('confirm-guests').textContent = guests;
      // Show full-page confirmation
      confirmationOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      reservationForm.reset();
    });
  }
  // Close confirmation
  const confirmCloseBtn = document.querySelector('.confirmation-close');
  if (confirmCloseBtn) {
    confirmCloseBtn.addEventListener('click', () => {
      confirmationOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // ============ TOAST NOTIFICATION ============
  function showToast(message) {
    const toast = document.querySelector('.toast');
    const toastMsg = toast.querySelector('.toast-message');
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============ TEXT SPLIT ANIMATION ============
  document.querySelectorAll('.text-split').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(40px)';
      span.style.transition = `opacity 0.5s ease ${i * 0.03}s, transform 0.5s ease ${i * 0.03}s`;
      el.appendChild(span);
    });
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        el.querySelectorAll('span').forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0)';
        });
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  // ============ MAGNETIC BUTTONS ============
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ============ SCROLL-DRIVEN MICRO PARALLAX ============
  // Makes elements subtly move as user scrolls, so content feels alive
  const floatElements = document.querySelectorAll('.story-image-wrapper, .stat-number, .order-step, .menu-card, .gallery-item, .section-title, .parallax-quote, .reservation-image');

  function getScrollProgress(el) {
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    // returns -1 (above viewport) to 1 (below viewport), 0 = centered
    return (rect.top + rect.height / 2 - viewH / 2) / viewH;
  }

  let ticking = false;
  function onScrollFloat() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      floatElements.forEach(el => {
        const progress = getScrollProgress(el);
        // Only apply when element is near / in viewport
        if (Math.abs(progress) < 1.2) {
          const y = progress * 18;  // subtle vertical shift
          el.style.willChange = 'transform';
          el.style.transform = `translateY(${y}px)`;
        }
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScrollFloat, { passive: true });

});
