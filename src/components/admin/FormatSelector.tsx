'use client';

import React, { useState } from 'react';
import { Settings, Search, Check } from 'lucide-react';

interface FormatSelectorProps {
  value: string;
  onChange: (format: string) => void;
  className?: string;
}

const AUDIO_FORMATS = [
  'Dolby Atmos 7.1.4',
  'Dolby Atmos 7.1.2',
  'Dolby Atmos 5.1.4',
  'Dolby Atmos 5.1.2',
  'DTS:X 7.1.4',
  'DTS:X 7.1.2',
  'Auro-3D 9.1',
  'Auro-3D 11.1',
  'Dolby Digital 5.1',
  'Dolby Digital Plus 7.1',
  'DTS 5.1',
  'DTS-HD Master Audio 7.1',
  'PCM 7.1',
  'PCM 5.1',
  'Stereo',
  'Mono'
];

export default function FormatSelector({ value, onChange, className = '' }: FormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFormats = AUDIO_FORMATS.filter(format =>
    format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (format: string) => {
    onChange(format);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || 'Select audio format...'}
        </span>
        <Settings className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search formats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Format list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredFormats.length > 0 ? (
              filteredFormats.map((format, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(format)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  <span className="text-sm text-gray-900">{format}</span>
                  {value === format && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No formats found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
