import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const homeFaqs = [
  {
    question: 'Is Rocky Point the same as Puerto Peñasco?',
    answer:
      'Yes. Rocky Point is the common English name for Puerto Peñasco, a city in Sonora, Mexico. Both names refer to the same popular beach destination on the Gulf of California, about 60 miles from the Arizona border.',
  },
  {
    question: 'How do I check availability?',
    answer:
      'Use our online availability search at the top of the page. Enter your check-in and check-out dates, select the number of guests, and you\'ll see which of our three vacation homes are available for your stay.',
  },
  {
    question: 'Are the rentals family-friendly?',
    answer:
      'Absolutely. All three of our Rocky Point vacation rentals are designed with families in mind — private pools, full kitchens, A/C, WiFi, and plenty of space. They\'re perfect for families with children, multi-generational trips, and large group getaways.',
  },
  {
    question: 'Can I book direct?',
    answer:
      'Yes — and we encourage it! Booking direct with Rocky Point 4 Rent means no platform fees, direct communication with your hosts, and a simpler booking process. Just check availability online and submit your reservation.',
  },
  {
    question: 'Is Rocky Point good for Arizona weekend trips?',
    answer:
      'Rocky Point is one of the best weekend beach destinations for Arizona travelers. It\'s about a 3.5-hour drive from Phoenix or Tucson, making it perfect for Friday-to-Sunday getaways. Many of our guests from Scottsdale, Mesa, and Chandler visit regularly.',
  },
  {
    question: 'Do you have rentals for groups?',
    answer:
      'Yes. Our three properties sleep up to 25 guests each and are built for group travel. Whether it\'s a family reunion, friends\' weekend, or corporate retreat, our homes offer private pools, large kitchens, and open living spaces that bring people together.',
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
            Common Questions
          </p>
          <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-lg mx-auto leading-relaxed font-light">
            Quick answers about Rocky Point vacation rentals, booking, and travel.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {homeFaqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`bg-sand-50 border transition-all duration-300 ${
                openIndex === index
                  ? 'border-teal-mid/30 shadow-md'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left group"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                      openIndex === index ? 'text-teal-mid' : 'text-slate-300 group-hover:text-teal-mid/50'
                    }`}
                  />
                  <span
                    className={`font-sans text-sm font-medium transition-colors duration-200 ${
                      openIndex === index ? 'text-teal-deep' : 'text-slate-700 group-hover:text-teal-deep'
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-teal-mid' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-7 pb-6 pt-0">
                  <div className="ml-7 pl-3 border-l-2 border-sand-200">
                    <p className="font-sans text-sm text-slate-500 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
