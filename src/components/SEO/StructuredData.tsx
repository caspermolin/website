import Script from 'next/script';

interface StructuredDataProps {
  data?: any;
}

export default function StructuredData({ data }: StructuredDataProps) {
  // Default POSTA VERMAAS structured data
  const defaultData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'POSTA VERMAAS',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [
      // Vul echte profielen in:
      'https://www.linkedin.com/company/posta-vermaas',
      'https://www.instagram.com/postavermaas',
      'https://www.facebook.com/postavermaas'
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Koivistokade 58',
        addressLocality: 'Amsterdam',
        postalCode: '1013 BB',
        addressCountry: 'NL'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Brantasgracht 11',
        addressLocality: 'Amsterdam',
        postalCode: '1019 RK',
        addressCountry: 'NL'
      }
    ]
  };

  const structuredData = data || defaultData;

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
