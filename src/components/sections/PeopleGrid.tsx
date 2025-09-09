'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Linkedin, User, Award } from 'lucide-react';
import { DatabaseService } from '@/lib/database';
import { Person } from '@/types';

export default function PeopleGrid() {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const peopleData = await DatabaseService.getPeople();
        setPeople(peopleData);
        setFilteredPeople(peopleData);
      } catch (error) {
        console.error('Error loading people:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, []);

  const openModal = (personId: string) => {
    setSelectedPerson(personId);
  };

  const closeModal = () => {
    setSelectedPerson(null);
  };

  const selectedPersonData = selectedPerson ? people.find(p => p.id === selectedPerson) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPeople.map((person, index) => (
          <div
            key={person.id}
            className="group card-hover transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative overflow-hidden rounded-t-xl">
              <Image
                src={person.image}
                alt={person.name}
                width={400}
                height={500}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => openModal(person.id)}
                  className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
                >
                  View Bio
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                {person.name}
              </h3>
              
              <p className="text-primary-600 font-medium mb-4">
                {person.role}
              </p>

              <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                {person.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {person.roles.map((role, roleIndex) => (
                  <span
                    key={roleIndex}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                    aria-label={`Email ${person.name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                    aria-label={`LinkedIn profile for ${person.name}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => openModal(person.id)}
                  className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                  aria-label={`View bio for ${person.name}`}
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">No team members found</h3>
          <p className="text-neutral-600 mb-6">
            Try adjusting your filters to see more team members.
          </p>
        </div>
      )}

      {/* Bio Modal */}
      {selectedPersonData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Image
                src={selectedPersonData.image}
                alt={selectedPersonData.name}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
              >
                ×
              </button>
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                {selectedPersonData.name}
              </h2>
              
              <p className="text-primary-600 text-xl font-medium mb-6">
                {selectedPersonData.role}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPersonData.roles.map((role, roleIndex) => (
                  <span
                    key={roleIndex}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {selectedPersonData.bio}
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-6 border-t border-neutral-200">
                {selectedPersonData.email && (
                  <a
                    href={`mailto:${selectedPersonData.email}`}
                    className="btn-secondary"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                )}
                {selectedPersonData.linkedin && (
                  <a
                    href={selectedPersonData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
