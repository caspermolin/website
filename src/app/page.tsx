import { Metadata } from 'next';
import Image from 'next/image';
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
    const homepage = pages.find(page => page.id === 'homepage');
    
    return homepage || null;
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
      title: 'POSTA VERMAAS Sound for Picture',
      description: 'Audio post production for feature films and television'
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
function renderBlock(block: PageBlock, homepageData: {projects: any[], news: any[]}) {
  switch (block.type) {
    case 'hero':
      return (
        <div key={block.id} className={`${block.settings?.background || 'gradient-to-br from-slate-900 via-slate-800 to-slate-900'} ${block.settings?.padding || 'min-h-screen flex items-center justify-center'}`}>
          <div className={`container-custom ${block.settings?.textAlign === 'center' ? 'text-center' : ''}`}>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {block.content.title}
            </h1>
            {block.content.subtitle && (
              <h2 className="text-2xl text-slate-300 mb-4">
                {block.content.subtitle}
              </h2>
            )}
            {block.content.description && (
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
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

    case 'services':
      return (
        <div key={block.id} className={`${block.settings?.background || '#ffffff'} ${block.settings?.padding || 'section-padding'}`}>
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {block.content.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {block.content.services?.map((service: string, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {service}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'usp':
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-slate-50'} ${block.settings?.padding || 'py-20'}`}>
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
              {block.content.usps?.map((usp: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {usp.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {usp.description}
                  </p>
                  {usp.features && (
                    <ul className="space-y-2">
                      {usp.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center text-slate-600">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'featured-projects':
      // Use real projects from database, get featured projects or newest ones
      const allProjects = homepageData.projects || [];
      const featuredProjects = allProjects
        .filter(project => project.featured === true)
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .slice(0, 6);

      // If we don't have enough featured projects, add the newest ones
      if (featuredProjects.length < 6) {
        const additionalProjects = allProjects
          .filter(project => !project.featured)
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .slice(0, 6 - featuredProjects.length);
        featuredProjects.push(...additionalProjects);
      }
      
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
            
            {featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project: any, index: number) => (
                  <div key={project.id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Project Image */}
                    {project.poster && (
                      <div className="aspect-w-16 aspect-h-9">
                          <Image
                            src={project.poster}
                            alt={project.title}
                            width={400}
                            height={225}
                            className="w-full h-48 object-cover"
                          />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {project.title}
                      </h3>
                      
                      {project.description && (
                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center text-sm text-slate-500 mb-3">
                        <span className="font-medium">{project.year}</span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {project.type}
                        </span>
                      </div>
                      
                      {project.director && (
                        <p className="text-sm text-slate-600 mb-2">
                          <span className="font-semibold">Director:</span> {project.director}
                        </p>
                      )}
                      
                      {project.credits && (
                        <div className="border-t pt-3">
                          <p className="text-xs text-slate-500">
                            <span className="font-semibold">Key Credits:</span> {Object.keys(project.credits).length} roles
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No featured projects available at the moment.</p>
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

    case 'latest-news':
      // Use real news from database, limit to 3 for homepage
      const latestNews = homepageData.news.slice(0, 3);
      
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
            
            {latestNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestNews.map((post: any, index: number) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="text-sm text-slate-500">
                      {post.date}
                    </div>
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

    case 'partners':
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {block.content.partners?.map((partner: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-slate-600">
                      {partner.name?.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {partner.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Fetch data from database
async function getHomepageData() {
  try {
    const [projectsResponse, newsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database?type=projects`, {
        cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database?type=news`, {
        cache: 'no-store'
      })
    ]);
    
    const [projectsData, newsData] = await Promise.all([
      projectsResponse.ok ? projectsResponse.json() : { projects: [] },
      newsResponse.ok ? newsResponse.json() : { news: [] }
    ]);
    
    return {
      projects: (projectsData.projects || []).sort((a: any, b: any) => (b.year || 0) - (a.year || 0)),
      news: newsData.news || []
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { projects: [], news: [] };
  }
}

export default async function HomePage() {
  const [page, homepageData] = await Promise.all([
    getPageData(),
    getHomepageData()
  ]);
  
  if (!page) {
    notFound();
  }

  return (
    <div>
      {page.blocks
        .filter(block => block.visible)
        .sort((a, b) => a.order - b.order)
        .map(block => renderBlock(block, homepageData))}
    </div>
  );
}