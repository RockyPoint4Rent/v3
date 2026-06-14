import { useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Home, DollarSign,
  CalendarX, Star, HelpCircle, LogOut, Waves, Menu, X,
  ChevronRight, FlaskConical, MessageSquare, Mail
} from 'lucide-react';

export type AdminPage =
  | 'dashboard'
  | 'reservations'
  | 'properties'
  | 'rates'
  | 'blackout'
  | 'reviews'
  | 'faqs'
  | 'sms'
  | 'email'
  | 'tests';

const NAV_ITEMS: { page: AdminPage; label: string; icon: React.ElementType; badge?: string }[] = [
  { page: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { page: 'reservations', label: 'Reservations',   icon: CalendarCheck },
  { page: 'properties',   label: 'Properties',     icon: Home },
  { page: 'rates',        label: 'Rates & Fees',   icon: DollarSign },
  { page: 'blackout',     label: 'Blackout Dates', icon: CalendarX },
  { page: 'reviews',      label: 'Reviews',        icon: Star },
  { page: 'faqs',         label: 'FAQs',           icon: HelpCircle },
  { page: 'sms',          label: 'SMS Alerts',     icon: MessageSquare },
  { page: 'email',        label: 'Email Alerts',   icon: Mail },
  { page: 'tests',        label: 'Booking Tests',  icon: FlaskConical },
];

type Props = {
  current: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onSignOut: () => void;
  pendingCount?: number;
  pendingReviews?: number;
  userEmail?: string;
};

export default function AdminSidebar({
  current, onNavigate, onSignOut, pendingCount = 0, pendingReviews = 0, userEmail,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-deep flex items-center justify-center flex-shrink-0">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-serif text-sm text-white font-medium truncate">Rocky Point</div>
            <div className="font-sans text-xs text-slate-500 tracking-wide truncate">Owner Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
          const isActive = current === page;
          const badge = page === 'reservations' ? pendingCount : page === 'reviews' ? pendingReviews : 0;
          return (
            <button
              key={page}
              type="button"
              onClick={() => { onNavigate(page); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 group ${
                isActive
                  ? 'bg-teal-deep/20 text-teal-light border-r-2 border-teal-light'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-light' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-sans text-sm flex-1">{label}</span>
              {badge > 0 && (
                <span className={`font-sans text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center ${isActive ? 'bg-teal-light text-teal-deep' : 'bg-coral-500 text-white'}`}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 text-teal-light opacity-60" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        {userEmail && (
          <div className="px-3 py-2 mb-2">
            <p className="font-sans text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span className="font-sans text-sm">Sign Out</span>
        </button>
        <a
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 mt-0.5"
        >
          <Waves className="w-4 h-4 text-slate-500" />
          <span className="font-sans text-sm">View Public Site</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-900 border border-slate-700 flex items-center justify-center text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-slate-900 h-full shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="hidden lg:flex w-60 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
