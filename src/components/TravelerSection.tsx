export default function TravelerSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
              For Arizona &amp; Texas Travelers
            </p>
            <h2 className="section-heading mb-4">
              Easy Rocky Point Vacation Rentals for Arizona and Texas Travelers
            </h2>
            <div className="w-16 h-px bg-sand-400 mb-8" />

            <p className="font-sans text-slate-600 leading-relaxed mb-5 font-light">
              Rocky Point — officially known as Puerto Peñasco, Sonora, Mexico — sits just
              60 miles from the Arizona border, making it one of the closest beach destinations
              for travelers from <strong className="font-medium text-teal-deep">Phoenix</strong>,{' '}
              <strong className="font-medium text-teal-deep">Tucson</strong>,{' '}
              <strong className="font-medium text-teal-deep">Scottsdale</strong>,{' '}
              <strong className="font-medium text-teal-deep">Mesa</strong>, and{' '}
              <strong className="font-medium text-teal-deep">Chandler</strong>.
            </p>

            <p className="font-sans text-slate-500 leading-relaxed mb-5 font-light">
              It's also a popular weekend getaway for Texas families, with easy access from{' '}
              <strong className="font-medium text-teal-deep">Dallas/Fort Worth</strong>,{' '}
              <strong className="font-medium text-teal-deep">Austin</strong>,{' '}
              <strong className="font-medium text-teal-deep">San Antonio</strong>, and{' '}
              <strong className="font-medium text-teal-deep">Houston</strong>.
              Whether you're planning a quick Arizona beach trip or a longer Texas vacation,
              our Rocky Point vacation rentals are ready when you are.
            </p>

            <p className="font-sans text-slate-500 leading-relaxed font-light mb-6">
              Check availability online and book direct — no platform fees, no hassle.
              Just pick your dates, choose your home, and start packing.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/rocky-point-rentals"
                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
                className="font-sans text-sm font-medium text-teal-deep border border-teal-deep/30 px-4 py-2 hover:bg-teal-deep hover:text-white transition-all duration-200"
              >
                Rocky Point Rentals
              </a>
              <a
                href="/puerto-penasco-vacation-rentals"
                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/puerto-penasco-vacation-rentals'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
                className="font-sans text-sm font-medium text-teal-deep border border-teal-deep/30 px-4 py-2 hover:bg-teal-deep hover:text-white transition-all duration-200"
              >
                Puerto Peñasco Vacation Rentals
              </a>
              <a
                href="/rocky-point-rentals-from-arizona"
                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-arizona'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
                className="font-sans text-sm font-medium text-teal-deep border border-teal-deep/30 px-4 py-2 hover:bg-teal-deep hover:text-white transition-all duration-200"
              >
                From Arizona
              </a>
              <a
                href="/rocky-point-rentals-from-texas"
                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/rocky-point-rentals-from-texas'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0 }); }}
                className="font-sans text-sm font-medium text-teal-deep border border-teal-deep/30 px-4 py-2 hover:bg-teal-deep hover:text-white transition-all duration-200"
              >
                From Texas
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src="https://res.cloudinary.com/duebfnnel/image/upload/v1779067487/WhatsApp_Image_2026-05-17_at_6.22.26_PM_ffq7it.jpg"
                alt="Rocky Point coastline near Puerto Peñasco, Mexico"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative overflow-hidden aspect-[3/4] mt-8">
              <img
                src="https://res.cloudinary.com/duebfnnel/image/upload/v1779067497/WhatsApp_Image_2026-05-17_at_6.21.56_PM_qtz5db.jpg"
                alt="Beach near Puerto Peñasco, Sonora, Mexico"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
