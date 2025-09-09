'use client';

import { useState } from 'react';
import { X, Save, Plus, Trash2, Briefcase, Upload } from 'lucide-react';

interface ServiceHighlight {
  title: string;
  description: string;
  icon?: string;
  features: string[];
}

interface ServiceHighlightsEditorProps {
  block: any;
  onSave: (updatedBlock: any) => void;
  onClose: () => void;
}

export default function ServiceHighlightsEditor({ block, onSave, onClose }: ServiceHighlightsEditorProps) {
  const [title, setTitle] = useState(block.content?.title || '');
  const [subtitle, setSubtitle] = useState(block.content?.subtitle || '');
  const [highlights, setHighlights] = useState<ServiceHighlight[]>(block.content?.highlights || []);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    return null;
  };

  const addHighlight = () => {
    setHighlights([...highlights, {
      title: '',
      description: '',
      icon: '',
      features: []
    }]);
  };

  const updateHighlight = (index: number, field: keyof ServiceHighlight, value: any) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setHighlights(newHighlights);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const addFeature = (highlightIndex: number) => {
    const newHighlights = [...highlights];
    newHighlights[highlightIndex].features.push('');
    setHighlights(newHighlights);
  };

  const updateFeature = (highlightIndex: number, featureIndex: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[highlightIndex].features[featureIndex] = value;
    setHighlights(newHighlights);
  };

  const removeFeature = (highlightIndex: number, featureIndex: number) => {
    const newHighlights = [...highlights];
    newHighlights[highlightIndex].features.splice(featureIndex, 1);
    setHighlights(newHighlights);
  };

  const handleSave = () => {
    onSave({
      ...block,
      content: {
        title,
        subtitle,
        highlights
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            Edit Service Highlights
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Section Header */}
          <div className="mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Our Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comprehensive audio post production solutions"
              />
            </div>
          </div>

          {/* Service Highlights List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Service Highlights</h3>
              <button
                onClick={addHighlight}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Highlight
              </button>
            </div>

            {highlights.map((highlight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Service Highlight {index + 1}</h4>
                  <button
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                      <input
                        type="text"
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Audio Post Production"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={highlight.description}
                        onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Professional audio post production services..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Icon (Optional)</label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={highlight.icon || ''}
                            onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="/images/icons/audio.svg"
                          />
                          <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer flex items-center">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleFileUpload(file);
                                  if (url) {
                                    updateHighlight(index, 'icon', url);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        {highlight.icon && (
                          <div className="mt-2">
                            <img
                              src={highlight.icon}
                              alt="Service icon preview"
                              className="w-16 h-16 object-contain rounded-md border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Service Features</label>
                    <button
                      onClick={() => addFeature(index)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {highlight.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Professional mixing and mastering"
                        />
                        <button
                          onClick={() => removeFeature(index, featureIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
