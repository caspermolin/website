'use client';

import { useState } from 'react';
import { MapPin, Navigation, Car, Train, Bus, ExternalLink } from 'lucide-react';
import { mainLocation, secondaryLocation } from '@/data/locations';

export default function RouteMap() {
  const [selectedLocation, setSelectedLocation] = useState<'main' | 'secondary'>('main');
  const [transportMode, setTransportMode] = useState<'driving' | 'transit' | 'walking'>('driving');

  const currentLocation = selectedLocation === 'main' ? mainLocation : secondaryLocation;

  const getDirectionsUrl = (mode: string) => {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1&destination=';
    const destination = `${currentLocation.address}, ${currentLocation.city}, ${currentLocation.country}`;
    const travelMode = mode === 'driving' ? 'driving' : mode === 'transit' ? 'transit' : 'walking';
    return `${baseUrl}${encodeURIComponent(destination)}&travelmode=${travelMode}`;
  };

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Location Selector */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Select Location</h2>
          <div className="space-y-4">
            <button
              onClick={() => setSelectedLocation('main')}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedLocation === 'main'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-semibold text-neutral-900">Main Location</span>
              </div>
              <div className="text-sm text-neutral-600">
                {mainLocation.address}<br />
                {mainLocation.postalCode} {mainLocation.city}
              </div>
            </button>

            <button
              onClick={() => setSelectedLocation('secondary')}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedLocation === 'secondary'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-semibold text-neutral-900">Secondary Location</span>
              </div>
              <div className="text-sm text-neutral-600">
                {secondaryLocation.address}<br />
                {secondaryLocation.postalCode} {secondaryLocation.city}
              </div>
            </button>
          </div>

          {/* Transport Mode */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Transport Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => setTransportMode('driving')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  transportMode === 'driving'
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-neutral-100'
                }`}
              >
                <Car className="w-5 h-5 mr-3" />
                Driving
              </button>
              <button
                onClick={() => setTransportMode('transit')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  transportMode === 'transit'
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-neutral-100'
                }`}
              >
                <Train className="w-5 h-5 mr-3" />
                Public Transport
              </button>
              <button
                onClick={() => setTransportMode('walking')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  transportMode === 'walking'
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-neutral-100'
                }`}
              >
                <Bus className="w-5 h-5 mr-3" />
                Walking
              </button>
            </div>
          </div>

          {/* Get Directions Button */}
          <div className="mt-8">
            <a
              href={getDirectionsUrl(transportMode)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center group"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Get Directions
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-100 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">Interactive Map</h3>
              <p className="text-neutral-600 mb-4">
                {currentLocation.address}, {currentLocation.city}
              </p>
              <p className="text-sm text-neutral-500">
                Click "Get Directions" to open in Google Maps
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
