import { MessageCircle } from 'lucide-react';
import { analytics } from '../lib/analytics';

type Props = {
  source?: string;
};

/**
 * "Not sure which home is right?" support CTA.
 * Scrolls to the contact form on the homepage or navigates there if not present.
 */
export default function HelpCta({ source = 'help_cta' }: Props) {
  const handleClick = () => {
    analytics.contactClicked({ source });

    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-sand-100 border-t border-sand-200">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <MessageCircle className="w-7 h-7 text-teal-mid mx-auto mb-4" />
        <h3 className="font-serif text-2xl md:text-3xl font-light text-teal-deep mb-3">
          Not sure which Rocky Point rental fits your trip?
        </h3>
        <p className="font-sans text-slate-500 max-w-md mx-auto leading-relaxed font-light mb-6 text-sm">
          Tell us your dates, guest count, and travel plans. We'll help point you toward the best
          Puerto Peñasco vacation rental for your group.
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="btn-outline"
        >
          <MessageCircle className="w-4 h-4" />
          Contact Us for Help
        </button>
      </div>
    </section>
  );
}
