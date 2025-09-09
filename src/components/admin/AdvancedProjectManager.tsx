'use client';

import { useState, useEffect, useRef } from 'react';
import SimpleCreditsManager from '@/components/admin/SimpleCreditsManager';
import {
  Database,
  FileText,
  Users,
  Building,
  Calendar,
  Search,
  Plus,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Eye,
  Copy,
  AlertTriangle,
  Star,
  Image as ImageIcon,
  Camera,
  User,
  Award,
  Tag,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Settings,
  Import,
  Export,
  FileJson,
  FolderOpen,
  Grid,
  List
} from 'lucide-react';

interface Project {
  id: string | number;
  title: string;
  year: number;
  type: string;
  director?: string;
  producer?: string;
  production_company?: string;
  description?: string;
  poster?: string;
  heroImage?: string;
  credits?: {[key: string]: string[]};
  roles?: string[];
  tags?: string[];
  slug?: string;
  featured?: boolean;
  gallery?: string[];
  client?: string;
  duration?: string;
  format?: string;
  status?: string;
  source_url?: string;
  imdb?: string;
  audioPostProducer?: string;
}

interface Person {
  id: string;
  name: string;
  role: string;
  roles?: string[];
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  experience?: string;
  education?: string;
  awards?: string[];
  featured?: boolean;
  order?: number;
}

interface DatabaseManagerProps {
  onProjectUpdate?: (project: Project) => void;
  onPersonUpdate?: (person: Person) => void;
}

