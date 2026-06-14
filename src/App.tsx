import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Properties from './components/Properties';
import TravelerSection from './components/TravelerSection';
import BookDirect from './components/BookDirect';
import About from './components/About';
import Explore from './components/Explore';
import Testimonials from './components/Testimonials';
import HomeFaq, { homeFaqs } from './components/HomeFaq';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import StickyMobileCta from './components/StickyMobileCta';
import HelpCta from './components/HelpCta';
import AdminApp from './admin/AdminApp';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingPage from './pages/BookingPage';
import CasaMargaritasPage from './pages/CasaMargaritasPage';
import CasaTropicalMangoPage from './pages/CasaTropicalMangoPage';
import CasaDelphinePage from './pages/CasaDelphinePage';
import RockyPointRentalsPage from './pages/RockyPointRentalsPage';
import PuertoPenascoPage from './pages/PuertoPenascoPage';
import ArizonaPage from './pages/ArizonaPage';
import TexasPage from './pages/TexasPage';
import { useSeo } from './lib/useSeo';
import { PAGES, SITE_CONFIG } from './lib/seoConfig';
import { JsonLd, createWebSiteSchema, createWebPageSchema, createFAQSchema } from './lib/schemaHelpers';
import type { SearchParams } from './components/availability/AvailabilitySearch';

const PROPERTY_SLUGS: Record<string, string> = {
  'Casa Margaritas': '/casa-margaritas',
  'Casa Tropical Mango': '/casa-tropical-mango',
  'Casa Delphine': '/casa-delphine',
};

const SLUG_TO_PROPERTY: Record<string, string> = Object.fromEntries(
  Object.entries(PROPERTY_SLUGS).map(([name, slug]) => [slug, name])
);

function getPath() {
  return window.location.pathname;
}

function navigate(path: string, state?: unknown) {
  window.history.pushState(state ?? {}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

type BookingTarget = {
  propertyName: string;
  maxGuests: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

function HomePage({
  onSearch,
  onBook,
}: {
  onSearch: (p: SearchParams) => void;
  onBook: (name: string, max: number) => void;
}) {
  const homePageMeta = PAGES.home;
  useSeo({
    title: homePageMeta.title,
    description: homePageMeta.description,
    canonical: '/',
    keywords: homePageMeta.keywords,
    ogTitle: homePageMeta.ogTitle,
    ogDescription: homePageMeta.ogDescription,
    ogImage: homePageMeta.ogImage,
    twitterTitle: homePageMeta.twitterTitle,
    twitterDescription: homePageMeta.twitterDescription,
    twitterImage: homePageMeta.twitterImage,
  });

  const scrollToProperties = useCallback(() => {
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero onSearch={scrollToProperties} />
      <TrustBar />
      <Properties onSearch={onSearch} onBook={onBook} />
      <TravelerSection />
      <BookDirect />
      <About />
      <Explore />
      <Testimonials />
      <HomeFaq />
      <HelpCta source="homepage_bottom" />
      <FinalCta onSearch={scrollToProperties} />
      <Footer />
      <JsonLd schema={createWebSiteSchema()} />
      <JsonLd schema={createWebPageSchema(homePageMeta.title, homePageMeta.description, SITE_CONFIG.domain + '/')} />
      <JsonLd schema={createFAQSchema(homeFaqs)} />
      <StickyMobileCta onClick={scrollToProperties} />
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(getPath);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goHome = useCallback(() => navigate('/'), []);

  const handleSearch = useCallback((params: SearchParams) => {
    setSearchParams(params);
    navigate('/search');
  }, []);

  const handleBook = useCallback(
    (propertyName: string, maxGuests: number, checkIn?: string, checkOut?: string, guests?: number) => {
      setBookingTarget({ propertyName, maxGuests, checkIn, checkOut, guests });
      navigate('/book');
    },
    []
  );

  const handleMoreInfo = useCallback((propertyName: string) => {
    navigate(PROPERTY_SLUGS[propertyName] ?? '/');
  }, []);

  if (path.startsWith('/admin')) return <AdminApp />;

  if (path === '/book' && bookingTarget) {
    return (
      <BookingPage
        propertyName={bookingTarget.propertyName}
        maxGuests={bookingTarget.maxGuests}
        initialCheckIn={bookingTarget.checkIn}
        initialCheckOut={bookingTarget.checkOut}
        initialGuests={bookingTarget.guests}
        onClose={goHome}
      />
    );
  }

  if (path === '/search' && searchParams) {
    return (
      <SearchResultsPage
        searchParams={searchParams}
        onBack={goHome}
        onNewSearch={(params) => {
          setSearchParams(params);
          setPath('/search');
        }}
        onBook={(propertyName, maxGuests) =>
          handleBook(propertyName, maxGuests, searchParams.checkIn, searchParams.checkOut, searchParams.adults + searchParams.children)
        }
        onMoreInfo={handleMoreInfo}
      />
    );
  }

  if (path === '/casa-margaritas') {
    return (
      <CasaMargaritasPage
        onBack={goHome}
        onBook={handleBook}
      />
    );
  }

  if (path === '/casa-tropical-mango') {
    return (
      <CasaTropicalMangoPage
        onBack={goHome}
        onBook={handleBook}
      />
    );
  }

  if (path === '/casa-delphine') {
    return (
      <CasaDelphinePage
        onBack={goHome}
        onBook={handleBook}
      />
    );
  }

  // SEO Landing Pages
  if (path === '/rocky-point-rentals') {
    return (
      <RockyPointRentalsPage
        onSearch={handleSearch}
        onBook={handleBook}
        onBack={goHome}
      />
    );
  }

  if (path === '/puerto-penasco-vacation-rentals') {
    return (
      <PuertoPenascoPage
        onSearch={handleSearch}
        onBook={handleBook}
        onBack={goHome}
      />
    );
  }

  if (path === '/rocky-point-rentals-from-arizona') {
    return (
      <ArizonaPage
        onSearch={handleSearch}
        onBook={handleBook}
        onBack={goHome}
      />
    );
  }

  if (path === '/rocky-point-rentals-from-texas') {
    return (
      <TexasPage
        onSearch={handleSearch}
        onBook={handleBook}
        onBack={goHome}
      />
    );
  }

  // Redirect unknown slugs back to home
  if (path !== '/' && !path.startsWith('/admin')) {
    navigate('/');
  }

  return (
    <HomePage
      onSearch={handleSearch}
      onBook={handleBook}
    />
  );
}
