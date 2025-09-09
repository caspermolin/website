import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
  };
  structuredData?: any;
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  openGraph,
  twitter,
  structuredData
}: SEOHeadProps) {
  const fullTitle = title.includes('Posta Vermaas') ? title : `${title} | Posta Vermaas`;
  const fullDescription = description || 'Professional audio post production services including Dolby Atmos, sound design, and re-recording mixing.';
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={openGraph?.title || fullTitle} />
      <meta property="og:description" content={openGraph?.description || fullDescription} />
      <meta property="og:type" content={openGraph?.type || 'website'} />
      <meta property="og:url" content={canonical || 'https://postavermaas.com'} />
      <meta property="og:image" content={openGraph?.image || 'https://postavermaas.com/og-image.jpg'} />
      <meta property="og:site_name" content="Posta Vermaas" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitter?.title || fullTitle} />
      <meta name="twitter:description" content={twitter?.description || fullDescription} />
      <meta name="twitter:image" content={twitter?.image || 'https://postavermaas.com/og-image.jpg'} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Posta Vermaas" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
}
