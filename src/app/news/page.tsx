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
    const newsPage = pages.find(page => page.id === 'news');
    
    return newsPage || null;
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
      title: 'News - Posta Vermaas',
      description: 'Latest news and updates'
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
function renderBlock(block: PageBlock, news: any[]) {
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

    case 'latest-news':
      // Use real news from database
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
            
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((post: any, index: number) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="mb-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category || 'News'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-sm text-slate-500">
                      <span>{post.date}</span>
                      {post.author && (
                        <span>By {post.author}</span>
                      )}
                    </div>
                    {post.slug && (
                      <div className="mt-4">
                        <a
                          href={`/news/${post.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Read more →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No news posts available at the moment.</p>
              </div>
            )}
            
            {block.content.ctaText && block.content.ctaLink && (
              <div className="text-center mt-12">
                <a
                  href={block.content.ctaLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {block.content.ctaText}
                </a>
              </div>
            )}
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

// Fetch news from database
async function getNews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database?type=news`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    return data.news || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsPage() {
  const [page, news] = await Promise.all([
    getPageData(),
    getNews()
  ]);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="pt-20">
      {page.blocks
        .filter(block => block.visible)
        .sort((a, b) => a.order - b.order)
        .map(block => renderBlock(block, news))}
    </div>
  );
}