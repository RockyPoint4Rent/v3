import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

/**
 * Visible breadcrumb bar — placed just below the hero on landing and property pages.
 * Matches the BreadcrumbList JSON-LD schema where present.
 */
export default function PageBreadcrumb({ items }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white border-b border-slate-100 py-3"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ol className="flex items-center flex-wrap gap-1.5 font-sans text-xs text-slate-500">
          <li className="flex items-center gap-1.5">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="flex items-center gap-1 hover:text-teal-deep transition-colors duration-150"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              {item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); navigate(item.href!); }}
                  className="hover:text-teal-deep transition-colors duration-150"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-teal-deep font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
