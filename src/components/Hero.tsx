import { ChevronDown, MapPin, Shield, Users, Search } from 'lucide-react';

type Props = {
  onSearch: () => void;
};

export default function Hero({ onSearch }: Props) {
  return (
    <section id="search" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-deep/70 via-teal-deep/50 to-teal-deep/80" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="w-4 h-4 text-sand-300" />
          <span className="font-sans text-sm tracking-widest uppercase text-sand-300">
            Puerto Peñasco, Mexico
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-3">
          Rocky Point 4 Rent
        </h1>

        <p className="font-sans text-lg sm:text-xl text-sand-300 font-light mb-5 tracking-wide">
          Rocky Point Vacation Rentals · Puerto Peñasco, Mexico
        </p>

        <div className="w-20 h-px bg-sand-400/60 mx-auto mb-6" />

        <p className="font-sans text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Book direct vacation homes in Rocky Point — also known as Puerto Peñasco — for
          Arizona and Texas beach getaways. Family-friendly stays, group-ready homes,
          and online availability with direct booking.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            type="button"
            onClick={onSearch}
            className="btn-primary bg-white !text-teal-deep hover:!bg-sand-100 hover:!shadow-xl"
          >
            <Search className="w-4 h-4" />
            Check Availability
          </button>
          <a href="#properties" className="btn-outline border-white text-white hover:bg-white hover:!text-teal-deep">
            View Vacation Homes
          </a>
        </div>

        <p className="font-sans text-xs text-white/60 tracking-wide max-w-md mx-auto leading-relaxed">
          Book direct. Easy availability search. Perfect for Phoenix, Tucson, and Texas travelers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sand-400" />
            <span className="font-sans text-xs text-white/70 tracking-wide">Book Direct</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sand-400" />
            <span className="font-sans text-xs text-white/70 tracking-wide">Family-Friendly Homes</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-sand-400" />
            <span className="font-sans text-xs text-white/70 tracking-wide">Online Availability</span>
          </div>
        </div>
      </div>

      <a
        href="#properties"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors duration-300 animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </a>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand-50 to-transparent" />
    </section>
  );
}
