import { useState, useEffect } from 'react';
import { Bed, Bath, CalendarCheck, ArrowLeft, Loader2, CheckCircle2, XCircle, Users, Calendar, Info, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AvailabilitySearch from '../components/availability/AvailabilitySearch';
import type { SearchParams } from '../components/availability/AvailabilitySearch';
import { checkAvailability, type PropertyAvailability } from '../lib/availabilityUtils';
import { formatDisplayDate, calcNights, getBookingPricing } from '../lib/bookingUtils';
import { useSeo } from '../lib/useSeo';
import { PAGES } from '../lib/seoConfig';
import { analytics } from '../lib/analytics';
import HelpCta from '../components/HelpCta';

type Props = {
  searchParams: SearchParams;
  onBack: () => void;
  onNewSearch: (params: SearchParams) => void;
  onBook: (propertyName: string, maxGuests: number) => void;
  onMoreInfo: (propertyName: string) => void;
};

export default function SearchResultsPage({ searchParams, onBack, onNewSearch, onBook, onMoreInfo }: Props) {
  const searchMeta = PAGES.search;
  useSeo({
    title: searchMeta.title,
    description: searchMeta.description,
    canonical: '/search',
    noindex: searchMeta.noindex,
  });

  const [results, setResults] = useState<PropertyAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkError, setCheckError] = useState('');
  const [currentParams, setCurrentParams] = useState<SearchParams>(searchParams);

  const nights = calcNights(currentParams.checkIn, currentParams.checkOut);
  const totalGuests = currentParams.adults + currentParams.children;

  useEffect(() => {
    setLoading(true);
    setCheckError('');
    checkAvailability(currentParams.checkIn, currentParams.checkOut, totalGuests)
      .then((res) => {
        setResults(res);
        setLoading(false);
        analytics.availabilitySearchCompleted({
          source: 'search_results',
          nights,
          guests: totalGuests,
        });
      })
      .catch((err) => {
        console.error('Availability check error:', err);
        setCheckError('Unable to check availability. Please try again.');
        setLoading(false);
      });
  }, [currentParams]);

  const handleNewSearch = (params: SearchParams) => {
    analytics.availabilitySearchStarted({ source: 'search_results_refine' });
    setCurrentParams(params);
    onNewSearch(params);
  };

  const availableCount = results.filter((r) => r.available).length;

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar solid />

      <div className="pt-20 flex-1">
        <div className="bg-teal-deep">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-white transition-colors duration-200 mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div className="mb-6">
              <h1 className="font-serif text-3xl md:text-4xl text-white font-light mb-1">
                Available Rocky Point Rentals
              </h1>
              <p className="font-sans text-sm text-white/60">
                {!loading && (
                  <>
                    {availableCount} of {results.length} properties available
                    {' · '}{nights} night{nights !== 1 ? 's' : ''}{' · '}
                    {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                  </>
                )}
              </p>
            </div>
            <AvailabilitySearch onSearch={handleNewSearch} initialParams={currentParams} />
            <p className="font-sans text-xs text-white/40 mt-3 font-light">
              Book direct for your Puerto Peñasco beach getaway — no platform fees, no middleman.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-teal-mid animate-spin" />
              <p className="font-sans text-sm text-slate-500">Checking availability...</p>
            </div>
          ) : checkError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <XCircle className="w-10 h-10 text-red-400" />
              <p className="font-sans text-sm text-red-500">{checkError}</p>
              <button
                type="button"
                onClick={() => setCurrentParams({ ...currentParams })}
                className="font-sans text-sm text-teal-deep underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="font-sans text-xs text-slate-400 uppercase tracking-widest mb-1">
                    Compare Available Rentals
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 font-sans text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-teal-mid" />
                      {formatDisplayDate(currentParams.checkIn)} – {formatDisplayDate(currentParams.checkOut)}
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="flex items-center gap-1.5 font-sans text-sm text-slate-600">
                      <Users className="w-4 h-4 text-teal-mid" />
                      {currentParams.adults} adult{currentParams.adults !== 1 ? 's' : ''}
                      {currentParams.children > 0 && `, ${currentParams.children} child${currentParams.children !== 1 ? 'ren' : ''}`}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs font-sans text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {availableCount} Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-slate-300" />
                    {results.length - availableCount} Unavailable
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((property) => (
                  <PropertyResultCard
                    key={property.id}
                    property={property}
                    checkIn={currentParams.checkIn}
                    checkOut={currentParams.checkOut}
                    nights={nights}
                    onBook={() => {
                      analytics.bookingStarted({ property_name: property.name, source: 'search_results' });
                      onBook(property.name, property.maxGuests);
                    }}
                    onMoreInfo={() => {
                      analytics.propertyViewed({ property_name: property.name, source: 'search_results' });
                      onMoreInfo(property.name);
                    }}
                  />
                ))}
              </div>

              {availableCount === 0 && !loading && (
                <div className="mt-12 text-center bg-white border border-slate-100 shadow-sm p-12">
                  <XCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-teal-deep font-light mb-2">
                    No Exact Matches Found
                  </h3>
                  <p className="font-sans text-sm text-slate-500 font-light max-w-md mx-auto mb-6">
                    None of our properties are available for those exact dates and guest count. Try adjusting your dates or contact us — we may be able to help find the right fit.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={onBack}
                      className="btn-outline text-sm"
                    >
                      View All Rentals
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        analytics.contactClicked({ source: 'search_empty_state' });
                        const el = document.getElementById('contact');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.history.pushState({}, '', '/');
                          window.dispatchEvent(new PopStateEvent('popstate'));
                          setTimeout(() => {
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                          }, 200);
                        }
                      }}
                      className="btn-primary text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Us for Help
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <HelpCta source="search_results_bottom" />
      <Footer />
    </div>
  );
}

