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
import AdvancedProjectManager from '@/components/admin/AdvancedProjectManager';
import ContactFormEditor from '@/components/admin/ContactFormEditor';
import ServiceHighlightsEditor from '@/components/admin/ServiceHighlightsEditor';
import USPEditor from '@/components/admin/USPEditor';
import FeaturedProjectsEditor from '@/components/admin/FeaturedProjectsEditor';
import ADRFocusEditor from '@/components/admin/ADRFocusEditor';
import PartnersEditor from '@/components/admin/PartnersEditor';
import LatestNewsEditor from '@/components/admin/LatestNewsEditor';
import ServicesDetailedEditor from '@/components/admin/ServicesDetailedEditor';
import WorkflowEditor from '@/components/admin/WorkflowEditor';

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
  facilities: { label: 'Facilities', icon: Building, description: 'Facility information' },
  timeline: { label: 'Timeline', icon: Calendar, description: 'Timeline or history' },
  awards: { label: 'Awards', icon: Award, description: 'Awards and recognition' },
  'service-highlights': { label: 'Service Highlights', icon: Briefcase, description: 'Service highlights' },
  'adr-focus': { label: 'ADR Focus', icon: Mic, description: 'ADR excellence section' },
  'services-detailed': { label: 'Detailed Services', icon: Settings, description: 'Detailed service information' },
  workflow: { label: 'Workflow', icon: RefreshCw, description: 'Process workflow' },
  'team-members': { label: 'Team Members', icon: Users, description: 'Team member profiles' },
  'contact-info': { label: 'Contact Info', icon: MapPin, description: 'Contact information' },
  'contact-form': { label: 'Contact Form', icon: MessageSquare, description: 'Contact form' },
  'studio-details': { label: 'Studio Details', icon: Building, description: 'Studio information' },
  'equipment-list': { label: 'Equipment List', icon: Settings, description: 'Equipment list' }
};

