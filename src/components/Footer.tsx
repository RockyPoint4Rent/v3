import { Waves, Instagram, Facebook, Phone, Mail, Search } from 'lucide-react';
import { SITE_CONFIG } from '../lib/seoConfig';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isInternal = href.startsWith('/');
  const isAnchor = href.startsWith('#') || href.startsWith('/#');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchor) return; // let browser handle smooth-scroll
    if (isInternal) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const handleCheckAvailability = () => {
    if (window.location.pathname === '/') {
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 pb-10 border-b border-white/10">

          {/* Brand column */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Waves className="w-6 h-6 text-sand-400" />
              <div>
                <div className="font-serif text-lg font-medium text-white">Rocky Point 4 Rent</div>
                <div className="font-sans text-xs tracking-widest uppercase text-white/40">
                  Puerto Peñasco, Mexico
                </div>
              </div>
            </div>
            <p className="font-sans text-sm text-white/50 leading-relaxed font-light max-w-xs mb-4">
              Three vacation rental homes in Rocky Point, Mexico — book direct with your hosts
              Tom &amp; Lidia. No platform fees.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-sand-400 hover:text-sand-400 transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-sand-400 hover:text-sand-400 transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="tel:+14802070114"
                aria-label="Call us"
                className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-sand-400 hover:text-sand-400 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="flex items-center gap-2 bg-teal-deep text-white font-sans text-xs font-semibold tracking-wider uppercase px-5 py-3 hover:bg-teal-mid transition-colors duration-200"
            >
              <Search className="w-3.5 h-3.5" />
              Check Availability
            </button>
          </div>

          {/* Rentals */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-white/40 mb-5">
              Rentals
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li><NavLink href="/rocky-point-rentals">Rocky Point Rentals</NavLink></li>
              <li><NavLink href="/puerto-penasco-vacation-rentals">Puerto Peñasco Vacation Rentals</NavLink></li>
              <li><NavLink href="/rocky-point-rentals-from-arizona">Rentals from Arizona</NavLink></li>
              <li><NavLink href="/rocky-point-rentals-from-texas">Rentals from Texas</NavLink></li>
            </ul>
          </div>

          {/* Vacation Homes */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-white/40 mb-5">
              Vacation Homes
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li><NavLink href="/casa-margaritas">Casa Margaritas</NavLink></li>
              <li><NavLink href="/casa-tropical-mango">Casa Tropical Mango</NavLink></li>
              <li><NavLink href="/casa-delphine">Casa Delphine</NavLink></li>
            </ul>
          </div>

          {/* Booking */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-white/40 mb-5">
              Booking
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-200 text-left"
                >
                  Check Availability
                </button>
              </li>
              <li><NavLink href="/rocky-point-rentals">View Vacation Homes</NavLink></li>
              <li>
                <NavLink href="/#contact">Contact Us</NavLink>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-white/40 mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li><NavLink href="/#about">About</NavLink></li>
              <li><NavLink href="/#faq">FAQ</NavLink></li>
              <li>
                <a
                  href="mailto:reservations@rockypoint4rent.com"
                  className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href="tel:+14802070114"
                  className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  +1 (480) 207-0114
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="font-sans text-sm text-white/20 hover:text-white/50 transition-colors duration-200"
                >
                  Host Login
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/30">
            &copy; {new Date().getFullYear()} Rocky Point 4 Rent. All rights reserved.
          </p>
          <p className="font-sans text-xs text-white/30">
            Puerto Peñasco (Rocky Point), Sonora, Mexico &nbsp;·&nbsp; Hosted by Tom &amp; Lidia
          </p>
        </div>
      </div>
    </footer>
  );
}
