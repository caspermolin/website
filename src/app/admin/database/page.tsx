'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Star
} from 'lucide-react';
import SimpleCreditsManager from '@/components/admin/SimpleCreditsManager';
import ImageUpload from '@/components/admin/ImageUpload';
import TagsManager from '@/components/admin/TagsManager';
import RolesDatabaseManager from '@/components/admin/RolesDatabaseManager';
import SpecialtiesManager from '@/components/admin/SpecialtiesManager';
import AwardsManager from '@/components/admin/AwardsManager';
import MonitoringManager from '@/components/admin/MonitoringManager';
import FormatSelector from '@/components/admin/FormatSelector';

interface DatabaseFile {
  name: string;
  type: 'projects' | 'people' | 'facilities' | 'news' | 'roles' | 'freelancers';
  count: number;
  lastModified: string;
  size: string;
}

export default function DatabaseAdminPage() {
  const [activeDb, setActiveDb] = useState<string>('projects');
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [allPeopleNames, setAllPeopleNames] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkEditField, setBulkEditField] = useState('');
  const [bulkEditValue, setBulkEditValue] = useState('');

  const databases: DatabaseFile[] = [
    {
      name: 'Projects',
      type: 'projects',
      count: 372,
      lastModified: '2024-01-15',
      size: '13.9 MB'
    },
    {
      name: 'People',
      type: 'people',
      count: 15,
      lastModified: '2024-01-14',
      size: '245 KB'
    },
    {
      name: 'Facilities',
      type: 'facilities',
      count: 6,
      lastModified: '2024-01-13',
      size: '45 KB'
    },
    {
      name: 'News',
      type: 'news',
      count: 8,
      lastModified: '2024-01-12',
      size: '12 KB'
    },
    {
      name: 'Roles',
      type: 'roles',
      count: 15,
      lastModified: '2024-01-15',
      size: '5 KB'
    },
    {
      name: 'Freelancers',
      type: 'freelancers',
      count: 120,
      lastModified: '2024-01-15',
      size: '25 KB'
    }
  ];

  // Load all people names from all databases on component mount
  useEffect(() => {
    const loadAllPeopleNames = async () => {
      const allPeople = new Set<string>();

      // Function to load data from a specific database
      const loadFromDatabase = async (dbType: string) => {
        try {
          const response = await fetch(`/api/admin/database/${dbType}`);
          if (response.ok) {
            const dbData = await response.json();
            if (dbData && Array.isArray(dbData)) {
              dbData.forEach((item: any) => {
                // Add people from people database
                if (dbType === 'people' && item.name) {
                  allPeople.add(item.name);
                }

                // Add people from freelancers database
                if (dbType === 'freelancers' && item.name) {
                  allPeople.add(item.name);
                }

                // Add people from project credits
                if (dbType === 'projects' && item.credits) {
                  // Handle all roles in credits
                  Object.values(item.credits).forEach((roleCredits: any) => {
                    if (Array.isArray(roleCredits)) {
                      roleCredits.forEach((person: string) => {
                        if (person && typeof person === 'string' && person.trim()) {
                          allPeople.add(person.trim());
                        }
                      });
                    }
                  });
                }

                // Add people from facilities (if any)
                if (dbType === 'facilities' && item.contact) {
                  allPeople.add(item.contact);
                }

                // Add people from news (if any)
                if (dbType === 'news' && item.author) {
                  allPeople.add(item.author);
                }
              });
            }
          }
        } catch (error) {
          console.warn(`Error loading from ${dbType}:`, error);
        }
      };

      // Load from all databases
      await Promise.all([
        loadFromDatabase('people'),
        loadFromDatabase('freelancers'),
        loadFromDatabase('projects'),
        loadFromDatabase('facilities'),
        loadFromDatabase('news')
      ]);

      const peopleArray = Array.from(allPeople).sort();
      setAllPeopleNames(peopleArray);
      console.log('All people names loaded:', peopleArray);
    };

    loadAllPeopleNames();
  }, []);

  // Function to normalize project credits to use correct role names
  const normalizeProjectCredits = async () => {
    try {
      console.log('Starting project credits normalization...');

      // Load projects and roles
      const [projectsResponse, rolesResponse] = await Promise.all([
        fetch('/api/admin/database/projects'),
        fetch('/api/admin/database/roles')
      ]);

      if (!projectsResponse.ok || !rolesResponse.ok) {
        throw new Error('Failed to load projects or roles');
      }

      const projects = await projectsResponse.json();
      const roles = await rolesResponse.json();

      // Create role mapping
      const roleMap: { [key: string]: string } = {};
      roles.forEach((role: any) => {
        roleMap[role.name.toLowerCase()] = role.name;
        // Also map common variations
        const variations: { [key: string]: string } = {
          'sound designer': 'Sound Designer',
          're-recording mixer': 'Re-recording Mixer',
          'audio post producer': 'Audio Post Producer',
          'sound editor': 'Sound Editor',
          'dialogue editor': 'Dialogue Editor',
          'adr supervisor': 'ADR Supervisor',
          'foley artist': 'Foley Artist',
          'production sound mixer': 'Production Sound Mixer',
          'sound recordist': 'Sound Recordist',
          'music supervisor': 'Music Supervisor',
          'audio engineer': 'Audio Engineer',
          'location sound recordist': 'Location Sound Recordist',
          'post production supervisor': 'Post Production Supervisor',
          'sound effects designer': 'Sound Effects Designer',
          'voice over director': 'Voice Over Director',
          'dubbing director': 'Dubbing Director'
        };

        if (variations[role.name.toLowerCase()]) {
          roleMap[variations[role.name.toLowerCase()]] = role.name;
        }
      });

      // Create role name to database field mapping
      const roleFieldMap: { [key: string]: string } = {
        'Sound Designer': 'soundDesign',
        'Re-recording Mixer': 'reRecordingMix',
        'Sound Editor': 'soundEditor',
        'Dialogue Editor': 'dialogueEditor',
        'ADR Supervisor': 'adr',
        'Foley Artist': 'foley',
        'Production Sound Mixer': 'productionSoundMixer',
        'Sound Recordist': 'soundRecordist',
        'Music Supervisor': 'musicSupervisor',
        'Audio Engineer': 'audioEngineer',
        'Location Sound Recordist': 'locationSoundRecordist',
        'Post Production Supervisor': 'postProductionSupervisor',
        'Sound Effects Designer': 'soundEffectsDesigner',
        'Voice Over Director': 'voiceOverDirector',
        'Dubbing Director': 'dubbingDirector'
      };

      let updatedProjects = 0;

      // Process each project
      for (const project of projects) {
        if (!project.credits) continue;

        const normalizedCredits: { [key: string]: string[] } = {};
        let hasChanges = false;

        // Process each role in credits
        Object.entries(project.credits).forEach(([roleKey, people]: [string, any]) => {
          if (!Array.isArray(people)) return;

          // Find the correct role name
          let correctRoleName = '';
          let correctRoleField = roleKey;

          // Try to match role key to known roles
          for (const [fieldName, roleName] of Object.entries(roleFieldMap)) {
            if (roleName === roleKey) {
              correctRoleName = fieldName;
              break;
            }
          }

          // If we couldn't match by field name, try by role name
          if (!correctRoleName) {
            const matchedRole = roleMap[roleKey.toLowerCase()];
            if (matchedRole) {
              correctRoleName = matchedRole;
              correctRoleField = roleFieldMap[correctRoleName] || roleKey;
            } else {
              correctRoleName = roleKey;
            }
          }

          // Add to normalized credits
          if (!normalizedCredits[correctRoleField]) {
            normalizedCredits[correctRoleField] = [];
          }

          // Add people, filtering out duplicates
          people.forEach((person: string) => {
            if (person && typeof person === 'string' && person.trim()) {
              const trimmedPerson = person.trim();
              if (!normalizedCredits[correctRoleField].includes(trimmedPerson)) {
                normalizedCredits[correctRoleField].push(trimmedPerson);
              }
            }
          });

          // Check if this role was changed
          if (correctRoleField !== roleKey || people.length !== normalizedCredits[correctRoleField].length) {
            hasChanges = true;
          }
        });

        // Update project if changes were made
        if (hasChanges) {
          try {
            const updateResponse = await fetch('/api/admin/database/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update',
                item: {
                  ...project,
                  credits: normalizedCredits
                }
              })
            });

            if (updateResponse.ok) {
              updatedProjects++;
              console.log(`Updated project: ${project.title || project.id}`);
            } else {
              console.warn(`Failed to update project: ${project.title || project.id}`);
            }
          } catch (error) {
            console.warn(`Error updating project ${project.title || project.id}:`, error);
          }
        }
      }

      alert(`Credits normalization completed! Updated ${updatedProjects} projects.`);
      if (activeDb === 'projects') {
        loadDatabase('projects');
      }

    } catch (error) {
      console.error('Error normalizing project credits:', error);
      alert('Failed to normalize project credits. Check console for details.');
    }
  };

  // Function to sync all people from projects to people database
  const syncPeopleDatabase = async () => {
    try {
      console.log('Starting people database synchronization...');

      // Load current people database
      const peopleResponse = await fetch('/api/admin/database/people');
      const currentPeople = peopleResponse.ok ? await peopleResponse.json() : [];

      // Load projects database
      const projectsResponse = await fetch('/api/admin/database/projects');
      const projects = projectsResponse.ok ? await projectsResponse.json() : [];

      const peopleMap = new Map(currentPeople.map((p: any) => [p.name.toLowerCase(), p]));
      const newPeople: any[] = [];

      // Extract all unique people from project credits
      projects.forEach((project: any) => {
        if (project.credits) {
          Object.values(project.credits).forEach((roleCredits: any) => {
            if (Array.isArray(roleCredits)) {
              roleCredits.forEach((personName: string) => {
                if (personName && typeof personName === 'string' && personName.trim()) {
                  const trimmedName = personName.trim();
                  const key = trimmedName.toLowerCase();

                  if (!peopleMap.has(key)) {
                    const newPerson = {
                      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                      name: trimmedName,
                      role: 'Collaborator',
                      roles: ['Collaborator'],
                      bio: `Collaborator on Posta Vermaas projects`,
                      image: '/images/people/placeholder.jpg',
                      email: '',
                      phone: '',
                      linkedin: '',
                      specialties: [],
                      experience: '',
                      education: '',
                      awards: [],
                      featured: false,
                      order: currentPeople.length + newPeople.length + 1
                    };
                    newPeople.push(newPerson);
                    peopleMap.set(key, newPerson);
                  }
                }
              });
            }
          });
        }
      });

      // Add new people to database
      if (newPeople.length > 0) {
        console.log(`Adding ${newPeople.length} new people to database...`);

        for (const newPerson of newPeople) {
          try {
            const response = await fetch('/api/admin/database/people', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'create', item: newPerson })
            });

            if (response.ok) {
              console.log(`Added: ${newPerson.name}`);
            } else {
              console.warn(`Failed to add: ${newPerson.name}`);
            }
          } catch (error) {
            console.warn(`Error adding ${newPerson.name}:`, error);
          }
        }

        // Refresh people names
        const updatedPeopleResponse = await fetch('/api/admin/database/people');
        if (updatedPeopleResponse.ok) {
          const updatedPeople = await updatedPeopleResponse.json();
          const allNames = updatedPeople.map((p: any) => p.name);
          setAllPeopleNames(allNames.sort());
        }

        alert(`Successfully added ${newPeople.length} new people to the database!`);
      } else {
        alert('All people from projects are already in the people database.');
      }

    } catch (error) {
      console.error('Error syncing people database:', error);
      alert('Failed to sync people database. Check console for details.');
    }
  };

  // Function to auto-sync all missing people to freelancers database
  const syncFreelancersDatabase = async () => {
    try {
      console.log('Starting freelancers database sync...');

      // Load current people and freelancers databases
      const [peopleResponse, freelancersResponse, projectsResponse] = await Promise.all([
        fetch('/api/admin/database/people'),
        fetch('/api/admin/database/freelancers'),
        fetch('/api/admin/database/projects')
      ]);

      const currentPeople = peopleResponse.ok ? await peopleResponse.json() : [];
      const currentFreelancers = freelancersResponse.ok ? await freelancersResponse.json() : [];
      const projects = projectsResponse.ok ? await projectsResponse.json() : [];

      // Create maps for existing people
      const peopleMap = new Map(currentPeople.map((p: any) => [p.name.toLowerCase(), p]));
      const freelancersMap = new Map(currentFreelancers.map((p: any) => [p.name.toLowerCase(), p]));
      const newFreelancers: any[] = [];

      // Extract all unique people from project credits that are not in people or freelancers
      projects.forEach((project: any) => {
        if (project.credits) {
          Object.values(project.credits).forEach((roleCredits: any) => {
            if (Array.isArray(roleCredits)) {
              roleCredits.forEach((personName: string) => {
                if (personName && typeof personName === 'string' && personName.trim()) {
                  const trimmedName = personName.trim();
                  const key = trimmedName.toLowerCase();

                  // Only add if not in people database and not already in freelancers
                  if (!peopleMap.has(key) && !freelancersMap.has(key)) {
                    const newFreelancer = {
                      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                      name: trimmedName,
                      role: 'Freelancer',
                      bio: `Freelancer on Posta Vermaas projects`,
                      image: '/images/people/placeholder.jpg',
                      email: '',
                      phone: '',
                      linkedin: '',
                      specialties: [],
                      experience: '',
                      education: '',
                      awards: [],
                      featured: false,
                      order: currentFreelancers.length + newFreelancers.length + 1
                    };
                    newFreelancers.push(newFreelancer);
                    freelancersMap.set(key, newFreelancer);
                  }
                }
              });
            }
          });
        }
      });

      // Add new freelancers to database
      if (newFreelancers.length > 0) {
        console.log(`Adding ${newFreelancers.length} new freelancers to database...`);

        for (const newFreelancer of newFreelancers) {
          try {
            const response = await fetch('/api/admin/database/freelancers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'create', item: newFreelancer })
            });

            if (response.ok) {
              console.log(`Added freelancer: ${newFreelancer.name}`);
            } else {
              console.warn(`Failed to add freelancer: ${newFreelancer.name}`);
            }
          } catch (error) {
            console.warn(`Error adding freelancer ${newFreelancer.name}:`, error);
          }
        }

        alert(`Successfully added ${newFreelancers.length} freelancers to the database! You can now select them in project credits.`);
      } else {
        alert('All people from projects are already in the people or freelancers database.');
      }

    } catch (error) {
      console.error('Error syncing freelancers database:', error);
      alert('Failed to sync freelancers database. Check console for details.');
    }
  };

  useEffect(() => {
    loadDatabase(activeDb);
  }, [activeDb]); // loadDatabase is defined in this component, no need to add it to deps

  useEffect(() => {
    filterData();
  }, [data, searchTerm]); // filterData is defined in this component, no need to add it to deps

  const loadDatabase = async (dbType: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/database/${dbType}`);
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Failed to load database:', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      // Search in all string fields
      return Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
  };

  const handleSave = async (item: any) => {
    try {
      const response = await fetch(`/api/admin/database/${activeDb}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item })
      });

      if (response.ok) {
        // Update local data
        const updatedData = data.map(d => d.id === item.id ? item : d);
        setData(updatedData);
        setEditingItem(null);
        alert('Item updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/database/${activeDb}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', itemId })
      });

      if (response.ok) {
        // Update local data
        const updatedData = data.filter(d => d.id !== itemId);
        setData(updatedData);
        alert('Item deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  const handleBulkEdit = async () => {
    if (!bulkEditField || selectedItems.length === 0) return;

    try {
      const updates = selectedItems.map(id => ({
        id,
        [bulkEditField]: bulkEditValue
      }));

      const response = await fetch(`/api/admin/database/${activeDb}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulkUpdate', updates })
      });

      if (response.ok) {
        // Update local data
        const updatedData = data.map(item => {
          if (selectedItems.includes(item.id)) {
            return { ...item, [bulkEditField]: bulkEditValue };
          }
          return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedItems([]);
        setShowBulkEdit(false);
        setBulkEditField('');
        setBulkEditValue('');
        alert(`Updated ${selectedItems.length} items successfully!`);
      }
    } catch (error) {
      console.error('Bulk edit error:', error);
      alert('Failed to update items');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) return;

    try {
      const response = await fetch(`/api/admin/database/${activeDb}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulkDelete', itemIds: selectedItems })
      });

      if (response.ok) {
        // Update local data
        const updatedData = data.filter(d => !selectedItems.includes(d.id));
        setData(updatedData);
        setSelectedItems([]);
        alert('Items deleted successfully!');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Failed to delete items');
    }
  };

  const exportDatabase = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDb}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDatabaseIcon = (type: string) => {
    switch (type) {
      case 'projects': return FileText;
      case 'people': return Users;
      case 'freelancers': return Users;
      case 'facilities': return Building;
      case 'news': return Calendar;
      case 'roles': return Star;
      default: return Database;
    }
  };

  // Use the pre-loaded all people names
  const getAllPeopleNames = useMemo(() => {
    return allPeopleNames;
  }, [allPeopleNames]);

  const getTableColumns = (dbType: string) => {
    switch (dbType) {
      case 'projects':
        return ['Title', 'Year', 'Director', 'Type', 'Status', 'Actions'];
      case 'people':
        return ['Name', 'Role', 'Email', 'Specialties', 'Actions'];
      case 'facilities':
        return ['Name', 'Type', 'Capacity', 'Dimensions', 'Actions'];
      case 'news':
        return ['Title', 'Category', 'Published', 'Featured', 'Actions'];
      case 'roles':
        return ['Name', 'Category', 'Description', 'Order', 'Actions'];
      case 'freelancers':
        return ['Name', 'Role', 'Bio', 'Email', 'Actions'];
      default:
        return ['Name', 'Value', 'Actions'];
    }
  };

  const renderTableCell = (item: any, column: string, dbType: string) => {
    switch (dbType) {
      case 'projects':
        switch (column) {
          case 'Title': return item.title || 'Untitled';
          case 'Year': return item.year || 'N/A';
          case 'Director': return item.director || 'Unknown';
          case 'Type': return item.type || 'Unknown';
          case 'Status': return item.status || 'Unknown';
          default: return '';
        }
      case 'people':
        switch (column) {
          case 'Name': return item.name || 'Unknown';
          case 'Role': return item.role || 'Unknown';
          case 'Email': return item.email || 'N/A';
          case 'Specialties': return Array.isArray(item.specialties) ? item.specialties.join(', ') : 'N/A';
          default: return '';
        }
      case 'facilities':
        switch (column) {
          case 'Name': return item.name || 'Unknown';
          case 'Type': return item.type || 'Unknown';
          case 'Capacity': return item.specifications?.capacity || 'N/A';
          case 'Dimensions': return item.specifications?.dimensions || 'N/A';
          default: return '';
        }
      case 'news':
        switch (column) {
          case 'Title': return item.title || 'Untitled';
          case 'Category': return item.category || 'General';
          case 'Published': return item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'N/A';
          case 'Featured': return item.featured ? '✅' : '❌';
          default: return '';
        }
      case 'roles':
        switch (column) {
          case 'Name': return item.name || 'Unknown';
          case 'Category': return item.category || 'Unknown';
          case 'Description': return item.description || 'No description';
          case 'Order': return item.order || 'N/A';
          default: return '';
        }
      case 'freelancers':
        switch (column) {
          case 'Name': return item.name || 'Unknown';
          case 'Role': return item.role || 'Unknown';
          case 'Bio': return item.bio || 'No bio';
          case 'Email': return item.email || 'N/A';
          default: return '';
        }
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Title section - always visible */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center min-w-0 flex-1">
                <Database className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Database Manager</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Manage all website databases and content</p>
                </div>
              </div>

              {/* Mobile actions button */}
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => loadDatabase(activeDb)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors lg:hidden"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions section - responsive */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={syncFreelancersDatabase}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
                  title="Sync all missing people from projects to freelancers database"
                >
                  <Users className="w-4 h-4 inline mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Sync Freelancers</span>
                  <span className="sm:hidden">Sync</span>
                </button>
                <button
                  onClick={normalizeProjectCredits}
                  className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium whitespace-nowrap"
                  title="Normalize project credits to use correct role names"
                >
                  <Edit3 className="w-4 h-4 inline mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Fix Credits</span>
                  <span className="sm:hidden">Fix</span>
                </button>
                <button
                  onClick={syncPeopleDatabase}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium whitespace-nowrap"
                  title="Sync all people from projects to people database"
                >
                  <Users className="w-4 h-4 inline mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Full Sync</span>
                  <span className="sm:hidden">Full</span>
                </button>
                <button
                  onClick={exportDatabase}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                  title="Export database"
                >
                  <Download className="w-4 h-4 inline mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>

              {/* Desktop refresh button */}
              <div className="hidden lg:block">
                <button
                  onClick={() => loadDatabase(activeDb)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  title="Refresh database"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Database Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Databases</h3>
                <div className="space-y-3">
                  {databases.map((db) => {
                    const IconComponent = getDatabaseIcon(db.type);
                    return (
                      <button
                        key={db.name}
                        onClick={() => setActiveDb(db.type)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          activeDb === db.type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="text-sm text-gray-500">{db.count}</span>
                        </div>
                        <div className="font-medium">{db.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {db.size} • {db.lastModified}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Database Stats */}
            <div className="bg-white rounded-lg shadow-sm border mt-6">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <span className="font-semibold text-gray-900">{data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Filtered</span>
                    <span className="font-semibold text-gray-900">{filteredData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Selected</span>
                    <span className="font-semibold text-gray-900">{selectedItems.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Database Header */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">{activeDb} Database</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage all {activeDb} records</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add New
                    </button>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Delete ({selectedItems.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Bulk Edit Section */}
                {selectedItems.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-blue-900">
                        Bulk Edit ({selectedItems.length} selected)
                      </h3>
                      <button
                        onClick={() => setShowBulkEdit(!showBulkEdit)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {showBulkEdit ? 'Hide' : 'Show'} Options
                      </button>
                    </div>
                    
                    {showBulkEdit && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Field to Update
                            </label>
                            <select
                              value={bulkEditField}
                              onChange={(e) => setBulkEditField(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select field...</option>
                              {data.length > 0 && Object.keys(data[0]).map(key => (
                                <option key={key} value={key}>
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              New Value
                            </label>
                            <input
                              type="text"
                              value={bulkEditValue}
                              onChange={(e) => setBulkEditValue(e.target.value)}
                              placeholder="Enter new value..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setShowBulkEdit(false);
                              setBulkEditField('');
                              setBulkEditValue('');
                            }}
                            className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBulkEdit}
                            disabled={!bulkEditField || !bulkEditValue}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update {selectedItems.length} Items
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              {isLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Loading database...</p>
                </div>
              ) : (
                <>
                  {/* Mobile-friendly card view */}
                  <div className="lg:hidden space-y-4">
                    {filteredData.map((item, index) => (
                      <div key={item.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedItems([...selectedItems, item.id]);
                                  } else {
                                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {activeDb === 'projects' ? item.title || 'Untitled' : item.name || 'Unknown'}
                              </h3>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              {getTableColumns(activeDb).slice(0, 3).map((column) => (
                                column !== 'Actions' && (
                                  <div key={column} className="truncate">
                                    <span className="font-medium">{column}:</span> {renderTableCell(item, column, activeDb)}
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                              title="Edit item"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table view */}
                  <div className="hidden lg:block overflow-x-auto relative">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(filteredData.map(item => item.id));
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        {getTableColumns(activeDb).map((column, index) => (
                          <th
                            key={column}
                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                              column === 'Actions'
                                ? 'sticky right-0 z-20 bg-gray-50 border-l border-gray-200'
                                : column === 'Title' || column === 'Name'
                                ? 'min-w-48 max-w-64'
                                : 'min-w-32 max-w-48'
                            }`}
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, item.id]);
                                } else {
                                  setSelectedItems(selectedItems.filter(id => id !== item.id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          {getTableColumns(activeDb).map((column) => (
                            <td
                              key={column}
                              className={`px-6 py-4 ${
                                column === 'Actions'
                                  ? 'sticky right-0 z-10 bg-white whitespace-nowrap border-l border-gray-200'
                                  : column === 'Title' || column === 'Name'
                                  ? 'min-w-48 max-w-64 truncate'
                                  : 'min-w-32 max-w-48 truncate'
                              }`}
                            >
                              {column === 'Actions' ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setEditingItem(item)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                    title="Edit item"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                    title="Delete item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900 truncate" title={renderTableCell(item, column, activeDb)}>
                                  {renderTableCell(item, column, activeDb)}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>

                  {filteredData.length === 0 && (
                    <div className="p-12 text-center">
                      <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms' : 'This database is empty'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          dbType={activeDb}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Add Modal */}
      {showAddForm && (
        <AddModal
          dbType={activeDb}
          onSave={(newItem) => {
            setData([...data, newItem]);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

// Edit Modal Component
function EditModal({ item, dbType, onSave, onClose }: {
  item: any;
  dbType: string;
  onSave: (item: any) => void;
  onClose: () => void;
}) {
  const [editedItem, setEditedItem] = useState({ ...item });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(editedItem);
    setIsSaving(false);
  };

  // Get all people names for autocomplete
  const getAllPeopleNames = useMemo(() => {
    const allPeople = new Set<string>();

    // Add some common names that might be used
    const commonNames = [
      'Marco Vermaas',
      'Christan Muiser',
      'Posta Vermaas',
      'Sound Designer',
      'Re-recording Mixer',
      'Audio Post Producer',
      'Sound Editor',
      'Dialogue Editor',
      'Foley Artist',
      'ADR Supervisor',
      'Production Sound Mixer',
      'Sound Recordist'
    ];

    commonNames.forEach(name => allPeople.add(name));

    return Array.from(allPeople);
  }, []);

  const renderField = (key: string, value: any) => {
    // Special handling for credits in projects
    if (key === 'credits' && dbType === 'projects') {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Credits
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Add people and their specific roles on this project (e.g., "Sound Design", "Re-recording Mix", "ADR")
          </div>
          <SimpleCreditsManager
            credits={editedItem[key] || {}}
            onChange={(credits) => setEditedItem({ ...editedItem, credits })}
            allPeople={getAllPeopleNames}
          />
        </div>
      );
    }

    // Special handling for gallery field (array of images)
    if (key === 'gallery' && Array.isArray(value)) {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gallery Images
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Add multiple images to the gallery (one per line)
          </div>
          <textarea
            value={value.join('\n')}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value.split('\n').filter(url => url.trim()) })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter image URLs, one per line..."
          />
        </div>
      );
    }

    // Special handling for source_url field
    if (key === 'source_url' || key === 'sourceUrl') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source URL
          </label>
          <input
            type="url"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>
      );
    }

    // Special handling for slug field
    if (key === 'slug') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="url-friendly-slug"
          />
          <p className="text-xs text-gray-500 mt-1">Used in URLs (auto-formatted)</p>
        </div>
      );
    }

    // Special handling for roles in people (hide it since we already have role field)
    if (key === 'roles' && dbType === 'people') {
      return null; // Don't show the roles array field since it's redundant with the role field
    }

    // Special handling for roles in projects (hide it since we have credits manager)
    if (key === 'roles' && dbType === 'projects') {
      return null; // Don't show the roles array field since we have the credits manager
    }

    // Special handling for audioPostProducer in projects (simple dropdown)
    if (key === 'audioPostProducer' && dbType === 'projects') {
      const audioPostProducerOptions = ['Posta', 'Vermaas', 'PostaVermaas'];
      
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audio Post Producer
          </label>
          <select
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select audio post producer...</option>
            {audioPostProducerOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    // Special handling for image fields
    if (key.toLowerCase().includes('image') || key.toLowerCase().includes('poster') || key.toLowerCase().includes('hero')) {
      return (
        <div key={key} className="mb-4 col-span-2">
          <ImageUpload
            value={editedItem[key]}
            onChange={(url) => setEditedItem({ ...editedItem, [key]: url })}
            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          />
        </div>
      );
    }

    if (key === 'id') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">ID cannot be changed</p>
        </div>
      );
    }

    // Special handling for year field
    if (key === 'year' && dbType === 'projects') {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <select
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select year...</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      );
    }

    // Special handling for type field in projects
    if (key === 'type' && dbType === 'projects') {
      const projectTypes = [
        'Documentary',
        'Feature Film',
        'One Night Stand',
        'Short',
        'TV/VOD series',
        'TV Movie'
      ];

      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <select
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type...</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      );
    }

    // Special handling for status field in projects
    if (key === 'status' && dbType === 'projects') {
      const statuses = ['Planning', 'In Production', 'Post Production', 'Completed', 'Released'];

      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <select
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select status...</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      );
    }

    // Special handling for category field in news
    if (key === 'category' && dbType === 'news') {
      const categories = ['Company News', 'Awards', 'Events', 'Media', 'Technology', 'Partnerships'];

      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <select
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category...</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      );
    }

    // Special handling for description field
    if (key === 'description' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <textarea
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter description..."
          />
        </div>
      );
    }

    // Special handling for bio field
    if (key === 'bio' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <textarea
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter biography..."
          />
        </div>
      );
    }

    // Special handling for experience field
    if (key === 'experience' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <textarea
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter experience details..."
          />
        </div>
      );
    }

    // Special handling for education field
    if (key === 'education' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter education..."
          />
        </div>
      );
    }

    // Special handling for featured field
    if (key === 'featured' && typeof value === 'boolean') {
      return (
        <div key={key} className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">Mark as featured item</p>
        </div>
      );
    }

    // Special handling for client field
    if (key === 'client' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter client name..."
          />
        </div>
      );
    }

    // Special handling for duration field
    if (key === 'duration' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 2h 15m"
          />
        </div>
      );
    }

    // Special handling for producer field
    if (key === 'producer' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter producer name..."
          />
        </div>
      );
    }

    // Special handling for email field
    if (key === 'email' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="email"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address..."
          />
        </div>
      );
    }

    // Special handling for phone field
    if (key === 'phone' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="tel"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number..."
          />
        </div>
      );
    }

    // Special handling for linkedin field
    if (key === 'linkedin' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="url"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      );
    }

    // Special handling for imdb field
    if (key === 'imdb' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="url"
            value={value}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.imdb.com/title/tt..."
          />
        </div>
      );
    }

    // Special handling for format field
    if (key === 'format' && typeof value === 'string') {
      const formatOptions = ['5.1', 'Dolby Atmos', 'Stereo', 'Mono', '7.1', 'DTS', 'Auro-3D'];
      
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <select
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select format...</option>
            {formatOptions.map(format => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
        </div>
      );
    }

    // Special handling for director field
    if (key === 'director' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter director name..."
          />
        </div>
      );
    }

    // Special handling for title field
    if (key === 'title' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter title..."
          />
        </div>
      );
    }

    // Special handling for name field
    if (key === 'name' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter name..."
          />
        </div>
      );
    }

    // Special handling for role field (for people)
    if (key === 'role' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Sound Designer, Re-recording Mixer"
          />
        </div>
      );
    }

    // Special handling for location field
    if (key === 'location' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location..."
          />
        </div>
      );
    }

    // Special handling for capacity field
    if (key === 'capacity' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 50 people, 200 sq ft"
          />
        </div>
      );
    }

    // Special handling for contact field
    if (key === 'contact' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact person..."
          />
        </div>
      );
    }

    // Special handling for author field
    if (key === 'author' && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            value={editedItem[key] || ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name..."
          />
        </div>
      );
    }

    // Special handling for publishedAt field
    if (key === 'publishedAt' || key === 'updatedAt') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="date"
            value={editedItem[key] ? editedItem[key].split('T')[0] : ''}
            onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    }

    // Special handling for tags field
    if (key === 'tags' && Array.isArray(value)) {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <TagsManager
            tags={value}
            onChange={(tags) => setEditedItem({ ...editedItem, tags })}
            placeholder="Add project tags..."
          />
        </div>
      );
    }


    // Special handling for specialties field
    if (key === 'specialties' && Array.isArray(value)) {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Add this person's specialized skills/expertise (e.g., "Sound Design", "Foley", "ADR")
          </div>
          <SpecialtiesManager
            specialties={value}
            onChange={(specialties) => setEditedItem({ ...editedItem, specialties })}
            placeholder="Add specialties..."
          />
        </div>
      );
    }

    // Special handling for awards field
    if (key === 'awards' && Array.isArray(value)) {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Add awards and recognitions this person has received (e.g., "Gouden Kalf", "Oscar")
          </div>
          <AwardsManager
            awards={value}
            onChange={(awards) => setEditedItem({ ...editedItem, awards })}
            placeholder="Add awards..."
          />
        </div>
      );
    }

    // Special handling for monitoring field (nested in specifications)
    if (key === 'specifications' && typeof value === 'object' && value !== null && value.monitoring && Array.isArray(value.monitoring)) {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monitoring
          </label>
          <MonitoringManager
            monitoring={value.monitoring}
            onChange={(monitoring) => setEditedItem({
              ...editedItem,
              specifications: {
                ...value,
                monitoring
              }
            })}
          />
        </div>
      );
    }

    // Default array handling for other arrays
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Edit as JSON array or use the textarea below for simple text list (one item per line)
          </div>
          <div className="space-y-2">
            <textarea
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try {
                  setEditedItem({ ...editedItem, [key]: JSON.parse(e.target.value) });
                } catch {
                  // Invalid JSON, keep as string
                }
              }}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="JSON array format..."
            />
            <div className="text-xs text-gray-400 text-center">OR</div>
            <textarea
              value={value.join('\n')}
              onChange={(e) => setEditedItem({ ...editedItem, [key]: e.target.value.split('\n').filter(item => item.trim()) })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Simple text list (one item per line)..."
            />
          </div>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null && key !== 'credits') {
      return (
        <div key={key} className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Edit as JSON object (be careful with syntax)
          </div>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                setEditedItem({ ...editedItem, [key]: JSON.parse(e.target.value) });
              } catch {
                // Invalid JSON, keep as string
              }
            }}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="JSON object format..."
          />
          <div className="mt-2 text-xs text-gray-400">
            💡 Tip: Use a JSON validator if you're unsure about the syntax
          </div>
        </div>
      );
    }

    // Smart input type detection
    const getInputType = (key: string, value: any) => {
      if (key.toLowerCase().includes('email')) return 'email';
      if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) return 'url';
      if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')) return 'tel';
      if (key.toLowerCase().includes('number') || key.toLowerCase().includes('count') || key.toLowerCase().includes('year')) return 'number';
      if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) return 'date';
      if (key.toLowerCase().includes('password')) return 'password';
      if (typeof value === 'number') return 'number';
      return 'text';
    };

    const inputType = getInputType(key, value);

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {key.replace(/([A-Z])/g, ' $1')}
        </label>
        <input
          type={inputType}
          value={editedItem[key] || ''}
          onChange={(e) => {
            const newValue = inputType === 'number' ? 
              (e.target.value === '' ? '' : Number(e.target.value)) : 
              e.target.value;
            setEditedItem({ ...editedItem, [key]: newValue });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${key.toLowerCase()}...`}
        />
        {inputType === 'number' && (
          <p className="text-xs text-gray-500 mt-1">Enter a number</p>
        )}
        {inputType === 'email' && (
          <p className="text-xs text-gray-500 mt-1">Enter a valid email address</p>
        )}
        {inputType === 'url' && (
          <p className="text-xs text-gray-500 mt-1">Enter a valid URL (e.g., https://example.com)</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit {dbType.slice(0, -1)}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(editedItem).map(([key, value]) => renderField(key, value))}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Modal Component
function AddModal({ dbType, onSave, onClose }: {
  dbType: string;
  onSave: (item: any) => void;
  onClose: () => void;
}) {
  const [newItem, setNewItem] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const getTemplateItem = (type: string) => {
    switch (type) {
      case 'projects':
        return {
          id: Date.now().toString(),
          title: 'New Project',
          year: new Date().getFullYear(),
          director: '',
          producer: '',
          type: 'Feature Film',
          genre: '',
          poster: '/images/projects/placeholder.jpg',
          heroImage: '/images/projects/placeholder.jpg',
          description: 'Project description',
          credits: {
            soundDesign: [],
            reRecordingMix: [],
            soundEditor: [],
            dialogueEditor: [],
            adr: [],
            foley: [],
            additionalRoles: {}
          },
          audioPostProducer: 'Posta',
          tags: [],
          slug: 'new-project',
          featured: false,
          gallery: [],
          client: '',
          duration: '',
          format: '5.1',
          status: 'Planning',
          imdb: '',
          production_company: '',
          source_url: '',
          sourceUrl: ''
        };
      case 'people':
        return {
          id: Date.now().toString(),
          name: 'New Team Member',
          role: 'Team Member',
          bio: 'Bio description',
          image: '/images/people/placeholder.jpg',
          email: '',
          phone: '',
          linkedin: '',
          specialties: [],
          experience: '',
          education: '',
          awards: [],
          featured: false,
          order: 0
        };
      case 'facilities':
        return {
          id: Date.now().toString(),
          name: 'New Facility',
          type: 'Studio',
          description: 'Facility description',
          location: '',
          contact: '',
          specifications: {
            monitoring: [],
            screen: '',
            projector: '',
            acoustics: [],
            capacity: '10 people',
            dimensions: '50m²'
          },
          images: ['/images/facilities/placeholder.jpg'],
          featured: false
        };
      case 'news':
        return {
          id: Date.now().toString(),
          title: 'New Article',
          slug: 'new-article',
          excerpt: 'Article excerpt',
          content: 'Article content',
          publishedAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          heroImage: '/images/news/placeholder.jpg',
          category: 'Company News',
          tags: [],
          featured: false,
          author: 'Posta Vermaas',
          source_url: '',
          sourceUrl: ''
        };
      case 'freelancers':
        return {
          id: Date.now().toString(),
          name: 'New Freelancer',
          role: 'Collaborator',
          bio: 'Freelancer description',
          image: '/images/people/placeholder.jpg',
          email: '',
          phone: '',
          linkedin: '',
          specialties: [],
          experience: '',
          education: '',
          awards: [],
          featured: false,
          order: 0
        };
      case 'roles':
        return {
          id: Date.now().toString(),
          name: 'New Credit Role',
          category: 'additional',
          description: 'Description of this credit role',
          order: 99,
          featured: false
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    setNewItem(getTemplateItem(dbType));
  }, [dbType]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/database/${dbType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', item: newItem })
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.item);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to create new item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add New {dbType.slice(0, -1)}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(newItem).map(([key, value]) => {
              if (key === 'id') return null; // Skip ID field

              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  {Array.isArray(value) || (typeof value === 'object' && value !== null) ? (
                    <textarea
                      value={JSON.stringify(value, null, 2)}
                      onChange={(e) => {
                        try {
                          setNewItem({ ...newItem, [key]: JSON.parse(e.target.value) });
                        } catch {
                          // Invalid JSON, keep as string
                        }
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
