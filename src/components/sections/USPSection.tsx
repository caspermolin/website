'use client';

import { useState, useEffect } from 'react';
import { 
  Speaker, 
  Headphones, 
  Mic, 
  Film, 
  Settings, 
  Wifi,
  Award,
  Users,
  Clock
} from 'lucide-react';

const usps = [
  {
    icon: Speaker,
    title: 'Dolby Atmos Certified',
    description: 'Pioneer in immersive audio technology with fully certified Dolby Atmos mastering suite featuring 7.1.4 monitoring and latest RMU integration.',
    features: ['7.1.4 Dolby Atmos monitoring', 'Latest RMU integration', 'Object-based mixing', 'Spatial audio design']
  },
  {
    icon: Headphones,
    title: 'Complete Audio Post Production',
    description: 'Full-service audio post production from concept to delivery, specializing in creative sound design and technical excellence.',
    features: ['Creative sound design', 'Re-recording mixing', 'ADR recording', 'Foley production', 'Final mastering']
  },
  {
    icon: Users,
    title: 'Award-Winning Team',
    description: 'Experienced professionals with Gouden Kalf wins and international credits, bringing creativity and technical mastery to every project.',
    features: ['Gouden Kalf winners', '15+ years experience', 'International co-productions', 'Continuous innovation']
  },
  {
    icon: Settings,
    title: 'State-of-the-Art Facilities',
    description: 'Two premium re-recording stages, dedicated foley studio, ADR booth, and mastering suites equipped with Pro Tools Ultimate.',
    features: ['Dual re-recording stages', 'Dedicated foley studio', 'Sound-isolated ADR booth', 'Pro Tools Ultimate', 'High-end monitoring']
  },
  {
    icon: Wifi,
    title: 'Global Remote Collaboration',
    description: 'Source Connect Pro implementation enables seamless remote collaboration with clients and partners worldwide.',
    features: ['Source Connect Pro', 'Real-time audio streaming', 'Remote session monitoring', 'International workflow support']
  },
  {
    icon: Clock,
    title: 'Amsterdam Based',
    description: 'Strategically located in Amsterdam\'s creative hub, serving both Dutch and international productions since 2008.',
    features: ['Amsterdam city center', 'Easy access to Schiphol', 'Dutch film industry hub', 'International accessibility']
  }
];

export default function USPSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems([0, 1, 2, 3, 4, 5]);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-light text-neutral-900 mb-8">
            What we do
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We specialize in creating immersive audio experiences that enhance 
            storytelling and bring your creative vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {usps.map((usp, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-6">
                <usp.icon className="w-8 h-8 text-accent-500 mb-4" />
                <h3 className="text-xl font-medium text-neutral-900 mb-3">
                  {usp.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="border-t border-neutral-200 pt-16">
            <h3 className="text-2xl font-light text-neutral-900 mb-6">
              Ready to work together?
            </h3>
            <p className="text-neutral-600 mb-8 max-w-xl mx-auto">
              Let's discuss your project and how we can bring your creative vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="bg-neutral-900 text-white px-8 py-3 font-medium hover:bg-neutral-800 transition-colors duration-200"
              >
                Start a conversation
              </a>
              <a
                href="/projects"
                className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors duration-200"
              >
                View our work →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
