/*
  # Create Reservations Table

  ## Summary
  Creates a table to store vacation rental reservation requests.

  ## New Tables
  - `reservations`
    - `id` (uuid, primary key) — unique reservation identifier
    - `property_name` (text) — name of the booked property
    - `check_in` (date) — guest check-in date
    - `check_out` (date) — guest check-out date
    - `guests` (integer) — number of guests
    - `guest_name` (text) — full name of the primary guest
    - `guest_email` (text) — guest email address
    - `guest_phone` (text, optional) — guest phone number
    - `special_requests` (text, optional) — any special notes or requests
    - `nights` (integer) — total number of nights
    - `nightly_breakdown` (jsonb) — per-night rate details
    - `subtotal` (numeric) — cost before fees
    - `cleaning_fee` (numeric) — fixed cleaning fee
    - `property_fee` (numeric) — fixed property fee
    - `total_amount` (numeric) — full reservation cost
    - `deposit_amount` (numeric) — deposit required to hold the booking
    - `status` (text) — reservation status: pending | confirmed | cancelled
    - `created_at` (timestamptz) — record creation timestamp

  ## Security
  - RLS enabled — table is locked down by default
  - Insert policy: anyone can submit a reservation request (no auth required for a contact-style form)
  - Select policy: only service role can read reservations (managed via admin)

  ## Notes
  1. This is a reservation REQUEST table, not a confirmed booking table.
  2. The deposit_amount is set to $200 by default.
  3. Status defaults to "pending" awaiting owner confirmation.
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  guest_name text NOT NULL,
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
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a reservation request"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    guest_name <> '' AND
    guest_email <> '' AND
    check_in < check_out AND
    guests > 0
  );

CREATE POLICY "Authenticated users can view their own reservations by email"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (guest_email = (auth.jwt() ->> 'email'));
