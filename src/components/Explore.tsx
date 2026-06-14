import { Fish, Waves, Umbrella, Camera, Ship, Mountain } from 'lucide-react';

const activities = [
  { icon: Fish, label: 'Deep Sea Fishing' },
  { icon: Waves, label: 'Whale Watching' },
  { icon: Ship, label: 'Sunset Cruises' },
  { icon: Umbrella, label: 'Beach Activities' },
  { icon: Camera, label: 'Bird Island Tours' },
  { icon: Mountain, label: 'Pinacate Reserve' },
];

export default function Explore() {
  return (
    <section id="explore" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-teal-deep/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-400 mb-4">
            Discover
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
            Explore Rocky Point
          </h2>
          <div className="w-16 h-px bg-sand-400/60 mx-auto mb-6" />
          <p className="font-sans text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Did you know Rocky Point is a hidden gem where the desert dunes meet
            the crystal-blue waters of the Gulf of California? Home to diverse
            marine life, this stunning region has been declared a{' '}
            <strong className="text-sand-300 font-medium">UNESCO World Heritage Site</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.label}
                className="group flex flex-col items-center gap-3 p-5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-sand-400/40 transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-sand-400 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-white/70 group-hover:text-sand-300 transition-colors duration-300" />
                </div>
                <span className="font-sans text-xs text-white/70 text-center tracking-wide group-hover:text-white transition-colors duration-300">
                  {activity.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden">
            <img src="https://res.cloudinary.com/duebfnnel/image/upload/v1779068484/WhatsApp_Image_2026-05-17_at_6.37.18_PM_e1xgne.jpg"
              alt="Pureto Peñasco"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src="https://res.cloudinary.com/duebfnnel/image/upload/v1779068484/WhatsApp_Image_2026-05-17_at_6.38.03_PM_embz8f.jpg"
              alt="Cruises"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="font-sans text-white/60 font-light text-sm">
            Plus: Jet skiing · Paddleboarding · Parasailing · World-class Golf · Vibrant Nightlife
          </p>
        </div>
      </div>
    </section>
  );
}
