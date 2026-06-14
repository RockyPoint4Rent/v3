/*
  # Fix reservations INSERT policy and guest_name sync

  ## Problem
  The INSERT RLS policy checks `guest_name <> ''`, but the app now submits
  `guest_first_name` and `guest_last_name` instead. Since `guest_name` is never
  set by the form it defaults to '' and every reservation insert is rejected.

  ## Changes

  1. **RLS INSERT policy** — replace `guest_name <> ''` with a check on the new
     name fields (`guest_first_name <> '' AND guest_last_name <> ''`).

  2. **Trigger** — add a BEFORE INSERT trigger that auto-populates the legacy
     `guest_name` column from `guest_first_name || ' ' || guest_last_name` so
     existing admin queries that read `guest_name` continue to work.

  ## Security
  - Anonymous and authenticated users can still insert reservation requests
  - All other policies remain unchanged
*/

-- 1. Fix the INSERT policy to check the new name fields
DROP POLICY IF EXISTS "Anyone can insert a reservation request" ON public.reservations;

CREATE POLICY "Anyone can insert a reservation request"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    guest_first_name <> '' AND
    guest_last_name <> '' AND
    guest_email <> '' AND
    check_in < check_out AND
    guests > 0
  );

-- 2. Trigger to keep legacy guest_name in sync
CREATE OR REPLACE FUNCTION public.sync_guest_name()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.guest_name IS NULL OR NEW.guest_name = '' THEN
    NEW.guest_name := trim(NEW.guest_first_name || ' ' || NEW.guest_last_name);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_guest_name ON public.reservations;

CREATE TRIGGER trg_sync_guest_name
  BEFORE INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_guest_name();
