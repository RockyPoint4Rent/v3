/*
  # Prevent duplicate bookings and fix availability check for anon users

  ## Problem
  1. The `reservations` table has no uniqueness constraint, so multiple reservations
     can be inserted for the same property and overlapping dates.
  2. The `checkAvailability` client query runs as the `anon` role which has no
     SELECT policy on `reservations`, so it always returns empty — every property
     always appears available.

  ## Changes

  ### 1. btree_gist extension
  Required for the date range exclusion constraint.

  ### 2. Exclusion constraint on `reservations`
  Prevents any two non-cancelled reservations for the same property from having
  overlapping date ranges. Uses a `daterange` exclusion with && (overlaps) operator.
  Cancelled reservations are excluded via the WHERE predicate.

  ### 3. `public.check_property_availability(date, date)` function
  A SECURITY DEFINER function (runs as postgres) that returns which properties
  are booked for a given date range. This lets the anon role call it via RPC
  without needing a SELECT policy on `reservations` directly.

  ## Security
  - Function uses fixed search_path = '' to prevent injection
  - EXECUTE granted to anon and authenticated for RPC access
*/

-- Required for the exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Exclusion constraint: no two active reservations for same property can overlap
ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS reservations_no_overlap;

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_no_overlap
  EXCLUDE USING gist (
    property_name WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  )
  WHERE (status <> 'cancelled');

-- Availability check function runnable by anon via RPC
CREATE OR REPLACE FUNCTION public.check_property_availability(
  p_check_in  date,
  p_check_out date
)
RETURNS TABLE (property_name text, is_booked boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    p.name AS property_name,
    EXISTS (
      SELECT 1
      FROM public.reservations r
      WHERE r.property_name = p.name
        AND r.status <> 'cancelled'
        AND daterange(r.check_in, r.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
    ) AS is_booked
  FROM public.properties p
  WHERE p.is_active = true;
$$;

GRANT EXECUTE ON FUNCTION public.check_property_availability(date, date) TO anon, authenticated;
