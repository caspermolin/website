'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Star, Search } from 'lucide-react';

interface SpecialtiesManagerProps {
  specialties: string[];
  onChange: (specialties: string[]) => void;
  className?: string;
  placeholder?: string;
}

export default function SpecialtiesManager({
  specialties,
  onChange,
  className = '',
  placeholder = 'Add specialty...'
}: SpecialtiesManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);

  // Load existing specialties from people database
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await fetch('/api/admin/database/people');
        if (response.ok) {
          const data = await response.json();
          const allSpecialties = new Set<string>();

          data.forEach((person: any) => {
            if (person.specialties && Array.isArray(person.specialties)) {
              person.specialties.forEach((specialty: string) => allSpecialties.add(specialty));
            }
          });

          setAvailableSpecialties(Array.from(allSpecialties));
        }
      } catch (error) {
        console.warn('Error loading specialties:', error);
        // Fallback specialties
        setAvailableSpecialties([
          'Sound Design',
          'Re-recording Mixing',
          'Audio Post Production',
          'Sound Editing',
          'Dialogue Editing',
          'Foley',
          'ADR',
          'Music Supervision',
          'Audio Engineering',
          'Production Sound',
          'Location Recording',
          'Post Production Supervision',
          'Sound Effects Design',
          'Voice Over Direction',
          'Dubbing'
        ]);
      }
    };

    loadSpecialties();
  }, []);

  const addSpecialty = (specialty: string) => {
    const trimmedSpecialty = specialty.trim();
    if (trimmedSpecialty && !specialties.includes(trimmedSpecialty)) {
      onChange([...specialties, trimmedSpecialty]);
    }
    setInputValue('');
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    onChange(specialties.filter(specialty => specialty !== specialtyToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecialty(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && specialties.length > 0) {
      removeSpecialty(specialties[specialties.length - 1]);
    }
  };

  const filteredSuggestions = availableSpecialties.filter(specialty =>
    specialty.toLowerCase().includes(inputValue.toLowerCase()) &&
    !specialties.includes(specialty)
  ).slice(0, 5);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        {specialties.map((specialty, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
          >
            <Star className="w-3 h-3" />
            {specialty}
            <button
              type="button"
              onClick={() => removeSpecialty(specialty)}
              className="text-purple-600 hover:text-purple-800 ml-1"
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
          placeholder={specialties.length === 0 ? placeholder : ''}
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
              onClick={() => addSpecialty(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add button for manual input */}
      {inputValue.trim() && (
        <button
          type="button"
          onClick={() => addSpecialty(inputValue)}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Add "{inputValue.trim()}"
        </button>
      )}
    </div>
  );
}
