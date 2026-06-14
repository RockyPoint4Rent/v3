/*
  # Update reservations table: split name fields, add pet add-on

  1. Changes
    - Add `guest_first_name` (text) — replaces combined guest_name
    - Add `guest_last_name` (text)
    - Add `pet_addon` (boolean, default false) — whether pet add-on was selected
    - Add `pet_fee` (integer, default 0) — pet add-on fee amount
    - Keep `guest_name` column intact for backwards compatibility with existing rows

  2. Notes
    - All new columns are nullable / have defaults to avoid breaking existing data
    - special_requests column is left in place (existing data preserved)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'guest_first_name'
  ) THEN
    ALTER TABLE reservations ADD COLUMN guest_first_name text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'guest_last_name'
  ) THEN
    ALTER TABLE reservations ADD COLUMN guest_last_name text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'pet_addon'
  ) THEN
    ALTER TABLE reservations ADD COLUMN pet_addon boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'pet_fee'
  ) THEN
    ALTER TABLE reservations ADD COLUMN pet_fee integer NOT NULL DEFAULT 0;
  END IF;
END $$;
