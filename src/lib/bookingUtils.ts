import type { NightlyRate } from './supabase';

export const CLEANING_FEE = 189;
export const PROPERTY_FEE = 85;
export const LINEN_FEE = 75;
export const DEPOSIT_AMOUNT = 200;

const RATES: Record<string, { rate: number; label: string }> = {
  0: { rate: 225, label: 'Sun' },
  1: { rate: 225, label: 'Mon' },
  2: { rate: 225, label: 'Tue' },
  3: { rate: 225, label: 'Wed' },
  4: { rate: 325, label: 'Thu' },
  5: { rate: 350, label: 'Fri' },
  6: { rate: 350, label: 'Sat' },
};

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calcNights(checkIn: string, checkOut: string): number {
  const a = parseLocalDate(checkIn);
  const b = parseLocalDate(checkOut);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export function buildNightlyBreakdown(checkIn: string, checkOut: string): NightlyRate[] {
  const breakdown: NightlyRate[] = [];
  const start = parseLocalDate(checkIn);
  const nights = calcNights(checkIn, checkOut);
  for (let i = 0; i < nights; i++) {
    const night = new Date(start);
    night.setDate(start.getDate() + i);
    const dow = night.getDay().toString();
    const { rate, label } = RATES[dow];
    breakdown.push({
      date: formatDate(night),
      rate,
      label,
    });
  }
  return breakdown;
}

export function calcSubtotal(breakdown: NightlyRate[]): number {
  return breakdown.reduce((sum, n) => sum + n.rate, 0);
}

export function calcTotal(subtotal: number): number {
  return subtotal + CLEANING_FEE + PROPERTY_FEE + LINEN_FEE;
}

export type BookingPricing = {
  nights: number;
  breakdown: NightlyRate[];
  subtotal: number;
  cleaningFee: number;
  propertyFee: number;
  linenFee: number;
  total: number;
  depositAmount: number;
  dueOnArrival: number;
};

export function getBookingPricing(checkIn: string, checkOut: string): BookingPricing | null {
  if (!checkIn || !checkOut) return null;
  const nights = calcNights(checkIn, checkOut);
  if (nights < 2) return null;
  const breakdown = buildNightlyBreakdown(checkIn, checkOut);
  const subtotal = calcSubtotal(breakdown);
  const total = calcTotal(subtotal);
  return {
    nights,
    breakdown,
    subtotal,
    cleaningFee: CLEANING_FEE,
    propertyFee: PROPERTY_FEE,
    linenFee: LINEN_FEE,
    total,
    depositAmount: DEPOSIT_AMOUNT,
    dueOnArrival: total - DEPOSIT_AMOUNT,
  };
}

export function getMinCheckOut(checkIn: string): string {
  if (!checkIn) return '';
  const d = parseLocalDate(checkIn);
  d.setDate(d.getDate() + 2);
  return formatDate(d);
}

export function todayStr(): string {
  return formatDate(new Date());
}
