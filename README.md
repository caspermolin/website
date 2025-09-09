# Posta Vermaas Website

A modern, fast, and accessible website for Posta Vermaas audio post production company. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, minimal design with 12-column grid system
- **Responsive**: Mobile-first approach with breakpoints at 360/768/1024/1280/1536px
- **Accessible**: WCAG 2.1 AA compliant with proper focus management and screen reader support
- **Fast**: Optimized for performance with Lighthouse scores ≥90
- **SEO Optimized**: Complete SEO setup with sitemap, robots.txt, and structured data
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid development

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

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **SEO**: Next SEO
- **Image Optimization**: Next.js Image component with Sharp

## Getting Started

### Prerequisites

- Node.js 18+ 
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

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Sitemap generation
│   ├── robots.ts          # Robots.txt
│   ├── manifest.ts        # PWA manifest
│   └── [pages]/           # Individual pages
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── sections/         # Page sections
│   ├── ui/               # Reusable UI components
│   └── SEO/              # SEO components
├── data/                 # Static data and content
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Content Management

The website uses static data files for content management. To update content:

1. **Projects**: Edit `src/data/projects.ts`
2. **People**: Edit `src/data/people.ts`
3. **Services**: Edit `src/data/services.ts`
4. **News**: Edit `src/data/news.ts`
5. **Facilities**: Edit `src/data/facilities.ts`

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
NEXT_PUBLIC_SITE_URL=https://postavermaas.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

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
