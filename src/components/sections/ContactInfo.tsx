import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { mainLocation, secondaryLocation } from '@/data/locations';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Main Location */}
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
          <MapPin className="w-6 h-6 text-primary-600 mr-3" />
          Main Location
        </h3>
        <div className="space-y-4">
          <div>
            <div className="font-medium text-neutral-900 mb-1">Address</div>
            <div className="text-neutral-600">
              {mainLocation.address}<br />
              {mainLocation.postalCode} {mainLocation.city}<br />
              {mainLocation.country}
            </div>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-1">Phone</div>
            <a
              href={`tel:${mainLocation.phone}`}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              {mainLocation.phone}
            </a>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-1">Email</div>
            <a
              href={`mailto:${mainLocation.email}`}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              {mainLocation.email}
            </a>
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/route"
            className="btn-secondary w-full justify-center group"
          >
            Get Directions
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>

      {/* Secondary Location */}
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
          <MapPin className="w-6 h-6 text-primary-600 mr-3" />
          Secondary Location
        </h3>
        <div className="space-y-4">
          <div>
            <div className="font-medium text-neutral-900 mb-1">Address</div>
            <div className="text-neutral-600">
              {secondaryLocation.address}<br />
              {secondaryLocation.postalCode} {secondaryLocation.city}<br />
              {secondaryLocation.country}
            </div>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-1">Phone</div>
            <a
              href={`tel:${secondaryLocation.phone}`}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              {secondaryLocation.phone}
            </a>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-1">Email</div>
            <a
              href={`mailto:${secondaryLocation.email}`}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              {secondaryLocation.email}
            </a>
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/route"
            className="btn-secondary w-full justify-center group"
          >
            Get Directions
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>

      {/* Business Hours */}
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
          <Clock className="w-6 h-6 text-primary-600 mr-3" />
          Business Hours
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-600">Monday - Friday</span>
            <span className="font-medium text-neutral-900">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Saturday</span>
            <span className="font-medium text-neutral-900">10:00 AM - 4:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Sunday</span>
            <span className="font-medium text-neutral-900">Closed</span>
          </div>
        </div>
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800">
            <strong>Note:</strong> We offer flexible scheduling for international clients 
            and urgent projects. Contact us to discuss your specific needs.
          </p>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          Need Immediate Assistance?
        </h3>
        <p className="text-neutral-600 mb-6">
          For urgent inquiries or immediate project needs, don't hesitate to call us directly.
        </p>
        <div className="space-y-3">
          <a
            href={`tel:${mainLocation.phone}`}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <Phone className="w-5 h-5 mr-3" />
            {mainLocation.phone}
          </a>
          <a
            href={`mailto:${mainLocation.email}`}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <Mail className="w-5 h-5 mr-3" />
            {mainLocation.email}
          </a>
        </div>
      </div>
    </div>
  );
}
