'use client';

import { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import { roleTypes } from '@/data/people';

export default function PeopleFilter() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedRoles.length > 0 || searchQuery.length > 0;

  return (
    <div className="mb-12">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="btn-secondary w-full justify-center"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {selectedRoles.length + (searchQuery ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-neutral-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Filter Team Members</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Role Filters */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Filter by Role</h4>
            <div className="flex flex-wrap gap-3">
              {roleTypes.map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedRoles.includes(role)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-neutral-600">Active filters:</span>
                {searchQuery && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedRoles.map((role) => (
                  <span
                    key={role}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {role}
                    <button
                      onClick={() => toggleRole(role)}
                      className="ml-2 hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
