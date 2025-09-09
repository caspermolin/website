'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2, Users, Star, Save, AlertTriangle } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  category: 'core' | 'additional';
  description?: string;
  order: number;
}

interface CentralRolesManagerProps {
  personRoles: string[];
  onPersonRolesChange: (roles: string[]) => void;
  className?: string;
}

export default function CentralRolesManager({
  personRoles,
  onPersonRolesChange,
  className = ''
}: CentralRolesManagerProps) {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  // Removed complex role management - use Roles database for that

  // Load all roles from central database
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await fetch('/api/admin/database/roles');
        if (response.ok) {
          const roles = await response.json();
          setAllRoles(roles);
        } else {
          console.error('Failed to load roles');
        }
      } catch (error) {
        console.error('Error loading roles:', error);
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

  const addNewRole = async () => {
    if (!newRoleName.trim()) {
      setError('Role name is required');
      return;
    }

    const roleId = newRoleName.toLowerCase().replace(/\s+/g, '_');

    try {
      const response = await fetch('/api/admin/database/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          role: {
            id: roleId,
            name: newRoleName.trim(),
            category: newRoleCategory,
            description: newRoleDescription.trim(),
            order: allRoles.length + 1
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAllRoles(data.roles);
        setNewRoleName('');
        setNewRoleDescription('');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add role');
      }
    } catch (error) {
      console.error('Error adding role:', error);
      setError('Failed to add role');
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This will affect all projects and people using this role.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/database/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          role: { id: roleId }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAllRoles(data.roles);

        // Remove from person's roles if they had it
        if (personRoles.some(roleName => {
          const role = allRoles.find(r => r.name === roleName);
          return role?.id === roleId;
        })) {
          const roleToRemove = allRoles.find(r => r.id === roleId)?.name;
          if (roleToRemove) {
            removeRoleFromPerson(roleToRemove);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setError('Failed to delete role');
    }
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
      {/* Person's Current Roles */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Person's Job Titles/Roles
          </label>
          <button
            type="button"
            onClick={() => setShowRoleManager(!showRoleManager)}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-600"
          >
            Manage All Roles
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gray-300 rounded-lg">
          {personRoles.map((role, index) => {
            const roleInfo = allRoles.find(r => r.name === role);
            return (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${
                  roleInfo?.category === 'core'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {roleInfo?.category === 'core' ? <Star className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                {role}
                <button
                  type="button"
                  onClick={() => removeRoleFromPerson(role)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {personRoles.length === 0 && (
            <span className="text-gray-400 text-sm py-1">No roles assigned</span>
          )}
        </div>
      </div>

      {/* Available Roles to Add */}
      {availableRoles.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Roles to Add
          </label>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => addRoleToPerson(role.name)}
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border hover:shadow-md transition-all ${
                  role.category === 'core'
                    ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {role.category === 'core' ? <Star className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                {role.name}
                <Plus className="w-3 h-3 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Role Management Panel */}
      {showRoleManager && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Manage All Roles</h3>
            <button
              type="button"
              onClick={() => setShowRoleManager(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Add New Role */}
          <div className="mb-4 p-3 bg-white border border-gray-200 rounded">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Role</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role name (e.g., 'Sound Designer')"
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={newRoleCategory}
                onChange={(e) => setNewRoleCategory(e.target.value as 'core' | 'additional')}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="additional">Additional Role</option>
                <option value="core">Core Role</option>
              </select>
            </div>
            <textarea
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
            />
            <button
              type="button"
              onClick={addNewRole}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Role
            </button>
          </div>

          {/* Existing Roles */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Roles</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allRoles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                  <div className="flex items-center gap-2">
                    {role.category === 'core' ? (
                      <Star className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Users className="w-4 h-4 text-green-600" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{role.name}</div>
                      {role.description && (
                        <div className="text-xs text-gray-500">{role.description}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteRole(role.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
