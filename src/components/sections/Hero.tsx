'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Award, Users, Headphones } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.03)_50%,transparent_75%)]" />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>

          {/* Logo Section */}
          <div className="mb-8">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                POSTA<span className="text-blue-400">VERMAAS</span>
              </h2>
              <p className="text-blue-300 text-sm md:text-base mt-1 font-medium">
                Sound for Picture • Amsterdam
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-6 leading-tight">
            Dutch market-leading audiopost facility
            <span className="block font-medium text-blue-400 mt-3">
              for feature films and hi-end TV- and VOD-drama
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Operating from the heart of its motion-picture industry, Amsterdam, POSTA VERMAAS provides
            complete audio post production packages for feature films and high-end television productions.
          </p>

          {/* Key Services */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            <div className="flex items-center gap-2 text-slate-300">
              <Headphones className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Sound Design</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Re-recording Mix</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Dolby Atmos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 group shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href="/projects"
              className="border-2 border-slate-400 text-slate-300 hover:text-white hover:border-blue-400 px-10 py-4 rounded-lg font-semibold transition-all duration-300 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              View Our Work
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-600 pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">300+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">Dolby</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Atmos Certified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">Intl</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Credits</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-slate-400 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Amsterdam Based
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              State-of-the-art Facilities
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Award-winning Team
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-400 to-transparent">
          <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
