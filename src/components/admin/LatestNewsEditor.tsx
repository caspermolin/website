'use client';

import { useState } from 'react';
import { X, Save, Plus, Trash2, Newspaper, Upload } from 'lucide-react';

interface NewsItem {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author?: string;
  category?: string;
  link?: string;
}

interface LatestNewsEditorProps {
  block: any;
  onSave: (updatedBlock: any) => void;
  onClose: () => void;
}

export default function LatestNewsEditor({ block, onSave, onClose }: LatestNewsEditorProps) {
  const [title, setTitle] = useState(block.content?.title || '');
  const [subtitle, setSubtitle] = useState(block.content?.subtitle || '');
  const [newsItems, setNewsItems] = useState<NewsItem[]>(block.content?.newsItems || []);

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

  const addNewsItem = () => {
    setNewsItems([...newsItems, {
      title: '',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      category: '',
      link: ''
    }]);
  };

  const updateNewsItem = (index: number, field: keyof NewsItem, value: string) => {
    const newNewsItems = [...newsItems];
    newNewsItems[index] = { ...newNewsItems[index], [field]: value };
    setNewsItems(newNewsItems);
  };

  const removeNewsItem = (index: number) => {
    setNewsItems(newsItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...block,
      content: {
        title,
        subtitle,
        newsItems
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Newspaper className="w-6 h-6 mr-2" />
            Edit Latest News
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
                placeholder="Latest News"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Stay updated with our latest news and updates"
              />
            </div>
          </div>

          {/* News Items List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">News Items</h3>
              <button
                onClick={addNewsItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add News Item
              </button>
            </div>

            {newsItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">News Item {index + 1}</h4>
                  <button
                    onClick={() => removeNewsItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateNewsItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New Studio Equipment Arrives"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                      <textarea
                        value={item.excerpt}
                        onChange={(e) => updateNewsItem(index, 'excerpt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Short description of the news item..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Content</label>
                      <textarea
                        value={item.content}
                        onChange={(e) => updateNewsItem(index, 'content', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Full article content..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateNewsItem(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Author (Optional)</label>
                        <input
                          type="text"
                          value={item.author || ''}
                          onChange={(e) => updateNewsItem(index, 'author', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category (Optional)</label>
                        <input
                          type="text"
                          value={item.category || ''}
                          onChange={(e) => updateNewsItem(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Studio Updates"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link (Optional)</label>
                        <input
                          type="url"
                          value={item.link || ''}
                          onChange={(e) => updateNewsItem(index, 'link', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/article"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Article Image</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => updateNewsItem(index, 'image', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="/images/news/news-1.jpg"
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
                                  updateNewsItem(index, 'image', url);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      {item.image && (
                        <div className="mt-2">
                          <img
                            src={item.image}
                            alt="News item preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </div>
                      )}
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
