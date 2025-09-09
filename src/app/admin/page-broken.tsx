'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Settings,
  FileText,
  Users,
  Building,
  MessageSquare,
  BarChart3,
  Save,
  Eye,
  Edit3,
  Trash2,
  Database,
  Image as ImageIcon,
  Menu,
  Home,
  Briefcase,
  Newspaper,
  Phone,
  MapPin,
  RefreshCw,
  Plus,
  Upload,
  Download,
  Copy,
  Move,
  GripVertical,
  Type,
  Image,
  Video,
  Link,
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Award,
  Calendar,
  Mic
} from 'lucide-react';
import BlockEditor from '@/components/admin/BlockEditor';
import StudioDetailsEditor from '@/components/admin/StudioDetailsEditor';
import EquipmentListEditor from '@/components/admin/EquipmentListEditor';
import StatsEditor from '@/components/admin/StatsEditor';
import ValuesEditor from '@/components/admin/ValuesEditor';
import TimelineEditor from '@/components/admin/TimelineEditor';
import AwardsEditor from '@/components/admin/AwardsEditor';
import TeamMembersEditor from '@/components/admin/TeamMembersEditor';
import ContactInfoEditor from '@/components/admin/ContactInfoEditor';
import ContactFormEditor from '@/components/admin/ContactFormEditor';
import ServiceHighlightsEditor from '@/components/admin/ServiceHighlightsEditor';
import USPEditor from '@/components/admin/USPEditor';
import FeaturedProjectsEditor from '@/components/admin/FeaturedProjectsEditor';
import ADRFocusEditor from '@/components/admin/ADRFocusEditor';
import PartnersEditor from '@/components/admin/PartnersEditor';
import LatestNewsEditor from '@/components/admin/LatestNewsEditor';
import ServicesDetailedEditor from '@/components/admin/ServicesDetailedEditor';
import WorkflowEditor from '@/components/admin/WorkflowEditor';
import AdvancedProjectManager from '@/components/admin/AdvancedProjectManager';

// Page types and their configurations
const pageTypes = {
  homepage: { label: 'Homepage', icon: Home, color: 'blue' },
  about: { label: 'About Us', icon: Users, color: 'green' },
  services: { label: 'Services', icon: Briefcase, color: 'purple' },
  facilities: { label: 'Facilities', icon: Building, color: 'orange' },
  people: { label: 'People', icon: Users, color: 'pink' },
  projects: { label: 'Projects', icon: FileText, color: 'indigo' },
  news: { label: 'News', icon: Newspaper, color: 'red' },
  contact: { label: 'Contact', icon: Phone, color: 'teal' }
};

// Block types for drag & drop
const blockTypes = {
  hero: { label: 'Hero Section', icon: Layout, description: 'Large banner with title and CTA' },
  text: { label: 'Text Block', icon: Type, description: 'Rich text content' },
  image: { label: 'Image', icon: Image, description: 'Single image with caption' },
  gallery: { label: 'Image Gallery', icon: ImageIcon, description: 'Multiple images in grid' },
  services: { label: 'Services Grid', icon: Briefcase, description: 'Service cards layout' },
  usp: { label: 'USP Section', icon: BarChart3, description: 'Unique selling points with icons' },
  'featured-projects': { label: 'Featured Projects', icon: FileText, description: 'Showcase featured projects' },
  'latest-news': { label: 'Latest News', icon: Newspaper, description: 'Recent news and updates' },
  partners: { label: 'Partners', icon: Users, description: 'Client and partner logos' },
  team: { label: 'Team Section', icon: Users, description: 'Team member profiles' },
  contact: { label: 'Contact Form', icon: MessageSquare, description: 'Contact form and info' },
  video: { label: 'Video', icon: Video, description: 'Embedded video player' },
  cta: { label: 'Call to Action', icon: Link, description: 'Action button section' },
  // New block types
  stats: { label: 'Statistics', icon: BarChart3, description: 'Statistics and numbers' },
  values: { label: 'Values', icon: Check, description: 'Company values and principles' },
  timeline: { label: 'Timeline', icon: Calendar, description: 'Timeline of events' },
  awards: { label: 'Awards', icon: Award, description: 'Awards and recognition' },
  'team-members': { label: 'Team Members', icon: Users, description: 'Team member profiles' },
  'contact-info': { label: 'Contact Info', icon: Phone, description: 'Contact information' },
  'contact-form': { label: 'Contact Form', icon: MessageSquare, description: 'Contact form' },
  'service-highlights': { label: 'Service Highlights', icon: Briefcase, description: 'Service highlights' },
  'adr-focus': { label: 'ADR Focus', icon: Mic, description: 'ADR services focus' },
  'services-detailed': { label: 'Detailed Services', icon: Briefcase, description: 'Detailed service descriptions' },
  workflow: { label: 'Workflow', icon: BarChart3, description: 'Process workflow' },
  'studio-details': { label: 'Studio Details', icon: Building, description: 'Studio information' },
  'equipment-list': { label: 'Equipment List', icon: Settings, description: 'Equipment and gear list' }
};

