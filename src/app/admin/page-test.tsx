'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Menu, 
  Search, 
  Home, 
  Plus, 
  Eye, 
  Save, 
  Monitor, 
  Tablet, 
  Smartphone,
  RefreshCw,
  Database,
  Edit,
  Trash2
} from 'lucide-react';

export default function AdminPageTest() {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'database'>('database');
  
  // Database state
  const [databaseData, setDatabaseData] = useState<{[key: string]: any}>({});
  const [selectedDatabase, setSelectedDatabase] = useState<string>('projects');
  const [databaseLoading, setDatabaseLoading] = useState(false);

  // Load database data
  useEffect(() => {
    if (activeTab === 'database') {
      loadDatabaseData();
    }
  }, [activeTab, selectedDatabase]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={sidebarOpen ? 'w-80 bg-white shadow-lg transition-all duration-300 flex flex-col' : 'w-16 bg-white shadow-lg transition-all duration-300 flex flex-col'}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

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

          {/* Database Selector */}
          {activeTab === 'database' && (
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
          )}

          {/* Database Content Preview */}
          {activeTab === 'database' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Database Items</h3>
                <button
                  onClick={loadDatabaseData}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {databaseLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : databaseData[selectedDatabase] && Array.isArray(databaseData[selectedDatabase]) ? (
                  databaseData[selectedDatabase].slice(0, 5).map((item: any, index: number) => (
                    <div key={item.id || index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm">{item.title || item.name || `Item ${index + 1}`}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.description || item.type || 'No description'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Database className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'database' 
                  ? `Database: ${selectedDatabase.charAt(0).toUpperCase() + selectedDatabase.slice(1)}`
                  : 'Pages Management'
                }
              </h2>
              {activeTab === 'database' && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {databaseData[selectedDatabase] ? 
                    (Array.isArray(databaseData[selectedDatabase]) ? 
                      `${databaseData[selectedDatabase].length} items` : 
                      '1 item') : 
                    '0 items'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button className="p-2 rounded bg-white shadow">
                  <Monitor className="w-4 h-4" />
                </button>
                <button className="p-2 rounded">
                  <Tablet className="w-4 h-4" />
                </button>
                <button className="p-2 rounded">
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Save className="w-4 h-4 inline mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            {activeTab === 'database' ? (
              <div>
                {databaseLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">Loading database...</p>
                  </div>
                ) : databaseData[selectedDatabase] && Array.isArray(databaseData[selectedDatabase]) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {databaseData[selectedDatabase].map((item: any, index: number) => (
                      <div key={item.id || index} className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {item.title || item.name || `Item ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {item.description || item.type || 'No description'}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => console.log('Edit item:', item)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => console.log('Delete item:', item)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">No data available for this database.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pages Management</h3>
                  <p className="text-gray-500">Switch to Database tab to manage data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
