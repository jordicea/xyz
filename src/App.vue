<template>
  <div id="app">
    <ThemeToggle />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isDaytime } from './utils/sunCalc';
import ThemeToggle from '@/components/ThemeToggle.vue';

@Component({
  components: {
    ThemeToggle
  }
})
export default class App extends Vue {
  private updateTheme() {
    // Check if user has manually set a theme preference
    const override = localStorage.getItem('theme-override');

    if (override) {
      // User has manually selected a theme, respect it
      if (override === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    } else {
      // Auto-detect based on time
      const isDay = isDaytime();
      if (isDay) {
        document.documentElement.classList.remove('dark-theme');
      } else {
        document.documentElement.classList.add('dark-theme');
      }
    }
  }

  mounted() {
    this.updateTheme();

    // Update theme every hour (only if no manual override)
    setInterval(() => {
      if (!localStorage.getItem('theme-override')) {
        this.updateTheme();
      }
    }, 60 * 60 * 1000);
  }
}
</script>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #2c3e50;
  --link-color: #1abc9c;
  --nav-link-color: #2c3e50;
  --hr-color: #e5e5e5;
}

:root.dark-theme {
  --bg-color: #0d1117;
  --text-color: #c9d1d9;
  --link-color: #1abc9c;
  --nav-link-color: #c9d1d9;
  --hr-color: #30363d;
}

body {
    margin: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items:center;
  color: var(--text-color);
  margin: 0 auto;
}

.home {
    margin: 0 auto;
    width:380px;
    display: flex;
    flex-direction: column;
}

.home h1 {
    margin-top: 1em;
}

#nav {
  padding: 30px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.nav-prompt {
  color: var(--link-color);
  margin-right: 0.5em;
}

#nav a {
  color: var(--nav-link-color);
  margin: 0 0.8em;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.2s ease;
}

#nav a:hover {
  border-bottom: 1px solid var(--link-color);
}

#nav a.router-link-exact-active {
  color: var(--link-color);
}
</style>
