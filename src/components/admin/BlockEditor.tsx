'use client';

import { useState, useEffect } from 'react';
import { X, Save, Upload, Plus, Trash2, GripVertical, Image as ImageIcon, Edit3 } from 'lucide-react';

interface BlockEditorProps {
  block: any;
  onSave: (updatedBlock: any) => void;
  onClose: () => void;
}

export default function BlockEditor({ block, onSave, onClose }: BlockEditorProps) {
  const [content, setContent] = useState(block.content || {});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
    return null;
  };

  const handleSave = () => {
    onSave({ ...block, content });
  };

  const renderField = (key: string, value: any, path: string = '') => {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          {key.toLowerCase().includes('description') || key.toLowerCase().includes('content') ? (
            <textarea
              value={value}
              onChange={(e) => {
                const newContent = { ...content };
                if (path) {
                  const pathParts = path.split('.');
                  let current = newContent;
                  for (let i = 0; i < pathParts.length; i++) {
                    if (i === pathParts.length - 1) {
                      current[pathParts[i]][key] = e.target.value;
                    } else {
                      current = current[pathParts[i]];
                    }
                  }
                } else {
                  newContent[key] = e.target.value;
                }
                setContent(newContent);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const newContent = { ...content };
                if (path) {
                  const pathParts = path.split('.');
                  let current = newContent;
                  for (let i = 0; i < pathParts.length; i++) {
                    if (i === pathParts.length - 1) {
                      current[pathParts[i]][key] = e.target.value;
                    } else {
                      current = current[pathParts[i]];
                    }
                  }
                } else {
                  newContent[key] = e.target.value;
                }
                setContent(newContent);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="space-y-3">
            {value.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    {typeof item === 'object' ? `Item ${index + 1}` : `Item ${index + 1}`}
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newContent = { ...content };
                        if (path) {
                          const pathParts = path.split('.');
                          let current = newContent;
                          for (let i = 0; i < pathParts.length; i++) {
                            if (i === pathParts.length - 1) {
                              current[pathParts[i]][key].splice(index, 1);
                            } else {
                              current = current[pathParts[i]];
                            }
                          }
                        } else {
                          newContent[key].splice(index, 1);
                        }
                        setContent(newContent);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {typeof item === 'object' ? (
                  <div className="space-y-3">
                    {Object.entries(item).map(([itemKey, itemValue]) => (
                      <div key={itemKey}>
                        {renderField(itemKey, itemValue, `${fullPath}[${index}]`)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newContent = { ...content };
                      if (path) {
                        const pathParts = path.split('.');
                        let current = newContent;
                        for (let i = 0; i < pathParts.length; i++) {
                          if (i === pathParts.length - 1) {
                            current[pathParts[i]][key][index] = e.target.value;
                          } else {
                            current = current[pathParts[i]];
                          }
                        }
                      } else {
                        newContent[key][index] = e.target.value;
                      }
                      setContent(newContent);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                const newContent = { ...content };
                if (path) {
                  const pathParts = path.split('.');
                  let current = newContent;
                  for (let i = 0; i < pathParts.length; i++) {
                    if (i === pathParts.length - 1) {
                      current[pathParts[i]][key].push(typeof value[0] === 'object' ? {} : '');
                    } else {
                      current = current[pathParts[i]];
                    }
                  }
                } else {
                  newContent[key].push(typeof value[0] === 'object' ? {} : '');
                }
                setContent(newContent);
              }}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          </div>
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </h3>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey}>
                {renderField(subKey, subValue, fullPath)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1).replace(/([A-Z])/g, ' $1')} Block
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {Object.entries(content).map(([key, value]) => (
              <div key={key}>
                {renderField(key, value)}
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