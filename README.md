# xyz

Source of https://jordicea.xyz (hosted on Netlify, deploys on push to `master`).

- Astro (static), 3 languages: `/en/`, `/es/`, `/ca/`. `/` redirects by browser language (see `netlify.toml`).
- Translations: `src/i18n/{en,es,ca}.json`.
- Contact form: Netlify Forms (`contact-en`, `contact-es`, `contact-ca`). Configure email notifications in the Netlify dashboard (Forms → Notifications).
- Analytics: Google Analytics 4, loaded only after consent (`src/scripts/site.js`).

## Develop

```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```
