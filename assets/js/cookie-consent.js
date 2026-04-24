(function () {
  var COOKIE_NAME = 'oneworx_consent';
  var COOKIE_DAYS = 365;

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'ow-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:9999',
      'background:#f5f0e8',        /* cream */
      'border-top:1px solid #1a1a1a', /* ink */
      'padding:16px 24px',
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'flex-wrap:wrap', 'gap:12px',
      'font-family:inherit', 'font-size:14px', 'color:#1a1a1a',
      'box-shadow:0 -2px 12px rgba(0,0,0,0.08)'
    ].join(';');

    var text = document.createElement('p');
    text.style.cssText = 'margin:0;flex:1;min-width:200px;line-height:1.5';
    text.innerHTML = 'We use analytics cookies to improve your experience. ' +
      'See our <a href="/Privacy-policy.html" style="color:#1a1a1a;text-decoration:underline">Privacy Policy</a>.';

    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display:flex;gap:8px;flex-shrink:0';

    var btnAccept = document.createElement('button');
    btnAccept.textContent = 'Accept';
    btnAccept.style.cssText = [
      'padding:8px 20px', 'background:#1a1a1a', 'color:#f5f0e8',
      'border:none', 'cursor:pointer', 'font-size:13px',
      'font-weight:600', 'letter-spacing:0.05em', 'text-transform:uppercase'
    ].join(';');

    var btnDecline = document.createElement('button');
    btnDecline.textContent = 'Decline';
    btnDecline.style.cssText = [
      'padding:8px 20px', 'background:transparent', 'color:#1a1a1a',
      'border:1px solid #1a1a1a', 'cursor:pointer', 'font-size:13px',
      'font-weight:600', 'letter-spacing:0.05em', 'text-transform:uppercase'
    ].join(';');

    btnAccept.addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'accepted', COOKIE_DAYS);
      if (typeof window.initFacebookPixel === 'function') window.initFacebookPixel();
      banner.remove();
    });

    btnDecline.addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'declined', COOKIE_DAYS);
      banner.remove();
    });

    btnWrap.appendChild(btnDecline);
    btnWrap.appendChild(btnAccept);
    banner.appendChild(text);
    banner.appendChild(btnWrap);
    document.body.appendChild(banner);
  }

  var consent = getCookie(COOKIE_NAME);

  if (consent === 'accepted') {
    // Already consented — fire pixel immediately (initFacebookPixel checks _fbPixelLoaded guard)
    if (typeof window.initFacebookPixel === 'function') {
      window.initFacebookPixel();
    } else {
      // Script order safety: pixel init may not be parsed yet
      document.addEventListener('DOMContentLoaded', function () {
        if (typeof window.initFacebookPixel === 'function') window.initFacebookPixel();
      });
    }
  } else if (!consent) {
    // No decision yet — show banner after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  // consent === 'declined' → do nothing
})();
