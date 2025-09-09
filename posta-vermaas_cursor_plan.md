# POSTA VERMAAS — Website hardening & migratieplan
*Voor Cursor (Grok Code Fast 1) — complete, idempotente instructies met codevoorbeelden, checklists en CI.*

> **Doel:** Maak `caspermolin/website` snel, toegankelijk, onderhoudbaar en veilig. Ruim oude/lege/duplicaatbestanden op, verbeter SEO & Core Web Vitals, scherm `/admin` af, en leid verkeer/autoriteit van `studiovermaas.nl` naar `postavermaas.nl` via consistente canonicals en 301-redirects.

---

## Hoe gebruik je dit document in Cursor
1. Open de repo in Cursor en plak de **Master Prompt** hieronder in een nieuw chatvenster met de codebase als context.  
2. Werk **per fase** (A → H). Commit na elke fase (kleine PRs).
3. Run lokaal: `npm run build`, Lighthouse/axe, en bundleanalyzer. Fix issues voordat je door gaat.

---

## MASTER PROMPT — plak dit in Cursor
**Context:** Je bent een senior Next.js/Tailwind/TypeScript engineer. Werk stap-voor-stap, maak kleine commits, en leg kort uit *waarom* je iets doet. Als een stap niet van toepassing is (versie/stack verschilt), sla over en ga door.

### FASE A — Baseline & upgrades
1) **Node & packages**
- Zet Node naar **>= 20** (nvm: `.nvmrc` → `20`).  
- Upgrade: `next`, `react`, `react-dom`, `eslint-config-next`, `typescript` (laatste minor).  
- Voeg/upgrade: `eslint`, `eslint-plugin-jsx-a11y`, `eslint-plugin-unused-imports`, `prettier`.

2) **Env & canonical**
- Zorg dat `NEXT_PUBLIC_SITE_URL` overeenkomt met de **canonieke host** (bijv. `https://www.postavermaas.nl`).  
- Kies **één** variant (met of zonder `www`) en houd die overal consistent (canonicals, host‑redirects, sitemap).

3) **Repo cleanup (globaal)**
- Verwijder verouderde mappen (build-artifacts, ruwe media, `.DS_Store`, ongebruikte data).  
- Voeg aan `.gitignore` toe wat niet mee de repo in hoeft (bijv. `node_modules`, `dist`, `out`, `*.log`).

---

### FASE B — TypeScript & projectstructuur
1) **TypeScript harden** — `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

2) **Dode code & deps**
```bash
npx knip            # ongebruikte exports / files
npx depcheck        # ongebruikte dependencies
npx ts-prune        # ongebruikte TS symbolen
```
- Verwijder wat tools rapporteren (bewust, met commit message).

---

### FASE C — Performance & Core Web Vitals
1) **React Server Components**
- Minimaliseer `use client`; migreer waar mogelijk naar servercomponenten.
- Verminder client-JS via dynamic imports en `suspense`.

2) **Afbeeldingen**
- Gebruik overal `next/image` met `sizes`, `priority` voor LCP, en `placeholder="blur"` waar gepast.  
- Definieer `remotePatterns` als je externe assets gebruikt.

3) **Fonts**
- Vervang `<link>`-geïmporteerde fonts door **`next/font`** (self-hosted) om CLS te vermijden.

4) **Bundles inzichtelijk maken**
```bash
npm i -D @next/bundle-analyzer
# next.config.{js,ts}:
// const withAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
# export default withAnalyzer({ /* config */ })
ANALYZE=true npm run build
```

5) **(Optioneel) Next caching-tuning**
- Als je Next 15+ inzet: overweeg `experimental.staleTimes` per route. Anders: gebruik route‑level caching (`revalidate`, `cache`, fetch‑opties) en ISR waar mogelijk.

---

### FASE D — SEO, metadata & structured data
1) **Default metadata** — `app/layout.tsx`
```tsx
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: { default: 'POSTA VERMAAS — Sound for Storytelling', template: '%s | POSTA VERMAAS' },
  description: 'Audio post voor film & high-end drama: sound design, ADR, foley, Dolby Atmos mix.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'POSTA VERMAAS' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true }
};
```

2) **Per‑pagina `generateMetadata`**
- Unieke titles/descriptions/canonicals voor project‑, people‑ en news‑detail.

3) **Robots & sitemap** (metadata routes)
```ts
// app/robots.ts
import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin'] }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
```

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next';
// Pas deze helpers aan naar jouw datastructuur:
import { getAllProjects, getAllNews } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;

  const staticRoutes = [
    '', '/projects', '/people', '/services', '/facilities', '/news', '/about-us',
    '/contact', '/dutch-cash-rebate', '/source-connect'
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: 0.7 as const }));

  const projects = getAllProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`, changeFrequency: 'monthly', priority: 0.6 as const
  }));

  const news = getAllNews().map((n) => ({
    url: `${base}/news/${n.slug}`, changeFrequency: 'monthly', priority: 0.5 as const
  }));

  return [...staticRoutes, ...projects, ...news];
}
```

4) **Structured Data (JSON‑LD)** — voorbeeld component
```tsx
// app/(marketing)/_components/StructuredData.tsx
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'POSTA VERMAAS',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [
      // Vul echte profielen in:
      'https://www.linkedin.com/company/...',
      'https://www.instagram.com/...',
      'https://www.facebook.com/...'
    ],
    address: [
      { '@type': 'PostalAddress', streetAddress: 'Koivistokade 58', addressLocality: 'Amsterdam', postalCode: '1013 BB', addressCountry: 'NL' },
      { '@type': 'PostalAddress', streetAddress: 'Brantasgracht 11', addressLocality: 'Amsterdam', postalCode: '1019 RK', addressCountry: 'NL' }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

---

### FASE E — Toegankelijkheid (WCAG 2.1 AA)
1) **Quick-wins**
- Voeg **skip-to-content** link toe, corrigeer **heading-volgorde**, zorg dat alle afbeeldingen zinvolle `alt`-teksten hebben (geen “Image:” prefix zichtbaar in content).
- Formuliervelden: `<label>` + `aria-describedby`, duidelijke focus-states (Tailwind).

