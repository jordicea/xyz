<template>
  <button @click="toggleTheme" class="theme-toggle" :title="currentTheme === 'light' ? 'dark mode' : 'light mode'">
    {{ currentTheme === 'light' ? '[ dark ]' : '[ light ]' }}
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ThemeToggle extends Vue {
  private currentTheme: 'light' | 'dark' = 'light';

  mounted() {
    this.updateCurrentTheme();
    this.watchThemeChanges();
  }

  private updateCurrentTheme() {
    this.currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
  }

  private watchThemeChanges() {
    const observer = new MutationObserver(() => {
      this.updateCurrentTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private toggleTheme() {
    if (this.currentTheme === 'light') {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme-override', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme-override', 'light');
    }
    this.updateCurrentTheme();
  }
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  z-index: 1000;
  padding: 0;
}

.theme-toggle:hover {
  opacity: 1;
}
</style>
