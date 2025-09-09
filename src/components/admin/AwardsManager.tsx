'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Award, Search, Trophy } from 'lucide-react';

interface AwardsManagerProps {
  awards: string[];
  onChange: (awards: string[]) => void;
  className?: string;
  placeholder?: string;
}

export default function AwardsManager({
  awards,
  onChange,
  className = '',
  placeholder = 'Add award...'
}: AwardsManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [availableAwards, setAvailableAwards] = useState<string[]>([]);

  // Load existing awards from people database
  useEffect(() => {
    const loadAwards = async () => {
      try {
        const response = await fetch('/api/admin/database/people');
        if (response.ok) {
          const data = await response.json();
          const allAwards = new Set<string>();

          data.forEach((person: any) => {
            if (person.awards && Array.isArray(person.awards)) {
              person.awards.forEach((award: string) => allAwards.add(award));
            }
          });

          setAvailableAwards(Array.from(allAwards));
        }
      } catch (error) {
        console.warn('Error loading awards:', error);
        // Fallback awards
        setAvailableAwards([
          'Gouden Kalf - Sound Design',
          'Gouden Kalf - Best Sound',
          'Netherlands Film Festival Award',
          'Dutch Sound Award',
          'European Film Award',
          'BAFTA Award',
          'Oscar Nomination',
          'Grammy Nomination',
          'Cannes Film Festival Award',
          'Berlin International Film Festival Award',
          'Venice Film Festival Award'
        ]);
      }
    };

    loadAwards();
  }, []);

  const addAward = (award: string) => {
    const trimmedAward = award.trim();
    if (trimmedAward && !awards.includes(trimmedAward)) {
      onChange([...awards, trimmedAward]);
    }
    setInputValue('');
  };

  const removeAward = (awardToRemove: string) => {
    onChange(awards.filter(award => award !== awardToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAward(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && awards.length > 0) {
      removeAward(awards[awards.length - 1]);
    }
  };

  const filteredSuggestions = availableAwards.filter(award =>
    award.toLowerCase().includes(inputValue.toLowerCase()) &&
    !awards.includes(award)
  ).slice(0, 5);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        {awards.map((award, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
          >
            <Trophy className="w-3 h-3" />
            {award}
            <button
              type="button"
              onClick={() => removeAward(award)}
              className="text-yellow-600 hover:text-yellow-800 ml-1"
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
          placeholder={awards.length === 0 ? placeholder : ''}
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
              onClick={() => addAward(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" />
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
          onClick={() => addAward(inputValue)}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          <Plus className="w-4 h-4" />
          Add "{inputValue.trim()}"
        </button>
      )}
    </div>
  );
}
