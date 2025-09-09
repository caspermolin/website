import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NAVIGATION_FILE = path.join(process.cwd(), 'src/database/navigation.json');

// Initialize navigation file if it doesn't exist
if (!fs.existsSync(NAVIGATION_FILE)) {
  const initialNavigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
      { name: 'People', href: '/people' },
      { name: 'Services', href: '/services' },
      { name: 'Facilities', href: '/facilities' },
      { name: 'News', href: '/news' }
    ],
    footer: [
      { name: 'About us', href: '/about-us' },
      { name: 'Contact us', href: '/contact' },
      { name: 'Route', href: '/route' },
      { name: 'Dutch Cash Rebate', href: '/dutch-cash-rebate' },
      { name: 'Source Connect', href: '/services/source-connect' }
    ],
    services: [
      { name: 'Dolby Atmos', href: '/services#dolby-atmos' },
      { name: 'Re-recording', href: '/services#re-recording' },
      { name: 'Sound Design', href: '/services#sound-design' },
      { name: 'Foley', href: '/services#foley' },
      { name: 'ADR', href: '/services#adr' },
      { name: 'Source Connect', href: '/services/source-connect' }
    ]
  };

  fs.writeFileSync(NAVIGATION_FILE, JSON.stringify(initialNavigation, null, 2));
}

export async function GET() {
  try {
    const navigation = fs.readFileSync(NAVIGATION_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(navigation));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load navigation' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, navigation } = body;

    // Read current navigation
    const currentNavigation = JSON.parse(fs.readFileSync(NAVIGATION_FILE, 'utf-8'));

    // Update the specific section
    currentNavigation[section] = navigation;

    // Write back to file
    fs.writeFileSync(NAVIGATION_FILE, JSON.stringify(currentNavigation, null, 2));

    return NextResponse.json({ success: true, message: 'Navigation updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 });
  }
}
