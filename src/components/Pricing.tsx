import { Check, ExternalLink } from 'lucide-react';

const rates = [
  {
    day: 'Fri – Sat',
    rate: '$350',
    label: 'Weekend',
    highlight: true,
  },
  {
    day: 'Sun – Wed',
    rate: '$225',
    label: 'Midweek',
    highlight: false,
  },
  {
    day: 'Thursday',
    rate: '$325',
    label: 'Pre-Weekend',
    highlight: false,
  },
];

const fees = [
  { label: 'Cleaning Fee', amount: '$189' },
  { label: 'Property Fee', amount: '$85' },
];

const platforms = [
  { name: 'Airbnb', color: 'text-coral-500' },
  { name: 'Booking.com', color: 'text-ocean-700' },
  { name: 'VRBO', color: 'text-teal-mid' },
];

const perks = [
  'Only $200 deposit to reserve',
  'Pay the rest upon arrival',
  'Direct booking discount',
  'Flexible check-in times',
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-sand-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
            Transparent Rates
          </p>
          <h2 className="section-heading mb-4">Pricing Overview</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
            Simple, transparent pricing with no hidden surprises. Book directly
            and save, or find us on your preferred platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {rates.map((rate) => (
                <div
                  key={rate.day}
                  className={`relative p-7 text-center transition-all duration-300 ${
                    rate.highlight
                      ? 'bg-teal-deep text-white shadow-xl'
                      : 'bg-white text-teal-deep border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg'
                  }`}
                >
                  {rate.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral-500 text-white font-sans text-xs px-3 py-0.5 tracking-wide uppercase">
                      Peak
                    </span>
                  )}
                  <div className={`font-sans text-xs tracking-widest uppercase mb-2 ${rate.highlight ? 'text-white/60' : 'text-slate-400'}`}>
                    {rate.label}
                  </div>
                  <div className={`font-serif text-4xl font-light mb-1 ${rate.highlight ? 'text-white' : 'text-teal-deep'}`}>
                    {rate.rate}
                  </div>
                  <div className={`font-sans text-xs ${rate.highlight ? 'text-white/60' : 'text-slate-400'}`}>
                    per night · {rate.day}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fees.map((fee) => (
                <div key={fee.label} className="bg-white p-5 border border-slate-100 flex items-center justify-between">
                  <span className="font-sans text-sm text-slate-600">{fee.label}</span>
                  <span className="font-serif text-2xl font-light text-teal-deep">{fee.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-teal-deep/5 border border-teal-mid/20 p-7 flex-1">
              <h3 className="font-serif text-xl text-teal-deep mb-4">
                Easy Booking Options
              </h3>
              <p className="font-sans text-sm text-slate-500 mb-5 font-light leading-relaxed">
                Book directly with us or find our properties on your favorite platform.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {platforms.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 font-sans text-sm font-medium text-slate-700"
                  >
                    <ExternalLink className={`w-4 h-4 ${p.color}`} />
                    {p.name}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-5">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5 mb-2.5">
                    <Check className="w-4 h-4 text-teal-mid flex-shrink-0" />
                    <span className="font-sans text-sm text-slate-600 font-light">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-coral-500 p-6 text-white text-center">
              <div className="font-serif text-3xl font-light mb-1">$200</div>
              <div className="font-sans text-xs tracking-wide uppercase text-white/80 mb-3">
                Deposit to Reserve
              </div>
              <div className="font-sans text-xs text-white/70 font-light">
                Pay the remainder when you arrive
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="#contact" className="btn-primary">
            Check Availability
          </a>
        </div>
      </div>
    </section>
  );
}
