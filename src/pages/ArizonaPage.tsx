import { Search, CalendarCheck, MapPin, ArrowLeft, Car, Sun, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AvailabilitySearch from '../components/availability/AvailabilitySearch';
import { PropertyListingCard, propertyList } from '../components/PropertyListingCard';
import { LandingPageFaq, LandingPageFaqSchema, LandingPageSchema, BreadcrumbSchema } from '../components/LandingPageFaq';
import { useSeo } from '../lib/useSeo';
import { PAGES, SITE_CONFIG } from '../lib/seoConfig';
import type { SearchParams } from '../components/availability/AvailabilitySearch';
import StickyMobileCta from '../components/StickyMobileCta';
import HelpCta from '../components/HelpCta';
import PageBreadcrumb from '../components/PageBreadcrumb';

const faqs = [
  {
    question: 'How far is Rocky Point from Arizona?',
    answer: 'Rocky Point (Puerto Peñasco) is about 60 miles from the Arizona border, making it a 3.5-hour drive from Phoenix or Tucson. It is one of the closest beach destinations for Arizona travelers.',
  },
  {
    question: 'Do Arizona travelers need a passport for Rocky Point?',
    answer: 'Rocky Point is in Mexico, so standard border crossing requirements apply. Check current US State Department guidance for the latest entry requirements.',
  },
  {
    question: 'Is Rocky Point good for Arizona weekend trips?',
    answer: 'Yes. Rocky Point is a popular weekend destination for Arizona travelers. The drive from Phoenix, Tucson, Scottsdale, Mesa, and Chandler is short enough for Friday-to-Sunday getaways.',
  },
  {
    question: 'How do I check availability for Arizona trips?',
    answer: 'Use the availability search on this page. Enter your travel dates and the number of guests to see which of our three Rocky Point vacation homes are available for your Arizona getaway.',
  },
  {
    question: 'Can Arizona families book direct?',
    answer: 'Yes. Book direct with Rocky Point 4 Rent — no platform fees, no middleman. A $200 deposit secures your dates. You will communicate directly with hosts Tom and Lidia.',
  },
  {
    question: 'Are these rentals good for large Arizona groups?',
    answer: 'Absolutely. Each property sleeps up to 25 guests. They are perfect for multi-family trips, reunions, and group vacations from Phoenix, Tucson, and across Arizona.',
  },
];

type Props = {
  onSearch: (params: SearchParams) => void;
  onBook: (propertyName: string, maxGuests: number) => void;
  onBack: () => void;
};

export default function ArizonaPage({ onSearch, onBook, onBack }: Props) {
  const pageMeta = PAGES['rocky-point-rentals-from-arizona'];
  useSeo({
    title: pageMeta.title,
    description: pageMeta.description,
    canonical: '/rocky-point-rentals-from-arizona',
    keywords: pageMeta.keywords,
    ogTitle: pageMeta.ogTitle,
    ogDescription: pageMeta.ogDescription,
    ogImage: pageMeta.ogImage,
    twitterTitle: pageMeta.twitterTitle,
    twitterDescription: pageMeta.twitterDescription,
    twitterImage: pageMeta.twitterImage,
  });

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[50vh] md:h-[55vh] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Rocky Point beach getaway for Arizona travelers from Phoenix and Tucson"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />

        <button
          onClick={onBack}
          className="absolute top-24 left-6 md:left-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-teal-deep font-sans text-sm font-medium tracking-wider uppercase px-4 py-2.5 hover:bg-white transition-all duration-200 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 md:pb-12">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-sand-300" />
            <span className="font-sans text-sm tracking-widest uppercase text-sand-300">Puerto Peñasco, Mexico</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
            Rocky Point Rentals for Arizona Travelers
          </h1>
          <p className="font-sans text-white/80 text-lg md:text-xl font-light max-w-2xl">
            Plan your beach trip from Phoenix, Tucson, Scottsdale, Mesa, or Chandler. Book direct vacation homes.
          </p>
        </div>
      </div>

      <PageBreadcrumb items={[
        { label: 'Rocky Point Rentals', href: '/rocky-point-rentals' },
        { label: 'Arizona Travelers' },
      ]} />

      {/* For Arizona Travelers */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Your Arizona Beach Getaway Starts Here</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            Rocky Point — officially Puerto Peñasco, Sonora, Mexico — is one of the closest beach destinations for
            Arizona travelers. Just 60 miles from the border, it is approximately a{' '}
            <strong className="font-medium text-teal-deep">3.5-hour drive from Phoenix</strong> and a similar distance
            from <strong className="font-medium text-teal-deep">Tucson</strong>.
          </p>
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            Whether you are coming from <strong className="font-medium text-teal-deep">Phoenix</strong>,{' '}
            <strong className="font-medium text-teal-deep">Tucson</strong>,{' '}
            <strong className="font-medium text-teal-deep">Scottsdale</strong>,{' '}
            <strong className="font-medium text-teal-deep">Mesa</strong>,{' '}
            <strong className="font-medium text-teal-deep">Chandler</strong>,{' '}
            <strong className="font-medium text-teal-deep">Gilbert</strong>,{' '}
            <strong className="font-medium text-teal-deep">Glendale</strong>,{' '}
            <strong className="font-medium text-teal-deep">Peoria</strong>, or{' '}
            <strong className="font-medium text-teal-deep">Surprise</strong> —
            our Rocky Point vacation rentals are designed for easy weekend trips and longer stays alike.
          </p>
          <p className="font-sans text-slate-500 leading-relaxed font-light">
            This page features all three of our vacation homes, each with private pools, space for up to 25 guests,
            and direct booking with no platform fees.
          </p>
        </div>
      </section>

      {/* Why Arizona Travelers Love Rocky Point */}
      <section className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Why Arizona Travelers Love Rocky Point</h2>
          <div className="divider-line" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Car className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Easy Drive</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                3.5 hours from Phoenix or Tucson. One tank of gas and you are at the beach.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Sun className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Weekend-Friendly</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                Perfect for Friday-to-Sunday getaways. Leave after work, wake up at the beach.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Users className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Group-Ready</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                Sleeps up to 25 guests. Ideal for multi-family trips and reunions from Arizona.
              </p>
            </div>
          </div>
          <p className="font-sans text-slate-500 leading-relaxed font-light text-center">
            Best for weekend trips, families, groups, and longer stays. Check availability and book direct.
          </p>
        </div>
      </section>

      {/* Availability Search */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4 text-center">Check Availability</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 text-center mb-8 font-light">Enter your dates to see which Rocky Point rentals are available.</p>
          <AvailabilitySearch onSearch={onSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Vacation Homes for Arizona Travelers</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-xl mx-auto mb-12 text-center font-light">
            Three Rocky Point rentals — each designed for families and groups from Arizona.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => (
              <PropertyListingCard key={property.id} property={property} onBook={onBook} />
            ))}
          </div>
        </div>
      </section>

      {/* Book Direct */}
      <section className="py-16 md:py-20 bg-teal-deep">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Book Direct — No Platform Fees
          </h2>
          <div className="w-16 h-px bg-sand-400/60 mx-auto mb-6" />
          <p className="font-sans text-white/70 max-w-2xl mx-auto leading-relaxed font-light mb-8">
            When you book direct with Rocky Point 4 Rent, you communicate directly with hosts Tom and Lidia.
            A <strong className="text-sand-300">$200 deposit</strong> secures your dates. Pay the rest when you arrive.
          </p>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <p className="font-sans text-xs tracking-widest uppercase text-slate-400 mb-4 text-center">Also Browse</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/rocky-point-rentals" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Rocky Point Rentals</a>
            <a href="/puerto-penasco-vacation-rentals" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/puerto-penasco-vacation-rentals'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Puerto Peñasco Vacation Rentals</a>
            <a href="/rocky-point-rentals-from-texas" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-texas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Texas Travelers</a>
            <a href="/casa-margaritas" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-margaritas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Margaritas</a>
            <a href="/casa-tropical-mango" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-tropical-mango'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Tropical Mango</a>
            <a href="/casa-delphine" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-delphine'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Delphine</a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <LandingPageFaq faqs={faqs} />

      <HelpCta source="arizona-page" />

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-coral-500">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Ready for Your Arizona Beach Trip?
          </h2>
          <div className="w-16 h-px bg-white/40 mx-auto mb-6" />
          <p className="font-sans text-white/80 leading-relaxed font-light mb-8">
            Check availability and book your Rocky Point rental today.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary bg-white !text-coral-500 hover:!bg-sand-100 hover:!shadow-xl"
          >
            <Search className="w-4 h-4" />
            Check Availability
          </button>
        </div>
      </section>

      <Footer />

      <StickyMobileCta onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Structured Data */}
      <LandingPageSchema
        name="Rocky Point Rentals from Arizona"
        description="Plan your Rocky Point beach trip from Phoenix, Tucson, Scottsdale, Mesa, Chandler, or anywhere in Arizona. Browse vacation rentals and book direct."
        url={`${SITE_CONFIG.domain}/rocky-point-rentals-from-arizona`}
      />
      <LandingPageFaqSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.domain },
          { name: 'Rocky Point Rentals from Arizona', url: `${SITE_CONFIG.domain}/rocky-point-rentals-from-arizona` },
        ]}
      />
    </div>
  );
}