```tsx
// src/components/a11y/SkipLink.tsx
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-3 focus:bg-white focus:text-black"
    >
      Ga naar hoofdinhoud
    </a>
  );
}
```

- In `app/layout.tsx` direct na `<body>` opnemen en de hoofdcontainer `id="main"` geven.

2) **Automatische checks in CI**
```bash
npx @axe-core/cli http://localhost:3000
```

---

### FASE F — Security & privacy
1) **Admin afschermen + noindex**
- Basis-auth op `/admin` via middleware. Zet env: `ADMIN_BASIC_AUTH=1`, `ADMIN_USER`, `ADMIN_PASS`.
- Header `X-Robots-Tag: noindex` op `/admin`.

2) **Security headers**
- `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` via `headers()` in `next.config`.

3) **Rate-limit + input-validatie**
- Rate-limit op API-routes; valideer input met `zod`.

```ts
// src/lib/ratelimit.ts
const WINDOW_MS = 60_000;
const MAX = 20;
const cache = new Map<string, { count: number; ts: number }>();

export function allow(ip: string) {
  const now = Date.now();
  const rec = cache.get(ip) ?? { count: 0, ts: now };
  if (now - rec.ts > WINDOW_MS) { rec.count = 0; rec.ts = now; }
  rec.count += 1; cache.set(ip, rec);
  return rec.count <= MAX;
}
```

```ts
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { allow } from '@/lib/ratelimit';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
  if (!allow(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  // …verwerking… (mailen/opslaan)
  return NextResponse.json({ ok: true });
}
```

---

### FASE G — Redirects & consolidatie (studiovermaas.nl → postavermaas.nl)
**Doel:** één domein, geen duplicate content, SEO-autoriteit bundelen op `postavermaas.nl`.

1) **Redirect mapping (initieel)**
| Studio URL                         | 301 → Posta                         | Opmerking |
|-----------------------------------|-------------------------------------|----------|
| `/` of `/home`                    | `/`                                 | Home |
| `/work`                           | `/projects`                         | Portfolio index |
| `/about`                          | `/about-us`                         | Over ons |
| `/cash-rebate`                    | `/dutch-cash-rebate`                | Rebate content |
| `/audio-description`              | `/services#audio-description`       | Of subroute `/services/audio-description` |
| `/dummy-home`, `/copy-of-home`    | `/`                                 | Opruimen placeholders |
| `/copy-of-vermaas-news`           | `/news`                             | News hub |

2) **`next.config.ts` (headers + redirects + optionele experimentals)**
```ts
// next.config.ts
import type { NextConfig } from 'next';

const canHost = process.env.CANONICAL_HOST ?? 'www.postavermaas.nl';

const nextConfig: NextConfig = {
  experimental: {
    // Alleen gebruiken als je versie dit ondersteunt; anders verwijderen
    // staleTimes: { dynamic: 30, static: 300 }
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'interest-cohort=()' }
        ]
      },
      { source: '/admin(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/work', destination: '/projects', permanent: true },
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/cash-rebate', destination: '/dutch-cash-rebate', permanent: true },
      { source: '/audio-description', destination: '/services#audio-description', permanent: true },
      { source: '/dummy-home', destination: '/', permanent: true },
      { source: '/copy-of-home', destination: '/', permanent: true },
      { source: '/copy-of-vermaas-news', destination: '/news', permanent: true }
    ];
  }
};

export default nextConfig;
```

