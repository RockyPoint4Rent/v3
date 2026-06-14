import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bed,
  Bath,
  Users,
  Waves,
  Wifi,
  Wind,
  UtensilsCrossed,
  Car,
  Flame,
  CheckCircle2,
  CalendarCheck,
  MapPin,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSeo } from '../lib/useSeo';
import { PROPERTIES, SITE_CONFIG } from '../lib/seoConfig';
import { BestForSection, BookingCtaSection, PropertyFaqSection, InternalLinksSection, PropertyStructuredData, PropertyBreadcrumbSchema } from '../components/PropertySeoSections';
import StickyMobileCta from '../components/StickyMobileCta';
import PageBreadcrumb from '../components/PageBreadcrumb';

const FALLBACK_IMAGES = [
  'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg',
  'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=900',
];

const amenities = [
  { icon: Wind, label: 'Air Conditioning' },
  { icon: Wifi, label: 'High-Speed WiFi' },
  { icon: UtensilsCrossed, label: 'Full Kitchen' },
  { icon: Car, label: 'Free Parking' },
  { icon: Waves, label: 'Private Pool' },
  { icon: Flame, label: 'BBQ Grill' },
];

type Props = {
  onBack: () => void;
  onBook: (propertyName: string, maxGuests: number) => void;
};

