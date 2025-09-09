'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Settings,
  FileText,
  Users,
  Building,
  MessageSquare,
  Calendar,
  BarChart3,
  Save,
  Eye,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Globe,
  Search,
  Palette,
  Layout,
  Code,
  Database,
  Shield,
  Zap
} from 'lucide-react';

interface PageData {
  id: string;
  title: string;
  path: string;
  type: 'page' | 'component';
  sections: SectionData[];
  metadata: MetadataData;
  settings: SettingsData;
  lastModified: string;
}

interface SectionData {
  id: string;
  name: string;
  type: 'hero' | 'text' | 'services' | 'team' | 'facilities' | 'contact' | 'usp' | 'projects' | 'news' | 'about' | 'custom';
  content: any;
  images: ImageData[];
  settings: SectionSettings;
}

interface ImageData {
  id: string;
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

interface MetadataData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  robots: string;
}

interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  layout: 'default' | 'wide' | 'narrow';
  showBreadcrumbs: boolean;
  showFooter: boolean;
  customCSS: string;
  customJS: string;
}

interface SectionSettings {
  background: string;
  padding: string;
  margin: string;
  textAlign: 'left' | 'center' | 'right';
  maxWidth: string;
  animation: string;
  visibility: 'visible' | 'hidden';
}

const pageTypes = [
  { id: 'homepage', name: 'Homepage', icon: Globe },
  { id: 'about', name: 'About Us', icon: Users },
  { id: 'services', name: 'Services', icon: Settings },
  { id: 'facilities', name: 'Facilities', icon: Building },
  { id: 'people', name: 'People', icon: Users },
  { id: 'projects', name: 'Projects', icon: FileText },
  { id: 'news', name: 'News', icon: Calendar },
  { id: 'contact', name: 'Contact', icon: MessageSquare },
];

const sectionTypes = [
  { id: 'hero', name: 'Hero Section', icon: Layout },
  { id: 'text', name: 'Text Content', icon: FileText },
  { id: 'services', name: 'Services', icon: Settings },
  { id: 'team', name: 'Team', icon: Users },
  { id: 'facilities', name: 'Facilities', icon: Building },
  { id: 'contact', name: 'Contact', icon: MessageSquare },
  { id: 'usp', name: 'USPs', icon: Zap },
  { id: 'projects', name: 'Projects', icon: FileText },
  { id: 'news', name: 'News', icon: Calendar },
  { id: 'about', name: 'About', icon: Users },
  { id: 'custom', name: 'Custom', icon: Code },
];

