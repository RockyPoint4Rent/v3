import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type BookedRange = { start_date: string; end_date: string };

type Props = {
  propertyName: string;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minNights?: number;
};

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date) {
  return a < b && !isSameDay(a, b);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DateRangePicker({
  propertyName,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  minNights = 2,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch booked ranges whenever property changes
  useEffect(() => {
    if (!propertyName) return;
    supabase
      .rpc('get_property_booked_ranges', { p_property_name: propertyName })
      .then(({ data }) => {
        if (data) setBookedRanges(data as BookedRange[]);
      });
  }, [propertyName]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function isBooked(d: Date): boolean {
    const ds = formatDate(d);
    return bookedRanges.some((r) => ds >= r.start_date && ds < r.end_date);
  }

  // A check-in candidate is blocked if it's booked, or if selecting it would
  // force a check-out that crosses a booked range (no clean window exists).
  function isCheckInBlocked(d: Date): boolean {
    if (isBeforeDay(d, today)) return true;
    if (isBooked(d)) return true;
    // Must have at least minNights before the next booked block
    for (let i = 1; i <= minNights; i++) {
      if (isBooked(addDays(d, i))) return true;
    }
    return false;
  }

  function isCheckOutBlocked(d: Date, from: Date): boolean {
    if (isBeforeDay(d, addDays(from, minNights))) return true;
    // Cannot check out on or after a booked start that falls after check-in
    for (const r of bookedRanges) {
      const rStart = parseDate(r.start_date);
      if (rStart > from && isBeforeDay(rStart, d)) return true;
    }
    if (isBooked(d)) return true;
    return false;
  }

  function isInRange(d: Date): boolean {
    if (!checkIn) return false;
    const ci = parseDate(checkIn);
    const end = checkOut ? parseDate(checkOut) : hoverDate;
    if (!end) return false;
    return d > ci && d < end;
  }

  function isCheckInDay(d: Date) {
    return checkIn && isSameDay(d, parseDate(checkIn));
  }

  function isCheckOutDay(d: Date) {
    return checkOut && isSameDay(d, parseDate(checkOut));
  }

  function handleDayClick(d: Date) {
    if (selecting === 'checkIn') {
      if (isCheckInBlocked(d)) return;
      onCheckInChange(formatDate(d));
      onCheckOutChange('');
      setSelecting('checkOut');
    } else {
      const ci = checkIn ? parseDate(checkIn) : null;
      if (!ci || isCheckOutBlocked(d, ci)) return;
      onCheckOutChange(formatDate(d));
      setSelecting('checkIn');
      setShowCalendar(false);
    }
  }

  function openForCheckIn() {
    setSelecting('checkIn');
    if (checkIn) {
      const d = parseDate(checkIn);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    setShowCalendar(true);
  }

  function openForCheckOut() {
    if (!checkIn) return;
    setSelecting('checkOut');
    const d = parseDate(checkIn);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setShowCalendar(true);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  }

  function buildCalendarDays(year: number, month: number): (Date | null)[] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  }

  function getDayClasses(d: Date): string {
    const base = 'flex items-center justify-center h-7 text-[11px] font-sans select-none transition-colors duration-100 cursor-pointer ';

    const blocked = selecting === 'checkIn'
      ? isCheckInBlocked(d)
      : (checkIn ? isCheckOutBlocked(d, parseDate(checkIn)) : true);

    if (blocked) {
      if (isBooked(d)) {
        return base + 'line-through text-slate-300 bg-red-50 cursor-not-allowed';
      }
      return base + 'text-slate-300 cursor-not-allowed';
    }

    const isCI = isCheckInDay(d);
    const isCO = isCheckOutDay(d);
    const inRange = isInRange(d);

    if (isCI || isCO) {
      return base + 'bg-teal-deep text-white font-semibold rounded-full cursor-pointer';
    }
    if (inRange) {
      return base + 'bg-teal-mid/20 text-teal-deep cursor-pointer hover:bg-teal-mid/30';
    }
    return base + 'text-slate-700 hover:bg-sand-100 cursor-pointer rounded-full';
  }

  const calendarDays = buildCalendarDays(viewYear, viewMonth);
  const isCurrentMonthPast = viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  return (
    <div ref={containerRef} className="relative">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">
            Check-in
          </label>
          <button
            type="button"
            onClick={openForCheckIn}
            className={`w-full flex items-center gap-2 pl-3 pr-2 py-2.5 border text-sm text-left focus:outline-none transition-colors duration-150 ${
              showCalendar && selecting === 'checkIn'
                ? 'border-teal-mid bg-white'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            } ${!checkIn ? 'text-slate-400' : 'text-slate-700'}`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{checkIn || 'Select date'}</span>
          </button>
        </div>
        <div>
          <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">
            Check-out
          </label>
          <button
            type="button"
            onClick={openForCheckOut}
            disabled={!checkIn}
            className={`w-full flex items-center gap-2 pl-3 pr-2 py-2.5 border text-sm text-left focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
              showCalendar && selecting === 'checkOut'
                ? 'border-teal-mid bg-white'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            } ${!checkOut ? 'text-slate-400' : 'text-slate-700'}`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{checkOut || 'Select date'}</span>
          </button>
        </div>
      </div>

      {/* Calendar dropdown */}
      {showCalendar && (
        <div className={`absolute top-full mt-1.5 z-50 bg-white border border-slate-200 shadow-xl p-3 w-72 ${selecting === 'checkOut' ? 'right-0' : 'left-0'}`}>
          <p className="font-sans text-xs text-teal-deep font-medium mb-2 uppercase tracking-wide">
            {selecting === 'checkIn' ? 'Select check-in' : 'Select check-out'}
          </p>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isCurrentMonthPast}
              className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <span className="font-sans text-xs font-semibold text-slate-700">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-slate-100 rounded transition-colors duration-150"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-0.5">
            {DAY_LABELS.map((l) => (
              <div key={l} className="flex items-center justify-center h-5 font-sans text-[10px] text-slate-400 font-medium">
                {l}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} className="h-7" />;
              return (
                <div
                  key={formatDate(d)}
                  className={getDayClasses(d)}
                  onClick={() => handleDayClick(d)}
                  onMouseEnter={() => setHoverDate(d)}
                  onMouseLeave={() => setHoverDate(null)}
                  title={isBooked(d) ? 'Already booked' : undefined}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-red-50 border border-red-200 rounded-sm" />
              <span className="font-sans text-[10px] text-slate-400">Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-teal-deep rounded-full" />
              <span className="font-sans text-[10px] text-slate-400">Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-teal-mid/20 rounded-sm" />
              <span className="font-sans text-[10px] text-slate-400">Your stay</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
