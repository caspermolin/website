'use client';

import { useEffect, useState } from 'react';
import { Film, Tv, Camera, Award, Calendar, Users, MapPin } from 'lucide-react';

// Import the actual database
import projectsData from '@/database/projects.json';

export default function ProjectsStats() {
  const [stats, setStats] = useState({
    total: 0,
    featureFilms: 0,
    tvSeries: 0,
    documentaries: 0,
    shorts: 0,
    commercials: 0,
    years: 0,
    latestYear: 0
  });

  useEffect(() => {
    // Calculate statistics from projects data
    const projects = projectsData.projects || [];
    const years = [...new Set(projects.map(p => p.year).filter(y => y))];
    const latestYear = Math.max(...years);

    const statsData = {
      total: projects.length,
      featureFilms: projects.filter(p => p.type === 'Feature Film').length,
      tvSeries: projects.filter(p => p.type === 'TV/VOD series').length,
      documentaries: projects.filter(p => p.type === 'Documentary').length,
      shorts: projects.filter(p => p.type === 'Short').length,
      commercials: projects.filter(p => p.type === 'Commercials').length,
      years: years.length,
      latestYear: latestYear
    };

    setStats(statsData);
  }, []);

  const statItems = [
    {
      icon: Film,
      value: stats.total,
      label: 'Total Projects',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Tv,
      value: stats.tvSeries,
      label: 'TV Series',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Camera,
      value: stats.featureFilms,
      label: 'Feature Films',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Award,
      value: stats.documentaries,
      label: 'Documentaries',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Calendar,
      value: stats.years,
      label: 'Years Active',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: MapPin,
      value: stats.latestYear,
      label: 'Latest Work',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`${item.bgColor} rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-sm border border-white/50`}
        >
          <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
          <div className="text-2xl font-bold text-neutral-900 mb-1">
            {item.value}
          </div>
          <div className="text-sm text-neutral-600 font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
