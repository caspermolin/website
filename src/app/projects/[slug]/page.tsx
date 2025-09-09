import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Play, Award } from 'lucide-react';
import projectsData from '@/database/projects.json';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projectsData.projects.find(p => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container-custom">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {project.type}
                </span>
                <span className="text-neutral-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.year}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                {project.title}
              </h1>

              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                {project.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Director: {project.director}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src={project.image || project.poster || '/images/placeholder.jpg'}
                alt={project.title}
                width={600}
                height={800}
                className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Credits */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Credits</h2>

              <div className="space-y-6">
                {/* Core Credits */}
                {[
                  { key: 'soundDesign', label: 'Sound Design' },
                  { key: 'reRecordingMix', label: 'Re-recording Mix' },
                  { key: 'audioPostProducer', label: 'Audio Post Producer' },
                  { key: 'soundEditor', label: 'Sound Editor' },
                  { key: 'dialogueEditor', label: 'Dialogue Editor' },
                  { key: 'adr', label: 'ADR' },
                  { key: 'foley', label: 'Foley' },
                ].map(({ key, label }) => {
                  const people = project.credits?.[key as keyof typeof project.credits] as string[];
                  return people && people.length > 0 ? (
                    <div key={key}>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">{label}</h3>
                      <div className="flex flex-wrap gap-2">
                        {people.map((person, index) => (
                          <span key={index} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}

                {/* Additional Roles */}
                {project.credits?.additionalRoles && Object.entries(project.credits.additionalRoles).map(([roleName, people]) => {
                  const peopleArray = people as string[];
                  return peopleArray && peopleArray.length > 0 ? (
                    <div key={roleName}>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">{roleName}</h3>
                      <div className="flex flex-wrap gap-2">
                        {peopleArray.map((person, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Project Details</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Year</h3>
                  <p className="text-neutral-600">{project.year}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Type</h3>
                  <p className="text-neutral-600">{project.type}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Director</h3>
                  <p className="text-neutral-600">{project.director}</p>
                </div>

                {project.imdb && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">IMDb</h3>
                    <a
                      href={project.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.5 8.5v-1h-3v1h1.5v4h-1.5v1h3v-1h-1.5v-4h1.5zM7.5 8.5v-1h-3v1h1.5v4h-1.5v1h3v-1h-1.5v-4h1.5zM18.5 8.5v-1h-3v1h1.5v4h-1.5v1h3v-1h-1.5v-4h1.5z"/>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      View on IMDb
                    </a>
                  </div>
                )}

                {project.production_company && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Production Company</h3>
                    <p className="text-neutral-600">{project.production_company}</p>
                  </div>
                )}

                {project.duration && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Duration</h3>
                    <p className="text-neutral-600">{project.duration}</p>
                  </div>
                )}


                {project.client && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Client</h3>
                    <p className="text-neutral-600">{project.client}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      <div className="section-padding bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Related Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsData.projects
              .filter(p => p.id !== project.id && p.type === project.type)
              .slice(0, 3)
              .map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={relatedProject.image || relatedProject.poster || '/images/placeholder.jpg'}
                      alt={relatedProject.title}
                      width={400}
                      height={600}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {relatedProject.title}
                    </h3>
                    <p className="text-neutral-500 text-sm">{relatedProject.year}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}