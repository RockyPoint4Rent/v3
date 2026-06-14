import { MessageSquare, Eye, Headphones, Heart, XCircle } from 'lucide-react';

const benefits = [
  {
    icon: XCircle,
    title: 'Avoid Unnecessary Platform Headaches',
    description: 'Skip the middleman fees, confusing policies, and impersonal booking processes.',
  },
  {
    icon: MessageSquare,
    title: 'Communicate Directly',
    description: 'Talk straight to your hosts — Tom and Lidia — for quick, clear answers about your stay.',
  },
  {
    icon: Eye,
    title: 'Clear Property Details',
    description: 'See exactly what you\'re booking with real photos, honest descriptions, and verified amenities.',
  },
  {
    icon: Headphones,
    title: 'Faster Booking Support',
    description: 'No hold queues or ticket systems. Reach us directly by phone, text, or email.',
  },
  {
    icon: Heart,
    title: 'Better Experience for Families & Groups',
    description: 'We know what large groups need — from extra linens to local tips — and we deliver it personally.',
  },
];

export default function BookDirect() {
  return (
    <section className="py-24 md:py-32 bg-sand-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
            Book Direct Benefits
          </p>
          <h2 className="section-heading mb-4">
            Why Book Direct With Rocky Point 4 Rent?
          </h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-xl mx-auto leading-relaxed font-light">
            Booking direct means a simpler, more personal experience — and better support before, during,
            and after your stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white p-8 border border-slate-100 hover:border-teal-mid/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-ocean-50 flex items-center justify-center mb-5 group-hover:bg-teal-deep transition-colors duration-300">
                  <Icon className="w-5 h-5 text-teal-mid group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-sans text-base font-semibold text-teal-deep mb-2">
                  {benefit.title}
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center p-8 bg-teal-deep">
          <p className="font-sans text-white/80 text-sm font-light mb-1">
            Only a <strong className="text-sand-300 font-medium">$200 deposit</strong> to confirm your reservation.
            Pay the remainder when you arrive.
          </p>
        </div>
      </div>
    </section>
  );
}
