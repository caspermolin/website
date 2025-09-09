import { Metadata } from 'next';
import RouteMap from '@/components/sections/RouteMap';
import LocationDetails from '@/components/sections/LocationDetails';

export const metadata: Metadata = {
  title: 'Route - Find Our Amsterdam Locations',
  description: 'Find directions to Posta Vermaas audio post production facilities in Amsterdam. Located at Koivistokade 58 and Brantasgracht 11 with easy access by car and public transport.',
  keywords: [
    'Posta Vermaas location',
    'Amsterdam audio studio directions',
    'Koivistokade 58',
    'Brantasgracht 11',
    'audio post production Amsterdam',
    'studio location Amsterdam'
  ],
  openGraph: {
    title: 'Route - Posta Vermaas Locations',
    description: 'Find directions to our Amsterdam facilities.',
    type: 'website',
  },
};

export default function RoutePage() {
  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Find <span className="gradient-text">Our Locations</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Visit our state-of-the-art audio post production facilities in Amsterdam. 
            We have two convenient locations with easy access by car and public transport.
          </p>
        </div>
      </div>

      <div className="section-padding bg-white">
        <div className="container-custom">
          <RouteMap />
          <LocationDetails />
        </div>
      </div>
    </div>
  );
}
