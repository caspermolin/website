import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SITE_FILE = path.join(process.cwd(), 'src/database/site.json');

// Initialize site data if it doesn't exist
if (!fs.existsSync(SITE_FILE)) {
  const initialSiteData = {
    metadata: {
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
      }
    },
    locations: {
      main: {
        name: 'Main Location',
        address: 'Koivistokade 58',
        postalCode: '1018 WB',
        city: 'Amsterdam',
        country: 'Netherlands',
        phone: '+31 20 123 4567',
        email: 'info@postavermaas.com',
        coordinates: {
          lat: 52.3676,
          lng: 4.9041
        }
      },
      secondary: {
        name: 'Secondary Location',
        address: 'Brantasgracht 11',
        postalCode: '1018 XT',
        city: 'Amsterdam',
        country: 'Netherlands',
        phone: '+31 20 123 4567',
        email: 'info@postavermaas.com',
        coordinates: {
          lat: 52.3676,
          lng: 4.9041
        }
      }
    },
    company: {
      name: 'Posta Vermaas',
      tagline: 'Sound for Picture',
      description: 'Creating immersive sound experiences for film, television and streaming. Based in Amsterdam.',
      founded: '2008',
      phone: '+31 20 123 4567',
      email: 'info@postavermaas.com',
      social: {
        linkedin: 'https://linkedin.com/company/posta-vermaas',
        twitter: 'https://twitter.com/postavermaas'
      }
    },
    contact: {
      phone: '+31 20 123 4567',
      email: 'info@postavermaas.com',
      address: 'Koivistokade 58, 1018 WB Amsterdam, Netherlands'
    }
  };

  fs.writeFileSync(SITE_FILE, JSON.stringify(initialSiteData, null, 2));
}

export async function GET() {
  try {
    const siteData = fs.readFileSync(SITE_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(siteData));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load site data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;

    // Read current site data
    const currentSiteData = JSON.parse(fs.readFileSync(SITE_FILE, 'utf-8'));

    // Update the specific section
    currentSiteData[section] = data;

    // Write back to file
    fs.writeFileSync(SITE_FILE, JSON.stringify(currentSiteData, null, 2));

    return NextResponse.json({ success: true, message: 'Site data updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update site data' }, { status: 500 });
  }
}
