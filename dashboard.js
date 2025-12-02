

// dashboard.js
// Tab switching + mobile nav toggle

(function () {
  // Elements
  const nav = document.querySelector('.sidebar-nav');
  const logo = document.querySelector('.sidebar-logo');
  const links = Array.from(document.querySelectorAll('.sidebar-nav a'));
  const contents = Array.from(document.querySelectorAll('.tab-content'));

  // --- Tab switching logic ---
  function showTab(targetId) {
    // hide all contents
    contents.forEach(c => c.classList.remove('active'));
    // remove active from all links
    links.forEach(l => l.classList.remove('active'));

    // show target content and set active link
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.add('active');

    const link = links.find(l => l.dataset.target === targetId);
    if (link) link.classList.add('active');
  }

  // attach click events for tab behavior
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.dataset.target;
      if (!targetId) return;

      showTab(targetId);

      // On mobile, collapse the nav after selecting an item
      if (window.innerWidth < 768 && nav.classList.contains('open')) {
        nav.classList.remove('open');
      }

      // scroll top of main-content to make section visible
      document.querySelector('.main-content').scrollIntoView({behavior: 'smooth'});
    });
  });

  // Make sure initial state is correct (show the first active tab)
  (function initActive() {
    const activeLink = links.find(l => l.classList.contains('active'));
    if (activeLink && activeLink.dataset.target) {
      showTab(activeLink.dataset.target);
    } else if (links.length) {
      showTab(links[0].dataset.target);
    }
  })();

  // --- Mobile nav toggle: create button and handle open/close ---
  function ensureToggle() {
    // remove existing toggle if any
    const existing = document.querySelector('.mobile-nav-toggle');
    if (existing) existing.remove();

    if (window.innerWidth < 768) {
      const btn = document.createElement('button');
      btn.className = 'mobile-nav-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.innerText = 'Menu';
      btn.addEventListener('click', function () {
        const open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      // insert button after logo
      logo.parentNode.insertBefore(btn, logo.nextSibling);

      // hide nav by default on small screens
      nav.classList.remove('open');
    } else {
      // larger screens: ensure nav visible and no toggle present
      nav.classList.remove('open');
    }
  }

  window.addEventListener('resize', ensureToggle);
  window.addEventListener('DOMContentLoaded', ensureToggle);
  // call once in case script loads after DOM ready
  ensureToggle();

  // Optional: keyboard navigation
  links.forEach((l, idx) => {
    l.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = links[(idx + 1) % links.length];
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = links[(idx - 1 + links.length) % links.length];
        prev.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        l.click();
      }
    });
  });

})();
