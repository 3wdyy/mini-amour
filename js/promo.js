/* ============================================
   MINI AMOUR — Promo Code System
   Handles code validation, price reveal,
   and URL parameter auto-apply
   ============================================ */

(function () {
  'use strict';

  // ---- Configuration ----
  var VALID_CODES = ['AMOUR', 'VALENTINE', 'VIP'];
  var PROMO_APPLIED_KEY = 'miniamour_promo_applied';

  // ---- State ----
  var promoApplied = false;

  // ---- DOM ready helper ----
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    checkUrlParam();
    checkSessionStorage();
    initPromoForm();
    initExitPopupApply();
  });

  // ============================================
  // Check URL parameter for auto-apply
  // ============================================
  function checkUrlParam() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get('code') || params.get('promo');
    if (code && isValidCode(code)) {
      applyPromoCode(code.toUpperCase(), true);
    }
  }

  // ============================================
  // Check session storage for previously applied code
  // ============================================
  function checkSessionStorage() {
    if (promoApplied) return;
    try {
      var saved = sessionStorage.getItem(PROMO_APPLIED_KEY);
      if (saved && isValidCode(saved)) {
        applyPromoCode(saved, true);
      }
    } catch (e) {
      // Session storage not available
    }
  }

  // ============================================
  // Initialize promo form handlers
  // ============================================
  function initPromoForm() {
    var input = document.getElementById('promo-input');
    var applyBtn = document.getElementById('promo-apply');

    if (!input || !applyBtn) return;

    // Handle apply button click
    applyBtn.addEventListener('click', function () {
      var code = input.value.trim();
      if (code && isValidCode(code)) {
        applyPromoCode(code.toUpperCase(), false);
      } else if (code) {
        shakeInput(input);
      }
    });

    // Handle enter key
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyBtn.click();
      }
    });

    // Auto-uppercase input
    input.addEventListener('input', function () {
      input.value = input.value.toUpperCase();
    });
  }

  // ============================================
  // Initialize exit popup apply button
  // ============================================
  function initExitPopupApply() {
    var exitApplyBtn = document.getElementById('exit-popup-apply');
    var exitPopup = document.getElementById('exit-popup');

    if (!exitApplyBtn) return;

    exitApplyBtn.addEventListener('click', function () {
      // Apply the code
      applyPromoCode('AMOUR', false);

      // Close the popup
      if (exitPopup) {
        exitPopup.classList.remove('active');
        exitPopup.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // ============================================
  // Validate promo code
  // ============================================
  function isValidCode(code) {
    return VALID_CODES.indexOf(code.toUpperCase()) !== -1;
  }

  // ============================================
  // Apply promo code — the magic happens here
  // ============================================
  function applyPromoCode(code, silent) {
    if (promoApplied) return;
    promoApplied = true;

    // Save to session storage
    try {
      sessionStorage.setItem(PROMO_APPLIED_KEY, code);
    } catch (e) {}

    // Update UI
    showSuccessState(code);
    updatePrices();
    updateWhatsAppLinks();
    updateHeroPriceAnchor();

    // Smooth scroll to products if not silent (user entered code manually)
    if (!silent) {
      setTimeout(function () {
        var productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800);
    }
  }

  // ============================================
  // Show success state in promo section
  // ============================================
  function showSuccessState(code) {
    var promoBox = document.getElementById('promo-box');
    var promoSuccess = document.getElementById('promo-success');
    var codeStrong = promoSuccess ? promoSuccess.querySelector('strong') : null;

    if (promoBox) {
      promoBox.style.display = 'none';
    }
    if (promoSuccess) {
      promoSuccess.style.display = 'flex';
      if (codeStrong) {
        codeStrong.textContent = code;
      }
    }

    // Update WhatsApp exclusive messaging
    var waExclusive = document.getElementById('whatsapp-exclusive');
    if (waExclusive) {
      waExclusive.innerHTML = '<p class="whatsapp-exclusive-text"><strong>Exclusive pricing unlocked!</strong> Direct distributor prices applied.</p>';
    }

    // Add body class for styling hooks
    document.body.classList.add('promo-active');
  }

  // ============================================
  // Update all prices to promo prices
  // ============================================
  function updatePrices() {
    // Update product cards
    var products = document.querySelectorAll('.product-card[data-retail][data-promo]');
    products.forEach(function (card) {
      var retail = card.getAttribute('data-retail');
      var promo = card.getAttribute('data-promo');
      var priceEl = card.querySelector('.price-amount');
      var wasEl = card.querySelector('.product-price-was');

      if (priceEl && retail && promo) {
        // Show strikethrough retail price
        if (wasEl) {
          wasEl.textContent = 'AED ' + formatPrice(retail);
          wasEl.style.display = 'inline';
        }
        // Update to promo price
        priceEl.textContent = formatPrice(promo);
        // Add animation class
        priceEl.classList.add('price-updated');
      }
    });

    // Update bundle cards
    var bundles = document.querySelectorAll('.bundle-card[data-retail][data-promo]');
    bundles.forEach(function (card) {
      var retail = card.getAttribute('data-retail');
      var promo = card.getAttribute('data-promo');
      var priceEl = card.querySelector('.price-amount');
      var wasEl = card.querySelector('.bundle-price-was');

      if (priceEl && retail && promo) {
        if (wasEl) {
          wasEl.textContent = 'AED ' + formatPrice(retail);
          wasEl.style.display = 'inline';
        }
        priceEl.textContent = formatPrice(promo);
        priceEl.classList.add('price-updated');
      }
    });
  }

  // ============================================
  // Update WhatsApp links to use promo prices
  // ============================================
  function updateWhatsAppLinks() {
    var WA = window.MiniAmourWA;
    if (!WA) return;

    // Update product CTA links
    var productBtns = document.querySelectorAll('.product-cta[data-promo-price]');
    productBtns.forEach(function (btn) {
      var name = btn.getAttribute('data-product') || '';
      var promoPrice = btn.getAttribute('data-promo-price') || '';
      if (promoPrice) {
        btn.href = WA.buildProductLink(name, promoPrice);
      }
    });

    // Update bundle CTA links
    var bundleBtns = document.querySelectorAll('.bundle-cta[data-promo-price]');
    bundleBtns.forEach(function (btn) {
      var name = btn.getAttribute('data-bundle') || '';
      var promoPrice = btn.getAttribute('data-promo-price') || '';
      if (promoPrice) {
        btn.href = WA.buildBundleLink(name, promoPrice);
      }
    });
  }

  // ============================================
  // Update hero price anchor
  // ============================================
  function updateHeroPriceAnchor() {
    var anchor = document.getElementById('hero-price-anchor');
    if (anchor) {
      anchor.innerHTML = 'Gift sets from <strong>AED 249</strong>';
    }
  }

  // ============================================
  // Helper: Format price with commas
  // ============================================
  function formatPrice(price) {
    var num = parseInt(price, 10);
    if (isNaN(num)) return price;
    return num.toLocaleString('en-US');
  }

  // ============================================
  // Helper: Shake input on invalid code
  // ============================================
  function shakeInput(input) {
    input.classList.add('shake');
    setTimeout(function () {
      input.classList.remove('shake');
    }, 500);
  }

  // ============================================
  // Expose for potential external use
  // ============================================
  window.MiniAmourPromo = {
    isApplied: function () { return promoApplied; },
    apply: applyPromoCode
  };

})();
