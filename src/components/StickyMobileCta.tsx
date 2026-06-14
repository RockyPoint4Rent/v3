import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

type Props = {
  label?: string;
  onClick: () => void;
};

/**
 * Sticky mobile CTA bar — appears after 400px scroll on screens < lg.
 * On booking/payment pages, do not render this component at all.
 */
export default function StickyMobileCta({ label = 'Check Availability', onClick }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="px-4 pt-6 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)' }}>
        <button
          type="button"
          onClick={onClick}
          className="w-full bg-teal-deep text-white font-sans text-sm font-semibold tracking-wider uppercase py-4 flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-transform duration-100"
        >
          <Search className="w-4 h-4" />
          {label}
        </button>
      </div>
    </div>
  );
}
