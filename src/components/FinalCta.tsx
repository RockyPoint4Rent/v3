import { Search } from 'lucide-react';

type Props = {
  onSearch: () => void;
};

export default function FinalCta({ onSearch }: Props) {
  return (
    <section className="py-24 md:py-32 bg-teal-deep relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
          Ready to Book Your Rocky Point Getaway?
        </h2>
        <div className="w-16 h-px bg-sand-400/60 mx-auto mb-8" />
        <p className="font-sans text-white/70 max-w-lg mx-auto leading-relaxed font-light mb-10">
          Check availability for your dates and book direct — no platform fees, no hassle.
          Just pick your home and start planning your Puerto Peñasco vacation.
        </p>
        <button
          type="button"
          onClick={onSearch}
          className="btn-primary bg-white !text-teal-deep hover:!bg-sand-100 hover:!shadow-xl text-base"
        >
          <Search className="w-5 h-5" />
          Check Availability
        </button>
      </div>
    </section>
  );
}
