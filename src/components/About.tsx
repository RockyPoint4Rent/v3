import { Heart, Home, Star, CheckCircle } from 'lucide-react';

const values = [
  {
    icon: Home,
    title: 'Thoughtfully Designed',
    description:
      'Every home is styled and equipped to feel like a luxury escape — not just a rental.',
  },
  {
    icon: Heart,
    title: 'Family-Focused',
    description:
      'As foster parents ourselves, we understand what families truly need to feel at home.',
  },
  {
    icon: Star,
    title: 'Local Expertise',
    description:
      'We live in Rocky Point and know every hidden gem — from the best seafood to secret beaches.',
  },
];

const stats = [
  { value: '100+', label: 'Families Hosted' },
  { value: '5★', label: 'Average Rating' },
  { value: '3', label: 'Unique Properties' },
  { value: '10+', label: 'Years Experience' },
];

const highlights = [
  'Personally clean and stock every property before your arrival',
  'Available 24/7 during your stay for any questions',
  'Provide insider guides and local recommendations',
  'Accept Zelle — only $200 deposit to secure your dates',
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden aspect-[3/4] mt-8">
                <img
                  src="https://res.cloudinary.com/duebfnnel/image/upload/v1779067487/WhatsApp_Image_2026-05-17_at_6.22.26_PM_ffq7it.jpg"
                  alt="Rocky Point coastal view"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src="https://res.cloudinary.com/duebfnnel/image/upload/v1779067497/WhatsApp_Image_2026-05-17_at_6.21.56_PM_qtz5db.jpg"
                  alt="Beautiful beach in Rocky Point"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] bg-teal-deep shadow-2xl p-5 z-20">
              <div className="grid grid-cols-4 divide-x divide-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center px-3">
                    <div className="font-serif text-2xl font-light text-white">{stat.value}</div>
                    <div className="font-sans text-xs text-white/50 tracking-wide mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-24 h-24 border border-sand-300 -z-10" />
            <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-sand-100 -z-10" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
              Your Hosts
            </p>
            <h2 className="section-heading mb-4">
              Meet Tom &amp; Lidia
            </h2>
            <div className="w-16 h-px bg-sand-400 mb-8" />

            <p className="font-sans text-slate-600 leading-relaxed mb-5 font-light text-lg">
              Hi! We're Tom and Lidia — foster parents, home designers, and passionate
              hosts in the heart of Rocky Point, Mexico.
            </p>

            <p className="font-sans text-slate-500 leading-relaxed mb-8 font-light">
              We fell in love with Rocky Point years ago and knew we had to share it.
              Our properties are crafted to feel like a true home away from home —
              beautiful, spotless, and stocked with everything you need for the
              perfect getaway. We're not a faceless rental company; we're your
              neighbors, and we treat every guest like family.
            </p>

            <ul className="flex flex-col gap-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-teal-mid flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-slate-600 font-light">{item}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="group p-5 bg-sand-50 border border-sand-100 hover:border-teal-mid/30 hover:shadow-md transition-all duration-300">
                    <div className="w-9 h-9 bg-white flex items-center justify-center mb-3 shadow-sm group-hover:bg-teal-deep transition-colors duration-300">
                      <Icon className="w-4 h-4 text-teal-deep group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h4 className="font-sans text-sm font-semibold text-teal-deep mb-1.5">
                      {value.title}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
