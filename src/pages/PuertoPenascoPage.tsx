import { Search, CalendarCheck, MapPin, ArrowLeft, Waves, Users, Home } from 'lucide-react';
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
    question: 'Is Puerto Peñasco the same as Rocky Point?',
    answer: 'Yes. Puerto Peñasco is the official name of the city in Sonora, Mexico. Rocky Point is the common English name used by American travelers. Both names refer to the same beach destination on the Gulf of California.',
  },
  {
    question: 'How do I check availability for Puerto Peñasco vacation rentals?',
    answer: 'Use the availability search on this page. Enter your check-in and check-out dates along with the number of guests to see which of our three Puerto Peñasco vacation homes are available.',
  },
  {
    question: 'Are Puerto Peñasco rentals good for families?',
    answer: 'Yes. All three vacation homes are designed for families with private pools, full kitchens, multiple bedrooms, and space for children. Each home sleeps up to 25 guests comfortably.',
  },
  {
    question: 'Can I book Puerto Peñasco rentals direct?',
    answer: 'Yes. Book direct with Rocky Point 4 Rent. A $200 deposit secures your reservation, and you pay the remainder upon arrival. No platform fees or middleman.',
  },
  {
    question: 'Are these rentals good for beach getaways?',
    answer: 'Absolutely. Each property is within walking distance or a short drive from the beach. Casa Tropical Mango is particularly close with easy beach access.',
  },
  {
    question: 'Where can I see all available rentals?',
    answer: 'This page features all three of our Puerto Peñasco vacation rentals. You can also visit our main Rocky Point rentals page or browse each property individually through the links below.',
  },
];

type Props = {
  onSearch: (params: SearchParams) => void;
  onBook: (propertyName: string, maxGuests: number) => void;
  onBack: () => void;
};

export default function PuertoPenascoPage({ onSearch, onBook, onBack }: Props) {
  const pageMeta = PAGES['puerto-penasco-vacation-rentals'];
  useSeo({
    title: pageMeta.title,
    description: pageMeta.description,
    canonical: '/puerto-penasco-vacation-rentals',
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
          alt="Puerto Peñasco vacation rentals beach view in Rocky Point, Mexico"
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
            <span className="font-sans text-sm tracking-widest uppercase text-sand-300">Sonora, Mexico</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
            Puerto Peñasco Vacation Rentals
          </h1>
          <p className="font-sans text-white/80 text-lg md:text-xl font-light max-w-2xl">
            Beach homes in Rocky Point for families, groups, and getaways. Check availability and book direct.
          </p>
        </div>
      </div>

      <PageBreadcrumb items={[{ label: 'Puerto Peñasco Vacation Rentals' }]} />

      {/* About Puerto Peñasco */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Puerto Peñasco — Also Known as Rocky Point</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            <strong className="font-medium text-teal-deep">Puerto Peñasco</strong> — commonly called Rocky Point by American travelers —
            is a beach destination in Sonora, Mexico, on the Gulf of California. It sits about 60 miles from the Arizona border,
            making it one of the closest Mexico beach destinations for travelers from Phoenix, Tucson, Scottsdale, and across the Southwest.
          </p>
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            This page features our <strong className="font-medium text-teal-deep">Puerto Peñasco vacation rentals</strong> —
            three family-friendly homes designed for beach getaways, group trips, and relaxed vacations. Each property has a private pool,
            full kitchen, multiple bedrooms, and space for up to 25 guests.
          </p>
          <p className="font-sans text-slate-500 leading-relaxed font-light">
            Book direct with Rocky Point 4 Rent and enjoy a simpler vacation rental experience with no platform fees.
          </p>
        </div>
      </section>

      {/* Availability Search */}
      <section className="py-12 md:py-16 bg-sand-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4 text-center">Check Availability</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 text-center mb-8 font-light">Enter your dates to see which Puerto Peñasco rentals are available.</p>
          <AvailabilitySearch onSearch={onSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Puerto Peñasco Beach Homes</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-xl mx-auto mb-12 text-center font-light">
            Three vacation rentals in Puerto Peñasco — each designed for families, groups, and beach getaways.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => (
              <PropertyListingCard key={property.id} property={property} onBook={onBook} />
            ))}
          </div>
        </div>
      </section>

      {/* Families, Groups, Beach */}
      <section className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Perfect for Families, Groups, and Beach Getaways</h2>
          <div className="divider-line" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Users className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Family-Friendly</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                Private pools, full kitchens, multiple bedrooms, and safe outdoor spaces for children and families.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Home className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Group-Ready</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                Each home sleeps up to 25 guests with open living spaces, large dining areas, and private suites.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300">
              <Waves className="w-8 h-8 text-teal-mid mb-4" />
              <h3 className="font-sans text-lg font-semibold text-teal-deep mb-2">Beach Access</h3>
              <p className="font-sans text-slate-500 text-sm leading-relaxed font-light">
                All properties are within walking distance or a short drive from the beautiful Puerto Peñasco beaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-16 md:py-20 bg-teal-deep">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Book Direct for a Simpler Experience
          </h2>
          <div className="w-16 h-px bg-sand-400/60 mx-auto mb-6" />
          <p className="font-sans text-white/70 max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Skip the platform fees and book your Puerto Peñasco vacation rental direct. A{' '}
            <strong className="text-sand-300">$200 deposit</strong> secures your dates, and you communicate
            directly with hosts Tom and Lidia throughout your stay.
          </p>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-10 bg-sand-50 border-t border-sand-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <p className="font-sans text-xs tracking-widest uppercase text-slate-400 mb-4 text-center">Also Browse</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/rocky-point-rentals" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Rocky Point Rentals</a>
            <a href="/rocky-point-rentals-from-arizona" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-arizona'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Arizona Travelers</a>
            <a href="/rocky-point-rentals-from-texas" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-texas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Texas Travelers</a>
            <a href="/casa-margaritas" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-margaritas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Margaritas</a>
            <a href="/casa-tropical-mango" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-tropical-mango'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Tropical Mango</a>
            <a href="/casa-delphine" className="btn-outline text-sm" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/casa-delphine'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}>Casa Delphine</a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <LandingPageFaq faqs={faqs} />

      <HelpCta source="puerto-penasco" />

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-coral-500">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Ready to Book Your Puerto Peñasco Vacation?
          </h2>
          <div className="w-16 h-px bg-white/40 mx-auto mb-6" />
          <p className="font-sans text-white/80 leading-relaxed font-light mb-8">
            Check availability and book direct today.
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
        name="Puerto Peñasco Vacation Rentals"
        description="Find Puerto Peñasco vacation rentals also known as Rocky Point rentals. Browse family-friendly beach homes and check availability online."
        url={`${SITE_CONFIG.domain}/puerto-penasco-vacation-rentals`}
      />
      <LandingPageFaqSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.domain },
          { name: 'Puerto Peñasco Vacation Rentals', url: `${SITE_CONFIG.domain}/puerto-penasco-vacation-rentals` },
        ]}
      />
    </div>
  );
}
