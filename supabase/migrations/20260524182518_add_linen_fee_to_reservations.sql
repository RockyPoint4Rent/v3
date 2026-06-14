/*
  # Add linen_fee column to reservations

  Adds a linen_fee column to store the per-booking linen fee ($75).
  Defaults to 75 for all new reservations; existing rows default to 0
  to avoid retroactively changing historical totals.
*/

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS linen_fee numeric NOT NULL DEFAULT 0;
