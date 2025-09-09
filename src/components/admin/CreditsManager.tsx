'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Edit3, Trash2, Save, User, Users, RefreshCw, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { ProjectCredits, CreditRole } from '@/types';

interface CreditsManagerProps {
  credits: ProjectCredits;
  onChange: (credits: ProjectCredits) => void;
  className?: string;
  allPeople?: string[];
}


// SIMPLE PROJECT CREDITS MANAGER
// Add people to roles for this specific project
// Roles are managed centrally in the Roles database
export default function CreditsManager({ credits, onChange, className = '', allPeople }: CreditsManagerProps) {
  const [availableRoles, setAvailableRoles] = useState<CreditRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [personSearch, setPersonSearch] = useState<{ [roleId: string]: string }>({});
  const [showRoleDropdown, setShowRoleDropdown] = useState<string | null>(null);
  const [personSuggestions, setPersonSuggestions] = useState<string[]>([]);
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [editingRole, setEditingRole] = useState<CreditRole | null>(null);
  const [showNewRoleForm, setShowNewRoleForm] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleDescription, setNewRoleDescription] = useState<string>('');

  // Default people if none provided
  const defaultPeople = [
    'Marco Vermaas',
    'Christan Muiser',
    'Posta Vermaas',
    'Sound Designer',
    'Re-recording Mixer',
    'Audio Post Producer',
    'Sound Editor',
    'Dialogue Editor',
    'Foley Artist',
    'ADR Supervisor'
  ];

  const peopleList = allPeople || defaultPeople;

  console.log('CreditsManager props:', { credits, allPeople, peopleList });

  // Load credit roles from database
  useEffect(() => {
    const loadCreditRoles = async () => {
      try {
        const response = await fetch('/api/admin/database/roles');
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded all roles for credits:', data);
          setAvailableRoles(data);
        } else {
          throw new Error('Failed to load roles');
        }
      } catch (error) {
        console.warn('Error loading credit roles, using defaults:', error);
        // Fallback to default roles if database fails
        const defaultRoles: CreditRole[] = [
          { id: 'soundDesign', name: 'Sound Design', category: 'core', order: 1 },
          { id: 'reRecordingMix', name: 'Re-recording Mix', category: 'core', order: 2 },
          { id: 'audioPostProducer', name: 'Audio Post Producer', category: 'core', order: 3 },
          { id: 'soundEditor', name: 'Sound Editor', category: 'core', order: 4 },
          { id: 'dialogueEditor', name: 'Dialogue Editor', category: 'core', order: 5 },
          { id: 'adr', name: 'ADR', category: 'core', order: 6 },
          { id: 'foley', name: 'Foley', category: 'core', order: 7 },
        ];
        console.log('Using default roles:', defaultRoles);
        setAvailableRoles(defaultRoles);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreditRoles();
  }, []);

  // Load all people from database for autocomplete
  useEffect(() => {
    const loadAllPeople = async () => {
      try {
        // Load people from database
        const peopleResponse = await fetch('/api/admin/database/people');
        if (peopleResponse.ok) {
          const peopleData = await peopleResponse.json();
          const peopleNames = peopleData.map((person: any) => person.name).filter(Boolean);
          console.log('Loaded people names:', peopleNames);
          setPersonSuggestions(peopleNames);
        }

        // Load project credits for additional names
        const projectsResponse = await fetch('/api/admin/database/projects');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          const creditNames = new Set<string>();

          projectsData.projects?.forEach((project: any) => {
            if (project.credits) {
              // Handle core roles
              ['soundDesign', 'reRecordingMix', 'audioPostProducer', 'soundEditor', 'dialogueEditor', 'adr', 'foley'].forEach(role => {
                const roleCredits = project.credits[role];
                if (Array.isArray(roleCredits)) {
                  roleCredits.forEach((person: string) => {
                    if (person && typeof person === 'string') {
                      creditNames.add(person);
                    }
                  });
                }
              });

              // Handle additional roles
              if (project.credits.additionalRoles && typeof project.credits.additionalRoles === 'object') {
                Object.values(project.credits.additionalRoles).forEach((roleCredits: any) => {
                  if (Array.isArray(roleCredits)) {
                    roleCredits.forEach((person: string) => {
                      if (person && typeof person === 'string') {
                        creditNames.add(person);
                      }
                    });
                  }
                });
              }
            }
          });

          setPersonSuggestions(prev => [...prev, ...Array.from(creditNames)]);
        }
      } catch (error) {
        console.warn('Error loading people data:', error);
        // Keep default suggestions if loading fails
      }
    };

    loadAllPeople();
  }, []);

  // Generate person suggestions from all credits
  const allPersonSuggestions = useMemo(() => {
    const personMap = new Map<string, number>();

    try {
      // Count occurrences from current credits
      if (credits && typeof credits === 'object') {
        // Handle core roles (arrays)
        ['soundDesign', 'reRecordingMix', 'audioPostProducer', 'soundEditor', 'dialogueEditor', 'adr', 'foley'].forEach(role => {
          const roleCredits = (credits as any)[role];
          if (Array.isArray(roleCredits)) {
            roleCredits.forEach((person: string) => {
              if (person && typeof person === 'string') {
                personMap.set(person, (personMap.get(person) || 0) + 1);
              }
            });
          }
        });

        // Handle additional roles
        if (credits.additionalRoles && typeof credits.additionalRoles === 'object') {
          Object.values(credits.additionalRoles).forEach((roleCredits: any) => {
            if (Array.isArray(roleCredits)) {
              roleCredits.forEach((person: string) => {
                if (person && typeof person === 'string') {
                  personMap.set(person, (personMap.get(person) || 0) + 1);
                }
              });
            }
          });
        }
      }

      // Add from people list
      if (peopleList && Array.isArray(peopleList)) {
        peopleList.forEach((person) => {
          if (person && typeof person === 'string') {
            personMap.set(person, (personMap.get(person) || 0) + 1);
          }
        });
      }
    } catch (error) {
      console.warn('Error processing credits for suggestions:', error);
    }

    const suggestions = personSuggestions;

    console.log('Generated person suggestions:', suggestions);
    return suggestions;
  }, [personSuggestions]);

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!roleSearch.trim()) return availableRoles;
    return availableRoles.filter(role =>
      role.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
      role.description?.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [availableRoles, roleSearch]);

  // Filter person suggestions based on search
  const getFilteredPersonSuggestions = (searchTerm: string, currentPeople: string[]) => {
    if (!searchTerm.trim()) return personSuggestions.slice(0, 8);

    return personSuggestions
      .filter(person =>
        person.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !currentPeople.includes(person)
      )
      .slice(0, 8);
  };

  // Initialize additional roles from credits if they exist
  useEffect(() => {
    try {
      if (credits && credits.additionalRoles && typeof credits.additionalRoles === 'object') {
        const additionalRoles: CreditRole[] = Object.keys(credits.additionalRoles).map((roleName, index) => ({
          id: roleName.toLowerCase().replace(/\s+/g, '_'),
          name: roleName,
          category: 'additional',
          order: availableRoles.length + index + 1,
        }));

        setAvailableRoles(prev => {
          const coreRoles = prev.filter(r => r.category === 'core');
          const existingAdditional = prev.filter(r => r.category === 'additional');
          const newAdditional = additionalRoles.filter(role =>
            !existingAdditional.some(existing => existing.name === role.name)
          );
          return [...coreRoles, ...existingAdditional, ...newAdditional];
        });
      }
    } catch (error) {
      console.warn('Error initializing additional roles:', error);
    }
  }, [credits, availableRoles.length]);

  const addPersonToRole = (roleId: string, personName: string) => {
    if (!personName.trim()) return;

    const updatedCredits = { ...credits };
    const role = availableRoles.find(r => r.id === roleId);

    if (!role) return;

    try {
      if (role.category === 'core') {
        // Handle core roles
        const currentArray = (updatedCredits as any)[roleId] || [];
        if (!Array.isArray(currentArray)) {
          (updatedCredits as any)[roleId] = [];
        }
        if (!(updatedCredits as any)[roleId].includes(personName.trim())) {
          (updatedCredits as any)[roleId] = [...(updatedCredits as any)[roleId], personName.trim()];
        }
      } else {
        // Handle additional roles
        if (!updatedCredits.additionalRoles) {
          updatedCredits.additionalRoles = {};
        }
        const additionalRoles = updatedCredits.additionalRoles;
        const currentArray = additionalRoles[role.name] || [];
        if (!Array.isArray(currentArray)) {
          additionalRoles[role.name] = [];
        }
        if (!additionalRoles[role.name].includes(personName.trim())) {
          additionalRoles[role.name] = [...additionalRoles[role.name], personName.trim()];
        }
      }

      onChange(updatedCredits);
      setPersonSearch(prev => ({ ...prev, [roleId]: '' }));
    } catch (error) {
      console.warn('Error adding person to role:', error);
    }
  };

  const addRoleFromDropdown = (role: CreditRole) => {
    if (!availableRoles.find(r => r.id === role.id)) {
      setAvailableRoles(prev => [...prev, role]);
    }
    setRoleSearch('');
    setShowRoleDropdown(null);
  };

  const removePersonFromRole = (roleId: string, personName: string) => {
    const updatedCredits = { ...credits };
    const role = availableRoles.find(r => r.id === roleId);

    if (!role) return;

    try {
      if (role.category === 'core') {
        const currentArray = (updatedCredits as any)[roleId] || [];
        if (Array.isArray(currentArray)) {
          (updatedCredits as any)[roleId] = currentArray.filter(p => p !== personName);
        }
      } else {
        const additionalRoles = updatedCredits.additionalRoles || {};
        const currentArray = additionalRoles[role.name] || [];
        if (Array.isArray(currentArray)) {
          additionalRoles[role.name] = currentArray.filter(p => p !== personName);
          if (additionalRoles[role.name].length === 0) {
            delete additionalRoles[role.name];
          }
        }
        updatedCredits.additionalRoles = additionalRoles;
      }

      onChange(updatedCredits);
    } catch (error) {
      console.warn('Error removing person from role:', error);
    }
  };

  const addNewRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: CreditRole = {
      id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      name: newRoleName.trim(),
      category: 'additional',
      description: newRoleDescription.trim() || undefined,
      order: availableRoles.length + 1,
    };

    setAvailableRoles(prev => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const removeRole = (roleId: string) => {
    const role = availableRoles.find(r => r.id === roleId);
    if (!role || role.category === 'core') return;

    try {
      // Remove all people from this role
      const updatedCredits = { ...credits };
      if (updatedCredits.additionalRoles && updatedCredits.additionalRoles[role.name]) {
        delete updatedCredits.additionalRoles[role.name];
        onChange(updatedCredits);
      }

      setAvailableRoles(prev => prev.filter(r => r.id !== roleId));
    } catch (error) {
      console.warn('Error removing role:', error);
    }
  };

  const getPeopleForRole = (role: CreditRole): string[] => {
    try {
      if (!credits || typeof credits !== 'object') return [];

      if (role.category === 'core') {
        const roleCredits = (credits as any)[role.id];
        return Array.isArray(roleCredits) ? roleCredits : [];
      } else {
        const additionalRoles = credits.additionalRoles;
        if (additionalRoles && typeof additionalRoles === 'object') {
          const roleCredits = additionalRoles[role.name];
          return Array.isArray(roleCredits) ? roleCredits : [];
        }
        return [];
      }
    } catch (error) {
      console.warn('Error getting people for role:', role.name, error);
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading credit roles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Credits Manager</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowNewRoleForm(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Role
          </button>
        </div>
      </div>

      {/* Role Search and Selection */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowRoleDropdown(showRoleDropdown === 'add' ? null : 'add')}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Role Dropdown */}
        {showRoleDropdown === 'add' && (
          <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => addRoleFromDropdown(role)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{role.name}</div>
                      {role.description && (
                        <div className="text-xs text-gray-500">{role.description}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No roles found. Try a different search term.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Role Modal */}
      {showNewRoleForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New Credit Role
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Sound Supervisor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of this role"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    addNewRole();
                    setShowNewRoleForm(false);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Role
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewRoleForm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Roles */}
      <div className="space-y-4">
        {availableRoles
          .sort((a, b) => a.order - b.order)
          .map((role) => {
            const people = getPeopleForRole(role);
            const hasPeople = people.length > 0;
            const currentSearch = personSearch[role.id] || '';
            const suggestions = getFilteredPersonSuggestions(currentSearch, people);

            return (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {role.category === 'core' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Users className="w-4 h-4 text-green-600" />
                      )}
                      <h4 className="text-sm font-medium text-gray-900">{role.name}</h4>
                      {role.category === 'additional' && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                    {role.description && (
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {role.category === 'additional' && (
                      <button
                        type="button"
                        onClick={() => removeRole(role.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* People List */}
                {hasPeople && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {people.map((person, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {person}
                        <button
                          type="button"
                          onClick={() => removePersonFromRole(role.id, person)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Remove person"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Person Input with Autocomplete */}
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={`Add ${role.name.toLowerCase()}...`}
                        value={personSearch[role.id] || ''}
                        onChange={(e) => setPersonSearch(prev => ({ ...prev, [role.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const searchValue = personSearch[role.id] || '';
                            if (searchValue.trim()) {
                              addPersonToRole(role.id, searchValue.trim());
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Autocomplete Suggestions */}
                      {personSearch[role.id] && getFilteredPersonSuggestions(personSearch[role.id], (credits as any)[role.id] || []).length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {getFilteredPersonSuggestions(personSearch[role.id], (credits as any)[role.id] || []).map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addPersonToRole(role.id, suggestion)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <span className="text-sm">{String(suggestion)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentSearch.trim()) {
                          addPersonToRole(role.id, currentSearch.trim());
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
