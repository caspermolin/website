'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Calendar, User } from 'lucide-react';
import { Project } from '@/types';

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load featured projects from API
    const loadFeaturedProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database?type=projects`, {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        const allProjects = data.projects || [];

        // Get featured projects, sorted by year (newest first)
        const featured = allProjects
          .filter(project => project.featured === true)
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .slice(0, 6);

        // If we don't have enough featured projects, add the newest ones
        if (featured.length < 6) {
          const additionalProjects = allProjects
            .filter(project => !project.featured)
            .sort((a, b) => (b.year || 0) - (a.year || 0))
            .slice(0, 6 - featured.length);
          featured.push(...additionalProjects);
        }

        console.log('Featured projects loaded:', featured.length);
        setFeaturedProjects(featured as Project[]);
      } catch (error) {
        console.error('Error loading featured projects:', error);
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Discover some of our most recent and acclaimed audio post production work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image || project.poster || '/images/placeholder.jpg'}
                  alt={project.title}
                  width={400}
                  height={600}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-neutral-900 px-6 py-3 rounded-full font-medium hover:bg-primary-50"
                  >
                    View Project
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {project.type}
                  </span>
                  <span className="text-neutral-500 text-sm flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.year}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                  {project.title}
                </h3>
                
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <User className="w-4 h-4" />
                    <span>{project.director}</span>
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 group"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}