function PropertyResultCard({
  property,
  checkIn,
  checkOut,
  nights,
  onBook,
  onMoreInfo,
}: {
  property: PropertyAvailability;
  checkIn: string;
  checkOut: string;
  nights: number;
  onBook: () => void;
  onMoreInfo: () => void;
}) {
  const pricing = property.available ? getBookingPricing(checkIn, checkOut) : null;

  return (
    <article
      className={`bg-white group shadow-md overflow-hidden transition-all duration-500 ${
        property.available
          ? 'hover:-translate-y-2 hover:shadow-2xl'
          : 'opacity-60'
      }`}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={property.image}
          alt={property.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${property.available ? 'group-hover:scale-110' : 'grayscale-[40%]'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-4 left-4 bg-white text-teal-deep font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5">
          {property.badge}
        </span>
        <span
          className={`absolute top-4 right-4 font-sans text-xs font-semibold tracking-wider uppercase px-3 py-1.5 flex items-center gap-1.5 ${
            property.available
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700/80 text-white/80'
          }`}
        >
          {property.available ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Available
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              Unavailable
            </>
          )}
        </span>
        <button
          type="button"
          onClick={onMoreInfo}
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-teal-deep text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2 flex items-center gap-1.5 hover:bg-teal-deep hover:text-white"
        >
          <Info className="w-3.5 h-3.5" />
          More Info
        </button>
      </div>

      <div className="p-6">
        <h3 className="font-serif text-2xl font-light text-teal-deep mb-1">
          {property.name}
        </h3>
        <p className="font-sans text-sm text-sand-600 italic mb-4">
          {property.tagline}
        </p>

        <div className="flex items-center gap-5 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Bed className="w-4 h-4 text-teal-mid" />
            <span className="font-sans text-sm">{property.bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Bath className="w-4 h-4 text-teal-mid" />
            <span className="font-sans text-sm">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 ml-auto">
            <Users className="w-4 h-4 text-teal-mid" />
            <span className="font-sans text-sm">Up to {property.maxGuests}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {property.amenities.map((amenity) => (
            <span
              key={amenity}
              className="font-sans text-xs text-teal-deep bg-ocean-50 px-3 py-1 tracking-wide"
            >
              {amenity}
            </span>
          ))}
        </div>

        {property.available && pricing ? (
          <div className="mb-5">
            <div className="bg-teal-deep/5 border border-teal-mid/20 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-sans text-xs text-slate-400 uppercase tracking-wide">
                  {nights} night{nights !== 1 ? 's' : ''} · All fees included
                </p>
                <p className="font-serif text-2xl text-teal-deep mt-0.5">
                  ${pricing.total.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs text-slate-400">From</p>
                <p className="font-sans text-sm text-teal-deep font-semibold">
                  ${Math.round(pricing.total / nights)}<span className="font-light text-xs">/night</span>
                </p>
              </div>
            </div>
          </div>
        ) : !property.available ? (
          <div className="mb-5 bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Status</p>
            <p className="font-sans text-sm text-slate-500">{property.unavailableReason}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onMoreInfo}
            className="btn-outline text-sm justify-center"
          >
            <Info className="w-4 h-4" />
            View Details
          </button>
          <button
            type="button"
            onClick={onBook}
            disabled={!property.available}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-300 ${
              property.available
                ? 'bg-teal-deep text-white hover:bg-teal-mid hover:shadow-lg active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            {property.available ? 'Start Booking' : 'Not Available'}
          </button>
        </div>
      </div>
    </article>
  );
}
