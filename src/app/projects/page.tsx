import { Metadata } from 'next';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
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
// Fetch projects from database
async function getProjects() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database?type=projects`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    return (data.projects || []).sort((a, b) => (b.year || 0) - (a.year || 0));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}
// Metadata will be handled by the layout or static metadata
// Render block content
const renderBlock = (block: PageBlock, projects: any[], visibleProjectsCount: number, handleLoadMore: () => void, handleProjectClick: (project: any) => void) => {
  switch (block.type) {
    case 'hero':
      return (
        <div key={block.id} className={`${block.settings?.background || 'bg-gradient-to-br from-primary-50 via-white to-accent-50'} ${block.settings?.padding || 'py-20'}`}>
          <div className={`container-custom ${block.settings?.textAlign === 'center' ? 'text-center' : ''}`}>
            <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6">
              {block.content.title}
            </h1>
            {block.content.subtitle && (
              <h2 className="text-2xl text-neutral-600 mb-4">
                {block.content.subtitle}
              </h2>
            )}
            {block.content.description && (
              <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed mb-8">
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
    case 'featured-projects':
      // Use real projects from database - show all projects
      const featuredProjects = projects;
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
            {/* Projects Filter */}
            <ProjectsFilter
              projects={allProjects}
              onFilterChange={handleFilterChange}
            />
            {featuredProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.slice(0, visibleProjectsCount).map((project: any, index: number) => (
                    <div 
                      key={project.id || index} 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      {/* Project Image */}
                      {project.poster && (
                        <div className="aspect-w-16 aspect-h-9">
                          <img 
                            src={project.poster} 
                            alt={project.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {project.title}
                        </h3>
                        
                        {project.description && (
                          <p className="text-slate-600 mb-4 line-clamp-3">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                          <span className="font-medium">{project.year}</span>
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            {project.type}
                          </span>
                        </div>
                        
                        {project.director && (
                          <div className="mb-3">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Director:</span> {project.director}
                            </p>
                            {project.producer && (
                              <p className="text-sm text-slate-600">
                                <span className="font-semibold">Producer:</span> {project.producer}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {project.credits && (
                          <div className="border-t pt-3">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Credits:</p>
                            <div className="space-y-1">
                              {Object.entries(project.credits).slice(0, 3).map(([role, people]) => (
                                <div key={role} className="text-xs text-slate-600">
                                  <span className="font-medium capitalize">{role.replace(/([A-Z])/g, ' $1').trim()}:</span> {(people as string[]).join(', ')}
                                </div>
                              ))}
                              {Object.keys(project.credits).length > 3 && (
                                <p className="text-xs text-slate-500">+{Object.keys(project.credits).length - 3} more roles</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {project.imdb && (
                          <div className="mt-3 pt-3 border-t">
                            <a 
                              href={project.imdb} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View on IMDb →
                            </a>
                          </div>
                        )}
                        
                        <div className="mt-4 text-center">
                          <span className="text-xs text-slate-400">Click for full details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {featuredProjects.length > visibleProjectsCount && (
                  <div className="text-center mt-12">
                    <p className="text-slate-600 mb-4">
                      Showing {visibleProjectsCount} of {featuredProjects.length} projects
                    </p>
                    <button 
                      onClick={handleLoadMore}
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Load More Projects
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No projects available at the moment.</p>
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
export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Our Projects
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover our latest audio post production work across feature films, television series, and streaming content.
          </p>
        </div>
      </div>
      {/* Projects Grid */}
      <div className="bg-slate-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Featured Projects
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A selection of our most recent and acclaimed audio post production work
            </p>
          </div>
          <ProjectsGrid projects={projects} />
        </div>
      </div>
    </div>
  );
}
