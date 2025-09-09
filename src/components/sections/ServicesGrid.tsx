'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Speaker, 
  Headphones, 
  Mic, 
  Film, 
  Settings, 
  Wifi,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { services } from '@/data/services';

const iconMap = {
  speaker: Speaker,
  mixer: Settings,
  headphones: Headphones,
  footsteps: Mic,
  microphone: Mic,
  tv: Film,
  settings: Settings,
  wifi: Wifi,
  film: Film,
};

export default function ServicesGrid() {
  const [visibleServices, setVisibleServices] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleServices(services.map((_, index) => index));
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
          Complete Service Portfolio
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          From Dolby Atmos mastering to custom foley work, we offer comprehensive 
          audio post production services tailored to your project's needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Settings;
          
          return (
            <div
              key={service.id}
              className={`card-hover p-8 transition-all duration-700 ${
                visibleServices.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <IconComponent className="w-8 h-8 text-primary-600" />
              </div>
              
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-neutral-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-neutral-500">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Equipment */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {service.equipment.slice(0, 2).map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                  {service.equipment.length > 2 && (
                    <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                      +{service.equipment.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-neutral-200">
                {service.slug === 'source-connect' ? (
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                ) : (
                  <Link
                    href={`/services#${service.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <div className="bg-neutral-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Every project is unique. Let's discuss how we can tailor our services 
            to meet your specific requirements and creative vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary text-lg px-8 py-4 group"
            >
              Discuss Your Project
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/facilities"
              className="btn-secondary text-lg px-8 py-4"
            >
              View Our Facilities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
