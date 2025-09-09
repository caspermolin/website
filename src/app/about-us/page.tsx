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
    const aboutPage = pages.find(page => page.id === 'about');
    
    return aboutPage || null;
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
      title: 'About Us - Posta Vermaas',
      description: 'Learn about Posta Vermaas audio post production'
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
function renderBlock(block: PageBlock) {
  switch (block.type) {
    case 'hero':
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-gradient-to-br from-primary-50 to-accent-50'} ${block.settings?.padding || 'py-16'}`}>
          <div className={`container-custom ${block.settings?.textAlign === 'left' ? 'text-left' : 'text-center'}`}>
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

    case 'text':
      return (
        <div key={block.id} className={`${block.settings?.background || '#ffffff'} ${block.settings?.padding || 'section-padding'}`}>
          <div className="container-custom">
            <div className={`${block.settings?.textAlign === 'center' ? 'text-center' : ''}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {block.content.title}
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {block.content.content}
              </p>
            </div>
          </div>
        </div>
      );

    case 'stats':
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

    case 'values':
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
              {block.content.values?.map((value: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'timeline':
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
            
            <div className="max-w-4xl mx-auto">
              {block.content.timeline?.map((item: any, index: number) => (
                <div key={index} className="flex items-start mb-12">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'awards':
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
              {block.content.awards?.map((award: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {award.name}
                    </h3>
                    <div className="text-blue-600 font-semibold mb-2">
                      {award.year}
                    </div>
                    <div className="text-slate-600 mb-2">
                      {award.category}
                    </div>
                    <div className="text-sm text-slate-500">
                      {award.project}
                    </div>
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

export default async function AboutPage() {
  const page = await getPageData();

  if (!page) {
    notFound();
  }

  return (
    <div className="pt-20">
      {page.blocks
        .filter(block => block.visible)
        .sort((a, b) => a.order - b.order)
        .map(block => renderBlock(block))}
    </div>
  );
}