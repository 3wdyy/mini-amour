/* ============================================
   MINI AMOUR — WhatsApp Integration
   Single source of truth for WhatsApp config
   ============================================ */

(function () {
  'use strict';

  // ---- Configuration ----
  // Update this phone number when ready (UAE format, no +)
  var WHATSAPP_PHONE = '971XXXXXXXXX';
  var BASE_URL = 'https://wa.me/';

  // ---- Link builders ----
  function buildWhatsAppLink(message) {
    var encoded = encodeURIComponent(message || '');
    return BASE_URL + WHATSAPP_PHONE + (encoded ? '?text=' + encoded : '');
  }

  function buildProductLink(productName, price) {
    var msg = 'Hi Mini AMOUR! I\'m interested in the ' + productName;
    if (price && price !== 'TBD') {
      msg += ' (AED ' + price + ')';
    }
    msg += '. Is it available?';
    return buildWhatsAppLink(msg);
  }

  function buildBundleLink(bundleName, price) {
    var msg = 'Hi Mini AMOUR! I\'d like to order the ' + bundleName;
    if (price && price !== 'TBD') {
      msg += ' (AED ' + price + ')';
    }
    msg += '. Can you help me with that?';
    return buildWhatsAppLink(msg);
  }

  function getGeneralLink() {
    return buildWhatsAppLink(
      'Hi Mini AMOUR! I\'m interested in your Valentine\'s Day perfume gift sets. Can you help me?'
    );
  }

  // ---- Expose globally ----
  window.MiniAmourWA = {
    buildWhatsAppLink: buildWhatsAppLink,
    buildProductLink: buildProductLink,
    buildBundleLink: buildBundleLink,
    getGeneralLink: getGeneralLink
  };
})();
