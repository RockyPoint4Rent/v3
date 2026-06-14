import { Search, CalendarCheck, MapPin, ArrowLeft } from 'lucide-react';
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
    question: 'Is Rocky Point the same as Puerto Peñasco?',
    answer: 'Yes. Rocky Point is the common English name for Puerto Peñasco, a city in Sonora, Mexico. Both names refer to the same beach destination on the Gulf of California, about 60 miles from the Arizona border.',
  },
  {
    question: 'How do I check availability for Rocky Point rentals?',
    answer: 'Use the availability search on this page to enter your travel dates and guest count. You will see which of our three Puerto Peñasco vacation homes are available for your stay.',
  },
  {
    question: 'Are these Rocky Point rentals good for families?',
    answer: 'Yes. All three vacation homes are designed for families and groups. They feature private pools, full kitchens, multiple bedrooms, and plenty of space for children and adults alike.',
  },
  {
    question: 'Can I book Rocky Point rentals direct?',
    answer: 'Yes. Book direct with Rocky Point 4 Rent — no platform fees, no middleman. A $200 deposit secures your dates, and you pay the remainder when you arrive.',
  },
  {
    question: 'Are these rentals good for groups?',
    answer: 'Absolutely. Each property sleeps up to 25 guests with private pools, large kitchens, and open living spaces. Perfect for family reunions, friend getaways, and group trips.',
  },
  {
    question: 'How do I start the booking process?',
    answer: 'Click Check Availability on any property card, enter your dates, and follow the booking steps. You can also browse our vacation homes and select the one that fits your group size.',
  },
];

type Props = {
  onSearch: (params: SearchParams) => void;
  onBook: (propertyName: string, maxGuests: number) => void;
  onBack: () => void;
};

export default function RockyPointRentalsPage({ onSearch, onBook, onBack }: Props) {
  const pageMeta = PAGES['rocky-point-rentals'];
  useSeo({
    title: pageMeta.title,
    description: pageMeta.description,
    canonical: '/rocky-point-rentals',
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
          alt="Rocky Point rentals beach view in Puerto Peñasco, Mexico"
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
            Rocky Point Rentals in Puerto Peñasco, Mexico
          </h1>
          <p className="font-sans text-white/80 text-lg md:text-xl font-light max-w-2xl">
            Browse vacation homes for families, groups, and beach getaways. Book direct — no platform fees.
          </p>
        </div>
      </div>

      <PageBreadcrumb items={[{ label: 'Rocky Point Rentals' }]} />

      {/* Intro Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Your Guide to Rocky Point Rentals</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            Rocky Point — known locally as Puerto Peñasco — is a popular beach destination in Sonora, Mexico,
            just 60 miles from the Arizona border. It is one of the closest Mexico beach getaways for travelers
            from Phoenix, Tucson, and across the Southwest. This page is your starting point for browsing
            <strong className="font-medium text-teal-deep"> Rocky Point rentals</strong> and finding the right
            vacation home for your trip.
          </p>
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5">
            We offer three family-friendly vacation homes in Puerto Peñasco, each with private pools,
            full kitchens, multiple bedrooms, and space for up to 25 guests. Whether you are planning
            a weekend trip from Arizona or a longer vacation from Texas, our Rocky Point vacation rentals
            are designed for comfort and easy direct booking.
          </p>
          <p className="font-sans text-slate-500 leading-relaxed font-light">
            Check availability online, book direct with your hosts Tom and Lidia, and enjoy a simpler
            vacation rental experience.
          </p>
        </div>
      </section>

      {/* Availability Search */}
      <section className="py-12 md:py-16 bg-sand-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4 text-center">Check Availability</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 text-center mb-8 font-light">Enter your dates to see which Rocky Point rentals are available.</p>
          <AvailabilitySearch onSearch={onSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">Rocky Point Vacation Rentals</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-xl mx-auto mb-12 text-center font-light">
            Three distinct vacation homes in Puerto Peñasco — each perfect for families and groups.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => (
              <PropertyListingCard key={property.id} property={property} onBook={onBook} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-16 md:py-20 bg-teal-deep">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Why Book Direct?
          </h2>
          <div className="w-16 h-px bg-sand-400/60 mx-auto mb-6" />
          <p className="font-sans text-white/70 max-w-2xl mx-auto leading-relaxed font-light mb-8">
            When you book direct with Rocky Point 4 Rent, you skip the platform fees and communicate
            directly with your hosts, Tom and Lidia. A <strong className="text-sand-300">$200 deposit</strong> secures
            your dates, and you pay the rest when you arrive.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            {['No platform fees', 'Direct communication with hosts', 'Simple $200 deposit'].map((benefit) => (
              <div key={benefit} className="bg-white/10 border border-white/20 p-5">
                <span className="font-sans text-white text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arizona/Texas Section */}
      <section className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="section-heading mb-4">For Arizona & Texas Travelers</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-600 leading-relaxed font-light mb-5 max-w-3xl">
            Rocky Point is a favorite beach destination for travelers from <strong className="font-medium text-teal-deep">Phoenix</strong>,{' '}
            <strong className="font-medium text-teal-deep">Tucson</strong>, <strong className="font-medium text-teal-deep">Scottsdale</strong>,{' '}
            <strong className="font-medium text-teal-deep">Mesa</strong>, and <strong className="font-medium text-teal-deep">Chandler</strong> —
            all within a 3.5-hour drive. It is also popular with Texas families from{' '}
            <strong className="font-medium text-teal-deep">Dallas/Fort Worth</strong>,{' '}
            <strong className="font-medium text-teal-deep">Austin</strong>,{' '}
            <strong className="font-medium text-teal-deep">San Antonio</strong>, and{' '}
            <strong className="font-medium text-teal-deep">Houston</strong>.
          </p>
          <p className="font-sans text-slate-500 leading-relaxed font-light max-w-3xl">
            Whether you are planning a quick weekend trip from Arizona or a longer vacation from Texas,
            our Rocky Point rentals in Puerto Peñasco are ready when you are.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="/rocky-point-rentals-from-arizona"
              className="btn-outline text-sm"
              onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-arizona'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
            >
              Arizona Travelers Guide
            </a>
            <a
              href="/rocky-point-rentals-from-texas"
              className="btn-outline text-sm"
              onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-texas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
            >
              Texas Travelers Guide
            </a>
            <a
              href="/puerto-penasco-vacation-rentals"
              className="btn-outline text-sm"
              onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/puerto-penasco-vacation-rentals'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
            >
              Puerto Peñasco Vacation Rentals
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <LandingPageFaq faqs={faqs} />

      <HelpCta source="rocky-point-rentals" />

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-teal-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Ready to Book Your Rocky Point Rental?
          </h2>
          <div className="w-16 h-px bg-sand-400/60 mx-auto mb-6" />
          <p className="font-sans text-white/70 leading-relaxed font-light mb-8">
            Check availability and book direct — no platform fees, no hassle.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary bg-white !text-teal-deep hover:!bg-sand-100 hover:!shadow-xl"
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
        name="Rocky Point Rentals"
        description="Browse Rocky Point rentals in Puerto Peñasco, Mexico. Book direct vacation homes for families, groups, and beach getaways from Arizona and Texas."
        url={`${SITE_CONFIG.domain}/rocky-point-rentals`}
      />
      <LandingPageFaqSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.domain },
          { name: 'Rocky Point Rentals', url: `${SITE_CONFIG.domain}/rocky-point-rentals` },
        ]}
      />
    </div>
  );
}
