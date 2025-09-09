'use client';

import { useState } from 'react';
import { X, Save, Plus, Trash2, Upload, Image as ImageIcon, GripVertical } from 'lucide-react';

interface Studio {
  name: string;
  description: string;
  features: string[];
  equipment: string[];
  image: string;
}

interface StudioDetailsEditorProps {
  block: any;
  onSave: (updatedBlock: any) => void;
  onClose: () => void;
}

export default function StudioDetailsEditor({ block, onSave, onClose }: StudioDetailsEditorProps) {
  const [title, setTitle] = useState(block.content?.title || '');
  const [subtitle, setSubtitle] = useState(block.content?.subtitle || '');
  const [studios, setStudios] = useState<Studio[]>(block.content?.studios || []);

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

  const addStudio = () => {
    setStudios([...studios, {
      name: '',
      description: '',
      features: [],
      equipment: [],
      image: ''
    }]);
  };

  const updateStudio = (index: number, field: keyof Studio, value: any) => {
    const newStudios = [...studios];
    newStudios[index] = { ...newStudios[index], [field]: value };
    setStudios(newStudios);
  };

  const removeStudio = (index: number) => {
    setStudios(studios.filter((_, i) => i !== index));
  };

  const addFeature = (studioIndex: number) => {
    const newStudios = [...studios];
    newStudios[studioIndex].features.push('');
    setStudios(newStudios);
  };

  const updateFeature = (studioIndex: number, featureIndex: number, value: string) => {
    const newStudios = [...studios];
    newStudios[studioIndex].features[featureIndex] = value;
    setStudios(newStudios);
  };

  const removeFeature = (studioIndex: number, featureIndex: number) => {
    const newStudios = [...studios];
    newStudios[studioIndex].features.splice(featureIndex, 1);
    setStudios(newStudios);
  };

  const addEquipment = (studioIndex: number) => {
    const newStudios = [...studios];
    newStudios[studioIndex].equipment.push('');
    setStudios(newStudios);
  };

  const updateEquipment = (studioIndex: number, equipmentIndex: number, value: string) => {
    const newStudios = [...studios];
    newStudios[studioIndex].equipment[equipmentIndex] = value;
    setStudios(newStudios);
  };

  const removeEquipment = (studioIndex: number, equipmentIndex: number) => {
    const newStudios = [...studios];
    newStudios[studioIndex].equipment.splice(equipmentIndex, 1);
    setStudios(newStudios);
  };

  const handleSave = () => {
    onSave({
      ...block,
      content: {
        title,
        subtitle,
        studios
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Studio Details</h2>
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
                placeholder="Our Studios"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State-of-the-art facilities for every production need"
              />
            </div>
          </div>

          {/* Studios List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Studios</h3>
              <button
                onClick={addStudio}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Studio
              </button>
            </div>

            {studios.map((studio, studioIndex) => (
              <div key={studioIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Studio {studioIndex + 1}</h4>
                  <button
                    onClick={() => removeStudio(studioIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Studio Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Studio Name</label>
                      <input
                        type="text"
                        value={studio.name}
                        onChange={(e) => updateStudio(studioIndex, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dolby Atmos Stage"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={studio.description}
                        onChange={(e) => updateStudio(studioIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Our flagship mastering suite with 7.1.4 monitoring system"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Studio Image</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={studio.image}
                          onChange={(e) => updateStudio(studioIndex, 'image', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="/images/facilities/studio.jpg"
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
                                  updateStudio(studioIndex, 'image', url);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      {studio.image && (
                        <div className="mt-2">
                          <img
                            src={studio.image}
                            alt="Studio preview"
                            className="w-32 h-20 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features and Equipment */}
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Features</label>
                        <button
                          onClick={() => addFeature(studioIndex)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Feature
                        </button>
                      </div>
                      <div className="space-y-2">
                        {studio.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(studioIndex, featureIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Dolby RMU integration"
                            />
                            <button
                              onClick={() => removeFeature(studioIndex, featureIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Equipment</label>
                        <button
                          onClick={() => addEquipment(studioIndex)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Equipment
                        </button>
                      </div>
                      <div className="space-y-2">
                        {studio.equipment.map((equipment, equipmentIndex) => (
                          <div key={equipmentIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={equipment}
                              onChange={(e) => updateEquipment(studioIndex, equipmentIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Dolby Atmos Mastering Suite"
                            />
                            <button
                              onClick={() => removeEquipment(studioIndex, equipmentIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
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
