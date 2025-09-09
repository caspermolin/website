import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle, Wifi, Clock, Globe, Headphones, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Source Connect - Remote Collaboration Services',
  description: 'Professional remote collaboration services using Source Connect for real-time audio streaming and global project coordination.',
  keywords: [
    'Source Connect',
    'remote collaboration',
    'real-time audio streaming',
    'remote monitoring',
    'global audio production',
    'remote mixing'
  ],
  openGraph: {
    title: 'Source Connect - Remote Collaboration | Posta Vermaas',
    description: 'Professional remote collaboration services using Source Connect for real-time audio streaming.',
    type: 'website',
  },
};

export default function SourceConnectPage() {
  const features = [
    {
      icon: Wifi,
      title: 'Real-time Audio Streaming',
      description: 'High-quality audio streaming with minimal latency for seamless remote collaboration.'
    },
    {
      icon: Headphones,
      title: 'Remote Monitoring',
      description: 'Clients can monitor sessions in real-time from anywhere in the world.'
    },
    {
      icon: Globe,
      title: 'Global Collaboration',
      description: 'Work with international clients and partners without geographical limitations.'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Accommodate different time zones and schedules for maximum convenience.'
    }
  ];

  const workflow = [
    'Initial consultation and technical setup',
    'Source Connect Pro connection establishment',
    'Real-time audio streaming and monitoring',
    'Client feedback integration',
    'Session recording and documentation',
    'Final delivery and follow-up'
  ];

  const requirements = [
    'High-speed internet connection (minimum 50 Mbps)',
    'Source Connect Pro license (we can provide)',
    'Professional audio interface',
    'Quiet, acoustically treated space',
    'Computer with sufficient processing power',
    'Backup internet connection recommended'
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                Source Connect
                <span className="block gradient-text">Remote Collaboration</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Break down geographical barriers with our professional Source Connect 
                services. Collaborate in real-time with clients and partners worldwide 
                through high-quality audio streaming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Schedule a Session
                </a>
                <a
                  href="#how-it-works"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/services/source-connect-hero.jpg"
                alt="Source Connect Remote Collaboration"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Why Choose Source Connect?
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Our Source Connect setup provides professional-grade remote collaboration 
              capabilities with minimal latency and maximum reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Our Source Connect workflow is designed for maximum efficiency and 
                minimal technical complexity. We handle all the technical setup 
                so you can focus on your creative work.
              </p>
              <ul className="space-y-4">
                {workflow.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-neutral-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/images/services/source-connect-workflow.jpg"
                alt="Source Connect Workflow"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                Technical Requirements
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                To ensure the best possible experience, please review our technical 
                requirements and recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
                  <Settings className="w-6 h-6 text-primary-600 mr-3" />
                  Client Requirements
                </h3>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
                  <Wifi className="w-6 h-6 text-primary-600 mr-3" />
                  Our Setup
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Source Connect Pro licenses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">High-speed internet (100+ Mbps)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Professional audio interfaces</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Dedicated monitoring setup</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Technical support team</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Collaborate Remotely?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's set up your Source Connect session and start collaborating 
            from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 rounded-lg font-medium transition-colors duration-200"
            >
              Schedule a Session
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors duration-200"
            >
              Get Technical Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
