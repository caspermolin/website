'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Users, Star, ChevronDown, Edit3, Save } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  category: 'core' | 'additional';
  description?: string;
  order: number;
}

interface CreditsManagerProps {
  credits: any;
  onChange: (credits: any) => void;
  className?: string;
  allPeople?: string[];
}

// ENHANCED PROJECT CREDITS MANAGER
// Add people to existing roles for this project
// Can create new roles and automatically adds people to people database
export default function SimpleCreditsManager({ credits, onChange, className = '', allPeople }: CreditsManagerProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);
  const [addingToExistingRole, setAddingToExistingRole] = useState<string | null>(null);
  const [showPersonDropdownForRole, setShowPersonDropdownForRole] = useState<string | null>(null);
  const [personSearchTerm, setPersonSearchTerm] = useState('');
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [newPersonBio, setNewPersonBio] = useState('');
  const [allPeopleFromDb, setAllPeopleFromDb] = useState<any[]>([]);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState<'core' | 'additional'>('additional');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<any[]>([]);

  // Role name mapping for database consistency
  const roleNameMap: { [key: string]: string } = {
    'Sound Designer': 'soundDesign',
    'Re-recording Mixer': 'reRecordingMix',
    'Sound Editor': 'soundEditor',
    'Dialogue Editor': 'dialogueEditor',
    'ADR Supervisor': 'adr',
    'Foley Artist': 'foley',
    'Production Sound Mixer': 'productionSoundMixer',
    'Sound Recordist': 'soundRecordist',
    'Music Supervisor': 'musicSupervisor',
    'Audio Engineer': 'audioEngineer',
    'Location Sound Recordist': 'locationSoundRecordist',
    'Post Production Supervisor': 'postProductionSupervisor',
    'Sound Effects Designer': 'soundEffectsDesigner',
    'Voice Over Director': 'voiceOverDirector',
    'Dubbing Director': 'dubbingDirector'
  };

  const reverseRoleNameMap: { [key: string]: string } = Object.fromEntries(
    Object.entries(roleNameMap).map(([key, value]) => [value, key])
  );

  // Load roles and people from databases
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load roles
        const rolesResponse = await fetch('/api/admin/database/roles');
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          setAvailableRoles(rolesData);
        }

        // Load all people from both people and freelancers databases
        const [peopleResponse, freelancersResponse] = await Promise.all([
          fetch('/api/admin/database/people'),
          fetch('/api/admin/database/freelancers')
        ]);

        let allPeopleData: any[] = [];

        if (peopleResponse.ok) {
          const peopleData = await peopleResponse.json();
          allPeopleData = [...allPeopleData, ...peopleData];
        }

        if (freelancersResponse.ok) {
          const freelancersData = await freelancersResponse.json();
          allPeopleData = [...allPeopleData, ...freelancersData];
        }

        // Sort people: featured first, then regular people, then freelancers
        const sortedPeople = allPeopleData.sort((a: any, b: any) => {
          // Featured people first
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          // Then by role type (Freelancer last)
          if (a.role === 'Freelancer' && b.role !== 'Freelancer') return 1;
          if (a.role !== 'Freelancer' && b.role === 'Freelancer') return -1;
          // Then alphabetically
          return a.name.localeCompare(b.name);
        });

        setAllPeopleFromDb(sortedPeople);
        setFilteredPeople(sortedPeople);
      } catch (error) {
        console.warn('Error loading data');
        setAvailableRoles([]);
        setAllPeopleFromDb([]);
        setFilteredPeople([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);


  // Add person to selected role
  const addPersonToRole = (roleName?: string) => {
    const targetRole = roleName || selectedRole;
    if (!targetRole || !selectedPerson.trim()) return;

    const personName = selectedPerson.trim();
    const currentCredits = credits || {};

    // Map role name to database field name
    const dbRoleName = roleNameMap[targetRole] || targetRole.toLowerCase().replace(/\s+/g, '');

    const roleCredits = currentCredits[dbRoleName] || [];

    if (!roleCredits.includes(personName)) {
      const updatedCredits = {
        ...currentCredits,
        [dbRoleName]: [...roleCredits, personName]
      };
      onChange(updatedCredits);
    }

    // Clear selection for next person
    setSelectedPerson('');
    setShowPersonDropdown(false);
    setAddingToExistingRole(null);
  };


  // Create new role
  const createNewRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      const response = await fetch('/api/admin/database/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          role: {
            id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
            name: newRoleName.trim(),
            category: newRoleCategory,
            description: newRoleDescription.trim(),
            order: availableRoles.length + 1
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableRoles(data.roles);
        setSelectedRole(newRoleName.trim());
        setShowNewRoleModal(false);
        setNewRoleName('');
        setNewRoleDescription('');
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  // Add new person to freelancers database
  const addNewPerson = async () => {
    if (!newPersonName.trim()) return;

    try {
      const response = await fetch('/api/admin/database/freelancers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          person: {
            name: newPersonName.trim(),
            role: 'Freelancer',
            bio: newPersonBio.trim(),
            email: newPersonEmail.trim(),
            specialties: []
          }
        })
      });

      if (response.ok) {
        // Reload people data
        const [peopleResponse, freelancersResponse] = await Promise.all([
          fetch('/api/admin/database/people'),
          fetch('/api/admin/database/freelancers')
        ]);

        let allPeopleData: any[] = [];
        if (peopleResponse.ok) {
          const peopleData = await peopleResponse.json();
          allPeopleData = [...allPeopleData, ...peopleData];
        }
        if (freelancersResponse.ok) {
          const freelancersData = await freelancersResponse.json();
          allPeopleData = [...allPeopleData, ...freelancersData];
        }

        // Sort people
        const sortedPeople = allPeopleData.sort((a: any, b: any) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.role === 'Freelancer' && b.role !== 'Freelancer') return 1;
          if (a.role !== 'Freelancer' && b.role === 'Freelancer') return -1;
          return a.name.localeCompare(b.name);
        });

        setAllPeopleFromDb(sortedPeople);
        setSelectedPerson(newPersonName.trim());
        setShowAddPersonModal(false);
        setNewPersonName('');
        setNewPersonEmail('');
        setNewPersonBio('');
        setPersonSearchTerm('');

        // If we're adding to an existing role, add immediately
        if (addingToExistingRole) {
          addPersonToRole(addingToExistingRole);
        }
      }
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  // Remove person from role
  const removePersonFromRole = (roleName: string, personName: string) => {
    const currentCredits = credits || {};
    const roleCredits = currentCredits[roleName] || [];
    const updatedRoleCredits = roleCredits.filter((person: string) => person !== personName);

    const updatedCredits = { ...currentCredits };
    if (updatedRoleCredits.length === 0) {
      delete updatedCredits[roleName];
    } else {
      updatedCredits[roleName] = updatedRoleCredits;
    }

    onChange(updatedCredits);
  };

  // Filter people based on search term
  useEffect(() => {
    if (allPeopleFromDb.length > 0) {
      const filtered = allPeopleFromDb.filter(person => 
        person.name.toLowerCase().includes(personSearchTerm.toLowerCase())
      );
      setFilteredPeople(filtered);
    }
  }, [allPeopleFromDb, personSearchTerm]);


  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-gray-500">Loading roles...</div>
      </div>
    );
  }

  const currentCredits = credits || {};

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add Credits Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Add Project Credits</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Role Selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400"
              >
                <span className={selectedRole ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedRole || 'Choose role...'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => setShowNewRoleModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                title="Create new role"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showRoleDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {availableRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.name);
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                  >
                    {role.category === 'core' ? (
                      <Star className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Users className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm">{role.name}</span>
                  </button>
                ))}
                {availableRoles.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No roles available. Create a new role first.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Person Selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Select Person(s)
            </label>
            <button
              type="button"
              onClick={() => {
                setShowPersonDropdown(!showPersonDropdown);
                setPersonSearchTerm('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400"
            >
              <span className={selectedPerson ? 'text-gray-900' : 'text-gray-500'}>
                {selectedPerson || 'Choose person...'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Person Dropdown */}
            {showPersonDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={personSearchTerm}
                    onChange={(e) => setPersonSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* People List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          setSelectedPerson(person.name);
                          setShowPersonDropdown(false);
                          setPersonSearchTerm('');
                          // If we're adding to an existing role, add immediately
                          if (addingToExistingRole) {
                            addPersonToRole(addingToExistingRole);
                          }
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm">{person.name}</span>
                        {person.role === 'Freelancer' && (
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-1 py-0.5 rounded">
                            Freelancer
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {allPeopleFromDb.length === 0 ? 'Loading people...' : 'No people found'}
                    </div>
                  )}
                </div>

                {/* Add New Person Button */}
                <div className="p-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPersonDropdown(false);
                      setShowAddPersonModal(true);
                    }}
                    className="w-full text-left px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                  >
                    + Add new person
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={addPersonToRole}
              disabled={!selectedRole || !selectedPerson.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Current Credits Display */}

      {Object.keys(currentCredits).length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Current Project Credits</h3>

          <div className="space-y-3">
            {Object.entries(currentCredits).map(([roleName, people]) => {
              // Convert database key to user-friendly name
              const displayRoleName = reverseRoleNameMap[roleName] || roleName;

              return (
                <div key={roleName} className="flex flex-wrap items-start gap-3 p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700 min-w-fit">
                    <span className="font-semibold">{displayRoleName}:</span>
                  </div>

                  <div className="flex flex-wrap gap-2 flex-1">
                    {(people as string[]).map((person, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm shadow-sm"
                      >
                        <span className="font-medium">{person}</span>
                        <button
                          type="button"
                          onClick={() => removePersonFromRole(roleName, person)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                          title={`Remove ${person} from ${displayRoleName}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    {/* Add person button for this role */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingToExistingRole(roleName);
                          setShowPersonDropdownForRole(roleName);
                          setPersonSearchTerm('');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 hover:bg-green-100 transition-colors"
                        title={`Add another person to ${displayRoleName}`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>

                      {/* Person dropdown for this specific role */}
                      {showPersonDropdownForRole === roleName && (
                        <div className="absolute z-30 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                          {/* Search Input */}
                          <div className="p-2 border-b border-gray-100">
                            <input
                              type="text"
                              placeholder="Search people..."
                              value={personSearchTerm}
                              onChange={(e) => setPersonSearchTerm(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoFocus
                            />
                          </div>

                          {/* People List */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredPeople.length > 0 ? (
                              filteredPeople.map((person) => (
                                <button
                                  key={person.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPerson(person.name);
                                    addPersonToRole(roleName);
                                    setShowPersonDropdownForRole(null);
                                    setAddingToExistingRole(null);
                                    setPersonSearchTerm('');
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                >
                                  <span className="text-sm">{person.name}</span>
                                  {person.role === 'Freelancer' && (
                                    <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-1 py-0.5 rounded">
                                      Freelancer
                                    </span>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                {allPeopleFromDb.length === 0 ? 'Loading people...' : 'No people found'}
                              </div>
                            )}
                          </div>

                          {/* Add New Person Button */}
                          <div className="p-2 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPersonDropdownForRole(null);
                                setAddingToExistingRole(roleName);
                                setShowAddPersonModal(true);
                              }}
                              className="w-full text-left px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                            >
                              + Add new person
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showRoleDropdown || showPersonDropdown || showPersonDropdownForRole) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowRoleDropdown(false);
            setShowPersonDropdown(false);
            setShowPersonDropdownForRole(null);
            setAddingToExistingRole(null);
            setPersonSearchTerm('');
          }}
        />
      )}

      {/* Add New Person Modal */}
      {showAddPersonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Person</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter person's name"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newPersonEmail}
                    onChange={(e) => setNewPersonEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={newPersonBio}
                    onChange={(e) => setNewPersonBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter brief bio or description"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddPersonModal(false);
                    setNewPersonName('');
                    setNewPersonEmail('');
                    setNewPersonBio('');
                    setAddingToExistingRole(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewPerson}
                  disabled={!newPersonName.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Add Person
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Role Modal */}
      {showNewRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Create New Role</h2>
                <button
                  onClick={() => setShowNewRoleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Sound Effects Editor"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newRoleCategory}
                  onChange={(e) => setNewRoleCategory(e.target.value as 'core' | 'additional')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="additional">Additional Role</option>
                  <option value="core">Core Role</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Describe what this role involves..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowNewRoleModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createNewRole}
                disabled={!newRoleName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
