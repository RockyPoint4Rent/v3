import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ContactRequestModal from './ContactRequestModal';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

const fallbackFaqs: FaqItem[] = [
  {
    id: '1',
    question: 'How far are the properties from the beach?',
    answer: 'All three of our properties are within 6 minutes of the beach. Rocky Point has a beautiful coastline with multiple beach access points, so you\'re never far from the water.',
    display_order: 1,
  },
  {
    id: '2',
    question: 'What is the booking and payment process?',
    answer: 'We make it simple — just reach out via our contact form or call/text us directly. To secure your dates we only require a $200 deposit, payable via Zelle. The remaining balance is paid upon arrival.',
    display_order: 2,
  },
  {
    id: '3',
    question: 'What is included in the rental?',
    answer: 'All properties come fully equipped with everything you need: full kitchen with appliances, linens and towels, high-speed WiFi, A/C, toiletries, and more. We personally stock and clean each home before your arrival.',
    display_order: 3,
  },
  {
    id: '4',
    question: 'Do you require a minimum stay?',
    answer: 'We typically require a 2-night minimum stay, though this may vary by season. Contact us directly for short-stay requests — we\'ll do our best to accommodate.',
    display_order: 4,
  },
  {
    id: '5',
    question: 'Is Rocky Point safe to visit?',
    answer: 'Rocky Point (Puerto Peñasco) is one of the safest and most popular beach destinations in Mexico for American families and tourists. It sits just 60 miles from the Arizona border and is frequented by hundreds of thousands of visitors each year.',
    display_order: 5,
  },
  {
    id: '6',
    question: 'What is your cancellation policy?',
    answer: 'We understand plans change. Please contact us as early as possible if you need to cancel or reschedule. Deposits are generally non-refundable, but we will always work with you to find a solution, including rescheduling to another date.',
    display_order: 6,
  },
];

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('id, question, answer, display_order')
      .eq('is_published', true)
      .order('display_order')
      .then(({ data }) => {
        setFaqs(data && data.length > 0 ? data : fallbackFaqs);
        setLoading(false);
      });
  }, []);

  const displayFaqs = loading ? fallbackFaqs : faqs;

  return (
    <section id="faq" className="py-24 md:py-32 bg-sand-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-widest uppercase text-sand-600 mb-4">
            Got Questions?
          </p>
          <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
          <div className="divider-line" />
          <p className="font-sans text-slate-500 max-w-lg mx-auto leading-relaxed font-light">
            Everything you need to know about booking with us. Can't find your answer?
            Contact us directly — we respond within a few hours.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white h-16 animate-pulse rounded-none" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`bg-white border transition-all duration-300 ${
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
        )}

        <div className="mt-12 text-center p-8 bg-white border border-slate-100 shadow-sm">
          <p className="font-sans text-sm text-slate-600 mb-4 font-light">
            Still have questions? We'd love to hear from you.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Contact Us Directly
          </button>
        </div>

        {showModal && <ContactRequestModal onClose={() => setShowModal(false)} />}
      </div>
    </section>
  );
}
