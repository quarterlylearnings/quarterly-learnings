# quarterlylearnings.com

Website for Quarterly Learnings: technical training for teams and AI implementation for small businesses.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4, with a component library documented in Storybook. Deployed on Netlify.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | What it does |
| -- | -- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config in `eslint.config.mjs`) |
| `npm run storybook` | Storybook on http://localhost:6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run test:e2e` | Playwright smoke tests (starts the dev server) |

## Project layout

- `app/(site)/` — pages (home, services, about, work, blog, podcast, contact, success, design)
- `components/` — layout, typography, and UI components, each with a `*.stories.tsx`
- `data/case-studies.ts` — case study content for `/work` and the home page preview
- `data/booking.ts` — intro-call booking link shared by `/contact` and `/success`
- `posts/` — blog posts as Markdown, read by `lib/posts.js`
- `public/__forms.html` — static form definition that lets Netlify detect the contact form
- `e2e/` — Playwright tests

## Deployment

Netlify deploys `main` to production and `development` as a branch deploy. Work lands on a feature branch, merges into `development`, and ships when `development` merges into `main`. Launches are tagged as GitHub releases.

The contact form uses Netlify Forms: `ContactForm` posts to `/__forms.html` and redirects to `/success` on success.
