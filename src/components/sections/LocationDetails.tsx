import { MapPin, Phone, Mail, Clock, Car, Train, Bus, ExternalLink } from 'lucide-react';
import { mainLocation, secondaryLocation } from '@/data/locations';

export default function LocationDetails() {
  const locations = [
    {
      ...mainLocation,
      name: 'Main Location',
      description: 'Our flagship facility featuring the Dolby Atmos stage and primary mixing suites.',
      facilities: ['Dolby Atmos Stage', 'Premix Stage A', 'Foley Stage', 'ADR Booth'],
      parking: 'Limited street parking available. Public parking garage nearby.',
      publicTransport: 'Tram 3, 5, 12 - Stop: Koivistokade (2 min walk)',
      accessibility: 'Wheelchair accessible entrance and facilities'
    },
    {
      ...secondaryLocation,
      name: 'Secondary Location',
      description: 'Our secondary facility with additional mixing suites and editing rooms.',
      facilities: ['Premix Stage B', 'Sound Editorial Suite', 'Client Monitoring'],
      parking: 'Street parking available. Public parking garage 5 min walk.',
      publicTransport: 'Tram 3, 5, 12 - Stop: Brantasgracht (3 min walk)',
      accessibility: 'Wheelchair accessible entrance and facilities'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold text-neutral-900 mb-8 text-center">
        Location Details
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {locations.map((location, index) => (
          <div key={index} className="card p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-neutral-900">{location.name}</h3>
            </div>

            <p className="text-neutral-600 mb-6 leading-relaxed">
              {location.description}
            </p>

            {/* Address */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-2">Address</h4>
              <div className="text-neutral-600">
                {location.address}<br />
                {location.postalCode} {location.city}<br />
                {location.country}
              </div>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-2">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-primary-600 mr-3" />
                  <a
                    href={`tel:${location.phone}`}
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    {location.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-primary-600 mr-3" />
                  <a
                    href={`mailto:${location.email}`}
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    {location.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-2">Facilities</h4>
              <div className="flex flex-wrap gap-2">
                {location.facilities.map((facility, facilityIndex) => (
                  <span
                    key={facilityIndex}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center">
                  <Car className="w-4 h-4 text-primary-600 mr-2" />
                  Parking
                </h4>
                <p className="text-neutral-600 text-sm">{location.parking}</p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center">
                  <Train className="w-4 h-4 text-primary-600 mr-2" />
                  Public Transport
                </h4>
                <p className="text-neutral-600 text-sm">{location.publicTransport}</p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2 flex items-center">
                  <Bus className="w-4 h-4 text-primary-600 mr-2" />
                  Accessibility
                </h4>
                <p className="text-neutral-600 text-sm">{location.accessibility}</p>
              </div>
            </div>

            {/* Get Directions Button */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.address}, ${location.city}, ${location.country}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center group"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-12 bg-neutral-50 rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">
          Additional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Clock className="w-8 h-8 text-primary-600 mx-auto mb-4" />
            <h4 className="font-semibold text-neutral-900 mb-2">Business Hours</h4>
            <p className="text-neutral-600 text-sm">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </div>

          <div className="text-center">
            <Car className="w-8 h-8 text-primary-600 mx-auto mb-4" />
            <h4 className="font-semibold text-neutral-900 mb-2">Parking</h4>
            <p className="text-neutral-600 text-sm">
              Limited street parking available at both locations. 
              Public parking garages within 5 minutes walking distance.
            </p>
          </div>

          <div className="text-center">
            <Train className="w-8 h-8 text-primary-600 mx-auto mb-4" />
            <h4 className="font-semibold text-neutral-900 mb-2">Public Transport</h4>
            <p className="text-neutral-600 text-sm">
              Both locations are easily accessible by tram. 
              Amsterdam Central Station is 15 minutes away by public transport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
