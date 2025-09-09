'use client';

import React, { useState } from 'react';
import { Plus, X, Volume2, VolumeX } from 'lucide-react';

interface MonitoringManagerProps {
  monitoring: string[];
  onChange: (monitoring: string[]) => void;
  className?: string;
}

const COMMON_MONITORING = [
  'Genelec 1030A',
  'Genelec 1031A',
  'Genelec 1032A',
  'Genelec 1038A',
  'Genelec 1040A',
  'Genelec 1041A',
  'Genelec 8050A',
  'Genelec 8060A',
  'Genelec 7070A',
  'Genelec 7080A',
  'JBL 4312G',
  'JBL 4344',
  'JBL 4350',
  'JBL 4367',
  'JBL 4370',
  'Neumann KH 80 DSP',
  'Neumann KH 120',
  'Neumann KH 310',
  'Neumann KH 420',
  'Adam Audio S2V',
  'Adam Audio S3V',
  'Adam Audio S4V',
  'Focal Twin6 BE',
  'Focal Trio6 BE',
  'PMC IB2S',
  'PMC BB5-XBD',
  'ATC SCM25A',
  'ATC SCM45A',
  'Dynaudio BM5A',
  'Dynaudio BM6A'
];

export default function MonitoringManager({ monitoring, onChange, className = '' }: MonitoringManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addMonitoring = (item: string) => {
    const trimmedItem = item.trim();
    if (trimmedItem && !monitoring.includes(trimmedItem)) {
      onChange([...monitoring, trimmedItem]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeMonitoring = (itemToRemove: string) => {
    onChange(monitoring.filter(item => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMonitoring(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && monitoring.length > 0) {
      removeMonitoring(monitoring[monitoring.length - 1]);
    }
  };

  const filteredSuggestions = COMMON_MONITORING.filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase()) &&
    !monitoring.includes(item)
  ).slice(0, 8);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        {monitoring.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
          >
            <Volume2 className="w-3 h-3" />
            {item}
            <button
              type="button"
              onClick={() => removeMonitoring(item)}
              className="text-orange-600 hover:text-orange-800 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="relative flex-1 min-w-[150px]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={monitoring.length === 0 ? 'Add monitoring...' : ''}
            className="w-full outline-none bg-transparent text-sm"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addMonitoring(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add button for manual input */}
      {inputValue.trim() && (
        <button
          type="button"
          onClick={() => addMonitoring(inputValue)}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          <Plus className="w-4 h-4" />
          Add "{inputValue.trim()}"
        </button>
      )}
    </div>
  );
}
