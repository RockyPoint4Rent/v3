import { useState, useEffect } from 'react';
import { Menu, X, Waves, ChevronDown, Search } from 'lucide-react';
import ContactRequestModal from './ContactRequestModal';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

type NavDropdownItem = { label: string; href: string };

const rentalsDropdown: NavDropdownItem[] = [
  { label: 'All Rocky Point Rentals', href: '/rocky-point-rentals' },
  { label: 'Puerto Peñasco Vacation Rentals', href: '/puerto-penasco-vacation-rentals' },
  { label: 'Rentals from Arizona', href: '/rocky-point-rentals-from-arizona' },
  { label: 'Rentals from Texas', href: '/rocky-point-rentals-from-texas' },
];

const propertiesDropdown: NavDropdownItem[] = [
  { label: 'Casa Margaritas', href: '/casa-margaritas' },
  { label: 'Casa Tropical Mango', href: '/casa-tropical-mango' },
  { label: 'Casa Delphine', href: '/casa-delphine' },
];

function DropdownMenu({
  label,
  items,
  isSolid,
}: {
  label: string;
  items: NavDropdownItem[];
  isSolid: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`nav-link flex items-center gap-1 ${
          isSolid ? 'text-slate-700 hover:text-teal-deep' : 'text-white/90 hover:text-white'
        }`}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-xl border border-slate-100 py-2 min-w-[240px] z-50">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 font-sans text-sm text-slate-700 hover:text-teal-deep hover:bg-sand-50 transition-colors duration-150"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
                setOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobileRentalsOpen, setMobileRentalsOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isSolid = solid || scrolled;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleCheckAvailability = () => {
    setMenuOpen(false);
    const path = window.location.pathname;
    if (path === '/') {
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isSolid ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group"
            >
              <Waves
                className={`w-7 h-7 transition-colors duration-300 ${
                  isSolid ? 'text-teal-deep' : 'text-white'
                }`}
              />
              <div className="leading-tight">
                <div
                  className={`font-serif text-lg font-medium tracking-wide transition-colors duration-300 ${
                    isSolid ? 'text-teal-deep' : 'text-white'
                  }`}
                >
                  Rocky Point 4 Rent
                </div>
                <div
                  className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 ${
                    isSolid ? 'text-sand-600' : 'text-white/80'
                  }`}
                >
                  Puerto Peñasco, Mexico
                </div>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className={`nav-link ${isSolid ? 'text-slate-700 hover:text-teal-deep' : 'text-white/90 hover:text-white'}`}
              >
                Home
              </a>

              <DropdownMenu label="Rentals" items={rentalsDropdown} isSolid={isSolid} />
              <DropdownMenu label="Properties" items={propertiesDropdown} isSolid={isSolid} />

              <a
                href="/#faq"
                className={`nav-link ${isSolid ? 'text-slate-700 hover:text-teal-deep' : 'text-white/90 hover:text-white'}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  } else {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                FAQ
              </a>

              <button
                type="button"
                onClick={() => { setMenuOpen(false); setShowModal(true); }}
                className={`nav-link ${isSolid ? 'text-slate-700 hover:text-teal-deep' : 'text-white/90 hover:text-white'}`}
              >
                Contact
              </button>

              <button
                type="button"
                onClick={handleCheckAvailability}
                className={`nav-link flex items-center gap-1.5 px-5 py-2.5 border font-semibold transition-all duration-300 ${
                  isSolid
                    ? 'border-teal-deep text-teal-deep bg-teal-deep/5 hover:bg-teal-deep hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-teal-deep'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Check Availability
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              className={`lg:hidden transition-colors duration-300 ${isSolid ? 'text-teal-deep' : 'text-white'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="px-6 py-5 flex flex-col gap-1">
              <a
                href="/"
                className="nav-link text-slate-700 hover:text-teal-deep py-2.5 block"
                onClick={(e) => { e.preventDefault(); navigate('/'); setMenuOpen(false); }}
              >
                Home
              </a>

              {/* Rentals accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileRentalsOpen(!mobileRentalsOpen)}
                  className="w-full flex items-center justify-between nav-link text-slate-700 hover:text-teal-deep py-2.5"
                >
                  <span>Rentals</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileRentalsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileRentalsOpen && (
                  <div className="pl-4 flex flex-col gap-1 pb-2">
                    {rentalsDropdown.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="font-sans text-sm text-slate-500 hover:text-teal-deep py-2 block"
                        onClick={(e) => { e.preventDefault(); navigate(item.href); setMenuOpen(false); }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Properties accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobilePropertiesOpen(!mobilePropertiesOpen)}
                  className="w-full flex items-center justify-between nav-link text-slate-700 hover:text-teal-deep py-2.5"
                >
                  <span>Properties</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePropertiesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobilePropertiesOpen && (
                  <div className="pl-4 flex flex-col gap-1 pb-2">
                    {propertiesDropdown.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="font-sans text-sm text-slate-500 hover:text-teal-deep py-2 block"
                        onClick={(e) => { e.preventDefault(); navigate(item.href); setMenuOpen(false); }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/#faq"
                className="nav-link text-slate-700 hover:text-teal-deep py-2.5 block"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  } else {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                FAQ
              </a>

              <button
                type="button"
                className="nav-link text-slate-700 hover:text-teal-deep py-2.5 text-left"
                onClick={() => { setMenuOpen(false); setShowModal(true); }}
              >
                Contact
              </button>

              <button
                type="button"
                onClick={handleCheckAvailability}
                className="btn-primary text-center justify-center mt-3"
              >
                <Search className="w-4 h-4" />
                Check Availability
              </button>
            </div>
          </div>
        )}
      </nav>

      {showModal && <ContactRequestModal onClose={() => setShowModal(false)} />}
    </>
  );
}
