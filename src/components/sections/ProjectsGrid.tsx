'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User, Filter, Star, Award, Play, Eye, Clock } from 'lucide-react';
import { Project } from '@/types';

// Projects are loaded via API now

interface GridProps {
  projects?: any[];
  filters?: {
    type: string;
    year: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search: string;
  };
}

export default function ProjectsGrid({ projects: initialProjects = [], filters }: GridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Use provided projects or empty array
  const projects = initialProjects;

  // Advanced filtering and sorting
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply filters if provided
    if (filters) {
      // Type filter
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(project => project.type === filters.type);
      }

      // Year filter
      if (filters.year && filters.year !== 'all') {
        filtered = filtered.filter(project => project.year?.toString() === filters.year);
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(project => {
          // Zoek in titel, regisseur, productiebedrijf, type, beschrijving
          const basicSearch = project.title.toLowerCase().includes(searchTerm) ||
                             project.director?.toLowerCase().includes(searchTerm) ||
                             project.production_company?.toLowerCase().includes(searchTerm) ||
                             project.type?.toLowerCase().includes(searchTerm) ||
                             project.description?.toLowerCase().includes(searchTerm);

          // Zoek in credits (alle audio rollen)
          const credits = project.credits || {};
          const creditsSearch = Object.values(credits).some(creditList =>
            Array.isArray(creditList) && creditList.some(person =>
              typeof person === 'string' && person.toLowerCase().includes(searchTerm)
            )
          );

          return basicSearch || creditsSearch;
        });
      }

      // Sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          let aValue, bValue;

          switch (filters.sortBy) {
            case 'year':
              aValue = a.year || 0;
              bValue = b.year || 0;
              break;
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'type':
              aValue = a.type || '';
              bValue = b.type || '';
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          }
        });
      }
    }

    return filtered;
  }, [projects, filters]);

  // Get featured projects (latest 3 from current year)
  const featuredProjects = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return projects
      .filter(p => p.year === currentYear)
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 3);
  }, [projects]);

  // Format duration
  const formatDuration = (duration: string) => {
    if (!duration) return '';
    // Convert minutes to hours/minutes format
    const minutes = parseInt(duration);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-neutral-600 font-medium">No projects found</div>
          <p className="text-neutral-500 text-sm mt-2">Please check back later for new projects</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View Mode Toggle & Results Count */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-neutral-600">
          <span className="font-semibold text-neutral-900">{filteredProjects.length}</span> projects found
          {filters?.search && (
            <span> for "{filters.search}"</span>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && !filters?.search && filters?.type === 'all' && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-neutral-900">Featured This Year</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : '#F59E0B'} 0%, ${index === 0 ? '#1D4ED8' : index === 1 ? '#059669' : '#D97706'} 100%)`
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Award className="w-8 h-8 opacity-80" />
                    <span className="text-sm font-medium opacity-90">{project.year}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-sm opacity-90 mb-4 line-clamp-2">{project.director}</p>

                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <span>{project.type}</span>
                    {project.duration && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(project.duration)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="bg-white text-neutral-900 px-6 py-3 rounded-full font-semibold hover:bg-neutral-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="#all-projects"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* All Projects Section */}
      <div id="all-projects">
        <div className="flex items-center gap-3 mb-8">
          <Eye className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-900">All Projects</h2>
        </div>

        {/* Projects Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={project.image || project.poster || '/images/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="bg-white/90 backdrop-blur-sm text-neutral-900 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors duration-200 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      {project.imdb && (
                        <a
                          href={project.imdb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors duration-200 flex items-center gap-2"
                        >
                          IMDb
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {project.type}
                    </span>
                  </div>

                  {/* Year Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-primary-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                    {project.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <User className="w-4 h-4" />
                      <span className="line-clamp-1">{project.director}</span>
                    </div>

                    {project.production_company && (
                      <div className="text-sm text-neutral-500">
                        <span className="font-medium">Prod:</span> {project.production_company}
                      </div>
                    )}

                    {project.duration && (
                      <div className="text-sm text-neutral-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(project.duration)}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group-hover:gap-3 transition-all duration-200"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="flex">
                  {/* Poster */}
                  <div className="relative w-32 h-48 flex-shrink-0">
                    <Image
                      src={project.image || project.poster || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span>{project.director}</span>
                          <span>•</span>
                          <span>{project.type}</span>
                          <span>•</span>
                          <span>{project.year}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {project.imdb && (
                          <a
                            href={project.imdb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:text-yellow-700 transition-colors duration-200 p-2 hover:bg-yellow-50 rounded-lg"
                            title="View on IMDb"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13.5 8.5v-1h-3v1h1.5v4h-1.5v1h3v-1h-1.5v-4h1.5zM7.5 8.5v-1h-3v1h1.5v4h-1.5v1h3v-1h-1.5v-4h1.5zM18.5 8.5v-1h-3v1h1.5v4h-1.5v1h3v-1h-1.5v-4h1.5z"/>
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </a>
                        )}
                        <Link
                          href={`/projects/${project.slug}`}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
                        >
                          View Project
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-neutral-500">
                      {project.production_company && (
                        <span><strong>Prod:</strong> {project.production_company}</span>
                      )}
                      {project.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(project.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No projects found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            {filters && (
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}