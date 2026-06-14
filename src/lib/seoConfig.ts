/**
 * Centralized SEO configuration for Rocky Point 4 Rent
 * Manages titles, descriptions, OG metadata, and canonical URLs
 * Production domain: https://rockypoint4rent.com
 */

export const SITE_CONFIG = {
  domain: 'https://rockypoint4rent.com',
  siteName: 'Rocky Point 4 Rent',
  businessName: 'Rocky Point 4 Rent',
  location: {
    city: 'Puerto Peñasco',
    region: 'Sonora',
    country: 'Mexico',
  },
  contact: {
    phone: '+1-480-207-0114',
    email: 'reservations@rockypoint4rent.com',
  },
  defaultOgImage: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200',
  defaultTwitterImage: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=900',
};

export type PropertyMetadata = {
  slug: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  primaryImage: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

export const PROPERTIES: Record<string, PropertyMetadata> = {
  'casa-margaritas': {
    slug: 'casa-margaritas',
    name: 'Casa Margaritas',
    bedrooms: 5,
    bathrooms: 2.5,
    maxGuests: 25,
    primaryImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg',
    title: 'Casa Margaritas | Rocky Point Vacation Rental | Book Direct',
    description:
      'Book Casa Margaritas, a Rocky Point vacation rental in Puerto Peñasco, Mexico. Check availability online for Arizona and Texas beach getaways.',
    keywords:
      'Casa Margaritas, Rocky Point rental, Puerto Peñasco vacation home, 5-bedroom rental, family vacation Mexico, Arizona beach getaway',
    ogTitle: 'Casa Margaritas — Rocky Point Vacation Rental with Private Pool',
    ogDescription:
      '5-bedroom vacation home in Puerto Peñasco, Mexico with private pool. Sleeps 25 — ideal for large family groups. Book direct with Tom & Lidia.',
    ogImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg',
    twitterTitle: 'Casa Margaritas — Rocky Point 5-Bedroom Rental with Pool',
    twitterDescription: '5-bedroom vacation home in Puerto Peñasco. Private pool, sleeps 25. Book direct — no fees.',
    twitterImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg',
  },
  'casa-tropical-mango': {
    slug: 'casa-tropical-mango',
    name: 'Casa Tropical Mango',
    bedrooms: 7,
    bathrooms: 4,
    maxGuests: 25,
    primaryImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/v1778347793/mango_jcbjpi.png',
    title: 'Casa Tropical Mango | Rocky Point Vacation Rental | Book Direct',
    description:
      'Book Casa Tropical Mango, a Rocky Point vacation rental in Puerto Peñasco, Mexico. Check availability online for Arizona and Texas beach getaways.',
    keywords:
      'Casa Tropical Mango, Rocky Point rental, Puerto Peñasco vacation home, 7-bedroom rental, beach house rental, large family vacation Mexico',
    ogTitle: 'Casa Tropical Mango — Largest Rocky Point Vacation Rental, Beach Access',
    ogDescription:
      '7-bedroom vacation home near the beach in Puerto Peñasco, Mexico. Largest property with beach access and private pool. Sleeps 25 guests. Book direct.',
    ogImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/v1778347793/mango_jcbjpi.png',
    twitterTitle: 'Casa Tropical Mango — Largest Rocky Point Rental, Beach Access',
    twitterDescription: '7-bedroom vacation home near the beach in Puerto Peñasco. Private pool, sleeps 25. Book direct.',
    twitterImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/v1778347793/mango_jcbjpi.png',
  },
  'casa-delphine': {
    slug: 'casa-delphine',
    name: 'Casa Delphine',
    bedrooms: 6,
    bathrooms: 4,
    maxGuests: 25,
    primaryImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.30.52_PM_uncyqm.jpg',
    title: 'Casa Delphine | Rocky Point Vacation Rental | Book Direct',
    description:
      'Book Casa Delphine, a Rocky Point vacation rental in Puerto Peñasco, Mexico. Check availability online for Arizona and Texas beach getaways.',
    keywords:
      'Casa Delphine, Rocky Point rental, Puerto Peñasco vacation home, 6-bedroom rental, pool with waterfall, family vacation Mexico',
    ogTitle: 'Casa Delphine — Rocky Point Vacation Rental with Pool & Waterfall',
    ogDescription:
      '6-bedroom vacation home in Puerto Peñasco, Mexico with private pool and waterfall feature. Sleeps 25 guests. Book direct with Tom & Lidia.',
    ogImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.30.52_PM_uncyqm.jpg',
    twitterTitle: 'Casa Delphine — Rocky Point 6-Bedroom Rental with Pool & Waterfall',
    twitterDescription: '6-bedroom vacation home in Puerto Peñasco. Private pool with waterfall, sleeps 25. Book direct.',
    twitterImage: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.30.52_PM_uncyqm.jpg',
  },
};

export type PageMetadata = {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
};

export const PAGES: Record<string, PageMetadata> = {
  home: {
    title: 'Rocky Point 4 Rent | Rocky Point Vacation Rentals',
    description:
      'Book direct Rocky Point vacation rentals in Puerto Peñasco, Mexico. Browse family-friendly homes, check availability, and plan your beach getaway from Arizona or Texas.',
    keywords:
      'Rocky Point rentals, Puerto Peñasco vacation homes, Mexico vacation rentals, Arizona beach getaway, Texas vacation rentals, family vacation Mexico',
    ogTitle: 'Rocky Point 4 Rent | Book Direct Vacation Rentals in Puerto Peñasco',
    ogDescription:
      'Browse Rocky Point vacation rentals for Arizona and Texas travelers. Check availability and book direct vacation homes in Puerto Peñasco, Mexico.',
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterTitle: 'Rocky Point 4 Rent | Book Direct Vacation Rentals',
    twitterDescription:
      'Browse Rocky Point vacation homes. Check availability and book direct in Puerto Peñasco, Mexico.',
    twitterImage: SITE_CONFIG.defaultTwitterImage,
  },
  'rocky-point-rentals': {
    title: 'Rocky Point Rentals | Book Direct Vacation Homes in Puerto Peñasco',
    description:
      'Browse Rocky Point rentals in Puerto Peñasco, Mexico. Book direct vacation homes for families, groups, Arizona travelers, and Texas beach getaways.',
    keywords:
      'Rocky Point rentals, Rocky Point vacation rentals, Rocky Point Mexico rentals, Puerto Peñasco rentals, Rocky Point beach rentals',
    ogTitle: 'Rocky Point Rentals | Book Direct Vacation Homes',
    ogDescription:
      'Browse Rocky Point rentals in Puerto Peñasco, Mexico. Book direct vacation homes for families and groups.',
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterTitle: 'Rocky Point Rentals | Book Direct',
    twitterDescription: 'Browse Rocky Point rentals in Puerto Peñasco, Mexico. Book direct vacation homes.',
    twitterImage: SITE_CONFIG.defaultTwitterImage,
  },
  'puerto-penasco-vacation-rentals': {
    title: 'Puerto Peñasco Vacation Rentals | Rocky Point Beach Homes',
    description:
      'Find Puerto Peñasco vacation rentals also known as Rocky Point rentals. Browse family-friendly beach homes and check availability online.',
    keywords:
      'Puerto Peñasco vacation rentals, Puerto Peñasco rentals, Puerto Peñasco beach rentals, Puerto Peñasco vacation homes, Rocky Point vacation rentals',
    ogTitle: 'Puerto Peñasco Vacation Rentals | Rocky Point Beach Homes',
    ogDescription:
      'Find Puerto Peñasco vacation rentals. Browse family-friendly beach homes in Rocky Point, Mexico.',
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterTitle: 'Puerto Peñasco Vacation Rentals',
    twitterDescription: 'Find Puerto Peñasco vacation rentals. Browse beach homes in Rocky Point, Mexico.',
    twitterImage: SITE_CONFIG.defaultTwitterImage,
  },
  'rocky-point-rentals-from-arizona': {
    title: 'Rocky Point Rentals from Arizona | Phoenix & Tucson Beach Getaways',
    description:
      'Plan your Rocky Point beach trip from Phoenix, Tucson, Scottsdale, Mesa, Chandler, or anywhere in Arizona. Browse vacation rentals and book direct.',
    keywords:
      'Rocky Point rentals from Arizona, Rocky Point rentals from Phoenix, Rocky Point rentals from Tucson, Arizona beach vacation rentals, Rocky Point weekend trip Arizona',
    ogTitle: 'Rocky Point Rentals for Arizona Travelers',
    ogDescription:
      'Plan your Rocky Point beach trip from Phoenix, Tucson, or anywhere in Arizona. Browse vacation rentals and book direct.',
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterTitle: 'Rocky Point Rentals from Arizona',
    twitterDescription: 'Rocky Point beach trips for Phoenix, Tucson, and Arizona travelers. Book direct.',
    twitterImage: SITE_CONFIG.defaultTwitterImage,
  },
  'rocky-point-rentals-from-texas': {
    title: 'Rocky Point Rentals from Texas | Puerto Peñasco Vacation Homes',
    description:
      'Explore Rocky Point vacation rentals for Texas families, groups, and beach travelers. Book direct Puerto Peñasco homes and check availability online.',
    keywords:
      'Rocky Point rentals from Texas, Puerto Peñasco rentals from Texas, Mexico beach rentals from Texas, Rocky Point Texas vacation',
    ogTitle: 'Rocky Point Rentals for Texas Travelers',
    ogDescription:
      'Explore Rocky Point vacation rentals for Texas families and groups. Book direct Puerto Peñasco homes.',
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterTitle: 'Rocky Point Rentals from Texas',
    twitterDescription: 'Rocky Point vacation rentals for Texas families and groups. Book direct.',
    twitterImage: SITE_CONFIG.defaultTwitterImage,
  },
  search: {
    title: 'Search Availability | Rocky Point 4 Rent Vacation Rentals',
    description: 'Search and filter available Rocky Point vacation rentals in Puerto Peñasco, Mexico.',
    noindex: true,
  },
  booking: {
    title: 'Book Your Reservation | Rocky Point 4 Rent',
    description: 'Complete your booking for a Rocky Point vacation rental in Puerto Peñasco, Mexico.',
    noindex: true,
  },
};

export function getPropertyMetadata(slug: string): PropertyMetadata | null {
  return PROPERTIES[slug] ?? null;
}

export function getPageMetadata(page: string): PageMetadata | null {
  return PAGES[page] ?? null;
}
