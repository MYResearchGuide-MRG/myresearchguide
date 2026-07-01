# MYResearchGuide (MRG)

The official website for **MYResearchGuide** — a not-for-profit, student-run initiative
founded in 2026, built in collaboration with Malaysian researchers from top institutions
around the world. Its mission is to make science research accessible to all Malaysian youth
by bridging the gap between curiosity and opportunity.

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** TypeScript + JavaScript (mixed)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com) with CSS variables; [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) primitives
- **Animation:** [Framer Motion](https://www.framer.com/motion/), [embla-carousel](https://www.embla-carousel.com) (auto-scrolling carousels)
- **Email:** [Resend](https://resend.com) (contact form)
- **Extras:** [COBE](https://cobe.vercel.app) (globe visualization), React Bootstrap (accordions)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp .env.example .env.local   # then fill in RESEND_API_KEY

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` in the project root:

```bash
RESEND_API_KEY=re_xxxxxxxx   # required for the contact form (/api/send) and for `next build`
```

> The production build collects data for the `/api/send` route at build time, so
> `RESEND_API_KEY` must be set for `npm run build` to succeed.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Pages / routes

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Home — hero, university carousel, community stats, researcher teaser, FAQ |
| `/team` | `src/app/team/` | About Us — consolidated intro + committees & advisors |
| `/researchers` | `src/app/researchers/` | Researcher directory with search + filters (university / field / level) |
| `/partner-sponsor` | `src/app/partner-sponsor/` | Partners (auto-scroll carousel) & Sponsors (Gold tier) |
| `/contact` | `src/app/contact/` | Contact form (posts to `/api/send`) |
| `/api/send` | `src/app/api/send/route.tsx` | Resend email endpoint for the contact form |

## Editing content

Most content is defined as data/arrays inside components — no CMS.

- **Researchers** — `src/data/researchers.js` is the single source of truth (used by both the
  home-page teaser in `src/components/Cards.tsx` and the `/researchers` directory). Each entry
  supports `name`, `tagline`, `universities[]`, `field[]`, `level`, `research`, `image`,
  `linkedin`, `scholar`, `website`, `twitter`, `github`, and `interview`. Missing fields are
  fine — empty `image` falls back to an initials avatar.
- **Partners & Sponsors** — edit the `partners` and `goldSponsors` arrays in
  `src/app/partner-sponsor/PartnerSponsor(chalk).tsx`. Each org has a `name`, `logo`,
  `description`, and `link` (partners also support per-logo `logoFit` / `logoPad`).
- **About Us copy** — `src/app/team/missionnvision.jsx`; team members — `src/app/team/committees.jsx`.
- **Contact recipient** — set in `src/app/api/send/route.tsx`.
- **Images / logos** — live in `public/` (e.g. `public/interviews/` for researcher photos,
  partner/sponsor logos at the project root of `public/`).

## Project structure

```
src/
├── app/                # App Router pages, layout, and the /api/send route
│   ├── page.tsx        # Home
│   ├── team/           # About Us
│   ├── researchers/    # Researcher directory (data-driven)
│   ├── partner-sponsor/# Partners & Sponsors
│   ├── contact/        # Contact form
│   └── api/send/       # Resend email endpoint
├── components/         # Shared components + components/ui (shadcn/ui)
├── data/               # researchers.js (content source of truth)
└── lib/                # utils (cn, etc.)
public/                 # Static assets (logos, photos, images)
```

## Deployment

Deploy on any Node host or [Vercel](https://vercel.com). Set `RESEND_API_KEY` in the host's
environment variables, then build and start:

```bash
npm run build
npm run start
```
