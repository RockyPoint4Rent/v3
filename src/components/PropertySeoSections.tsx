import { useState } from 'react';
import { ChevronDown, HelpCircle, Search, CalendarCheck, Home, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../lib/seoConfig';
import { JsonLd, createVacationRentalSchema, createBreadcrumbSchema } from '../lib/schemaHelpers';
import type { VacationRentalData } from '../lib/schemaHelpers';

/* ── Best For Section ── */

export function BestForSection({ propertyName }: { propertyName: string }) {
  return (
    <section className="py-16 md:py-20 bg-sand-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <h2 className="section-heading mb-4">Best For Arizona &amp; Texas Travelers</h2>
        <div className="divider-line" />
        <p className="font-sans text-slate-600 leading-relaxed font-light mb-5 max-w-3xl">
          {propertyName} is a popular choice for travelers from{' '}
          <strong className="font-medium text-teal-deep">Phoenix</strong>,{' '}
          <strong className="font-medium text-teal-deep">Tucson</strong>,{' '}
          <strong className="font-medium text-teal-deep">Scottsdale</strong>,{' '}
          <strong className="font-medium text-teal-deep">Mesa</strong>, and{' '}
          <strong className="font-medium text-teal-deep">Chandler</strong> —
          all within a 3.5-hour drive to Rocky Point. It is also a great option for Texas families
          visiting from <strong className="font-medium text-teal-deep">Dallas/Fort Worth</strong>,{' '}
          <strong className="font-medium text-teal-deep">Austin</strong>,{' '}
          <strong className="font-medium text-teal-deep">San Antonio</strong>, and{' '}
          <strong className="font-medium text-teal-deep">Houston</strong>.
        </p>
        <p className="font-sans text-slate-500 leading-relaxed font-light max-w-3xl">
          Whether you're planning a weekend getaway from Arizona or a longer vacation from Texas,
          {propertyName} in Puerto Peñasco is ready when you are. Book direct and check availability online.
        </p>
      </div>
    </section>
  );
}

/* ── Booking CTA Section ── */

export function BookingCtaSection({
  propertyName,
  maxGuests,
  onBook,
}: {
  propertyName: string;
  maxGuests: number;
  onBook: (propertyName: string, maxGuests: number) => void;
}) {
  return (
    <section className="py-16 md:py-20 bg-teal-deep">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
          Check Availability for {propertyName}
        </h2>
        <div className="w-16 h-px bg-sand-400/60 mx-auto mb-6" />
        <p className="font-sans text-white/70 max-w-lg mx-auto leading-relaxed font-light mb-8">
          Only a $200 deposit to confirm your reservation. Pay the remainder when you arrive.
          Book direct — no platform fees, no hassle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onBook(propertyName, maxGuests)}
            className="btn-primary bg-white !text-teal-deep hover:!bg-sand-100 hover:!shadow-xl"
          >
            <CalendarCheck className="w-4 h-4" />
            Check Availability
          </button>
          <a
            href="/"
            className="btn-outline border-white text-white hover:bg-white hover:!text-teal-deep"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0 });
            }}
          >
            <Home className="w-4 h-4" />
            View All Rentals
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Property FAQ Section ── */

