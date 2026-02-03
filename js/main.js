/* ============================================
   MINI AMOUR — Main JavaScript
   No dependencies — vanilla JS only
   ============================================ */

(function () {
  'use strict';

  // ---- DOM ready helper ----
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    initWhatsAppLinks();
    initScrollReveal();
    initHeaderScroll();
    initProductFilters();
    initCountdown();
    initImageLoad();
  });

  // ============================================
  // WhatsApp link binding
  // ============================================
  function initWhatsAppLinks() {
    var WA = window.MiniAmourWA;
    if (!WA) return;

    // General WhatsApp links
    var generalIds = [
      'header-whatsapp',
      'hero-whatsapp',
      'final-whatsapp',
      'floating-whatsapp',
      'footer-whatsapp'
    ];

    generalIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.href = WA.getGeneralLink();
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Product CTA links
    var productBtns = document.querySelectorAll('.product-cta');
    productBtns.forEach(function (btn) {
      var name = btn.getAttribute('data-product') || '';
      var price = btn.getAttribute('data-price') || '';
      btn.href = WA.buildProductLink(name, price);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });

    // Bundle CTA links
    var bundleBtns = document.querySelectorAll('.bundle-cta');
    bundleBtns.forEach(function (btn) {
      var name = btn.getAttribute('data-bundle') || '';
      var price = btn.getAttribute('data-price') || '';
      btn.href = WA.buildBundleLink(name, price);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });
  }

  // ============================================
  // Scroll reveal with IntersectionObserver
  // ============================================
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Fallback: show all if IO not supported
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================
  // Header background on scroll
  // ============================================
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var scrollThreshold = 60;
    var ticking = false;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load
    updateHeader();
  }

  // ============================================
  // Product filter tabs
  // ============================================
  function initProductFilters() {
    var tabs = document.querySelectorAll('.filter-tab');
    var cards = document.querySelectorAll('.product-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = tab.getAttribute('data-filter');

        // Update active tab
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter cards
        cards.forEach(function (card) {
          var gender = card.getAttribute('data-gender');

          if (filter === 'all' || gender === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ============================================
  // Countdown timer to Feb 14, 2026 00:00:00 GMT+4
  // ============================================
  function initCountdown() {
    var daysEl = document.getElementById('countdown-days');
    var hoursEl = document.getElementById('countdown-hours');
    var minsEl = document.getElementById('countdown-mins');
    var secsEl = document.getElementById('countdown-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Feb 14, 2026 00:00:00 UAE time (UTC+4)
    var targetDate = new Date('2026-02-14T00:00:00+04:00').getTime();

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function updateNum(el, value) {
      var padded = pad(value);
      if (el.textContent !== padded) {
        el.textContent = padded;
        el.classList.remove('tick');
        // Trigger reflow for animation restart
        void el.offsetWidth;
        el.classList.add('tick');
      }
    }

    function tick() {
      var now = Date.now();
      var diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);

      updateNum(daysEl, days);
      updateNum(hoursEl, hours);
      updateNum(minsEl, mins);
      updateNum(secsEl, secs);
    }

    // Initial tick
    tick();
    // Update every second
    setInterval(tick, 1000);
  }

  // ============================================
  // Image load detection (remove shimmer)
  // ============================================
  function initImageLoad() {
    var imgWraps = document.querySelectorAll('.product-img-wrap');

    imgWraps.forEach(function (wrap) {
      var img = wrap.querySelector('.product-img');
      if (!img) return;

      if (img.complete && img.naturalHeight > 0) {
        wrap.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          wrap.classList.add('loaded');
        });
        img.addEventListener('error', function () {
          wrap.classList.add('loaded');
        });
      }
    });
  }

})();
