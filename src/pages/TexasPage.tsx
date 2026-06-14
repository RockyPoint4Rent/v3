import { Search, CalendarCheck, MapPin, ArrowLeft, Plane, Sun, Users } from 'lucide-react';
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
    question: 'How do Texas travelers get to Rocky Point?',
    answer: 'Rocky Point (Puerto Peñasco) is a popular Mexico beach destination for Texas families. Travelers from Dallas/Fort Worth, Austin, San Antonio, Houston, and El Paso typically drive or fly into Phoenix and continue to Rocky Point. The destination is known for its beautiful beaches on the Gulf of California.',
  },
  {
    question: 'Is Rocky Point good for Texas family vacations?',
    answer: 'Yes. Rocky Point is a favorite destination for Texas families seeking a Mexico beach getaway. Our three vacation homes are designed for families with private pools, full kitchens, multiple bedrooms, and space for up to 25 guests.',
  },
  {
    question: 'How do I check availability for Texas trips?',
    answer: 'Use the availability search on this page. Enter your travel dates and guest count to see which of our three Rocky Point vacation homes are available for your Texas family vacation.',
  },
  {
    question: 'Can Texas families book direct?',
    answer: 'Yes. Book direct with Rocky Point 4 Rent — no platform fees, no middleman. A $200 deposit secures your dates. You will communicate directly with hosts Tom and Lidia throughout your stay.',
  },
  {
    question: 'Are these rentals good for Texas groups?',
    answer: 'Absolutely. Each property sleeps up to 25 guests. They are perfect for multi-family trips, reunions, and group vacations from Dallas, Austin, San Antonio, Houston, and across Texas.',
  },
  {
    question: 'Where can I see all Rocky Point rentals?',
    answer: 'This page features all three of our vacation homes. You can also visit our main Rocky Point Rentals page or Puerto Peñasco Vacation Rentals page for more information.',
  },
];

type Props = {
  onSearch: (params: SearchParams) => void;
  onBook: (propertyName: string, maxGuests: number) => void;
  onBack: () => void;
};

export default function TexasPage({ onSearch, onBook, onBack }: Props) {
  const pageMeta = PAGES['rocky-point-rentals-from-texas'];
  useSeo({
    title: pageMeta.title,
    description: pageMeta.description,
    canonical: '/rocky-point-rentals-from-texas',
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
          src="https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Rocky Point vacation rentals for Texas travelers from Dallas, Austin, San Antonio, and Houston"
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
            Rocky Point Rentals for Texas Travelers
          </h1>
          <p className="font-sans text-white/80 text-lg md:text-xl font-light max-w-2xl">
            Puerto Peñasco vacation homes for Texas families, groups, and beach travelers. Book direct.
          </p>
        </div>
      </div>

      <PageBreadcrumb items={[
        { label: 'Rocky Point Rentals', href: '/rocky-point-rentals' },
        { label: 'Texas Travelers' },
      ]} />

      {/* For Texas Travelers */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Puerto Peñasco — A Mexico Beach Destination for Texas Families</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            Rocky Point — officially Puerto Peñasco, Sonora, Mexico — is a beloved beach destination for
            Texas travelers seeking a Mexico getaway. Located on the Gulf of California, it offers beautiful beaches,
            warm waters, and a relaxed atmosphere perfect for family vacations.
          </p>
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            Whether you are traveling from <strong className="font-medium text-teal-deep">Dallas/Fort Worth</strong>,{' '}
            <strong className="font-medium text-teal-deep">Austin</strong>,{' '}
            <strong className="font-medium text-teal-deep">San Antonio</strong>,{' '}
            <strong className="font-medium text-teal-deep">Houston</strong>,{' '}
            <strong className="font-medium text-teal-deep">El Paso</strong>, or across{' '}
            <strong className="font-medium text-teal-deep">West Texas</strong> —
            our Rocky Point vacation rentals are designed for families and groups seeking a memorable beach experience.
          </p>
          <p className="font-sans text-slate-500 leading-relaxed font-light">
            This page features all three of our Puerto Peñasco vacation homes, each with private pools,
            space for up to 25 guests, and direct booking with no platform fees.
          </p>
        </div>
      </section>

      {/* Why Texas Travelers Love Rocky Point */}
      <section className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Why Texas Families Love Rocky Point</h2>
          <div className="divider-line" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Plane className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Mexico Beach Getaway</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                A beautiful Gulf of California destination with pristine beaches and warm Mexican hospitality.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Sun className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Family-Friendly</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                Private pools, full kitchens, and safe outdoor spaces for children and multi-generational trips.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Users className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Group-Ready</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                Each home sleeps up to 25 guests. Perfect for family reunions and group vacations from Texas.
              </p>
            </div>
          </div>
          <p className="font-sans text-slate-500 leading-relaxed font-light text-center">
            Explore our vacation homes and book direct for a simpler rental experience.
          </p>
        </div>
      </section>

      {/* Availability Search */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4 text-center">Check Availability</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 text-center mb-8 font-light">Enter your dates to see which Puerto Peñasco rentals are available.</p>
          <AvailabilitySearch onSearch={onSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Vacation Homes for Texas Travelers</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-xl mx-auto mb-12 text-center font-light">
            Three Rocky Point rentals — each designed for Texas families and groups.
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
            <a href="/rocky-point-rentals-from-arizona" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-arizona'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Arizona Travelers</a>
            <a href="/casa-margaritas" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-margaritas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Margaritas</a>
            <a href="/casa-tropical-mango" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-tropical-mango'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Tropical Mango</a>
            <a href="/casa-delphine" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-delphine'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Delphine</a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <LandingPageFaq faqs={faqs} />

      <HelpCta source="texas-page" />

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-coral-500">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Ready for Your Texas Family Beach Trip?
          </h2>
          <div className="w-16 h-px bg-white/40 mx-auto mb-6" />
          <p className="font-sans text-white/80 leading-relaxed font-light mb-8">
            Check availability and book your Puerto Peñasco rental today.
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
        name="Rocky Point Rentals from Texas"
        description="Explore Rocky Point vacation rentals for Texas families, groups, and beach travelers. Book direct Puerto Peñasco homes and check availability online."
        url={`${SITE_CONFIG.domain}/rocky-point-rentals-from-texas`}
      />
      <LandingPageFaqSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.domain },
          { name: 'Rocky Point Rentals from Texas', url: `${SITE_CONFIG.domain}/rocky-point-rentals-from-texas` },
        ]}
      />
    </div>
  );
}
