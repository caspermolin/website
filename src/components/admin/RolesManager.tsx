'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, User, Users, Search } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  category: 'core' | 'additional';
}

interface RolesManagerProps {
  roles: string[];
  onChange: (roles: string[]) => void;
  className?: string;
  placeholder?: string;
}

export default function RolesManager({ roles, onChange, className = '', placeholder = 'Add job title...' }: RolesManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Load existing roles from people database
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await fetch('/api/admin/database/people');
        if (response.ok) {
          const data = await response.json();
          const allRoles = new Set<string>();

          data.forEach((person: any) => {
            if (person.roles && Array.isArray(person.roles)) {
              person.roles.forEach((role: string) => allRoles.add(role));
            }
            if (person.role) {
              allRoles.add(person.role);
            }
          });

          const rolesArray = Array.from(allRoles).map((role, index) => ({
            id: role.toLowerCase().replace(/\s+/g, '_'),
            name: role,
            category: 'additional' as const
          }));

          setAvailableRoles(rolesArray);
        }
      } catch (error) {
        console.warn('Error loading roles:', error);
        // Fallback roles
        setAvailableRoles([
          { id: 'sound_designer', name: 'Sound Designer', category: 'additional' },
          { id: 're_recording_mixer', name: 'Re-recording Mixer', category: 'additional' },
          { id: 'audio_post_producer', name: 'Audio Post Producer', category: 'additional' },
          { id: 'sound_editor', name: 'Sound Editor', category: 'additional' },
          { id: 'dialogue_editor', name: 'Dialogue Editor', category: 'additional' },
          { id: 'foley_artist', name: 'Foley Artist', category: 'additional' },
          { id: 'adr_supervisor', name: 'ADR Supervisor', category: 'additional' },
          { id: 'production_sound_mixer', name: 'Production Sound Mixer', category: 'additional' },
          { id: 'music_supervisor', name: 'Music Supervisor', category: 'additional' },
          { id: 'audio_engineer', name: 'Audio Engineer', category: 'additional' }
        ]);
      }
    };

    loadRoles();
  }, []);

  const addRole = (role: string) => {
    const trimmedRole = role.trim();
    if (trimmedRole && !roles.includes(trimmedRole)) {
      onChange([...roles, trimmedRole]);
    }
    setInputValue('');
  };

  const removeRole = (roleToRemove: string) => {
    onChange(roles.filter(role => role !== roleToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRole(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && roles.length > 0) {
      removeRole(roles[roles.length - 1]);
    }
  };

  const filteredSuggestions = availableRoles.filter(role =>
    role.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !roles.includes(role.name)
  ).slice(0, 5);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        {roles.map((role, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
          >
            <Users className="w-3 h-3" />
            {role}
            <button
              type="button"
              onClick={() => removeRole(role)}
              className="text-green-600 hover:text-green-800 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          placeholder={roles.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
        />
      </div>

      {/* Suggestions dropdown */}
      {isInputFocused && inputValue && filteredSuggestions.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addRole(suggestion.name)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{suggestion.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add button for manual input */}
      {inputValue.trim() && (
        <button
          type="button"
          onClick={() => addRole(inputValue)}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add "{inputValue.trim()}"
        </button>
      )}
    </div>
  );
}
