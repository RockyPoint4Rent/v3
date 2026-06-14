import { useState, useEffect, useRef } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import { getBookingPricing } from '../../lib/bookingUtils';
import PricingSummary from './PricingSummary';
import DateRangePicker from './DateRangePicker';
import { supabase } from '../../lib/supabase';

type Props = {
  propertyName: string;
  maxGuests: number;
  onBook: (checkIn: string, checkOut: string, guests: number) => void;
};

export default function BookingWidget({ propertyName, maxGuests, onBook }: Props) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pricing = getBookingPricing(checkIn, checkOut);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    setAvailability('idle');
    if (checkOut && checkOut <= val) setCheckOut('');
  };

  const handleCheckOutChange = (val: string) => {
    setCheckOut(val);
    setAvailability('idle');
  };

  // Check availability whenever both dates are set
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailability('idle');
      return;
    }
    setAvailability('checking');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase.rpc('check_property_availability', {
        p_check_in: checkIn,
        p_check_out: checkOut,
      });
      const row = (data ?? []).find(
        (r: { property_name: string; is_booked: boolean }) => r.property_name === propertyName
      );
      setAvailability(row?.is_booked ? 'unavailable' : 'available');
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [checkIn, checkOut, propertyName]);

  const handleSubmit = () => {
    if (!checkIn || !checkOut || !pricing || availability !== 'available') return;
    onBook(checkIn, checkOut, guests);
  };

  const canBook = !!pricing && availability === 'available';

  return (
    <div className="bg-white border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-teal-deep px-5 py-4">
        <p className="font-sans text-xs tracking-widest uppercase text-white/60 mb-1">
          Book Direct &amp; Save
        </p>
        <p className="font-serif text-lg text-white font-light">{propertyName}</p>
        <p className="font-sans text-xs text-white/50 mt-0.5">
          From $225 / night
        </p>
      </div>

      <div className="p-5 space-y-3">
        <DateRangePicker
          propertyName={propertyName}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={handleCheckInChange}
          onCheckOutChange={handleCheckOutChange}
          minNights={2}
        />

        {/* Availability feedback */}
        {availability === 'checking' && (
          <div className="flex items-center gap-2 py-1">
            <div className="w-3.5 h-3.5 border-2 border-teal-deep border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span className="font-sans text-xs text-slate-400">Checking availability…</span>
          </div>
        )}
        {availability === 'unavailable' && (
          <div className="bg-red-50 border border-red-200 px-3 py-2.5">
            <p className="font-sans text-xs font-medium text-red-700">Not available for these dates</p>
            <p className="font-sans text-xs text-red-500 mt-0.5">Please choose different dates.</p>
          </div>
        )}
        {availability === 'available' && (
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-2">
            <p className="font-sans text-xs font-medium text-emerald-700">Available for these dates</p>
          </div>
        )}

        <div className="relative">
          <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">
            Guests
          </label>
          <button
            type="button"
            onClick={() => setShowGuests(!showGuests)}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:border-teal-mid"
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showGuests ? 'rotate-180' : ''}`} />
          </button>

          {showGuests && (
            <div className="absolute z-20 top-full left-0 right-0 bg-white border border-slate-200 border-t-0 shadow-lg">
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setGuests(n); setShowGuests(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-sand-50 transition-colors duration-150 ${n === guests ? 'text-teal-deep font-medium bg-sand-50' : 'text-slate-600'}`}
                >
                  {n} Guest{n > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {canBook && (
          <div className="border-t border-slate-100 pt-4">
            <PricingSummary pricing={pricing} />
          </div>
        )}

        <button
          type="button"
          disabled={!canBook}
          onClick={handleSubmit}
          className="w-full py-3.5 bg-teal-deep text-white font-sans text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:bg-teal-mid disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {availability === 'checking' ? 'Checking…' : availability === 'unavailable' ? 'Not Available' : canBook ? 'Reserve Now' : 'Select Dates'}
        </button>

        {canBook && (
          <p className="text-center text-xs text-slate-400 font-light">
            Only $200 deposit required to confirm
          </p>
        )}
      </div>
    </div>
  );
}
