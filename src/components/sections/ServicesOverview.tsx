'use client';

import { useState, useEffect } from 'react';
import { 
  Speaker, 
  Headphones, 
  Mic, 
  Film, 
  Settings, 
  Wifi,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const serviceHighlights = [
  {
    icon: Speaker,
    title: 'Dolby Atmos',
    description: 'Immersive 3D audio experiences with our state-of-the-art Dolby Atmos mastering suite.',
    features: ['Object-based audio mixing', 'Spatial audio design', '7.1.4 monitoring system']
  },
  {
    icon: Headphones,
    title: 'Sound Design',
    description: 'Creative sound design that enhances storytelling and creates immersive experiences.',
    features: ['Custom sound effects', 'Ambient soundscapes', 'Character sound signatures']
  },
  {
    icon: Mic,
    title: 'ADR & Foley',
    description: 'Professional ADR and foley services with experienced voice direction and custom sound effects.',
    features: ['Voice direction', 'Custom foley', 'Seamless integration']
  },
  {
    icon: Film,
    title: 'Picture Services',
    description: 'Complete picture post production including editing, color grading, and visual effects.',
    features: ['Picture editing', 'Color grading', 'VFX integration']
  }
];

export default function ServicesOverview() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems([0, 1, 2, 3]);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-16">
      {/* Service Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {serviceHighlights.map((service, index) => (
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
              <service.icon className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              {service.title}
            </h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {service.description}
            </p>
            <ul className="space-y-2">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 lg:p-12 text-white text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Ready to Start Your Project?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Let's discuss how we can bring your audio vision to life with our 
          professional services and state-of-the-art facilities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/contact"
            className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 rounded-lg font-medium transition-colors duration-200 group"
          >
            Request a Quote
            <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="/facilities"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors duration-200"
          >
            View Our Facilities
          </a>
        </div>
      </div>
    </div>
  );
}
