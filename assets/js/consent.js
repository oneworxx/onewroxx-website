(function() {
  var CONSENT_COOKIE = 'oneworx_consent';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'ow-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
      'background:#1a1a2e', 'color:#fff', 'padding:16px 24px',
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'flex-wrap:wrap', 'gap:12px', 'font-family:sans-serif', 'font-size:14px',
      'box-shadow:0 -2px 12px rgba(0,0,0,0.3)'
    ].join(';');

    banner.innerHTML = [
      '<div style="flex:1;min-width:200px;line-height:1.5">',
      'We use cookies and tracking technologies to improve your experience and for analytics. ',
      'By clicking \u201cAccept All\u201d, you consent to our ',
      '<a href="/privacy-policy.html" style="color:#a0c4ff">Privacy Policy</a>.',
      ' Under India\u2019s DPDP Act 2023, you may decline non-essential tracking.',
      '</div>',
      '<div style="display:flex;gap:10px;flex-shrink:0">',
      '<button id="ow-consent-decline" style="padding:8px 16px;border:1px solid #fff;',
      'background:transparent;color:#fff;border-radius:4px;cursor:pointer;font-size:13px">',
      'Decline</button>',
      '<button id="ow-consent-accept" style="padding:8px 16px;border:none;',
      'background:#4a90e2;color:#fff;border-radius:4px;cursor:pointer;font-size:13px;font-weight:500">',
      'Accept All</button>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    document.getElementById('ow-consent-accept').onclick = function() {
      document.cookie = CONSENT_COOKIE + '=accepted; max-age=31536000; path=/; SameSite=Lax';
      banner.remove();
      if (typeof window.initFacebookPixel === 'function') window.initFacebookPixel();
      if (typeof window.initGoogleAnalytics === 'function') window.initGoogleAnalytics();
    };

    document.getElementById('ow-consent-decline').onclick = function() {
      document.cookie = CONSENT_COOKIE + '=declined; max-age=31536000; path=/; SameSite=Lax';
      banner.remove();
    };
  }

  var consent = getCookie(CONSENT_COOKIE);
  if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  } else if (consent === 'accepted') {
    if (typeof window.initFacebookPixel === 'function') {
      document.addEventListener('DOMContentLoaded', function() {
        window.initFacebookPixel();
      });
    }
  }
})();
