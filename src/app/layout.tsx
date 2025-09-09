import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
    title: {
      default: 'Posta Vermaas - Professional Audio Post Production',
      template: '%s | Posta Vermaas',
    },
    description: 'Professional audio post production services including Dolby Atmos, sound design, re-recording mixing, ADR, and foley. Based in Amsterdam with state-of-the-art facilities.',
    keywords: [
      'audio post production',
      'Dolby Atmos',
      'sound design',
      're-recording mixing',
      'ADR',
      'foley',
      'Amsterdam',
      'film audio',
      'television audio',
      'commercial audio'
    ],
    authors: [{ name: 'Posta Vermaas' }],
    creator: 'Posta Vermaas',
    publisher: 'Posta Vermaas',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://postavermaas.com'),
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/',
        'nl-NL': '/nl',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://postavermaas.com',
      siteName: 'Posta Vermaas',
      title: 'Posta Vermaas - Professional Audio Post Production',
      description: 'Professional audio post production services including Dolby Atmos, sound design, re-recording mixing, ADR, and foley. Based in Amsterdam with state-of-the-art facilities.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Posta Vermaas - Professional Audio Post Production',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Posta Vermaas - Professional Audio Post Production',
      description: 'Professional audio post production services including Dolby Atmos, sound design, re-recording mixing, ADR, and foley.',
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
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
