import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jordicea.xyz',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thanks/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es', ca: 'ca' } },
    }),
  ],
});
