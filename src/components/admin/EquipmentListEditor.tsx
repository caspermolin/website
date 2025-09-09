'use client';

import { useState } from 'react';
import { X, Save, Plus, Trash2, GripVertical } from 'lucide-react';

interface EquipmentCategory {
  name: string;
  equipment: string[];
}

interface EquipmentListEditorProps {
  block: any;
  onSave: (updatedBlock: any) => void;
  onClose: () => void;
}

export default function EquipmentListEditor({ block, onSave, onClose }: EquipmentListEditorProps) {
  const [title, setTitle] = useState(block.content?.title || '');
  const [subtitle, setSubtitle] = useState(block.content?.subtitle || '');
  const [categories, setCategories] = useState<EquipmentCategory[]>(block.content?.categories || []);

  const addCategory = () => {
    setCategories([...categories, {
      name: '',
      equipment: []
    }]);
  };

  const updateCategory = (index: number, field: keyof EquipmentCategory, value: any) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setCategories(newCategories);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addEquipment = (categoryIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].equipment.push('');
    setCategories(newCategories);
  };

  const updateEquipment = (categoryIndex: number, equipmentIndex: number, value: string) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].equipment[equipmentIndex] = value;
    setCategories(newCategories);
  };

  const removeEquipment = (categoryIndex: number, equipmentIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].equipment.splice(equipmentIndex, 1);
    setCategories(newCategories);
  };

  const handleSave = () => {
    onSave({
      ...block,
      content: {
        title,
        subtitle,
        categories
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Equipment List</h2>
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
                placeholder="Professional Equipment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Industry-standard tools for exceptional results"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Equipment Categories</h3>
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>

            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Category {categoryIndex + 1}</h4>
                  <button
                    onClick={() => removeCategory(categoryIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(categoryIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mixing Consoles"
                    />
                  </div>

                  {/* Equipment List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Equipment Items</label>
                      <button
                        onClick={() => addEquipment(categoryIndex)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Equipment
                      </button>
                    </div>
                    <div className="space-y-2">
                      {category.equipment.map((equipment, equipmentIndex) => (
                        <div key={equipmentIndex} className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={equipment}
                            onChange={(e) => updateEquipment(categoryIndex, equipmentIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Avid S6 console"
                          />
                          <button
                            onClick={() => removeEquipment(categoryIndex, equipmentIndex)}
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
