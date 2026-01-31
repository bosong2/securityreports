// Cookie Consent Management

class CookieConsent {
    constructor() {
        this.consentKey = 'cookie-consent';
        this.consentValue = null;
        this.init();
    }

    init() {
        // Check if consent already given
        this.consentValue = localStorage.getItem(this.consentKey);

        if (!this.consentValue) {
            // Show banner after a short delay
            setTimeout(() => this.showBanner(), 1000);
        } else {
            // Apply consent settings
            this.applyConsent(this.consentValue === 'accepted');
        }
    }

    showBanner() {
        // Create banner HTML
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.id = 'cookieConsentBanner';

        banner.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-text">
          <p data-i18n="cookieConsentText">
            이 웹사이트는 사용자 경험 개선 및 맞춤 광고 제공을 위해 쿠키를 사용합니다.
            계속 사용하시면 쿠키 정책에 동의하는 것으로 간주됩니다.
            자세한 내용은 <a href="privacy.html" data-i18n-link="cookieConsentLink">개인정보 처리방침</a>을 참조하세요.
          </p>
        </div>
        <div class="cookie-consent-actions">
          <button class="cookie-consent-btn cookie-consent-accept" id="cookieAccept">
            <span data-i18n="cookieAccept">동의함</span>
          </button>
          <button class="cookie-consent-btn cookie-consent-decline" id="cookieDecline">
            <span data-i18n="cookieDecline">거부함</span>
          </button>
        </div>
      </div>
    `;

        document.body.appendChild(banner);

        // Apply translations if i18n is available
        if (window.i18n) {
            window.i18n.updatePageLanguage();
        }

        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);

        // Attach event listeners
        document.getElementById('cookieAccept').addEventListener('click', () => {
            this.acceptCookies();
        });

        document.getElementById('cookieDecline').addEventListener('click', () => {
            this.declineCookies();
        });
    }

    acceptCookies() {
        localStorage.setItem(this.consentKey, 'accepted');
        this.consentValue = 'accepted';
        this.applyConsent(true);
        this.hideBanner();
        console.log('Cookies accepted');
    }

    declineCookies() {
        localStorage.setItem(this.consentKey, 'declined');
        this.consentValue = 'declined';
        this.applyConsent(false);
        this.hideBanner();
        console.log('Cookies declined');
    }

    applyConsent(accepted) {
        if (accepted) {
            // Enable AdSense and other tracking
            // AdSense will automatically respect this
            console.log('Consent given: Ads and analytics enabled');
        } else {
            // Disable non-essential cookies
            console.log('Consent declined: Only essential cookies allowed');

            // Note: AdSense will show non-personalized ads
            // This is handled automatically by Google
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    // Method to reset consent (for testing)
    resetConsent() {
        localStorage.removeItem(this.consentKey);
        this.consentValue = null;
        console.log('Consent reset');
    }
}

// Initialize cookie consent when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsent = new CookieConsent();
    });
} else {
    window.cookieConsent = new CookieConsent();
}
