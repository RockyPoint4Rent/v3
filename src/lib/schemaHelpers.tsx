import { SITE_CONFIG } from './seoConfig';

/** Injects a JSON-LD script tag safely. */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** WebSite schema — sitewide identity. */
export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.domain,
    description:
      'Book direct Rocky Point vacation rentals in Puerto Peñasco, Mexico for Arizona and Texas beach getaways.',
  };
}

/** LodgingBusiness schema — business-level identity for Rocky Point 4 Rent. */
export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_CONFIG.domain}/#business`,
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.domain,
    description:
      'Rocky Point / Puerto Peñasco vacation rentals for Arizona and Texas travelers. Book direct with Tom & Lidia.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Puerto Peñasco',
      addressRegion: 'Sonora',
      addressCountry: 'MX',
    },
  };
}

/** WebPage schema — for the homepage and generic pages. */
export function createWebPageSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.domain,
    },
  };
}

/**
 * CollectionPage schema — for landing pages that list multiple rental properties.
 * CollectionPage is a more specific subtype of WebPage appropriate for listing pages.
 */
export function createCollectionPageSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.domain,
    },
  };
}

/** FAQPage schema — requires visible FAQ content on the page to match. */
export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList schema — items ordered from root to current page. */
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type VacationRentalData = {
  name: string;
  description: string;
  url: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
};

/**
 * VacationRental schema — schema.org/VacationRental is the most accurate type
 * for short-term vacation rental properties.
 */
export function createVacationRentalSchema(data: VacationRentalData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${data.url}#property`,
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Puerto Peñasco',
      addressRegion: 'Sonora',
      addressCountry: 'MX',
    },
    numberOfRooms: data.bedrooms,
    numberOfBathroomsTotal: data.bathrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: data.maxGuests,
    },
    amenityFeature: data.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  };
}