export default function CasaMargaritasPage({ onBack, onBook }: Props) {
  const meta = PROPERTIES['casa-margaritas'];
  useSeo({
    title: meta.title,
    description: meta.description,
    canonical: '/casa-margaritas',
    keywords: meta.keywords,
    ogTitle: meta.ogTitle,
    ogDescription: meta.ogDescription,
    ogImage: meta.ogImage,
    twitterTitle: meta.twitterTitle,
    twitterDescription: meta.twitterDescription,
    twitterImage: meta.twitterImage,
  });

  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'rules' | 'pricing'>('overview');

  useEffect(() => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cloudinary-images?folder=casa-margaritas`;
    fetch(url, { headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` } })
      .then((r) => r.json())
      .then((data) => { if (data.images?.length) setImages(data.images.map((img: { url: string }) => img.url)); })
      .catch(() => {});
  }, []);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + images.length) % images.length));
  const nextImage = () => setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero image with back button */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <img
          src={images[0]}
          alt="Casa Margaritas vacation rental in Puerto Peñasco, Mexico — private pool and 5 bedrooms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        <button
          onClick={onBack}
          className="absolute top-24 left-6 md:left-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-teal-deep font-sans text-sm font-medium tracking-wider uppercase px-4 py-2.5 hover:bg-white transition-all duration-200 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 md:pb-12">
          <span className="inline-block bg-coral-500 text-white font-sans text-xs font-semibold tracking-widest uppercase px-3 py-1.5 mb-4">
            Most Popular
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-white mb-2 tracking-wide">
            Casa Margaritas Rocky Point Vacation Rental
          </h1>
          <p className="font-sans text-white/80 text-base md:text-lg font-light">
            5-Bedroom Vacation Home in Puerto Peñasco, Mexico · Private Pool · Sleeps 25
          </p>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="bg-teal-deep text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sand-300" />
              <span className="font-sans text-sm">Up to 25 Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-sand-300" />
              <span className="font-sans text-sm">5 Bedrooms · 9 Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-sand-300" />
              <span className="font-sans text-sm">2.5 Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sand-300" />
              <span className="font-sans text-sm">Private Pool</span>
            </div>
            <div className="ml-auto hidden md:block">
              <button
                onClick={() => onBook('Casa Margaritas', 25)}
                className="btn-primary bg-coral-500 hover:bg-coral-600 border-0 py-2.5"
              >
                <CalendarCheck className="w-4 h-4" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <PageBreadcrumb items={[
        { label: 'Rocky Point Rentals', href: '/rocky-point-rentals' },
        { label: 'Casa Margaritas' },
      ]} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left column — main content */}
          <div className="lg:col-span-2">

            {/* Photo gallery */}
            <div className="mb-12">
              <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">Photo Gallery</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.slice(0, 5).map((src, i) => (
                  <div
                    key={i}
                    className={`overflow-hidden cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''}`}
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={src}
                      alt={`Casa Margaritas Rocky Point rental photo ${i + 1}`}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i === 0 ? 'h-64 md:h-72' : 'h-32 md:h-[138px]'}`}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => openLightbox(0)}
                className="mt-3 font-sans text-xs text-teal-mid tracking-wider uppercase underline underline-offset-4 hover:text-teal-deep transition-colors"
              >
                View all {images.length} photos
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-8">
              <div className="flex gap-0 -mb-px">
                {(['overview', 'amenities', 'rules', 'pricing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-sans text-xs tracking-widest uppercase px-5 py-3 border-b-2 transition-all duration-200 ${
                      activeTab === tab
                        ? 'border-teal-deep text-teal-deep font-medium'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-light text-teal-deep mb-4">About This Property</h2>
                  <div className="divider-line !mx-0" />
                  <p className="font-sans text-slate-600 leading-relaxed font-light mb-4">
                    Welcome to our beautiful Rocky Point getaway, located just seconds from the beach. The moment you arrive, you'll feel relaxed, comfortable, and ready to enjoy your stay. The home offers plenty of space to celebrate, party all night, grill on the BBQ, or simply unwind.
                  </p>
                  <p className="font-sans text-slate-500 leading-relaxed font-light italic text-sm mb-6">
                    Bienvenidos a nuestro hermoso refugio en Rocky Point, ubicado a solo segundos de la playa. Desde que llegues, te sentirás relajado, cómodo y listo para disfrutar tu estancia.
                  </p>
                  <video
                    src="https://res.cloudinary.com/duebfnnel/video/upload/v1779155129/margarita_eduqjw.mp4"
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    className="w-full object-cover"
                    onMouseEnter={(e) => e.currentTarget.setAttribute('controls', '')}
                    onMouseLeave={(e) => e.currentTarget.removeAttribute('controls')}
                  />
                </div>

                <div className="bg-white p-7 shadow-sm border border-slate-100">
                  <h3 className="font-serif text-xl font-light text-teal-deep mb-3">The Space</h3>
                  <p className="font-sans text-slate-600 leading-relaxed font-light">
                    My house is truly unique because it's cozy, quiet, relaxing, and brand-new. It's affordable, offers complete privacy, and features your very own private pool. With king-size beds and a fully equipped kitchen, it has everything you need for a perfect stay.
                  </p>
                </div>

                <div className="bg-white p-7 shadow-sm border border-slate-100">
                  <h3 className="font-serif text-xl font-light text-teal-deep mb-3">Guest Access</h3>
                  <p className="font-sans text-slate-600 leading-relaxed font-light">
                    My guests have full access to the entire house and the pool. You're welcome to use the grill and everything you need to make your vacation perfect. Enjoy the space, relax, and make unforgettable memories.
                  </p>
                </div>

                <div className="bg-ocean-50 p-7 border-l-4 border-teal-light">
                  <h3 className="font-serif text-xl font-light text-teal-deep mb-3">Other Things to Note</h3>
                  <p className="font-sans text-slate-600 leading-relaxed font-light">
                    My home is your home. It is always thoroughly disinfected before and after every stay. We are located just 5 minutes from the beach and only seconds away from anything you may need. The property is fully cleaned, sanitized, and COVID-compliant.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light text-teal-deep mb-4">Where You'll Be</h3>
                  <div className="flex items-start gap-3 bg-white p-5 shadow-sm border border-slate-100">
                    <MapPin className="w-5 h-5 text-coral-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-sans font-medium text-teal-deep text-sm mb-1">Puerto Peñasco, Sonora, Mexico</p>
                      <p className="font-sans text-slate-500 text-sm font-light">Minutes from the beach and town center. Easy walking distance to restaurants, shops, and local attractions.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Amenities */}
            {activeTab === 'amenities' && (
              <div>
                <h2 className="font-serif text-3xl font-light text-teal-deep mb-4">What's Included</h2>
                <div className="divider-line !mx-0" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  {amenities.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 bg-white p-4 shadow-sm border border-slate-100">
                      <div className="w-9 h-9 bg-ocean-50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal-mid" />
                      </div>
                      <span className="font-sans text-sm text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-serif text-xl font-light text-teal-deep mb-4">All Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Air conditioning in all rooms',
                    'High-speed WiFi',
                    'Fully equipped kitchen',
                    'Private pool',
                    'BBQ grill',
                    'Free parking',
                    'King-size beds',
                    'Smart TV',
                    'Washer & dryer',
                    'Outdoor dining area',
                    'Beach towels',
                    'Pool toys & floats',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 py-2.5 border-b border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-teal-light shrink-0" />
                      <span className="font-sans text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Rules */}
            {activeTab === 'rules' && (
              <div>
                <h2 className="font-serif text-3xl font-light text-teal-deep mb-4">House Rules</h2>
                <div className="divider-line !mx-0" />
                <p className="font-sans text-slate-500 text-sm mb-8 font-light">
                  You'll be staying in someone's home, so please treat it with care and respect.
                </p>

                <div className="space-y-6">
                  <div className="bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-teal-mid" />
                      <h3 className="font-sans font-semibold text-teal-deep text-sm tracking-wide uppercase">Check-In & Check-Out</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="font-sans text-sm text-slate-600">Check-in</span>
                        <span className="font-sans text-sm font-medium text-teal-deep">3:00 PM – 10:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-sans text-sm text-slate-600">Check-out</span>
                        <span className="font-sans text-sm font-medium text-teal-deep">Before 11:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-teal-mid" />
                      <h3 className="font-sans font-semibold text-teal-deep text-sm tracking-wide uppercase">During Your Stay</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Maximum guests', value: '25 guests' },
                        { label: 'Pets', value: 'Allowed (+$50 fee)' },
                        { label: 'Photography', value: 'Commercial allowed' },
                        { label: 'Smoking', value: 'Not allowed indoors' },
                        { label: 'Minimum stay', value: '2 nights' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <span className="font-sans text-sm text-slate-600">{label}</span>
                          <span className="font-sans text-sm font-medium text-teal-deep">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="font-sans font-semibold text-teal-deep text-sm tracking-wide uppercase mb-4">Before You Leave</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 font-sans text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-light shrink-0" />
                        Return all keys to the lockbox
                      </li>
                      <li className="flex items-center gap-2 font-sans text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-light shrink-0" />
                        Dispose of trash in designated bins
                      </li>
                      <li className="flex items-center gap-2 font-sans text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-light shrink-0" />
                        Leave the home in the condition you found it
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Pricing */}
            {activeTab === 'pricing' && (
              <div>
                <h2 className="font-serif text-3xl font-light text-teal-deep mb-4">Pricing Overview</h2>
                <div className="divider-line !mx-0" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Friday – Saturday', rate: '$350', note: 'Peak nights' },
                    { label: 'Sunday – Wednesday', rate: '$225', note: 'Midweek' },
                    { label: 'Thursday', rate: '$325', note: 'Weekend eve' },
                  ].map(({ label, rate, note }) => (
                    <div key={label} className="bg-white p-6 shadow-sm border border-slate-100 text-center">
                      <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-2">{label}</p>
                      <p className="font-serif text-4xl font-light text-teal-deep mb-1">{rate}</p>
                      <p className="font-sans text-xs text-slate-400">{note}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 shadow-sm border border-slate-100 mb-6">
                  <h3 className="font-sans font-semibold text-teal-deep text-sm tracking-wide uppercase mb-4">Additional Fees</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Cleaning Fee', value: '$189', note: 'One-time per stay' },
                      { label: 'Property Fee', value: '$85', note: 'One-time per stay' },
                      { label: 'Pet Fee', value: '$50', note: 'Optional, per stay' },
                    ].map(({ label, value, note }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="font-sans text-sm font-medium text-slate-700">{label}</p>
                          <p className="font-sans text-xs text-slate-400">{note}</p>
                        </div>
                        <span className="font-serif text-xl font-light text-teal-deep">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-deep text-white p-6">
                  <p className="font-sans text-xs tracking-widest uppercase text-sand-300 mb-2">Easy Booking</p>
                  <p className="font-serif text-2xl font-light mb-3">Reserve with only $200 deposit</p>
                  <p className="font-sans text-white/70 text-sm font-light">Pay the remainder when you arrive. We accept Zelle for fast, secure payments.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right column — sticky booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              <div className="bg-white shadow-md border border-slate-100 p-7">
                <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-1">Starting from</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-serif text-4xl font-light text-teal-deep">$225</span>
                  <span className="font-sans text-sm text-slate-400">/ night</span>
                </div>
                <p className="font-sans text-xs text-slate-400 mb-6">Fri–Sat from $350/night · 2 night min</p>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-slate-500">Cleaning fee</span>
                    <span className="font-sans text-slate-700">$189</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-slate-500">Property fee</span>
                    <span className="font-sans text-slate-700">$85</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-slate-500">Linen fee</span>
                    <span className="font-sans text-slate-700">$75</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-slate-500">Deposit to reserve</span>
                    <span className="font-sans font-medium text-teal-deep">$200</span>
                  </div>
                </div>

                <button
                  onClick={() => onBook('Casa Margaritas', 25)}
                  className="w-full btn-primary justify-center mb-3"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book This Property
                </button>
                <p className="font-sans text-xs text-center text-slate-400">No credit card required · Free cancellation</p>
              </div>

              <div className="bg-white shadow-sm border border-slate-100 p-5">
                <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-3">Want to pay more? We're also available on:</p>
                <div className="space-y-2">
                  {[
                    { name: 'Airbnb', url: 'https://www.airbnb.com/rooms/708166089068936506?unique_share_id=7a94d31b-260d-4681-825e-ab9d99a27b83&viralityEntryPoint=1&s=76' },
                    { name: 'Booking.com', url: 'https://www.booking.com' },
                    { name: 'VRBO', url: 'https://www.vrbo.com' },
                  ].map(({ name, url }) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1.5 hover:opacity-75 transition-opacity">
                      {name === 'Airbnb' ? (
                        <img src="/image copy.png" alt="Airbnb" className="w-4 h-4 flex-shrink-0 rounded-full" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-light flex-shrink-0" />
                      )}
                      <span className="font-sans text-sm text-slate-600">{name}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-coral-500/10 border border-coral-400/20 p-5">
                <p className="font-sans text-sm font-semibold text-coral-600 mb-1">Special Offer</p>
                <p className="font-sans text-sm text-slate-600 font-light">Get 1 free pizza &amp; wine with any 2-night booking!</p>
                <p className="font-sans text-sm font-bold text-red-600 mt-1 animate-pulse">OR</p>
                <p className="font-sans text-sm text-slate-600 font-light mt-1">Get a free massage with a 3+ night booking</p>
                <img
                  src="https://res.cloudinary.com/duebfnnel/image/upload/v1779068712/WhatsApp_Image_2026-05-17_at_6.44.06_PM_vhehdq.jpg"
                  alt="Massage offer"
                  loading="lazy"
                  onClick={(e) => {
                    const img = e.currentTarget;
                    img.classList.toggle('w-32');
                    img.classList.toggle('h-32');
                    img.classList.toggle('w-full');
                    img.classList.toggle('h-auto');
                  }}
                  className="w-32 h-32 object-cover rounded cursor-pointer mt-3 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BestForSection propertyName="Casa Margaritas" />
      <BookingCtaSection propertyName="Casa Margaritas" maxGuests={25} onBook={onBook} />
      <PropertyFaqSection slug="casa-margaritas" />
      <InternalLinksSection currentSlug="casa-margaritas" />
      <Footer />

      <StickyMobileCta
        label="Book Casa Margaritas"
        onClick={() => onBook('Casa Margaritas', 25)}
      />

      <PropertyStructuredData
        data={{
          name: 'Casa Margaritas',
          description: '5-bedroom vacation rental in Puerto Peñasco, Mexico with private pool, BBQ grill, and free parking. Sleeps up to 25 guests. Book direct with Rocky Point 4 Rent.',
          url: `${SITE_CONFIG.domain}/casa-margaritas`,
          image: FALLBACK_IMAGES[0],
          bedrooms: 5,
          bathrooms: 2.5,
          maxGuests: 25,
          slug: 'casa-margaritas',
          amenities: ['Air Conditioning', 'High-Speed WiFi', 'Full Kitchen', 'Free Parking', 'Private Pool', 'BBQ Grill'],
        }}
      />
      <PropertyBreadcrumbSchema slug="casa-margaritas" name="Casa Margaritas" />
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`Casa Margaritas Rocky Point rental photo ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <p className="absolute bottom-4 text-white/50 font-sans text-xs tracking-widest">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