export default function AdminCompletePage() {
  const [currentPage, setCurrentPage] = useState<string>('homepage');
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'settings' | 'images'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPageData(currentPage);
  }, [currentPage]);

  const loadPageData = async (pageId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`);
      if (!response.ok) {
        // Create default page data if not exists
        const defaultData = createDefaultPageData(pageId);
        setPageData(defaultData);
        return;
      }
      const data = await response.json();
      setPageData(data);
    } catch (error) {
      console.error('Failed to load page data:', error);
      const defaultData = createDefaultPageData(pageId);
      setPageData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultPageData = (pageId: string): PageData => {
    const pageType = pageTypes.find(p => p.id === pageId);

    return {
      id: pageId,
      title: pageType?.name || 'Page',
      path: pageId === 'homepage' ? '/' : `/${pageId}`,
      type: 'page',
      sections: [],
      metadata: {
        title: `${pageType?.name || 'Page'} - Posta Vermaas`,
        description: '',
        keywords: [],
        ogImage: '/og-image.jpg',
        canonical: pageId === 'homepage' ? '/' : `/${pageId}`,
        robots: 'index, follow'
      },
      settings: {
        theme: 'auto',
        layout: 'default',
        showBreadcrumbs: true,
        showFooter: true,
        customCSS: '',
        customJS: ''
      },
      lastModified: new Date().toISOString()
    };
  };

  const savePageData = async () => {
    if (!pageData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${currentPage}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        alert('Page saved successfully!');
        setPageData({ ...pageData, lastModified: new Date().toISOString() });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: string) => {
    if (!pageData) return;

    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      type: type as any,
      content: getDefaultContent(type),
      images: [],
      settings: {
        background: '#ffffff',
        padding: '4rem 0',
        margin: '0',
        textAlign: 'left',
        maxWidth: '1200px',
        animation: 'fadeIn',
        visibility: 'visible'
      }
    };

    setPageData({
      ...pageData,
      sections: [...pageData.sections, newSection]
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Welcome',
          subtitle: '',
          description: 'Enter your hero content here...',
          ctaText: 'Learn More',
          ctaLink: '#'
        };
      case 'text':
        return {
          title: 'Section Title',
          content: 'Enter your content here...'
        };
      case 'services':
        return {
          title: 'Our Services',
          services: [
            { name: 'Service 1', description: 'Description...' },
            { name: 'Service 2', description: 'Description...' }
          ]
        };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, updates: Partial<SectionData>) => {
    if (!pageData) return;

    setPageData({
      ...pageData,
      sections: pageData.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!pageData) return;

    setPageData({
      ...pageData,
      sections: pageData.sections.filter(section => section.id !== sectionId)
    });
  };

  const uploadImage = async (file: File, sectionId: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sectionId', sectionId);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        // Add image to section
        updateSection(sectionId, {
          images: [...(pageData?.sections.find(s => s.id === sectionId)?.images || []), result.image]
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file, sectionId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const currentPageType = pageTypes.find(p => p.id === currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Complete Admin</h1>
                <p className="text-sm text-gray-600">Full control over all pages and content</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin/database"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Database className="w-4 h-4 inline mr-2" />
                Database Admin
              </a>
              <button
                onClick={() => window.open(pageData?.path || '/', '_blank')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button
                onClick={savePageData}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                ) : (
                  <Save className="w-4 h-4 inline mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Page Selection */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Pages</h3>
                <div className="space-y-2">
                  {pageTypes.map((page) => {
                    const IconComponent = page.icon;
                    return (
                      <button
                        key={page.id}
                        onClick={() => setCurrentPage(page.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          currentPage === page.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        } border`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-3" />
                          <span className="font-medium">{page.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Database Management */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Database Management</h3>
                <div className="space-y-2">
                  <a
                    href="/admin/database"
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-colors block"
                  >
                    <div className="flex items-center">
                      <Database className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <span className="font-medium text-purple-700">Database Admin</span>
                        <p className="text-xs text-purple-600">Manage all data records</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Section Management */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Add Section</h3>
                <div className="space-y-2">
                  {sectionTypes.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => addSection(section.id)}
                        className="w-full text-left p-2 rounded border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">{section.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Page Info */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Page Info</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Path:</span>
                    <span className="ml-2 font-mono">{pageData?.path}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sections:</span>
                    <span className="ml-2">{pageData?.sections.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Modified:</span>
                    <span className="ml-2">{pageData?.lastModified ? new Date(pageData.lastModified).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {currentPageType && <currentPageType.icon className="w-6 h-6 text-blue-600 mr-3" />}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{pageData?.title}</h2>
                      <p className="text-sm text-gray-600">Manage all content and settings</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'content', name: 'Content', icon: FileText },
                      { id: 'metadata', name: 'SEO & Meta', icon: Globe },
                      { id: 'settings', name: 'Settings', icon: Settings },
                      { id: 'images', name: 'Images', icon: ImageIcon }
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 inline mr-2" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {pageData?.sections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdate={(updates) => updateSection(section.id, updates)}
                    onDelete={() => deleteSection(section.id)}
                    onImageUpload={(file) => uploadImage(file, section.id)}
                  />
                ))}

                {pageData?.sections.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                    <p className="text-gray-600 mb-4">Add your first section to get started</p>
                    <button
                      onClick={() => addSection('hero')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Hero Section
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metadata' && (
              <MetadataEditor
                metadata={pageData?.metadata || {}}
                onUpdate={(metadata) => setPageData(prev => prev ? { ...prev, metadata } : null)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsEditor
                settings={pageData?.settings || {}}
                onUpdate={(settings) => setPageData(prev => prev ? { ...prev, settings } : null)}
              />
            )}

            {activeTab === 'images' && (
              <ImagesManager
                images={pageData?.sections.flatMap(s => s.images) || []}
                onUpload={(file, sectionId) => uploadImage(file, sectionId)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Editor Component
function SectionEditor({ section, onUpdate, onDelete, onImageUpload }: {
  section: SectionData;
  onUpdate: (updates: Partial<SectionData>) => void;
  onDelete: () => void;
  onImageUpload: (file: File) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-gray-600 mr-3" />
            <h3 className="font-semibold text-gray-900">{section.name}</h3>
            <span className="ml-2 text-sm text-gray-500 capitalize">{section.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
            <input
              type="text"
              value={section.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Content Editor based on type */}
          {section.type === 'hero' && (
            <HeroEditor content={section.content} onUpdate={(content) => onUpdate({ content })} />
          )}

          {section.type === 'text' && (
            <TextEditor content={section.content} onUpdate={(content) => onUpdate({ content })} />
          )}

          {section.type === 'services' && (
            <ServicesEditor content={section.content} onUpdate={(content) => onUpdate({ content })} />
          )}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {section.images.map((image) => (
                <div key={image.id} className="relative">
                  <img src={image.url} alt={image.alt} className="w-full h-24 object-cover rounded border" />
                  <button className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs">
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Add Image</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
              className="hidden"
            />
          </div>

          {/* Settings */}
          <SectionSettingsEditor
            settings={section.settings}
            onUpdate={(settings) => onUpdate({ settings })}
          />
        </div>
      )}
    </div>
  );
}

// Specific content editors
function HeroEditor({ content, onUpdate }: { content: any; onUpdate: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => onUpdate({ ...content, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onUpdate({ ...content, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
          <input
            type="text"
            value={content.ctaText || ''}
            onChange={(e) => onUpdate({ ...content, ctaText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
          <input
            type="text"
            value={content.ctaLink || ''}
            onChange={(e) => onUpdate({ ...content, ctaLink: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function TextEditor({ content, onUpdate }: { content: any; onUpdate: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          value={content.content || ''}
          onChange={(e) => onUpdate({ ...content, content: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

function ServicesEditor({ content, onUpdate }: { content: any; onUpdate: (content: any) => void }) {
  const services = content.services || [];

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    onUpdate({ ...content, services: newServices });
  };

  const addService = () => {
    const newServices = [...services, { name: '', description: '' }];
    onUpdate({ ...content, services: newServices });
  };

  const removeService = (index: number) => {
    const newServices = services.filter((_: any, i: number) => i !== index);
    onUpdate({ ...content, services: newServices });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Services</label>
          <button
            onClick={addService}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Service
          </button>
        </div>

        {services.map((service: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Service {index + 1}</h4>
              <button
                onClick={() => removeService(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Service name"
                value={service.name || ''}
                onChange={(e) => updateService(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <textarea
                placeholder="Service description"
                value={service.description || ''}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSettingsEditor({ settings, onUpdate }: { settings: SectionSettings; onUpdate: (settings: SectionSettings) => void }) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">Section Settings</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Background</label>
          <input
            type="text"
            value={settings.background}
            onChange={(e) => onUpdate({ ...settings, background: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Padding</label>
          <input
            type="text"
            value={settings.padding}
            onChange={(e) => onUpdate({ ...settings, padding: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Text Align</label>
          <select
            value={settings.textAlign}
            onChange={(e) => onUpdate({ ...settings, textAlign: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Max Width</label>
          <input
            type="text"
            value={settings.maxWidth}
            onChange={(e) => onUpdate({ ...settings, maxWidth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function MetadataEditor({ metadata, onUpdate }: { metadata: MetadataData; onUpdate: (metadata: MetadataData) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO & Metadata</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => onUpdate({ ...metadata, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{metadata.title.length}/60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea
            value={metadata.description}
            onChange={(e) => onUpdate({ ...metadata, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{metadata.description.length}/155 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
          <input
            type="text"
            value={metadata.keywords.join(', ')}
            onChange={(e) => onUpdate({ ...metadata, keywords: e.target.value.split(',').map(k => k.trim()) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
          <input
            type="text"
            value={metadata.canonical}
            onChange={(e) => onUpdate({ ...metadata, canonical: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
          <select
            value={metadata.robots}
            onChange={(e) => onUpdate({ ...metadata, robots: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="index, follow">Index, Follow</option>
            <option value="index, nofollow">Index, No Follow</option>
            <option value="noindex, follow">No Index, Follow</option>
            <option value="noindex, nofollow">No Index, No Follow</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function SettingsEditor({ settings, onUpdate }: { settings: SettingsData; onUpdate: (settings: SettingsData) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Page Settings</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => onUpdate({ ...settings, theme: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
          <select
            value={settings.layout}
            onChange={(e) => onUpdate({ ...settings, layout: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="default">Default</option>
            <option value="wide">Wide</option>
            <option value="narrow">Narrow</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Display Options</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showBreadcrumbs}
              onChange={(e) => onUpdate({ ...settings, showBreadcrumbs: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show breadcrumbs</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showFooter}
              onChange={(e) => onUpdate({ ...settings, showFooter: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show footer</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
          <textarea
            value={settings.customCSS}
            onChange={(e) => onUpdate({ ...settings, customCSS: e.target.value })}
            rows={6}
            placeholder="Add custom CSS for this page..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom JavaScript</label>
          <textarea
            value={settings.customJS}
            onChange={(e) => onUpdate({ ...settings, customJS: e.target.value })}
            rows={6}
            placeholder="Add custom JavaScript for this page..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function ImagesManager({ images, onUpload }: { images: ImageData[]; onUpload: (file: File, sectionId: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Image Library</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file, 'global');
          }}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                <p className="text-sm font-medium">{image.title}</p>
                <p className="text-xs">{image.width} × {image.height}</p>
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No images yet</h4>
            <p className="text-gray-600">Upload your first image to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
