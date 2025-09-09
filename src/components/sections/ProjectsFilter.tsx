'use client';

import { useState, useEffect } from 'react';
import { Filter, Search, SortAsc, SortDesc, X } from 'lucide-react';

interface FilterProps {
  projects: any[];
  onFilterChange: (filters: {
    type: string;
    year: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search: string;
  }) => void;
}

export default function ProjectsFilter({ projects, onFilterChange }: FilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAllYears, setShowAllYears] = useState(false);

  // Get available years from projects
  const availableYears = Array.from(
    new Set(projects?.map(p => p.year).filter(y => y))
  ).sort((a, b) => b - a);

  // Get all unique people from credits for search suggestions
  const getAllPeople = () => {
    const people = new Set<string>();

    if (!projects) return [];

    projects.forEach(project => {
      // Add director
      if (project.director) people.add(project.director);

      // Add production company
      if (project.production_company) people.add(project.production_company);

      // Add all people from credits
      const credits = project.credits || {};
      Object.values(credits).forEach(creditList => {
        if (Array.isArray(creditList)) {
          creditList.forEach(person => {
            if (typeof person === 'string') people.add(person);
          });
        }
      });
    });

    return Array.from(people).sort();
  };

  const allPeople = getAllPeople();

  const projectTypes = [
    { value: 'all', label: 'All Projects', count: projects?.length || 0 },
    { value: 'Feature Film', label: 'Feature Film', count: projects?.filter(p => p.type === 'Feature Film').length || 0 },
    { value: 'TV/VOD series', label: 'TV/VOD series', count: projects?.filter(p => p.type === 'TV/VOD series').length || 0 },
    { value: 'Documentary', label: 'Documentary', count: projects?.filter(p => p.type === 'Documentary').length || 0 },
    { value: 'Short', label: 'Short', count: projects?.filter(p => p.type === 'Short').length || 0 },
    { value: 'TV Movie', label: 'TV Movie', count: projects?.filter(p => p.type === 'TV Movie').length || 0 },
    { value: 'Commercials', label: 'Commercials', count: projects?.filter(p => p.type === 'Commercials').length || 0 }
  ];

  const sortOptions = [
    { value: 'year', label: 'Year' },
    { value: 'title', label: 'Title' },
    { value: 'type', label: 'Type' }
  ];

  const handleTypeChange = (type: string) => {
    onFilterChange({
      type,
      year: 'all', // Reset other filters when changing type
      sortBy: 'year',
      sortOrder: 'desc',
      search: ''
    });
  };

  const handleYearChange = (year: string) => {
    onFilterChange({
      type: 'all', // Reset other filters when changing year
      year,
      sortBy: 'year',
      sortOrder: 'desc',
      search: ''
    });
  };

  const handleSortChange = (newSortBy: string) => {
    onFilterChange({
      type: 'all',
      year: 'all',
      sortBy: newSortBy,
      sortOrder: 'desc',
      search: ''
    });
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    onFilterChange({
      type: 'all',
      year: 'all',
      sortBy: 'year',
      sortOrder: order,
      search: ''
    });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({
      type: 'all',
      year: 'all',
      sortBy: 'year',
      sortOrder: 'desc',
      search
    });
  };

  const clearFilters = () => {
    onFilterChange({
      type: 'all',
      year: 'all',
      sortBy: 'year',
      sortOrder: 'desc',
      search: ''
    });
  };

  const hasActiveFilters = false; // Simplified since we're not tracking local state

  return (
    <div className="mb-12">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto lg:mx-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects, directors, crew..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
              title="Advanced search"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSearchChange('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Search Suggestions */}
        {showAdvancedSearch && (
          <div className="mt-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Search Suggestions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div>
                <h5 className="text-xs font-medium text-neutral-600 mb-2">Directors:</h5>
                <div className="flex flex-wrap gap-1">
                  {allPeople.filter(p => p.length < 20).slice(0, 5).map(person => (
                    <button
                      key={person}
                      onClick={() => handleSearchChange(person)}
                      className="text-xs px-2 py-1 bg-white rounded border hover:bg-primary-50 hover:border-primary-300"
                    >
                      {person}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-medium text-neutral-600 mb-2">Companies:</h5>
                <div className="flex flex-wrap gap-1">
                  {allPeople.filter(p => p.includes(' ') && p.length > 15).slice(0, 3).map(company => (
                    <button
                      key={company}
                      onClick={() => handleSearchChange(company)}
                      className="text-xs px-2 py-1 bg-white rounded border hover:bg-primary-50 hover:border-primary-300"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-medium text-neutral-600 mb-2">Quick Search:</h5>
                <div className="flex flex-wrap gap-1">
                  {['Posta', 'Dolby', 'Atmos', 'Sound Design', 'Re-recording'].map(term => (
                    <button
                      key={term}
                      onClick={() => handleSearchChange(term)}
                      className="text-xs px-2 py-1 bg-white rounded border hover:bg-primary-50 hover:border-primary-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary w-full justify-center"
        >
          <Filter className="w-5 h-5 mr-2" />
          {hasActiveFilters ? 'Filters (Active)' : 'Filters'}
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-2xl p-6 border border-neutral-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Sorting
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Project Type Filters */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Project Type</h4>
            <div className="flex flex-wrap gap-2">
            {projectTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeChange(type.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200 hover:border-primary-300'
                }`}
              >
                {type.label}
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600`}>
                  {type.count}
                </span>
              </button>
            ))}
            </div>
          </div>

          {/* Year Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Year</h4>
            <div className="space-y-3">
              <button
                onClick={() => handleYearChange('all')}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200 text-left"
              >
                All Years
              </button>

              {/* Show recent years by default, with option to show all */}
              <div className="grid grid-cols-2 gap-2">
                {(showAllYears ? availableYears : availableYears.slice(0, 8)).map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year.toString())}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200"
                  >
                    {year}
                  </button>
                ))}
              </div>

              {/* Show More/Less button if there are more than 8 years */}
              {availableYears.length > 8 && (
                <button
                  onClick={() => setShowAllYears(!showAllYears)}
                  className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
                >
                  {showAllYears ? 'Show Less' : `Show ${availableYears.length - 8} More Years`}
                </button>
              )}

              {/* Show count info */}
              <div className="text-xs text-neutral-500 mt-2">
                {showAllYears ? 'All' : `${Math.min(8, availableYears.length)} of ${availableYears.length}`} years shown
                ({Math.min(...availableYears)} - {Math.max(...availableYears)})
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Sort by</h4>
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Order</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortOrderChange('desc')}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-200"
                >
                  <SortDesc className="w-4 h-4" />
                  Newest
                </button>
                <button
                  onClick={() => handleSortOrderChange('asc')}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-200"
                >
                  <SortAsc className="w-4 h-4" />
                  Oldest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}