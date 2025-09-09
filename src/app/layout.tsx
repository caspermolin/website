import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StructuredData from '@/components/SEO/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Fetch site metadata from database
async function getSiteMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/site`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const siteData = await response.json();
      return siteData.metadata;
    }
  } catch (error) {
    console.error('Error fetching site metadata:', error);
  }

  // Fallback metadata
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.postavermaas.nl'),
    title: { default: 'POSTA VERMAAS — Sound for Storytelling', template: '%s | POSTA VERMAAS' },
    description: 'Audio post voor film & high-end drama: sound design, ADR, foley, Dolby Atmos mix.',
    alternates: { canonical: '/' },
    openGraph: { type: 'website', siteName: 'POSTA VERMAAS' },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true }
  };
}

// Generate metadata from database
export async function generateMetadata(): Promise<Metadata> {
  return await getSiteMetadata();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <StructuredData />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
