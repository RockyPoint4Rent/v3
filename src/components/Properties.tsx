import { Bed, Bath, MapPin, CalendarCheck, Info, Users } from 'lucide-react';
import AvailabilitySearch from './availability/AvailabilitySearch';
import type { SearchParams } from './availability/AvailabilitySearch';
import { PROPERTIES } from '../lib/seoConfig';

const propertyCards = [
  {
    id: 1,
    slug: 'casa-margaritas',
    name: 'Casa Margaritas',
    tagline: 'Comfortable Heart of Rocky Point',
    description:
      'A cozy, fully equipped central getaway with modern comforts and easy access to Rocky Point attractions. Perfect for groups seeking a vibrant local experience.',
    bedrooms: 5,
    bathrooms: 2.5,
    maxGuests: 25,
    image:
      'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg?auto=compress&cs=tinysrgb&w=900',
    badge: 'Most Popular',
    amenities: ['A/C', 'WiFi', 'Full Kitchen', 'Parking'],
  },
  {
    id: 2,
    slug: 'casa-tropical-mango',
    name: 'Casa Tropical Mango',
    tagline: 'Tropical Comfort Near the Beach',
    description:
      'A bright tropical retreat near the beach, offering comfort, convenience, and all essential amenities. Ideal for large family gatherings.',
    bedrooms: 7,
    bathrooms: 4,
    maxGuests: 25,
    image:
      'https://res.cloudinary.com/dq9mbqfct/image/upload/v1778347793/mango_jcbjpi.png',
    badge: 'Largest Property',
    amenities: ['A/C', 'WiFi', 'BBQ Grill', 'Beach Access'],
  },
  {
    id: 3,
    slug: 'casa-delphine',
    name: 'Casa Delphine',
    tagline: 'Charming Coastal Home for Families',
    description:
      'A cozy, fully equipped coastal retreat with A/C, WiFi, and a central location close to the beach. The ideal family sanctuary.',
    bedrooms: 6,
    bathrooms: 4,
    maxGuests: 25,
    image:
      'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.30.52_PM_uncyqm.jpg?auto=compress&cs=tinysrgb&w=900',
    badge: 'Family Favorite',
    amenities: ['A/C', 'WiFi', 'Patio', 'Near Beach'],
  },
];

type Props = {
  onSearch: (params: SearchParams) => void;
  onBook: (propertyName: string, maxGuests: number) => void;
};

export default function Properties({ onSearch, onBook }: Props) {
  return (
    <section id="properties" className="pb-24 pt-10 md:pb-32 md:pt-14 bg-sand-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
            Our Vacation Homes
          </p>
          <h2 className="section-heading mb-4">Rocky Point Vacation Rentals</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-600 max-w-xl mx-auto leading-relaxed font-light">
            Three distinct retreats in Puerto Peñasco, Mexico — each designed to deliver comfort, style,
            and an authentic Rocky Point experience for families and groups.
          </p>
        </div>

        <div className="mb-12">
          <p className="font-sans text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">
            Check availability for your dates
          </p>
          <p className="font-sans text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">
            2 night minimum stay
          </p>
          <AvailabilitySearch onSearch={onSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyCards.map((property) => {
            const meta = PROPERTIES[property.slug];
            return (
              <article
                key={property.id}
                className="bg-white group card-hover shadow-md overflow-hidden"
              >
                <a
                  href={`/${property.slug}`}
                  className="block relative overflow-hidden h-64"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', `/${property.slug}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <img
                    src={property.image}
                    alt={meta ? `${meta.name} — ${meta.bedrooms}-bedroom vacation rental in Puerto Peñasco, Mexico` : property.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 bg-white text-teal-deep font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5">
                    {property.badge}
                  </span>
                  <span className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-teal-deep text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    View Details
                  </span>
                </a>

                <div className="p-7">
                  <a
                    href={`/${property.slug}`}
                    className="block"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', `/${property.slug}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0 });
                    }}
                  >
                    <h3 className="font-serif text-2xl font-light text-teal-deep mb-1 hover:text-teal-mid transition-colors duration-200">
                      {property.name}
                    </h3>
                  </a>
                  <p className="font-sans text-sm text-sand-600 italic mb-4">
                    {property.tagline}
                  </p>

                  <div className="flex items-center gap-5 mb-5 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Bed className="w-4 h-4 text-teal-mid" />
                      <span className="font-sans text-sm">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Bath className="w-4 h-4 text-teal-mid" />
                      <span className="font-sans text-sm">{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users className="w-4 h-4 text-teal-mid" />
                      <span className="font-sans text-sm">Sleeps {property.maxGuests}</span>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-slate-500 leading-relaxed mb-5 font-light">
                    {property.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="font-sans text-xs text-teal-deep bg-ocean-50 px-3 py-1 tracking-wide"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`/${property.slug}`}
                      className="btn-outline text-center justify-center text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, '', `/${property.slug}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        window.scrollTo({ top: 0 });
                      }}
                    >
                      View Details
                    </a>
                    <button
                      type="button"
                      onClick={() => onBook(property.name, property.maxGuests)}
                      className="w-full btn-primary justify-center"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Check Availability
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 shadow-sm border border-slate-100">
            <MapPin className="w-4 h-4 text-coral-500" />
            <span className="font-sans text-sm text-slate-600 font-light">
              All properties located within{' '}
              <strong className="font-medium text-teal-deep"> minutes from the beach</strong>{' '}
              in Puerto Peñasco, Mexico
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
