/*
  # Create Reservations Table
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  guest_name text NOT NULL DEFAULT '',
  guest_email text NOT NULL,
  guest_phone text DEFAULT '',
  special_requests text DEFAULT '',
  nights integer NOT NULL,
  nightly_breakdown jsonb DEFAULT '[]'::jsonb,
  subtotal numeric(10, 2) NOT NULL,
  cleaning_fee numeric(10, 2) NOT NULL DEFAULT 189.00,
  property_fee numeric(10, 2) NOT NULL DEFAULT 85.00,
  total_amount numeric(10, 2) NOT NULL,
  deposit_amount numeric(10, 2) NOT NULL DEFAULT 200.00,
  payment_option text NOT NULL DEFAULT 'deposit',
  amount_paid numeric(10, 2) NOT NULL DEFAULT 0.00,
  balance_due numeric(10, 2) NOT NULL DEFAULT 0.00,
  guest_first_name text NOT NULL DEFAULT '',
  guest_last_name text NOT NULL DEFAULT '',
  pet_addon boolean NOT NULL DEFAULT false,
  pet_fee integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