3) **`middleware.ts` (canonical host + https + admin basic auth)**
> Let op: Middleware draait op Edge-runtime; gebruik geen Node-only API’s. `btoa` is beschikbaar in Edge.
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = process.env.CANONICAL_HOST || 'www.postavermaas.nl';

export const config = { matcher: ['/:path*', '/admin/:path*'] };

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Force https (indien van toepassing op je hosting)
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  // Canonical host
  if (url.hostname !== CANONICAL_HOST) {
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  // Basic auth voor /admin
  if (url.pathname.startsWith('/admin') && process.env.ADMIN_BASIC_AUTH === '1') {
    const auth = req.headers.get('authorization') || '';
    const expected = 'Basic ' + btoa(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`);
    if (auth !== expected) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
      });
    }
  }

  return NextResponse.next();
}
```

---

### FASE H — CI/CD & kwaliteitspoorten
1) **GitHub Actions** — `.github/workflows/ci.yml`
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck --if-present
      - run: npm run test --if-present
      - run: npm run build
```

2) **Conventional Commits + CODEOWNERS**
- Hou PR’s klein; 1 fase = 1 PR.  

3) **Deployment**
- Koppel Vercel (of eigen infra). Preview deployments per PR.

---

## Definition of Done (DOD)
- **Core Web Vitals** overal “good”.  
- **A11y**: geen critical/serious issues in axe.  
- **SEO**: correcte canonicals, sitemap/robots oké, 301‑redirects actief.  
- **Security**: `/admin` afgeschermd, security headers actief.  
- **Codekwaliteit**: 0 unused deps/exports, ESLint schoon, typecheck clean.  
- **CI**: lint/build/test/axe draaien bij elke PR.

---

## Commands & snippets (cheatsheet)
```bash
# Node & deps
nvm use 20
npm ci

# Upgrades
npm i next@latest react@latest react-dom@latest eslint-config-next@latest -D
npm i -D typescript@latest eslint prettier eslint-plugin-jsx-a11y eslint-plugin-unused-imports

# Cleanup & quality
npx knip
npx depcheck
npx ts-prune
npm run lint
npm run build

# Analyzer
ANALYZE=true npm run build
```

---

## Checklist per fase (voor PR-beschrijvingen)

### Fase A
- [ ] Node >= 20 ingesteld (`.nvmrc`, `engines`).
- [ ] Next/React/TS/ESLint geüpdatet.
- [ ] `NEXT_PUBLIC_SITE_URL` klopt (en sluit aan bij canonical host).
- [ ] `.gitignore` aangevuld, build artefacts verwijderd.

### Fase B
- [ ] `tsconfig` strikt.
- [ ] `knip`/`depcheck`/`ts-prune` gerund en opgeschoond.

### Fase C
- [ ] `next/image` overal toegepast; LCP-afbeelding `priority`.
- [ ] `next/font` i.p.v. externe font-links.
- [ ] Bundleanalyzer gedraaid en grote chunks gesplitst.

### Fase D
- [ ] Default metadata + per‑page metadata op orde.
- [ ] `robots.ts` en `sitemap.ts` actief.

### Fase E
- [ ] Skip‑link aanwezig; headings logisch.
- [ ] Alt-teksten gecontroleerd/gecorrigeerd.
- [ ] axe‑scan => geen critical/serious issues.

### Fase F
- [ ] `/admin` basis-auth + `X-Robots-Tag: noindex`.
- [ ] Security headers actief.
- [ ] API‑input validatie + rate limiting aanwezig.

### Fase G
- [ ] Redirect mapping geïmplementeerd en getest (301).
- [ ] Canonical host en https enforced in middleware.

### Fase H
- [ ] CI (lint/typecheck/test/build) draait en blokkeert bij fouten.
- [ ] Deploy previews per PR.
- [ ] Conventional Commits + CODEOWNERS ingericht.

---

## Notities & TODO’s (pas aan op jouw repo)
- Controleer `.env.example`: geen `*.com` als je site op `*.nl` draait.
- Vul **social profielen** in bij structured data.
- Breng **Studio**-content over naar **Posta** (bijv. als `projects/` items). Voeg JSON‑LD toe voor relevante paginatypes (Organization, NewsArticle, BreadcrumbList, CreativeWork/Movie).
- Check of er “Image:”‑achtige prefixen in zichtbare tekst of alt‑teksten staan en verwijder die.

---

**Klaar.** Gebruik dit document als leidraad in Cursor. Werk gefaseerd, commit klein en meet na elke stap (CWV, Lighthouse, axe). Succes!
