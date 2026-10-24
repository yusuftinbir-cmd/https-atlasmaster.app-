/**
 * atlasmaster.app — Cloudflare Web Analytics (RUM) Kosullu Yukleyici (/js/olcum.js)
 * Cerez, banner veya parmak izi kullanmaz; yalnizca:
 *   (a) Otomasyon tarayicilarini (navigator.webdriver === true)
 *   (b) ?olcme=1 parametresiyle isaretlenen ic cihazlari (localStorage['am_olcme'] === '1')
 * ziyaret sayacindan haric tutar.
 */
(function () {
  'use strict';
  try {
    var search = window.location && window.location.search ? window.location.search : '';
    if (search) {
      var params = new URLSearchParams(search);
      if (params.get('olcme') === '1') {
        try {
          window.localStorage.setItem('am_olcme', '1');
        } catch (_) {}
        return;
      }
      if (params.get('olcme') === '0') {
        try {
          window.localStorage.removeItem('am_olcme');
        } catch (_) {}
      }
    }

    if (navigator.webdriver === true) {
      return;
    }

    try {
      if (window.localStorage && window.localStorage.getItem('am_olcme') === '1') {
        return;
      }
    } catch (_) {}

    if (document.querySelector('script[data-cf-beacon]')) {
      return;
    }

    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', '{"token": "45cebae6af65484e8fed23b68faa175f"}');
    (document.head || document.documentElement).appendChild(s);
  } catch (_) {}
})();
