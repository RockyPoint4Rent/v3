/*
  # Add Payment Fields to Reservations

  ## Summary
  Extends the reservations table to support a deposit-first or pay-in-full payment model,
  and introduces explicit booking status tracking.

  ## Changes to `reservations`
  - `payment_option` (text) — either 'deposit' or 'full' — records which payment plan the guest chose
  - `amount_paid` (numeric) — how much has been paid so far (0, deposit, or full)
  - `balance_due` (numeric) — remaining balance owed (total - amount_paid)
  - `status` is now one of: pending | deposit_paid | confirmed | balance_due | fully_paid | cancelled

  ## Status Lifecycle
  1. pending       → reservation submitted, payment instructions shown, awaiting Zelle transfer
  2. deposit_paid  → guest confirms $200 Zelle deposit sent; owner verifies
  3. confirmed     → owner has confirmed the reservation
  4. balance_due   → stay completed, balance still outstanding (for deposit path)
  5. fully_paid    → entire amount received
  6. cancelled     → reservation was cancelled

  ## Notes
  - `amount_paid` defaults to 0 at insert time
  - `balance_due` defaults to `total_amount` and is updated when payments are recorded
  - Both columns are kept in sync by the application layer on status transitions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'payment_option'
  ) THEN
    ALTER TABLE reservations ADD COLUMN payment_option text NOT NULL DEFAULT 'deposit';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'amount_paid'
  ) THEN
    ALTER TABLE reservations ADD COLUMN amount_paid numeric(10, 2) NOT NULL DEFAULT 0.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'balance_due'
  ) THEN
    ALTER TABLE reservations ADD COLUMN balance_due numeric(10, 2) NOT NULL DEFAULT 0.00;
  END IF;
END $$;