export default function AdvancedProjectManager({ onProjectUpdate, onPersonUpdate }: DatabaseManagerProps) {
  const [activeDatabase, setActiveDatabase] = useState<'projects' | 'people' | 'freelancers'>('projects');
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    year: 'all',
    status: 'all',
    featured: 'all'
  });

  // Available options for dropdowns
  const projectTypes = ['Feature Film', 'TV/VOD series', 'Documentary', 'Short', 'TV Movie', 'Commercials'];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const statuses = ['Completed', 'In Progress', 'Planned', 'Cancelled'];

  const databases = [
    {
      id: 'projects' as const,
      name: 'Projects',
      icon: FileText,
      color: 'indigo',
      count: 372,
      description: 'Manage audio post production projects'
    },
    {
      id: 'people' as const,
      name: 'People',
      icon: Users,
      color: 'blue',
      count: 15,
      description: 'Team members and collaborators'
    },
    {
      id: 'freelancers' as const,
      name: 'Freelancers',
      icon: User,
      color: 'green',
      count: 120,
      description: 'External collaborators and freelancers'
    }
  ];

  // Load data from API
  useEffect(() => {
    loadData();
  }, [activeDatabase]);

  // Apply filters and search
  useEffect(() => {
    applyFilters();
  }, [data, searchTerm, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/database/${activeDatabase}`);
      if (response.ok) {
        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } else {
        console.error('Failed to load data');
        setData([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableFields = activeDatabase === 'projects'
          ? ['title', 'director', 'producer', 'production_company', 'description', 'type']
          : ['name', 'role', 'bio', 'email', 'specialties'];

        return searchableFields.some(field =>
          item[field] && item[field].toString().toLowerCase().includes(term)
        );
      });
    }

    // Type/Status filters
    if (filters.type !== 'all') {
      if (activeDatabase === 'projects') {
        filtered = filtered.filter(item => item.type === filters.type);
      }
    }

    if (filters.year !== 'all') {
      filtered = filtered.filter(item => item.year?.toString() === filters.year);
    }

    if (filters.status !== 'all' && activeDatabase === 'projects') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.featured !== 'all') {
      filtered = filtered.filter(item => item.featured === (filters.featured === 'true'));
    }

    setFilteredData(filtered);
  };

  const handleSaveItem = async (item: any) => {
    try {
      const isNew = !item.id || item.id.toString().startsWith('temp-');
      const method = isNew ? 'POST' : 'POST'; // Using POST for both add and update
      const action = isNew ? 'add' : 'update';

      const payload = isNew
        ? { action, item: { ...item, id: undefined } }
        : { action, item, id: item.id };

      const response = await fetch(`/api/admin/database/${activeDatabase}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await loadData(); // Reload data
        setEditingItem(null);
        setShowAddForm(false);
      } else {
        alert('Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/database/${activeDatabase}?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) return;

    try {
      const response = await fetch(`/api/admin/database/${activeDatabase}?ids=${selectedItems.join(',')}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSelectedItems([]);
        await loadData();
      } else {
        alert('Failed to delete items');
      }
    } catch (error) {
      console.error('Error deleting items:', error);
      alert('Error deleting items');
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDatabase}-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderProjectCard = (project: Project) => (
    <div
      key={project.id}
      className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 overflow-hidden ${
        selectedItems.includes(project.id.toString()) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Project Image */}
      <div className="relative h-48 bg-gray-100">
        {project.poster ? (
          <img
            src={project.poster}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Star className="w-3 h-3 inline mr-1" />
            Featured
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded-full text-xs">
          {project.status || 'Unknown'}
        </div>

        {/* Selection Checkbox */}
        <div className="absolute bottom-3 left-3">
          <input
            type="checkbox"
            checked={selectedItems.includes(project.id.toString())}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, project.id.toString()]);
              } else {
                setSelectedItems(selectedItems.filter(id => id !== project.id.toString()));
              }
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
              {project.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{project.year}</span>
              <span>•</span>
              <span>{project.type}</span>
            </div>
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Credits Preview */}
        {project.credits && Object.keys(project.credits).length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Key Credits:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(project.credits).slice(0, 3).map(([role, people]) => (
                <span key={role} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {role}: {Array.isArray(people) ? people.slice(0, 2).join(', ') : people}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingItem(project)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit project"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`/projects/${project.slug || project.id}`, '_blank')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View project"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteItem(project.id.toString())}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-gray-500">
            ID: {project.id}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonCard = (person: Person) => (
    <div
      key={person.id}
      className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 overflow-hidden ${
        selectedItems.includes(person.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Person Image */}
      <div className="relative h-48 bg-gray-100">
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User className="w-12 h-12" />
          </div>
        )}

        {/* Featured Badge */}
        {person.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Star className="w-3 h-3 inline mr-1" />
            Featured
          </div>
        )}

        {/* Selection Checkbox */}
        <div className="absolute bottom-3 left-3">
          <input
            type="checkbox"
            checked={selectedItems.includes(person.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, person.id]);
              } else {
                setSelectedItems(selectedItems.filter(id => id !== person.id));
              }
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Person Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {person.name}
            </h3>
            <p className="text-sm text-gray-600">
              {person.role}
            </p>
          </div>
        </div>

        {person.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {person.bio}
          </p>
        )}

        {/* Specialties */}
        {person.specialties && person.specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {person.specialties.slice(0, 3).map((specialty, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingItem(person)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit person"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`/people#${person.id}`, '_blank')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View person"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteItem(person.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete person"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-gray-500">
            ID: {person.id}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
            <p className="text-gray-600 mt-1">Manage projects, people, and freelancers</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>
        </div>

        {/* Database Tabs */}
        <div className="flex space-x-1 mb-6">
          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => {
                setActiveDatabase(db.id);
                setSelectedItems([]);
                setEditingItem(null);
              }}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeDatabase === db.id
                  ? `bg-${db.color}-100 text-${db.color}-700 border border-${db.color}-200`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <db.icon className="w-4 h-4 mr-2" />
              {db.name}
              <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded text-xs">
                {db.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeDatabase}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {showFilters ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
          </button>

          {/* Refresh */}
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activeDatabase === 'projects' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                <select
                  value={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-700 font-medium">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedItems([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading {activeDatabase}...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== 'all')
                ? 'Try adjusting your search or filters'
                : `No ${activeDatabase} available yet`}
            </p>
            {!searchTerm && !Object.values(filters).some(f => f !== 'all') && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeDatabase.charAt(0).toUpperCase() + activeDatabase.slice(1)}
                  </h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid/List View */}
            <div className="p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredData.map(item =>
                    activeDatabase === 'projects'
                      ? renderProjectCard(item)
                      : renderPersonCard(item)
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredData.map((item, index) => (
                    <div key={item.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {activeDatabase === 'projects' ? (
                            <FileText className="w-6 h-6 text-gray-600" />
                          ) : (
                            <User className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.title || item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.type || item.role} • {item.year || item.experience}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit' : 'Add New'} {activeDatabase.slice(0, -1)}
                </h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowAddForm(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <ProjectForm
                item={editingItem}
                databaseType={activeDatabase}
                onSave={handleSaveItem}
                onCancel={() => {
                  setEditingItem(null);
                  setShowAddForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Project/Person Form Component
function ProjectForm({ item, databaseType, onSave, onCancel }: {
  item?: any;
  databaseType: string;
  onSave: (item: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (databaseType === 'projects') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
            <input
              type="number"
              required
              value={formData.year || ''}
              onChange={(e) => updateFormData('year', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              required
              value={formData.type || ''}
              onChange={(e) => updateFormData('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Feature Film">Feature Film</option>
              <option value="TV/VOD series">TV/VOD series</option>
              <option value="Documentary">Documentary</option>
              <option value="Short">Short</option>
              <option value="TV Movie">TV Movie</option>
              <option value="Commercials">Commercials</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status || 'Completed'}
              onChange={(e) => updateFormData('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planned">Planned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Director</label>
            <input
              type="text"
              value={formData.director || ''}
              onChange={(e) => updateFormData('director', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Production Company</label>
            <input
              type="text"
              value={formData.production_company || ''}
              onChange={(e) => updateFormData('production_company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Poster URL</label>
            <input
              type="url"
              value={formData.poster || ''}
              onChange={(e) => updateFormData('poster', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IMDB URL</label>
            <input
              type="url"
              value={formData.imdb || ''}
              onChange={(e) => updateFormData('imdb', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => updateFormData('featured', e.target.checked)}
              className="mr-2"
            />
            Featured Project
          </label>
        </div>

        {/* Credits Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Credits
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Add people and their specific roles on this project (e.g., "Sound Design", "Re-recording Mix", "ADR")
          </div>
          <SimpleCreditsManager
            credits={formData.credits || {}}
            onChange={(credits) => updateFormData('credits', credits)}
            allPeople={[]} // Will be populated from the database
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {item ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    );
  }

  // Person form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <input
            type="text"
            required
            value={formData.role || ''}
            onChange={(e) => updateFormData('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => updateFormData('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image || ''}
            onChange={(e) => updateFormData('image', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <input
            type="text"
            value={formData.experience || ''}
            onChange={(e) => updateFormData('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => updateFormData('featured', e.target.checked)}
            className="mr-2"
          />
          Featured Person
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {item ? 'Update Person' : 'Create Person'}
        </button>
      </div>
    </form>
  );
}
