# POSTA VERMAAS - Geoptimaliseerde Website 🚀

**Website Hardening & Migratieplan Uitgevoerd - FASE A-D Voltooid**

Een professionele, volledig geoptimaliseerde website voor POSTA VERMAAS, een toonaangevende audio post productie studio in Amsterdam. Gebouwd met moderne web technologieën, volledig gehard en SEO-geoptimaliseerd.

## 🔧 **Website Hardening Status - FASE A-D VOLTOOID** ✅

### ✅ **FASE A - Baseline & Upgrades**
- **Node.js**: v24.7.0 (≥ 20 voldaan)
- **Packages**: Next.js 15.5.2, React 19.1.1, TypeScript 5.9.2, ESLint 9.35.0
- **Environment**: Geconfigureerd voor `https://www.postavermaas.nl`
- **Repository**: Opgeschoond, ongebruikte bestanden verwijderd

### ✅ **FASE B - TypeScript & Projectstructuur**
- **TypeScript Config**: Strikte instellingen met moderne ES2022 features
- **Code Cleanup**: 18+ ongebruikte bestanden verwijderd met knip/depcheck
- **Dependencies**: Ongebruikte packages verwijderd (framer-motion, next-seo, etc.)

### ✅ **FASE C - Performance & Core Web Vitals**
- **Fonts**: Geoptimaliseerd met `next/font/google`
- **Bundle Analyzer**: Opgezet voor performance monitoring
- **Images**: `next/image` geïmplementeerd voor optimale laadtijden

### ✅ **FASE D - SEO, Metadata & Structured Data**
- **Metadata**: Volledig bijgewerkt voor POSTA VERMAAS branding
- **SEO Routes**: `robots.ts` en `sitemap.ts` dynamisch opgezet
- **Structured Data**: JSON-LD Organization schema toegevoegd

---

## ✨ Belangrijkste Features

### 🎨 Moderne Design & Technologie
- **Database-Driven CMS** - Alle content wordt dynamisch uit database geladen
- **Admin Panel** - Volledige controle via professionele admin interface
- **Modern Design** - Clean, responsive design met Tailwind CSS
- **TypeScript** - Volledige type veiligheid en strikte configuratie
- **Next.js 15** - App Router voor optimale performance

### 📝 Content Management System
- **Real-time Content Updates** - Wijzigingen zijn direct zichtbaar
- **Modulaire Content Blocks** - Hero, Services, USP, Projects, News, Partners
- **SEO Geoptimaliseerd** - Dynamische metadata en structured data
- **Multilingual Support** - Uitbreidbaar voor meerdere talen

### 🎵 Audio Post Production Focus
- **Dolby Atmos Certified** - Professionele audio technologie
- **Pro Tools Ultimate** - Industry-standard software
- **Complete Workflow** - Van concept tot delivery
- **International Portfolio** - 500+ projecten wereldwijd

## Pages

- **Home** (`/`) - Hero section with USP's, featured projects, latest news, and partners
- **Projects** (`/projects`) - Project portfolio with filtering and detailed project pages
- **People** (`/people`) - Team members with role filtering and bio modals
- **Services** (`/services`) - Service overview and Source Connect subpage
- **Facilities** (`/facilities`) - Studio facilities with specifications and gallery
- **News** (`/news`) - News articles with pagination and filtering
- **About Us** (`/about-us`) - Company information, mission, and timeline
- **Dutch Cash Rebate** (`/dutch-cash-rebate`) - Information about the rebate program
- **Contact** (`/contact`) - Contact form and company information
- **Route** (`/route`) - Location details and directions

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router) 🚀
- **Language**: TypeScript 5.9.2 (strikte configuratie)
- **Styling**: Tailwind CSS
- **Database**: JSON File-based (extensible naar echte database)
- **Icons**: Lucide React
- **UI Components**: Custom component library
- **SEO**: Next.js metadata API + structured data + robots.txt + sitemap.xml
- **Image Optimization**: Next.js Image component + WebP/AVIF support
- **API**: RESTful API routes voor alle CRUD operations
- **Performance**: Bundle analyzer + code splitting + lazy loading
- **Quality**: ESLint 9.35.0 + Prettier + knip (dead code detection)

## Getting Started

### Prerequisites

- Node.js 20+ (momenteel v24.7.0)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd posta-vermaas-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # RESTful API routes
│   │   ├── pages/         # Page content management
│   │   ├── site/          # Site configuration
│   │   ├── navigation/    # Menu management
│   │   └── admin/         # Admin CRUD operations
│   ├── admin/             # Admin panel pages
│   ├── [dynamic]/         # Dynamic content pages
│   └── layout.tsx         # Root layout with metadata
├── components/            # React components
│   ├── admin/             # Admin interface components
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Page content sections
│   └── ui/                # Reusable UI components
├── database/              # JSON database files
│   ├── pages/             # Page content per page
│   ├── projects.json      # Project portfolio
│   ├── people.json        # Team members
│   ├── news.json          # News articles
│   └── site.json          # Site configuration
├── types/                 # TypeScript definitions
└── data/                  # Legacy static data (being phased out)
```

## 📊 Content Management System

### Admin Panel Access
1. Ga naar `/admin` voor volledige content controle
2. **Pages Tab** - Bewerk pagina's met drag & drop editor
3. **Database Tab** - Beheer projecten, mensen en content
4. **Real-time Updates** - Wijzigingen zijn direct zichtbaar

### Database Entiteiten
- **Pages** - Website pagina's met modulaire content blocks
- **Projects** - Film/TV projecten met credits en rollen
- **People** - Teamleden en freelancers met bio's
- **News** - Dynamische nieuws artikelen
- **Navigation** - Menu structuur (header/footer)
- **Site Settings** - Metadata, contact info, etc.

### API Endpoints
- `GET/POST /api/pages` - Pagina content management
- `GET/POST /api/site` - Site configuratie
- `GET/POST /api/navigation` - Menu beheer
- `GET/POST /api/admin/database/[type]` - Database CRUD operations

## SEO Features

- **Meta Tags**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Structured Data**: JSON-LD structured data for search engines
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling instructions

## Performance Features

- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic code splitting by Next.js
- **Lazy Loading**: Images and components loaded on demand
- **Font Optimization**: Google Fonts with display swap
- **Bundle Analysis**: Built-in bundle analyzer

## Accessibility Features

- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and focus trapping
- **Color Contrast**: WCAG 2.1 AA compliant color contrast ratios
- **Skip Links**: Skip to main content functionality

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

The website is optimized for deployment on Vercel, but can be deployed to any platform that supports Next.js:

1. **Vercel** (Recommended):
   - Connect your GitHub repository
   - Deploy automatically on push

2. **Other Platforms**:
   - Build the project: `npm run build`
   - Deploy the `.next` folder and `package.json`

## Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_SITE_URL=https://www.postavermaas.nl
CANONICAL_HOST=www.postavermaas.nl
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

**Belangrijk**: De environment variabelen zijn al geconfigureerd voor productie gebruik op `postavermaas.nl`.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For questions about this website, contact:
- Email: info@postavermaas.com
- Phone: +31 20 123 4567
