'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Star } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  category: 'core' | 'additional';
  description?: string;
  order: number;
}

interface SimpleRolesManagerProps {
  personRoles: string[];
  onPersonRolesChange: (roles: string[]) => void;
  className?: string;
}

// SIMPLE PERSON ROLES MANAGER
// Add job titles/professions to a person
// Roles are managed centrally - no custom role creation here
export default function SimpleRolesManager({
  personRoles,
  onPersonRolesChange,
  className = ''
}: SimpleRolesManagerProps) {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all roles from central database
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await fetch('/api/admin/database/roles');
        if (response.ok) {
          const data = await response.json();
          setAllRoles(data);
        }
      } catch (error) {
        console.error('Error loading roles');
        setAllRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  const addRoleToPerson = (roleName: string) => {
    if (!personRoles.includes(roleName)) {
      onPersonRolesChange([...personRoles, roleName]);
    }
  };

  const removeRoleFromPerson = (roleName: string) => {
    onPersonRolesChange(personRoles.filter(role => role !== roleName));
  };

  const availableRoles = allRoles.filter(role => !personRoles.includes(role.name));

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-gray-500">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Unified Roles Interface */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Person's Roles & Job Titles
        </label>

        {/* All Roles in One Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {allRoles.map((role) => {
            const isAssigned = personRoles.includes(role.name);

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  if (isAssigned) {
                    removeRoleFromPerson(role.name);
                  } else {
                    addRoleToPerson(role.name);
                  }
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isAssigned
                    ? role.category === 'core'
                      ? 'border-blue-500 bg-blue-100 text-blue-800 shadow-md'
                      : 'border-green-500 bg-green-100 text-green-800 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {role.category === 'core' ? (
                    <Star className={`w-4 h-4 ${isAssigned ? 'text-blue-600' : 'text-gray-400'}`} />
                  ) : (
                    <Users className={`w-4 h-4 ${isAssigned ? 'text-green-600' : 'text-gray-400'}`} />
                  )}
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {role.category}
                  </span>
                </div>
                <div className={`text-sm font-medium ${isAssigned ? 'text-current' : 'text-gray-700'}`}>
                  {role.name}
                </div>
                {isAssigned && (
                  <div className="mt-1 flex justify-end">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {allRoles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No roles available. Add roles in the "Roles" database first.
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <div className="flex items-center justify-between">
          <span>
            {personRoles.length} role{personRoles.length !== 1 ? 's' : ''} assigned
          </span>
          <span>
            To manage available roles, go to the "Roles" database
          </span>
        </div>
      </div>
    </div>
  );
}
