import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'src/database/content.json');

// Initialize content file if it doesn't exist
if (!fs.existsSync(CONTENT_FILE)) {
  const initialContent = {
    homepage: {
      hero: {
        title: 'Dutch market-leading audiopost facility',
        subtitle: 'for feature films and hi-end TV- and VOD-drama',
        description: 'Operating from the heart of its motion-picture industry, Amsterdam, POSTA VERMAAS provides complete audio post production packages for feature films and high-end television productions.'
      },
      services: [
        'Sound Design',
        'Re-recording Mixing',
        'ADR Recording',
        'Foley Recording',
        'Dolby Atmos',
        'Source Connect'
      ]
    },
    about: {
      title: 'About Posta Vermaas',
      description: 'Founded in 2008, POSTA VERMAAS is the Dutch market-leading audiopost facility for feature films and hi-end TV- and VOD-drama operating from the heart of its motion-picture industry, Amsterdam.',
      mission: 'To elevate storytelling through exceptional sound design and immersive audio experiences.',
      vision: 'To be Europe\'s most respected audio post production facility.'
    },
    services: {
      title: 'Our Services',
      description: 'Complete audio post production services from concept to delivery.'
    },
    facilities: {
      title: 'Our Facilities',
      description: 'State-of-the-art audio studios equipped with the latest technology.'
    },
    people: {
      title: 'Our Team',
      description: 'Meet our experienced professionals.'
    },
    contact: {
      title: 'Contact Us',
      address: 'Koivistokade 58, Amsterdam',
      phone: '+31 20 123 4567',
      email: 'info@postavermaas.nl'
    }
  };

  fs.writeFileSync(CONTENT_FILE, JSON.stringify(initialContent, null, 2));
}

export async function GET() {
  try {
    const content = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, content } = body;

    // Read current content
    const currentContent = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));

    // Update the specific section
    currentContent[section] = content;

    // Write back to file
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(currentContent, null, 2));

    return NextResponse.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
