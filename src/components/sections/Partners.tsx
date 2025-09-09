'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const partners = [
  { name: 'Dolby', logo: '/images/partners/dolby.png', width: 120, height: 60 },
  { name: 'Avid', logo: '/images/partners/avid.png', width: 100, height: 60 },
  { name: 'JBL', logo: '/images/partners/jbl.png', width: 80, height: 60 },
  { name: 'Pro Tools', logo: '/images/partners/protools.png', width: 120, height: 60 },
  { name: 'Neumann', logo: '/images/partners/neumann.png', width: 100, height: 60 },
  { name: 'Barco', logo: '/images/partners/barco.png', width: 100, height: 60 },
  { name: 'Source Connect', logo: '/images/partners/source-connect.png', width: 120, height: 60 },
  { name: 'Film Fund', logo: '/images/partners/film-fund.png', width: 100, height: 60 },
];

export default function Partners() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-white border-t border-neutral-200">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We work with leading technology partners and industry organizations 
            to deliver the highest quality audio post production services.
          </p>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={partner.width}
                height={partner.height}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-neutral-500">
            Certified partners and technology providers
          </p>
        </div>
      </div>
    </section>
  );
}
