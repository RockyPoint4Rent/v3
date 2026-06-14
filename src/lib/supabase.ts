import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createAdminClient(adminToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { 'x-admin-token': adminToken },
    },
  });
}

export type BookingStatus =
  | 'pending'
  | 'deposit_paid'
  | 'confirmed'
  | 'balance_due'
  | 'fully_paid'
  | 'cancelled';

export type PaymentOption = 'deposit' | 'full';

export type Reservation = {
  id?: string;
  property_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  pet_addon: boolean;
  nights: number;
  nightly_breakdown: NightlyRate[];
  subtotal: number;
  cleaning_fee: number;
  property_fee: number;
  linen_fee: number;
  pet_fee: number;
  total_amount: number;
  deposit_amount: number;
  payment_option: PaymentOption;
  amount_paid: number;
  balance_due: number;
  status?: BookingStatus;
};

export type NightlyRate = {
  date: string;
  rate: number;
  label: string;
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  deposit_paid: 'Deposit Paid',
  confirmed: 'Confirmed',
  balance_due: 'Balance Due',
  fully_paid: 'Fully Paid',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; border: string }> = {
  pending:      { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200' },
  deposit_paid: { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200'  },
  confirmed:    { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200'},
  balance_due:  { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200'},
  fully_paid:   { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200'},
  cancelled:    { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200'   },
};
