import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'src/database/pages');

// Ensure pages directory exists
if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId;
    const pageFile = path.join(PAGES_DIR, `${pageId}.json`);

    // Check if page file exists
    if (!fs.existsSync(pageFile)) {
      // Return default page structure
      const defaultPage = createDefaultPage(pageId);
      return NextResponse.json(defaultPage);
    }

    // Read and return page data
    const pageData = JSON.parse(fs.readFileSync(pageFile, 'utf-8'));
    return NextResponse.json(pageData);
  } catch (error) {
    console.error('Error reading page:', error);
    return NextResponse.json({ error: 'Failed to load page' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId;
    const pageFile = path.join(PAGES_DIR, `${pageId}.json`);

    const body = await request.json();

    // Write page data to file
    fs.writeFileSync(pageFile, JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Page saved successfully'
    });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

function createDefaultPage(pageId: string) {
  const pageTitles: { [key: string]: string } = {
    homepage: 'Homepage',
    about: 'About Us',
    services: 'Services',
    facilities: 'Facilities',
    people: 'People',
    projects: 'Projects',
    news: 'News',
    contact: 'Contact'
  };

  return {
    id: pageId,
    title: pageTitles[pageId] || 'Page',
    path: pageId === 'homepage' ? '/' : `/${pageId}`,
    type: 'page',
    sections: [],
    metadata: {
      title: `${pageTitles[pageId] || 'Page'} - Posta Vermaas`,
      description: '',
      keywords: [],
      ogImage: '/og-image.jpg',
      canonical: pageId === 'homepage' ? '/' : `/${pageId}`,
      robots: 'index, follow'
    },
    settings: {
      theme: 'auto',
      layout: 'default',
      showBreadcrumbs: true,
      showFooter: true,
      customCSS: '',
      customJS: ''
    },
    lastModified: new Date().toISOString()
  };
}
