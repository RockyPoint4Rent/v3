import { Shield, Users, Search, MapPin } from 'lucide-react';

const trustPoints = [
  { icon: Shield, label: 'Book Direct' },
  { icon: Users, label: 'Family-Friendly Homes' },
  { icon: Search, label: 'Online Availability' },
  { icon: MapPin, label: 'Arizona & Texas Beach Getaways' },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.label}
                className="flex flex-col items-center gap-2.5 py-8 md:py-10 border-r border-slate-100 last:border-r-0"
              >
                <div className="w-10 h-10 bg-ocean-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-mid" />
                </div>
                <span className="font-sans text-sm font-medium text-teal-deep tracking-wide text-center">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
