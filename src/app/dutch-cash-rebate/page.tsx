import { Metadata } from 'next';
import Image from 'next/image';
import { 
  Euro, 
  CheckCircle, 
  ExternalLink, 
  ArrowRight,
  Calendar,
  FileText,
  Users,
  Globe,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dutch Cash Rebate - Up to 35% Rebate for International Productions',
  description: 'Learn about the Dutch Cash Rebate program offering up to 35% rebate on qualifying production costs, with a maximum of €1.5M per application for international productions.',
  keywords: [
    'Dutch Cash Rebate',
    'Netherlands film incentives',
    'international production rebate',
    'film funding Netherlands',
    'audio post production rebate',
    'Netherlands Film Fund'
  ],
  openGraph: {
    title: 'Dutch Cash Rebate - Posta Vermaas',
    description: 'Learn about the Dutch Cash Rebate program for international productions.',
    type: 'website',
  },
};

export default function DutchCashRebatePage() {
  const benefits = [
    {
      icon: Euro,
      title: 'Up to 35% Rebate',
      description: 'Receive up to 35% cash rebate on qualifying production costs'
    },
    {
      icon: Award,
      title: 'Maximum €1.5M',
      description: 'Maximum rebate of €1.5M per application'
    },
    {
      icon: Globe,
      title: 'International Focus',
      description: 'Designed specifically for international productions'
    },
    {
      icon: CheckCircle,
      title: 'Easy Application',
      description: 'Streamlined application process with our support'
    }
  ];

  const requirements = [
    'Minimum spending threshold of €1M in the Netherlands',
    'At least 30% of the production budget must be spent in the Netherlands',
    'Production must have significant Dutch content or cultural value',
    'Application must be submitted before production begins',
    'Production must be completed within 24 months of approval'
  ];

  const eligibleCosts = [
    'Audio post production services',
    'Sound design and mixing',
    'ADR and foley work',
    'Dolby Atmos mastering',
    'Picture post production',
    'Equipment rental',
    'Studio facilities',
    'Technical personnel costs'
  ];

  const process = [
    {
      step: 1,
      title: 'Initial Consultation',
      description: 'We assess your project and determine eligibility for the rebate program.'
    },
    {
      step: 2,
      title: 'Application Preparation',
      description: 'We help prepare all required documentation and submit your application.'
    },
    {
      step: 3,
      title: 'Approval Process',
      description: 'The Netherlands Film Fund reviews and approves your application.'
    },
    {
      step: 4,
      title: 'Production & Documentation',
      description: 'We work with you to ensure all costs are properly documented.'
    },
    {
      step: 5,
      title: 'Rebate Payment',
      description: 'You receive your cash rebate after production completion and verification.'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                Dutch Cash Rebate
                <span className="block gradient-text">Up to 35% Rebate</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                The Dutch Cash Rebate program offers attractive incentives for international 
                productions filming in the Netherlands, with rebates up to 35% and a 
                maximum of €1.5M per application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Apply Now
                </a>
                <a
                  href="#requirements"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/dutch-cash-rebate/hero.jpg"
                alt="Dutch Cash Rebate Program"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Program Benefits
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              The Dutch Cash Rebate program provides significant financial incentives 
              for international productions choosing the Netherlands for their projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div id="requirements" className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                Eligibility Requirements
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                To qualify for the Dutch Cash Rebate program, your production must meet 
                specific criteria and spending thresholds.
              </p>
              <ul className="space-y-4">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/images/dutch-cash-rebate/requirements.jpg"
                alt="Eligibility Requirements"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Costs Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Eligible Production Costs
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Many of our audio post production services qualify for the Dutch Cash Rebate program, 
              making it even more attractive to work with us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eligibleCosts.map((cost, index) => (
                <div key={index} className="flex items-center p-4 bg-neutral-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                  <span className="text-neutral-700">{cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Application Process
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We guide you through the entire application process, from initial consultation 
              to receiving your rebate payment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Why Choose Posta Vermaas?
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              As a local audio post production facility, we have extensive experience 
              working with international productions and the Dutch Cash Rebate program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Local Expertise
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                We understand the local requirements and can help ensure your production 
                meets all eligibility criteria.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Application Support
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                We provide comprehensive support throughout the application process, 
                ensuring all documentation is properly prepared.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Proven Track Record
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                We have successfully worked with numerous international productions 
                that have received Dutch Cash Rebates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Additional Resources
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Learn more about the Dutch Cash Rebate program and how it can benefit your production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Netherlands Film Fund
              </h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                The official organization that administers the Dutch Cash Rebate program. 
                Visit their website for detailed information and application forms.
              </p>
              <a
                href="https://www.filmfonds.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary group"
              >
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Film Commission Netherlands
              </h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Get information about filming in the Netherlands, including locations, 
                permits, and additional support services.
              </p>
              <a
                href="https://www.filmcommission.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary group"
              >
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Apply for Dutch Cash Rebate?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your project and how we can help you maximize your rebate 
            while delivering exceptional audio post production services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 rounded-lg font-medium transition-colors duration-200 group"
            >
              Start Your Application
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors duration-200"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