const propertyFaqs: Record<string, Array<{ question: string; answer: string }>> = {
  'casa-margaritas': [
    {
      question: 'How do I check availability for Casa Margaritas?',
      answer: 'Use the Check Availability button on this page to start the booking process for Casa Margaritas. Enter your dates and number of guests to see if this Rocky Point vacation rental is available.',
    },
    {
      question: 'Is Casa Margaritas good for Arizona travelers?',
      answer: 'Yes. Casa Margaritas is a popular Rocky Point rental for travelers from Phoenix, Tucson, Scottsdale, Mesa, and Chandler. Puerto Peñasco is about a 3.5-hour drive from the Arizona border.',
    },
    {
      question: 'Can Texas travelers book this Puerto Peñasco vacation rental?',
      answer: 'Absolutely. Casa Margaritas welcomes Texas travelers from Dallas/Fort Worth, Austin, San Antonio, Houston, and beyond. Book direct online and secure your dates with a $200 deposit.',
    },
    {
      question: 'Can I book Casa Margaritas direct?',
      answer: 'Yes. Book direct with Rocky Point 4 Rent — no platform fees, no middleman. Communicate directly with your hosts, Tom and Lidia, and enjoy a simpler booking experience.',
    },
    {
      question: 'Where can I see more Rocky Point rentals?',
      answer: 'Rocky Point 4 Rent has three vacation rental properties in Puerto Peñasco: Casa Margaritas (5-bedroom), Casa Tropical Mango (7-bedroom), and Casa Delphine (6-bedroom). Visit our homepage to compare all properties.',
    },
  ],
  'casa-tropical-mango': [
    {
      question: 'How do I check availability for Casa Tropical Mango?',
      answer: 'Click the Check Availability button on this page to start your booking for Casa Tropical Mango. Enter your travel dates and guest count to see if this Rocky Point vacation rental is open.',
    },
    {
      question: 'Is Casa Tropical Mango good for Arizona travelers?',
      answer: 'Yes. Casa Tropical Mango is a favorite Rocky Point rental for Arizona travelers from Phoenix, Tucson, Scottsdale, Mesa, and Chandler. It is our largest property with beach access — ideal for big groups.',
    },
    {
      question: 'Can Texas travelers book this Puerto Peñasco vacation rental?',
      answer: 'Absolutely. Casa Tropical Mango is perfect for Texas families and groups from Dallas/Fort Worth, Austin, San Antonio, and Houston. Book direct online with just a $200 deposit.',
    },
    {
      question: 'Can I book Casa Tropical Mango direct?',
      answer: 'Yes. Book direct with Rocky Point 4 Rent — skip the platform fees. You will communicate directly with hosts Tom and Lidia and get faster, more personal booking support.',
    },
    {
      question: 'Where can I see more Rocky Point rentals?',
      answer: 'Rocky Point 4 Rent has three vacation rental homes in Puerto Peñasco: Casa Margaritas (5-bedroom), Casa Tropical Mango (7-bedroom, largest), and Casa Delphine (6-bedroom). Visit our homepage to browse all properties.',
    },
  ],
  'casa-delphine': [
    {
      question: 'How do I check availability for Casa Delphine?',
      answer: 'Use the Check Availability button on this page to begin your booking for Casa Delphine. Enter your dates and number of guests to check if this Rocky Point vacation rental is available.',
    },
    {
      question: 'Is Casa Delphine good for Arizona travelers?',
      answer: 'Yes. Casa Delphine is a popular choice for Arizona travelers from Phoenix, Tucson, Scottsdale, Mesa, and Chandler. Puerto Peñasco is just 60 miles from the Arizona border — perfect for a weekend trip.',
    },
    {
      question: 'Can Texas travelers book this Puerto Peñasco vacation rental?',
      answer: 'Absolutely. Casa Delphine is great for Texas families from Dallas/Fort Worth, Austin, San Antonio, and Houston. Book direct with a $200 deposit and pay the rest when you arrive.',
    },
    {
      question: 'Can I book Casa Delphine direct?',
      answer: 'Yes. Book direct with Rocky Point 4 Rent — no platform fees or third-party hassle. Communicate directly with your hosts, Tom and Lidia, for a smoother booking experience.',
    },
    {
      question: 'Where can I see more Rocky Point rentals?',
      answer: 'Rocky Point 4 Rent has three vacation rental homes in Puerto Peñasco: Casa Margaritas (5-bedroom), Casa Tropical Mango (7-bedroom), and Casa Delphine (6-bedroom with pool waterfall). Visit our homepage to explore all options.',
    },
  ],
};

