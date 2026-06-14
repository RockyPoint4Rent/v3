import { useState } from 'react';
import { Calendar, Users, Search, ChevronDown, Plus, Minus } from 'lucide-react';
import { todayStr, getMinCheckOut } from '../../lib/bookingUtils';
import { analytics } from '../../lib/analytics';

export type SearchParams = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
};

type Props = {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
};

export default function AvailabilitySearch({ onSearch, initialParams }: Props) {
  const [checkIn, setCheckIn] = useState(initialParams?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut ?? '');
  const [adults, setAdults] = useState(initialParams?.adults ?? 2);
  const [children, setChildren] = useState(initialParams?.children ?? 0);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [error, setError] = useState('');

  const totalGuests = adults + children;

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    setError('');
    if (checkOut && checkOut <= val) setCheckOut('');
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }
    setError('');
    analytics.availabilitySearchStarted({ source: 'availability_search' });
    onSearch({ checkIn, checkOut, adults, children });
  };

  return (
    <div className="bg-white shadow-lg border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="px-5 py-4">
          <label className="block font-sans text-xs text-slate-400 uppercase tracking-widest mb-1.5">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-mid pointer-events-none" />
            <input
              type="date"
              value={checkIn}
              min={todayStr()}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full pl-6 pr-2 py-1 font-sans text-sm text-slate-700 focus:outline-none bg-transparent appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="px-5 py-4">
          <label className="block font-sans text-xs text-slate-400 uppercase tracking-widest mb-1.5">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-mid pointer-events-none" />
            <input
              type="date"
              value={checkOut}
              min={checkIn ? getMinCheckOut(checkIn) : todayStr()}
              disabled={!checkIn}
              onChange={(e) => { setCheckOut(e.target.value); setError(''); }}
              className="w-full pl-6 pr-2 py-1 font-sans text-sm text-slate-700 focus:outline-none bg-transparent appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="px-5 py-4 relative min-w-[180px]">
          <label className="block font-sans text-xs text-slate-400 uppercase tracking-widest mb-1.5">
            Guests
          </label>
          <button
            type="button"
            onClick={() => setGuestsOpen(!guestsOpen)}
            className="flex items-center gap-2 w-full focus:outline-none"
          >
            <Users className="w-4 h-4 text-teal-mid flex-shrink-0" />
            <span className="font-sans text-sm text-slate-700">
              {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
              {children > 0 && (
                <span className="text-slate-400 ml-1 text-xs">
                  ({adults} adult{adults !== 1 ? 's' : ''}, {children} child{children !== 1 ? 'ren' : ''})
                </span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform duration-200 ${guestsOpen ? 'rotate-180' : ''}`} />
          </button>

          {guestsOpen && (
            <div className="absolute top-full left-0 right-0 z-30 bg-white border border-slate-200 shadow-xl p-4 mt-1 min-w-[240px]">
              <GuestCounter
                label="Adults"
                sublabel="Ages 13+"
                value={adults}
                min={1}
                max={14}
                onChange={setAdults}
              />
              <div className="border-t border-slate-100 my-3" />
              <GuestCounter
                label="Children"
                sublabel="Ages 2–12"
                value={children}
                min={0}
                max={12}
                onChange={setChildren}
              />
              <button
                type="button"
                onClick={() => setGuestsOpen(false)}
                className="mt-4 w-full bg-teal-deep text-white font-sans text-xs uppercase tracking-widest py-2 hover:bg-teal-mid transition-colors duration-200"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div className="flex items-stretch">
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-2.5 bg-teal-deep hover:bg-teal-mid text-white font-sans text-sm font-medium tracking-wider uppercase px-8 transition-colors duration-300 w-full md:w-auto justify-center py-4 md:py-0"
          >
            <Search className="w-4 h-4" />
            Check Availability
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 bg-red-50 border-t border-red-100">
          <p className="font-sans text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}

function GuestCounter({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-sans text-sm text-slate-700 font-medium">{label}</p>
        <p className="font-sans text-xs text-slate-400">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 flex items-center justify-center border border-slate-300 text-slate-600 hover:border-teal-mid hover:text-teal-deep disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="font-sans text-sm font-medium text-slate-700 w-5 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 flex items-center justify-center border border-slate-300 text-slate-600 hover:border-teal-mid hover:text-teal-deep disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
