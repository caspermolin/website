import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Types
interface Page {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  created: string;
  lastModified: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  blocks: PageBlock[];
}

interface PageBlock {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  content: any;
  images?: any[];
  settings?: any;
}

// Fetch page data
async function getPageData(): Promise<Page | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pages`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch page data');
    }
    
    const pages: Page[] = await response.json();
    const peoplePage = pages.find(page => page.id === 'people');
    
    return peoplePage || null;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

// Generate metadata from page data
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData();
  
  if (!page) {
    return {
      title: 'People - Posta Vermaas',
      description: 'Meet our team'
    };
  }

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords,
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: 'website',
    },
  };
}

// Render block content
function renderBlock(block: PageBlock, people: any[]) {
  switch (block.type) {
    case 'hero':
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-gradient-to-br from-slate-50 to-blue-50'} ${block.settings?.padding || 'py-20'}`}>
          <div className={`container-custom ${block.settings?.textAlign === 'center' ? 'text-center' : ''}`}>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {block.content.title}
            </h1>
            {block.content.subtitle && (
              <h2 className="text-2xl text-slate-600 mb-4">
                {block.content.subtitle}
              </h2>
            )}
            {block.content.description && (
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
                {block.content.description}
              </p>
            )}
            {block.content.ctaText && block.content.ctaLink && (
              <a
                href={block.content.ctaLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {block.content.ctaText}
              </a>
            )}
          </div>
        </div>
      );

    case 'stats':
      return (
        <div key={block.id} className={`${block.settings?.background || '#ffffff'} ${block.settings?.padding || 'py-16'}`}>
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {block.content.title}
              </h2>
              {block.content.subtitle && (
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  {block.content.subtitle}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {block.content.stats?.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-slate-900 mb-2">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="text-sm text-slate-600">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'team-members':
      // Use real people from database
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-slate-50'} ${block.settings?.padding || 'py-16'}`}>
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {block.content.title}
              </h2>
              {block.content.subtitle && (
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  {block.content.subtitle}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {people.map((member: any, index: number) => (
                <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg ${member.featured ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-600">
                        {member.name?.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {member.name}
                    </h3>
                    <div className="text-blue-600 font-semibold mb-4">
                      {member.role}
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {member.specialties && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((specialty: string, idx: number) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.experience && (
                      <div className="text-sm text-slate-600">
                        <span className="font-semibold">Experience:</span> {member.experience}
                      </div>
                    )}
                    
                    {member.awards && member.awards.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Awards:</h4>
                        <div className="space-y-1">
                          {member.awards.map((award: string, idx: number) => (
                            <div key={idx} className="text-sm text-slate-600">
                              • {award}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.email && (
                      <div className="pt-4 border-t">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                        >
                          Contact {member.name}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'cta':
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-gradient-to-br from-blue-600 to-indigo-700'} ${block.settings?.padding || 'py-20'}`}>
          <div className="container-custom text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {block.content.title}
            </h2>
            {block.content.subtitle && (
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                {block.content.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {block.content.ctaText && block.content.ctaLink && (
                <a
                  href={block.content.ctaLink}
                  className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {block.content.ctaText}
                </a>
              )}
              {block.content.secondaryCtaText && block.content.secondaryCtaLink && (
                <a
                  href={block.content.secondaryCtaLink}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  {block.content.secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Fetch people from database
async function getPeople() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database?type=people`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    
    const data = await response.json();
    return data.people || [];
  } catch (error) {
    console.error('Error fetching people:', error);
    return [];
  }
}

export default async function PeoplePage() {
  const [page, people] = await Promise.all([
    getPageData(),
    getPeople()
  ]);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="pt-20">
      {page.blocks
        .filter(block => block.visible)
        .sort((a, b) => a.order - b.order)
        .map(block => renderBlock(block, people))}
    </div>
  );
}