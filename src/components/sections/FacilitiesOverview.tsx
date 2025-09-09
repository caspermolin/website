'use client';

import { useState, useEffect } from 'react';
import { 
  Speaker, 
  Headphones, 
  Mic, 
  Film, 
  Settings, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const facilityHighlights = [
  {
    icon: Speaker,
    title: 'Dolby Atmos Mastering Suite',
    description: 'Our flagship 7.1.4 Dolby Atmos certified mastering suite with the latest RMU integration and premium monitoring systems.',
    specs: ['7.1.4 Dolby Atmos monitoring', 'Latest RMU integration', '4K HDR projection', 'Acoustic treatment']
  },
  {
    icon: Headphones,
    title: 'Professional Re-recording Stages',
    description: 'Two premium mixing suites equipped with Pro Tools Ultimate and Avid S6 consoles for the highest quality audio production.',
    specs: ['Pro Tools Ultimate HDX', 'Avid S6 console integration', '5.1 + Atmos monitoring', 'Client monitoring systems']
  },
  {
    icon: Mic,
    title: 'ADR Recording Booth',
    description: 'Sound-isolated ADR booth with Neumann U87 microphones and experienced voice directors for perfect lip-sync.',
    specs: ['Neumann U87 microphones', 'Sound isolation treatment', 'Real-time monitoring', 'Multiple language support']
  },
  {
    icon: Film,
    title: 'Foley Production Stage',
    description: 'Dedicated foley stage with extensive surface materials and professional foley artists for authentic sound effects.',
    specs: ['Multiple surface materials', 'High-quality recording setup', 'Real-time monitoring', 'Professional foley artists']
  }
];

const keyFeatures = [
  'Dolby Atmos certified 7.1.4 mastering suite',
  'Pro Tools Ultimate with HDX acceleration',
  'Studio Vermaas recording collaboration',
  'Source Connect remote workflow support',
  'Gouden Kalf award-winning facilities',
  'Amsterdam city center location',
  '15+ years of industry excellence',
  'Full-service audio post production'
];

export default function FacilitiesOverview() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems([0, 1, 2, 3]);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-16">
      {/* Facility Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {facilityHighlights.map((facility, index) => (
          <div
            key={index}
            className={`text-center transition-all duration-700 ${
              visibleItems.includes(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <facility.icon className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              {facility.title}
            </h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {facility.description}
            </p>
            <ul className="space-y-2">
              {facility.specs.map((spec, specIndex) => (
                <li key={specIndex} className="flex items-center text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <div className="bg-neutral-50 rounded-2xl p-8 lg:p-12 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Why Choose Our Facilities?
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Our facilities are designed with both technical excellence and creative 
            workflow in mind, providing the perfect environment for audio post production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
              <span className="text-neutral-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 lg:p-12 text-white text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Ready to Experience Our Facilities?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Schedule a tour of our facilities and see how we can bring your 
          audio post production project to life.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/contact"
            className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 rounded-lg font-medium transition-colors duration-200 group"
          >
            Schedule a Tour
            <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="/contact"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors duration-200"
          >
            Request a Session
          </a>
        </div>
      </div>
    </div>
  );
}
