import { useState, useEffect } from 'react';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  guest_name: string;
  guest_location: string;
  property_name: string;
  rating: number;
  content: string;
}

const fallbackReviews: Review[] = [
  {
    id: '1',
    guest_name: 'Miguel R.',
    guest_location: 'Phoenix, Arizona',
    content: 'Wow experience from the time I booked to check out. I will definitely refer this to anyone looking for a place in Rocky Point. 6 minutes from the beach! Great place.',
    rating: 5,
    property_name: 'Casa Margaritas',
  },
  {
    id: '2',
    guest_name: 'Sarah & David T.',
    guest_location: 'Tucson, Arizona',
    content: 'The house was absolutely stunning and so clean. Tom and Lidia were incredibly responsive and helpful. Our kids had the time of their lives. We will be back every year!',
    rating: 5,
    property_name: 'Casa Tropical Mango',
  },
  {
    id: '3',
    guest_name: 'The Hernandez Family',
    guest_location: 'Scottsdale, Arizona',
    content: 'Perfect location, beautiful home, amazing hosts. Everything we needed was provided and then some. Rocky Point is a gem and Casa Delphine is the perfect base.',
    rating: 5,
    property_name: 'Casa Delphine',
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id, guest_name, guest_location, property_name, rating, content')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setReviews(data && data.length > 0 ? data : fallbackReviews);
        setLoading(false);
      });
  }, []);

  const displayReviews = loading ? fallbackReviews : reviews;

  return (
    <section id="reviews" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
            Guest Experiences
          </p>
          <h2 className="section-heading mb-4">What Our Guests Say</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-md mx-auto font-light leading-relaxed">
            Don't just take our word for it — hear from the families who've made memories here.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-14 p-6 bg-sand-50 border border-sand-100 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center gap-0.5 mb-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-sand-400 text-sand-400" />)}
            </div>
            <div className="font-serif text-3xl font-light text-teal-deep">5.0</div>
            <div className="font-sans text-xs text-slate-400 tracking-wide mt-0.5">Average Rating</div>
          </div>
          <div className="w-px h-16 bg-sand-200" />
          <div className="text-center">
            <div className="font-serif text-3xl font-light text-teal-deep mb-1">100+</div>
            <div className="font-sans text-xs text-slate-400 tracking-wide">Verified Reviews</div>
          </div>
          <div className="w-px h-16 bg-sand-200" />
          <div className="text-center">
            <div className="font-sans text-xs text-slate-500 mb-2 font-light">Also on</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-sans text-xs text-slate-600 font-medium">
                <ExternalLink className="w-3 h-3 text-coral-500" /> Airbnb
              </div>
              <div className="flex items-center gap-1.5 font-sans text-xs text-slate-600 font-medium">
                <ExternalLink className="w-3 h-3 text-teal-mid" /> VRBO
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-sand-50 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review) => (
              <article
                key={review.id}
                className="relative p-8 bg-sand-50 border border-sand-100 hover:border-teal-mid/20 hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <Quote className="w-8 h-8 text-sand-200 mb-4 group-hover:text-teal-mid/20 transition-colors duration-300" />

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-sand-400 text-sand-400" />
                  ))}
                </div>

                <p className="font-sans text-slate-600 leading-relaxed mb-6 font-light text-sm flex-1">
                  "{review.content}"
                </p>

                <div className="border-t border-sand-200 pt-5 flex items-start justify-between">
                  <div>
                    <div className="font-sans font-semibold text-teal-deep text-sm">
                      {review.guest_name}
                    </div>
                    <div className="font-sans text-xs text-slate-400 mt-0.5">
                      {review.guest_location}
                    </div>
                  </div>
                  {review.property_name && (
                    <span className="font-sans text-xs text-teal-mid bg-ocean-50 px-2.5 py-1 border border-ocean-100">
                      {review.property_name}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
