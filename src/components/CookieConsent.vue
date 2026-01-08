<template>
  <div v-if="showBanner" class="cookie-banner">
    <div class="cookie-content">
      <p>
        $ This site uses Google Analytics to track visits. Accept cookies to enable analytics.
      </p>
      <div class="cookie-actions">
        <button @click="acceptCookies" class="btn-accept">[ accept ]</button>
        <button @click="declineCookies" class="btn-decline">[ decline ]</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component
export default class CookieConsent extends Vue {
  private showBanner = false;

  mounted() {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      this.showBanner = true;
    }
  }

  private acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    this.showBanner = false;
    this.enableAnalytics();
  }

  private declineCookies() {
    localStorage.setItem('cookie-consent', 'declined');
    this.showBanner = false;
    this.disableAnalytics();
  }

  private enableAnalytics() {
    // Enable GA4
    if (window.gtag) {
      (window as any)['ga-disable-G-BZY5CJW9D0'] = false;
      window.gtag('js', new Date());
      window.gtag('config', 'G-BZY5CJW9D0');
    }
  }

  private disableAnalytics() {
    // Disable GA4
    (window as any)['ga-disable-G-BZY5CJW9D0'] = true;
  }
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-color);
  border-top: 1px solid var(--text-color);
  padding: 1em;
  z-index: 9999;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.cookie-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.cookie-content p {
  margin: 0;
  line-height: 1.5;
}

.cookie-actions {
  display: flex;
  gap: 1em;
  justify-content: center;
}

.cookie-actions button {
  background: transparent;
  border: 1px solid var(--text-color);
  color: var(--text-color);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 0.5em 1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cookie-actions button:hover {
  background: var(--text-color);
  color: var(--bg-color);
}

@media (min-width: 600px) {
  .cookie-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .cookie-actions {
    justify-content: flex-end;
  }
}
</style>