export function PropertyFaqSection({ slug }: { slug: string }) {
  const faqs = propertyFaqs[slug] ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
        <div className="divider-line" />
        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`bg-sand-50 border transition-all duration-300 ${
                openIndex === index
                  ? 'border-teal-mid/30 shadow-md'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left group"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                      openIndex === index ? 'text-teal-mid' : 'text-slate-300 group-hover:text-teal-mid/50'
                    }`}
                  />
                  <span
                    className={`font-sans text-sm font-medium transition-colors duration-200 ${
                      openIndex === index ? 'text-teal-deep' : 'text-slate-700 group-hover:text-teal-deep'
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-teal-mid' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-7 pb-6 pt-0">
                  <div className="ml-7 pl-3 border-l-2 border-sand-200">
                    <p className="font-sans text-sm text-slate-500 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Internal Links Section ── */

export function InternalLinksSection({ currentSlug }: { currentSlug: string }) {
  const otherProperties = [
    { slug: 'casa-margaritas', name: 'Casa Margaritas', desc: '5-bedroom, Most Popular' },
    { slug: 'casa-tropical-mango', name: 'Casa Tropical Mango', desc: '7-bedroom, Beach Access' },
    { slug: 'casa-delphine', name: 'Casa Delphine', desc: '6-bedroom, Pool Waterfall' },
  ].filter((p) => p.slug !== currentSlug);

  return (
    <section className="py-16 md:py-20 bg-sand-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <h2 className="section-heading mb-4">More Rocky Point Vacation Rentals</h2>
        <div className="divider-line" />
        <p className="font-sans text-slate-500 max-w-xl mx-auto leading-relaxed font-light mb-10">
          Explore our other vacation homes in Puerto Peñasco, Mexico.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {otherProperties.map((prop) => (
            <a
              key={prop.slug}
              href={`/${prop.slug}`}
              className="bg-white p-6 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300 group flex items-center gap-4"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', `/${prop.slug}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0 });
              }}
            >
              <MapPin className="w-5 h-5 text-teal-mid group-hover:text-coral-500 transition-colors duration-300 shrink-0" />
              <div>
                <h3 className="font-sans font-semibold text-teal-deep group-hover:text-teal-mid transition-colors duration-200">
                  {prop.name}
                </h3>
                <p className="font-sans text-xs text-slate-400">{prop.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <a
            href="/rocky-point-rentals"
            className="btn-outline text-sm"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/rocky-point-rentals');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0 });
            }}
          >
            Rocky Point Rentals
          </a>
          <a
            href="/puerto-penasco-vacation-rentals"
            className="btn-outline text-sm"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/puerto-penasco-vacation-rentals');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0 });
            }}
          >
            Puerto Peñasco Vacation Rentals
          </a>
          <a
            href="/rocky-point-rentals-from-arizona"
            className="btn-outline text-sm"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/rocky-point-rentals-from-arizona');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0 });
            }}
          >
            From Arizona
          </a>
          <a
            href="/rocky-point-rentals-from-texas"
            className="btn-outline text-sm"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/rocky-point-rentals-from-texas');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0 });
            }}
          >
            From Texas
          </a>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="btn-outline"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0 });
            }}
          >
            View All Rocky Point Rentals
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Structured Data (JSON-LD) ── */

type PropertySchemaData = VacationRentalData & { slug: string };

/**
 * VacationRental schema for property detail pages.
 * Uses schema.org/VacationRental — the most accurate type for short-term rental properties.
 */
export function PropertyStructuredData({ data }: { data: PropertySchemaData }) {
  return <JsonLd schema={createVacationRentalSchema(data)} />;
}

/**
 * BreadcrumbList schema for property detail pages.
 * Trail: Home → Rocky Point Rentals → [Property Name]
 */
export function PropertyBreadcrumbSchema({ slug, name }: { slug: string; name: string }) {
  return (
    <JsonLd
      schema={createBreadcrumbSchema([
        { name: 'Home', url: SITE_CONFIG.domain },
        { name: 'Rocky Point Rentals', url: `${SITE_CONFIG.domain}/rocky-point-rentals` },
        { name, url: `${SITE_CONFIG.domain}/${slug}` },
      ])}
    />
  );
}
