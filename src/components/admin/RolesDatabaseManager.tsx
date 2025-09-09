'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Star, Save, AlertTriangle } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  category: 'core' | 'additional';
  description?: string;
  order: number;
}

// CENTRAL ROLES DATABASE MANAGER
// Add/remove roles from the central roles system
export default function RolesDatabaseManager() {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState<'core' | 'additional'>('additional');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        console.error('Error loading roles:', error);
        setError('Failed to load roles');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

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
        setSuccess('Role added successfully!');
        setTimeout(() => setSuccess(''), 3000);
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
        setSuccess('Role deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setError('Failed to delete role');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Add New Role */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Role</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name *
            </label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g., Sound Designer"
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
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            placeholder="Describe what this role involves..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

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
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Existing Roles ({allRoles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allRoles.map((role) => (
            <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
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
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {allRoles.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No roles found. Add your first role above.
          </div>
        )}
      </div>
    </div>
  );
}
