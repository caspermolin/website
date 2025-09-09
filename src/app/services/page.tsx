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
    const servicesPage = pages.find(page => page.id === 'services');
    
    return servicesPage || null;
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
      title: 'Services - Posta Vermaas',
      description: 'Audio post production services'
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

    case 'service-highlights':
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
              {block.content.services?.map((service: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'adr-focus':
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-gradient-to-r from-blue-50 to-indigo-50'} ${block.settings?.padding || 'py-16'}`}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {block.content.features?.map((feature: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <ul className="space-y-3">
                    {feature.items?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center text-slate-600">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'services-detailed':
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
            
            <div className="space-y-16">
              {block.content.services?.map((service: any, index: number) => (
                <div key={index} className="bg-slate-50 rounded-2xl p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">Features:</h4>
                        <ul className="space-y-2">
                          {service.features?.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center text-slate-600">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {service.equipment && (
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">Equipment:</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.equipment.map((item: string, idx: number) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {service.workflow && (
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">Workflow:</h4>
                          <ol className="space-y-2">
                            {service.workflow.map((step: string, idx: number) => (
                              <li key={idx} className="flex items-start text-slate-600">
                                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                                  {idx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      {service.deliverables && (
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">Deliverables:</h4>
                          <ul className="space-y-1">
                            {service.deliverables.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-center text-slate-600">
                                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'workflow':
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
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {block.content.steps?.map((step: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-6">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
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

export default async function ServicesPage() {
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