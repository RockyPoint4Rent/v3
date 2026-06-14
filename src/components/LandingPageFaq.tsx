import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '../lib/seoConfig';
import { JsonLd, createCollectionPageSchema, createFAQSchema, createBreadcrumbSchema } from '../lib/schemaHelpers';

type FaqItem = {
  question: string;
  answer: string;
};

export function LandingPageFaq({ faqs, heading = 'Frequently Asked Questions' }: { faqs: FaqItem[]; heading?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h2 className="section-heading mb-4">{heading}</h2>
        <div className="divider-line" />
        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
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

export function LandingPageFaqSchema({ faqs }: { faqs: FaqItem[] }) {
  return <JsonLd schema={createFAQSchema(faqs)} />;
}

/**
 * CollectionPage schema for landing pages that list multiple rental properties.
 * CollectionPage is a subtype of WebPage — more specific and accurate for listing pages.
 */
export function LandingPageSchema({ name, description, url }: { name: string; description: string; url: string }) {
  return <JsonLd schema={createCollectionPageSchema(name, description, url)} />;
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  return <JsonLd schema={createBreadcrumbSchema(items)} />;
}
