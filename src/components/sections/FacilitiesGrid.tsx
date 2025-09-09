'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Speaker, 
  Headphones, 
  Mic, 
  Film, 
  Settings, 
  Award,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Monitor,
  Wifi
} from 'lucide-react';
import facilitiesData from '@/database/facilities.json';

const iconMap = {
  'Mastering Suite': Speaker,
  'Re-recording Suite': Headphones,
  'Editing Suite': Settings,
  'Recording Studio': Mic,
  'Foley Stage': Film,
};

export default function FacilitiesGrid() {
  const [visibleFacilities, setVisibleFacilities] = useState<number[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleFacilities(facilities.map((_, index) => index));
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (facilityId: string) => {
    setSelectedFacility(facilityId);
  };

  const closeModal = () => {
    setSelectedFacility(null);
  };

  const selectedFacilityData = selectedFacility ? facilitiesData.facilities.find(f => f.id === selectedFacility) : null;

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
          Detailed Facility Information
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          Each of our facilities is equipped with state-of-the-art technology 
          and designed for optimal audio post production workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilitiesData.facilities.map((facility, index) => {
          const IconComponent = iconMap[facility.type as keyof typeof iconMap] || Settings;
          
          return (
            <div
              key={facility.id}
              className={`card-hover transition-all duration-700 ${
                visibleFacilities.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <Image
                  src={facility.images[0]}
                  alt={facility.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => openModal(facility.id)}
                    className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {facility.type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <IconComponent className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-neutral-600">{facility.type}</p>
                  </div>
                </div>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {facility.description}
                </p>

                {/* Key Specs */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Users className="w-4 h-4 text-primary-600 mr-2" />
                    <span>Capacity: {facility.specifications.capacity}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Monitor className="w-4 h-4 text-primary-600 mr-2" />
                    <span>Dimensions: {facility.specifications.dimensions}</span>
                  </div>
                  {facility.specifications.screen && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <ExternalLink className="w-4 h-4 text-primary-600 mr-2" />
                      <span>Screen: {facility.specifications.screen}</span>
                    </div>
                  )}
                </div>

                {/* Monitoring */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Monitoring</h4>
                  <div className="flex flex-wrap gap-2">
                    {facility.specifications.monitoring.slice(0, 2).map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                    {facility.specifications.monitoring.length > 2 && (
                      <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                        +{facility.specifications.monitoring.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openModal(facility.id)}
                  className="w-full btn-secondary group"
                >
                  View Full Specifications
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Facility Detail Modal */}
      {selectedFacilityData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Image
                src={selectedFacilityData.images[0]}
                alt={selectedFacilityData.name}
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
                {selectedFacilityData.name}
              </h2>
              
              <p className="text-primary-600 text-xl font-medium mb-6">
                {selectedFacilityData.type}
              </p>

              <p className="text-neutral-600 leading-relaxed mb-8">
                {selectedFacilityData.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Specifications */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Specifications</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neutral-700 mb-2">Capacity</h4>
                      <p className="text-neutral-600">{selectedFacilityData.specifications.capacity}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-700 mb-2">Dimensions</h4>
                      <p className="text-neutral-600">{selectedFacilityData.specifications.dimensions}</p>
                    </div>
                    {selectedFacilityData.specifications.screen && (
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-2">Screen</h4>
                        <p className="text-neutral-600">{selectedFacilityData.specifications.screen}</p>
                      </div>
                    )}
                    {selectedFacilityData.specifications.projector && (
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-2">Projector</h4>
                        <p className="text-neutral-600">{selectedFacilityData.specifications.projector}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Monitoring */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Monitoring System</h3>
                  <ul className="space-y-2">
                    {selectedFacilityData.specifications.monitoring.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Acoustics */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">Acoustics</h3>
                <ul className="space-y-2">
                  {selectedFacilityData.specifications.acoustics.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gallery */}
              {selectedFacilityData.images.length > 1 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFacilityData.images.slice(1).map((image, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          alt={`${selectedFacilityData.name} - Image ${index + 2}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-neutral-600">
                    Interested in booking this facility?
                  </p>
                  <a
                    href="/contact"
                    className="btn-primary"
                  >
                    Request a Session
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
