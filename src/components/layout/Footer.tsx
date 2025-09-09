'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const [navigation, setNavigation] = useState<any>({ footer: [], services: [] });
  const [siteData, setSiteData] = useState<any>({ locations: { main: {}, secondary: {} }, company: {} });

  // Load navigation and site data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load navigation
        const navResponse = await fetch('/api/navigation');
        if (navResponse.ok) {
          const navData = await navResponse.json();
          setNavigation(navData);
        }

        // Load site data
        const siteResponse = await fetch('/api/site');
        if (siteResponse.ok) {
          const siteData = await siteResponse.json();
          setSiteData(siteData);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-neutral-900 font-medium text-sm">PV</span>
                </div>
                <div>
                  <div className="text-lg font-medium">Posta Vermaas</div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider">Audio Post</div>
                </div>
              </Link>
              <p className="text-neutral-400 mb-8 leading-relaxed text-sm">
                {siteData.company?.description || 'Creating immersive sound experiences for film, television and streaming. Based in Amsterdam.'}
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/company/posta-vermaas"
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/postavermaas"
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-6 uppercase tracking-wider">Services</h3>
              <ul className="space-y-3">
                {navigation.services?.map((service: any) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-6 uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                {navigation.footer?.map((item: any) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">{siteData.locations?.main?.name || 'Main Location'}</div>
                    <div className="text-neutral-400 text-sm">
                      {siteData.locations?.main?.address || 'Koivistokade 58'}<br />
                      {siteData.locations?.main?.postalCode || '1018 WB'} {siteData.locations?.main?.city || 'Amsterdam'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">{siteData.locations?.secondary?.name || 'Secondary Location'}</div>
                    <div className="text-neutral-400 text-sm">
                      {siteData.locations?.secondary?.address || 'Brantasgracht 11'}<br />
                      {siteData.locations?.secondary?.postalCode || '1018 XT'} {siteData.locations?.secondary?.city || 'Amsterdam'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <a
                    href={`tel:${siteData.contact?.phone || siteData.locations?.main?.phone || '+31 20 123 4567'}`}
                    className="text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {siteData.contact?.phone || siteData.locations?.main?.phone || '+31 20 123 4567'}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <a
                    href={`mailto:${siteData.contact?.email || siteData.locations?.main?.email || 'info@postavermaas.com'}`}
                    className="text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {siteData.contact?.email || siteData.locations?.main?.email || 'info@postavermaas.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Posta Vermaas. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/admin" className="text-neutral-400 hover:text-white transition-colors duration-200">
                🔧 Admin Console
              </Link>
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" className="text-neutral-400 hover:text-white transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