interface PageBlock {
  id: string;
  type: string;
  content: any;
  order: number;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  type: string;
  blocks: PageBlock[];
  status: 'draft' | 'published' | 'archived';
  lastModified: string;
  created: string;
}

export default function AdminPage() {
  // Main state
  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'pages' | 'database'>('pages');
  const [showBlockPalette, setShowBlockPalette] = useState(false);
  const [showAddBlockPalette, setShowAddBlockPalette] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  
  // Drag & drop state
  const [draggedBlock, setDraggedBlock] = useState<PageBlock | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  
  // File upload state
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  
  // Database state
  const [databaseData, setDatabaseData] = useState<{[key: string]: any}>({});
  const [selectedDatabase, setSelectedDatabase] = useState<string>('projects');
  const [databaseLoading, setDatabaseLoading] = useState(false);

  // Load pages from API - Disabled for testing
  // useEffect(() => {
  //   loadPages();
  // }, []);

  // Load database data
  useEffect(() => {
    if (activeTab === 'database') {
      loadDatabaseData();
    }
  }, [activeTab, selectedDatabase]);

  const loadPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setPages(data);
          setActivePage(data[0]);
        } else {
          // Create default pages if no data
          createDefaultPages();
        }
      } else {
        // Create default pages if API doesn't exist
        createDefaultPages();
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
      createDefaultPages();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDatabaseData = async () => {
    setDatabaseLoading(true);
    try {
      const response = await fetch(`/api/admin/database/${selectedDatabase}`);
      if (response.ok) {
        const data = await response.json();
        setDatabaseData(prev => ({
          ...prev,
          [selectedDatabase]: data
        }));
      } else {
        console.error('Failed to load database data');
      }
    } catch (error) {
      console.error('Failed to load database data:', error);
    } finally {
      setDatabaseLoading(false);
    }
  };

  const createDefaultPages = () => {
    const defaultPages: Page[] = [
      {
        id: 'homepage',
        title: 'Homepage',
        slug: '/',
        type: 'homepage',
        blocks: [],
        status: 'published',
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
      },
      {
        id: 'about',
        title: 'About Us',
        slug: '/about',
        type: 'about',
        blocks: [],
        status: 'draft',
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
      },
      {
        id: 'services',
        title: 'Services',
        slug: '/services',
        type: 'services',
        blocks: [],
        status: 'draft',
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
      },
      {
        id: 'projects',
        title: 'Projects',
        slug: '/projects',
        type: 'projects',
        blocks: [],
        status: 'draft',
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
      },
      {
        id: 'contact',
        title: 'Contact',
        slug: '/contact',
        type: 'contact',
        blocks: [],
        status: 'draft',
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
      }
    ];
    
    setPages(defaultPages);
    setActivePage(defaultPages[0]);
  };

  const updateBlock = (blockId: string, updates: Partial<PageBlock>) => {
    if (!activePage) return;
    
    const updatedBlocks = activePage.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    
    const updatedPage = { ...activePage, blocks: updatedBlocks };
    setActivePage(updatedPage);
    
    // Update in pages array
    setPages(pages.map(page => page.id === activePage.id ? updatedPage : page));
  };

  const addBlock = (type: string) => {
    if (!activePage) return;
    
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      content: {},
      order: activePage.blocks.length
    };
    
    const updatedBlocks = [...activePage.blocks, newBlock];
    const updatedPage = { ...activePage, blocks: updatedBlocks };
    setActivePage(updatedPage);
    
    // Update in pages array
    setPages(pages.map(page => page.id === activePage.id ? updatedPage : page));
  };

  const deleteBlock = (blockId: string) => {
    if (!activePage) return;
    
    const updatedBlocks = activePage.blocks.filter(block => block.id !== blockId);
    const updatedPage = { ...activePage, blocks: updatedBlocks };
    setActivePage(updatedPage);
    
    // Update in pages array
    setPages(pages.map(page => page.id === activePage.id ? updatedPage : page));
  };

  const createNewPage = (type: string) => {
    const pageType = pageTypes[type as keyof typeof pageTypes];
    const newPage: Page = {
      id: `${type}-${Date.now()}`,
      title: pageType.label,
      slug: `/${type}`,
      type,
      blocks: [],
      status: 'draft',
      lastModified: new Date().toISOString(),
      created: new Date().toISOString()
    };
    
    setPages([...pages, newPage]);
    setActivePage(newPage);
  };

  const savePage = async () => {
    if (!activePage) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePage)
      });
      
      if (response.ok) {
        const updatedPage = { ...activePage, lastModified: new Date().toISOString() };
        setActivePage(updatedPage);
        setPages(pages.map(page => page.id === activePage.id ? updatedPage : page));
        alert('Page saved successfully!');
      } else {
        throw new Error('Failed to save page');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Main render - Skip loading state for now to test database functionality
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
  //         <p className="text-gray-600">Loading admin dashboard...</p>
  //         <p className="text-sm text-gray-500 mt-2">Pages loaded: {pages.length}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={sidebarOpen ? 'w-80 bg-white shadow-lg transition-all duration-300 flex flex-col' : 'w-16 bg-white shadow-lg transition-all duration-300 flex flex-col'}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        {sidebarOpen && (
          <div className="flex-1 p-4">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'pages'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pages
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'database'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Database
                </button>
              </div>
            </div>

            {activeTab === 'pages' ? (
              <>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter */}
                <div className="mb-6">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Pages List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Pages</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => createNewPage('homepage')}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Add Homepage"
                      >
                        <Home className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowBlockPalette(true)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Add Block"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
              
                  {pages
                    .filter(page => 
                      (filterStatus === 'all' || page.status === filterStatus) &&
                      (searchTerm === '' || page.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((page) => {
                      const pageType = pageTypes[page.type as keyof typeof pageTypes];
                      return (
                        <div
                          key={page.id}
                          onClick={() => setActivePage(page)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            activePage?.id === page.id
                              ? 'bg-blue-100 border border-blue-200'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {pageType && <pageType.icon className="w-4 h-4 mr-2 text-gray-600" />}
                              <div>
                                <h4 className="font-medium text-gray-900">{page.title}</h4>
                                <p className="text-sm text-gray-500">{page.slug}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              page.status === 'published' ? 'bg-green-100 text-green-800' :
                              page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {page.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <>
                {/* Database Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Database
                  </label>
                  <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="projects">Projects</option>
                    <option value="people">People</option>
                    <option value="freelancers">Freelancers</option>
                    <option value="news">News</option>
                    <option value="credit-roles">Credit Roles</option>
                  </select>
                </div>

                {/* Database Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {selectedDatabase.charAt(0).toUpperCase() + selectedDatabase.slice(1)}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={loadDatabaseData}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Refresh"
                        disabled={databaseLoading}
                      >
                        <RefreshCw className={`w-4 h-4 ${databaseLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {databaseLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Loading database...</p>
                    </div>
                  ) : databaseData[selectedDatabase] ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {Array.isArray(databaseData[selectedDatabase]) ? (
                        databaseData[selectedDatabase].slice(0, 10).map((item: any, index: number) => (
                          <div key={item.id || index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {item.title || item.name || `Item ${index + 1}`}
                                </h4>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                {item.year && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.year}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                  ID: {item.id}
                                </span>
                                <button
                                  onClick={() => console.log('Edit item:', item)}
                                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <pre className="text-xs text-gray-600 overflow-auto">
                            {JSON.stringify(databaseData[selectedDatabase], null, 2)}
                          </pre>
                        </div>
                      )}
                      {Array.isArray(databaseData[selectedDatabase]) && databaseData[selectedDatabase].length > 10 && (
                        <div className="text-center py-2">
                          <p className="text-sm text-gray-500">
                            Showing 10 of {databaseData[selectedDatabase].length} items
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Database className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">No data loaded</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'pages' ? (
          <>
            {/* Top Bar */}
            <div className="bg-white shadow-sm border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activePage?.title || 'Select a page'}
                  </h2>
                  {activePage && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activePage.status === 'published' ? 'bg-green-100 text-green-800' :
                      activePage.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activePage.status}
                    </span>
                  )}
                </div>
            
                <div className="flex items-center space-x-3">
                  {/* Preview Mode */}
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow' : ''}`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow' : ''}`}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow' : ''}`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Actions */}
                  <button
                    onClick={() => window.open(activePage?.slug || '/', '_blank')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                  
                  <button
                    onClick={savePage}
                    disabled={isSaving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  
                  {activePage && (
                    <div className="text-xs text-gray-500">
                      Last saved: {new Date(activePage.lastModified).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Page Editor */}
            <div className="flex-1 flex">
              {/* Page Type Palette */}
              {showBlockPalette && (
                <div className="w-80 bg-white border-r shadow-lg">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Add Block</h3>
                      <button
                        onClick={() => setShowBlockPalette(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(blockTypes).map(([type, config]) => (
                        <button
                          key={type}
                          onClick={() => {
                            addBlock(type);
                            setShowBlockPalette(false);
                          }}
                          className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center">
                            <config.icon className="w-5 h-5 text-gray-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">{config.label}</h4>
                              <p className="text-sm text-gray-500">{config.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="flex-1 p-6">
                {activePage ? (
                  <div className="space-y-4">
                    {activePage.blocks.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks yet</h3>
                        <p className="text-gray-500 mb-4">Add your first block to get started</p>
                        <button
                          onClick={() => setShowBlockPalette(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add Block
                        </button>
                      </div>
                    ) : (
                      activePage.blocks.map((block, index) => (
                        <div
                          key={block.id}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-700">
                                {blockTypes[block.type as keyof typeof blockTypes]?.label || block.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingBlock(block)}
                                className="p-1 hover:bg-gray-100 rounded text-blue-600"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteBlock(block.id)}
                                className="p-1 hover:bg-gray-100 rounded text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Block content preview...
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No page selected</h3>
                      <p className="text-gray-500">Choose a page from the sidebar to start editing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'database' ? (
          <>
            {/* Database Header */}
            <div className="bg-white shadow-sm border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Database: {selectedDatabase.charAt(0).toUpperCase() + selectedDatabase.slice(1)}
                  </h2>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {databaseData[selectedDatabase] ? 
                      (Array.isArray(databaseData[selectedDatabase]) ? 
                        `${databaseData[selectedDatabase].length} items` : 
                        'Object data'
                      ) : 
                      'No data'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadDatabaseData}
                    disabled={databaseLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 inline mr-2 ${databaseLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Database Content */}
            <div className="flex-1 p-6">
              {databaseLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading database...</p>
                  </div>
                </div>
              ) : databaseData[selectedDatabase] ? (
                <div className="space-y-6">
                  {Array.isArray(databaseData[selectedDatabase]) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {databaseData[selectedDatabase].map((item: any, index: number) => (
                        <div key={item.id || index} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                              {item.title || item.name || `Item ${index + 1}`}
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              #{item.id}
                            </span>
                          </div>
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                              {item.description}
                            </p>
                          )}
                          
                          {item.year && (
                            <p className="text-xs text-gray-500 mb-3">
                              Year: {item.year}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => console.log('Edit item:', item)}
                                className="p-2 hover:bg-blue-100 rounded text-blue-600"
                                title="Edit item"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => console.log('Delete item:', item)}
                                className="p-2 hover:bg-red-100 rounded text-red-600"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(item.createdAt || item.updatedAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedDatabase.charAt(0).toUpperCase() + selectedDatabase.slice(1)} Data
                      </h3>
                      <pre className="text-sm text-gray-600 overflow-auto max-h-96 bg-gray-50 p-4 rounded">
                        {JSON.stringify(databaseData[selectedDatabase], null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No data loaded</h3>
                    <p className="text-gray-500">Select a database from the sidebar to view data</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        editingBlock.type === 'studio-details' ? (
          <StudioDetailsEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'equipment-list' ? (
          <EquipmentListEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'stats' ? (
          <StatsEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'values' ? (
          <ValuesEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'timeline' ? (
          <TimelineEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'awards' ? (
          <AwardsEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'team-members' ? (
          <TeamMembersEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'contact-info' ? (
          <ContactInfoEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'contact-form' ? (
          <ContactFormEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'service-highlights' ? (
          <ServiceHighlightsEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'usp' ? (
          <USPEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'featured-projects' ? (
          <FeaturedProjectsEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'adr-focus' ? (
          <ADRFocusEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'partners' ? (
          <PartnersEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'latest-news' ? (
          <LatestNewsEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'services-detailed' ? (
          <ServicesDetailedEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : editingBlock.type === 'workflow' ? (
          <WorkflowEditor
            block={editingBlock}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock.id, { content: updatedBlock.content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        ) : (
          <BlockEditor
            block={editingBlock}
            onSave={(content) => {
              updateBlock(editingBlock.id, { content });
              setEditingBlock(null);
            }}
            onClose={() => setEditingBlock(null)}
          />
        )
      )}
    </div>
  );
}