interface PageBlock {
  id: string;
  type: keyof typeof blockTypes;
  content: any;
  order: number;
  visible: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  type: keyof typeof pageTypes;
  blocks: PageBlock[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
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
  const [showBlockPalette, setShowBlockPalette] = useState(false);
  const [showAddBlockPalette, setShowAddBlockPalette] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [activeTab, setActiveTab] = useState<'pages' | 'database'>('pages');
  
  // Database state
  const [databaseData, setDatabaseData] = useState<{[key: string]: any}>({});
  const [selectedDatabase, setSelectedDatabase] = useState<string>('projects');
  const [databaseLoading, setDatabaseLoading] = useState(false);
  
  // Drag & drop state
  const [draggedBlock, setDraggedBlock] = useState<PageBlock | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  
  // File upload state
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load pages from API
  useEffect(() => {
    loadPages();
  }, []);

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
      const response = await fetch(`/api/database?type=${selectedDatabase}`);
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
        status: 'published',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        meta: {
          title: 'Posta Vermaas - Dutch Audio Post Production',
          description: 'Leading audio post production facility in Amsterdam',
          keywords: ['audio', 'post production', 'Amsterdam', 'film', 'TV']
        },
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            order: 0,
            visible: true,
            content: {
              title: 'Dutch market-leading audiopost facility',
              subtitle: 'for feature films and hi-end TV- and VOD-drama',
              description: 'Operating from the heart of its motion-picture industry, Amsterdam',
              backgroundImage: '/images/hero-bg.jpg',
              ctaText: 'View Our Work',
              ctaLink: '/projects'
            }
          },
          {
            id: 'services-1',
            type: 'services',
            order: 1,
            visible: true,
            content: {
              title: 'Our Services',
              services: [
                { title: 'Sound Design', description: 'Creative sound design for film and TV' },
                { title: 'Re-recording Mix', description: 'Final mix and mastering services' },
                { title: 'ADR', description: 'Automated Dialogue Replacement' }
              ]
            }
          }
        ]
      },
      {
        id: 'about',
        title: 'About Us',
        slug: '/about-us',
        type: 'about',
        status: 'published',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        meta: {
          title: 'About Posta Vermaas',
          description: 'Learn about our team and facilities',
          keywords: ['about', 'team', 'facilities', 'Amsterdam']
        },
        blocks: [
          {
            id: 'text-1',
            type: 'text',
            order: 0,
            visible: true,
            content: {
              title: 'About Posta Vermaas',
              content: 'We are a leading audio post production facility...'
            }
          }
        ]
      }
    ];
    setPages(defaultPages);
    setActivePage(defaultPages[0]);
  };

  // Page management functions
  const createNewPage = (type: keyof typeof pageTypes) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: `New ${pageTypes[type].label}`,
      slug: `/${type}-${Date.now()}`,
      type,
      status: 'draft',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      meta: {
        title: `New ${pageTypes[type].label}`,
        description: '',
        keywords: []
      },
      blocks: []
    };
    setPages([...pages, newPage]);
    setActivePage(newPage);
  };

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    const updatedPages = pages.map(page => 
      page.id === pageId 
        ? { ...page, ...updates, lastModified: new Date().toISOString() }
        : page
    );
    setPages(updatedPages);
    if (activePage?.id === pageId) {
      setActivePage({ ...activePage, ...updates, lastModified: new Date().toISOString() });
    }
  };

  const deletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      const updatedPages = pages.filter(page => page.id !== pageId);
      setPages(updatedPages);
      if (activePage?.id === pageId) {
        setActivePage(updatedPages[0] || null);
      }
    }
  };

  // Block management functions
  const addBlock = (type: keyof typeof blockTypes) => {
    if (!activePage) return;
    
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      order: activePage.blocks.length,
      visible: true,
      content: getDefaultBlockContent(type)
    };
    
    updatePage(activePage.id, {
      blocks: [...activePage.blocks, newBlock]
    });
    setShowAddBlockPalette(false);
  };

  const getDefaultBlockContent = (type: keyof typeof blockTypes) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Your Hero Title',
          subtitle: 'Your subtitle here',
          description: 'Description text',
          backgroundImage: '',
          ctaText: 'Learn More',
          ctaLink: '#'
        };
      case 'text':
        return {
          title: 'Section Title',
          content: 'Your content here...'
        };
      case 'image':
        return {
          src: '',
          alt: 'Image description',
          caption: 'Image caption'
        };
      case 'gallery':
        return {
          images: []
        };
      case 'services':
        return {
          title: 'Our Services',
          services: []
        };
      case 'team':
        return {
          title: 'Our Team',
          members: []
        };
      case 'contact':
        return {
          title: 'Contact Us',
          form: true,
          info: {}
        };
      case 'video':
        return {
          src: '',
          title: 'Video Title',
          description: 'Video description'
        };
      case 'cta':
        return {
          title: 'Call to Action',
          description: 'Action description',
          buttonText: 'Get Started',
          buttonLink: '#'
        };
      default:
        return {};
    }
  };

  const updateBlock = (blockId: string, updates: Partial<PageBlock>) => {
    if (!activePage) return;
    
    const updatedBlocks = activePage.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    
    updatePage(activePage.id, { blocks: updatedBlocks });
  };

  const deleteBlock = (blockId: string) => {
    if (!activePage) return;
    
    const updatedBlocks = activePage.blocks.filter(block => block.id !== blockId);
    updatePage(activePage.id, { blocks: updatedBlocks });
  };

  const moveBlock = (blockId: string, newOrder: number) => {
    if (!activePage) return;
    
    const blocks = [...activePage.blocks];
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    const [movedBlock] = blocks.splice(blockIndex, 1);
    blocks.splice(newOrder, 0, movedBlock);
    
    // Update order numbers
    const updatedBlocks = blocks.map((block, index) => ({
      ...block,
      order: index
    }));
    
    updatePage(activePage.id, { blocks: updatedBlocks });
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, block: PageBlock) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverBlock(targetBlockId);
  };

  const handleDragLeave = () => {
    setDragOverBlock(null);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    
    if (!draggedBlock || !activePage) return;
    
    const targetIndex = activePage.blocks.findIndex(block => block.id === targetBlockId);
    const draggedIndex = activePage.blocks.findIndex(block => block.id === draggedBlock.id);
    
    if (targetIndex !== -1 && draggedIndex !== -1 && targetIndex !== draggedIndex) {
      moveBlock(draggedBlock.id, targetIndex);
    }
    
    setDraggedBlock(null);
    setDragOverBlock(null);
  };

  // File upload functions
  const handleFileUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          return result.url;
        }
        throw new Error('Upload failed');
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    });
    
    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== null);
  };

  // Save functions
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
        const result = await response.json();
        console.log('Page saved successfully:', result);
        // Update the page in the list
        const updatedPages = pages.map(page => 
          page.id === activePage.id ? { ...activePage, lastModified: new Date().toISOString() } : page
        );
        setPages(updatedPages);
      } else {
        const errorText = await response.text();
        throw new Error(`Save failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Admin</h1>
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
          <div className="flex-1 overflow-y-auto p-4">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
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
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Filter */}
                <div className="mb-6">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Pages</option>
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
                  const pageType = pageTypes[page.type];
                  const IconComponent = pageType.icon;
                  return (
                    <div
                      key={page.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        activePage?.id === page.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => setActivePage(page)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent className={`w-5 h-5 mr-3 text-${pageType.color}-600`} />
                          <div>
                            <h4 className="font-medium text-gray-900">{page.title}</h4>
                            <p className="text-xs text-gray-500">{page.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            page.status === 'published' ? 'bg-green-100 text-green-800' :
                            page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {page.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePage(page.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="projects">Projects (372 items)</option>
                    <option value="people">People (15 items)</option>
                    <option value="services">Services (9 items)</option>
                    <option value="freelancers">Freelancers (120 items)</option>
                    <option value="news">News (1 item)</option>
                    <option value="roles">Roles (16 items)</option>
                    <option value="content">Content (1 item)</option>
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
            <div className="bg-white shadow-sm border-b p-4 relative z-[60]">
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
                disabled={isSaving || !activePage}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
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
                  <h3 className="font-semibold text-gray-900">Add New Page</h3>
                  <button
                    onClick={() => setShowBlockPalette(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {Object.entries(pageTypes).map(([type, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        createNewPage(type as keyof typeof pageTypes);
                        setShowBlockPalette(false);
                      }}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center">
                        <IconComponent className={`w-5 h-5 text-${config.color}-600 mr-3`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-500">Create a new {config.label.toLowerCase()} page</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Block Palette */}
          {showAddBlockPalette && (
            <div className="w-80 bg-white border-r shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Add Block</h3>
                  <button
                    onClick={() => setShowAddBlockPalette(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {Object.entries(blockTypes).map(([type, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => addBlock(type as keyof typeof blockTypes)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center">
                        <IconComponent className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-500">{config.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1 p-6">
            {activePage ? (
              <div className="max-w-4xl mx-auto">
                {/* Page Settings */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Page Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={activePage.title}
                        onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <input
                        type="text"
                        value={activePage.slug}
                        onChange={(e) => updatePage(activePage.id, { slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={activePage.status}
                        onChange={(e) => updatePage(activePage.id, { status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={activePage.meta.title}
                        onChange={(e) => updatePage(activePage.id, { meta: { ...activePage.meta, title: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Blocks */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Page Blocks</h3>
                    <button
                      onClick={() => setShowAddBlockPalette(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Block
                    </button>
                  </div>
                  
                  {activePage.blocks.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks yet</h3>
                      <p className="text-gray-500 mb-4">Add your first block to start building your page</p>
                      <button
                        onClick={() => setShowAddBlockPalette(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Block
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activePage.blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block, index) => {
                          const blockType = blockTypes[block.type];
                          const IconComponent = blockType.icon;
                          
                          return (
                            <div
                              key={block.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, block)}
                              onDragOver={(e) => handleDragOver(e, block.id)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, block.id)}
                              className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
                                dragOverBlock === block.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              } ${draggedBlock?.id === block.id ? 'opacity-50' : ''}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
                                  <IconComponent className="w-5 h-5 text-gray-600 mr-3" />
                                  <div>
                                    <h4 className="font-medium text-gray-900">{blockType.label}</h4>
                                    <p className="text-sm text-gray-500">Order: {block.order}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setEditingBlock(block)}
                                    className="p-2 hover:bg-gray-100 rounded text-blue-600"
                                    title="Edit block"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteBlock(block.id)}
                                    className="p-2 hover:bg-red-100 rounded text-red-600"
                                    title="Delete block"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Block Preview */}
                              <div className="bg-gray-50 rounded p-3">
                {block.type === 'hero' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <p className="text-xs text-gray-500">{block.content.description}</p>
                  </div>
                )}
                {block.type === 'text' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.content}</p>
                  </div>
                )}
                {block.type === 'services' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <div className="flex flex-wrap gap-1">
                      {block.content.services?.map((service: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {block.type === 'usp' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="flex flex-wrap gap-1">
                      {block.content.usps?.map((usp: any, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {usp.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {block.type === 'featured-projects' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <p className="text-xs text-gray-500">Projects: {block.content.projects?.length || 0}</p>
                  </div>
                )}
                {block.type === 'latest-news' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <p className="text-xs text-gray-500">Posts: {block.content.posts?.length || 0}</p>
                  </div>
                )}
                {block.type === 'partners' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="flex flex-wrap gap-1">
                      {block.content.partners?.map((partner: any, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">
                          {partner.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Stats Preview */}
                {block.type === 'stats' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {block.content.stats?.map((stat: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Values Preview */}
                {block.type === 'values' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {block.content.values?.map((value: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{value.title}</div>
                          <div className="text-sm text-gray-600">{value.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Preview */}
                {block.type === 'timeline' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="space-y-2">
                      {block.content.timeline?.map((item: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{item.year} - {item.title}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards Preview */}
                {block.type === 'awards' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="space-y-2">
                      {block.content.awards?.map((award: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{award.title} ({award.year})</div>
                          <div className="text-sm text-gray-600">{award.organization}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Members Preview */}
                {block.type === 'team-members' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {block.content.members?.map((member: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info Preview */}
                {block.type === 'contact-info' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="space-y-2">
                      {block.content.contactInfo?.map((info: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{info.label}</div>
                          <div className="text-sm text-gray-600">{info.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Form Preview */}
                {block.type === 'contact-form' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="text-sm text-gray-600">
                      {block.content.fields?.length || 0} form fields configured
                    </div>
                  </div>
                )}

                {/* Service Highlights Preview */}
                {block.type === 'service-highlights' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {block.content.services?.map((service: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{service.title}</div>
                          <div className="text-sm text-gray-600">{service.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADR Focus Preview */}
                {block.type === 'adr-focus' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="text-sm text-gray-600">
                      {block.content.features?.length || 0} ADR features configured
                    </div>
                  </div>
                )}

                {/* Services Detailed Preview */}
                {block.type === 'services-detailed' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {block.content.services?.map((service: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{service.title}</div>
                          <div className="text-sm text-gray-600">{service.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workflow Preview */}
                {block.type === 'workflow' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="space-y-2">
                      {block.content.steps?.map((step: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">Step {step.order}: {step.title}</div>
                          <div className="text-sm text-gray-600">{step.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Studio Details Preview */}
                {block.type === 'studio-details' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {block.content.studios?.map((studio: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{studio.name}</div>
                          <div className="text-sm text-gray-600">{studio.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment List Preview */}
                {block.type === 'equipment-list' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">{block.content.title}</h4>
                    <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                    <div className="space-y-2">
                      {block.content.categories?.map((category: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-600">{category.equipment?.length || 0} items</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback for unknown block types */}
                {!['hero', 'text', 'services', 'usp', 'featured-projects', 'latest-news', 'partners', 'stats', 'values', 'facilities', 'timeline', 'awards', 'team-members', 'contact-info', 'contact-form', 'service-highlights', 'adr-focus', 'services-detailed', 'workflow', 'studio-details', 'equipment-list'].includes(block.type) && (
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {JSON.stringify(block.content, null, 2)}
                  </pre>
                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
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
        ) : (
          <>
            {/* Database Top Bar */}
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
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={databaseLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${databaseLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Database Content */}
            <div className="flex-1 p-6">
              <AdvancedProjectManager />
            </div>
          </>
        )}
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
