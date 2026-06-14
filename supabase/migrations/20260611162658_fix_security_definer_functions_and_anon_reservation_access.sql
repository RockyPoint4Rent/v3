
-- ── Step 1: Tighten anon access to reservations ────────────────────────────────
-- Remove the overly-broad table-level SELECT grant and replace with column-level
-- grants that cover only availability data (no PII: no guest_name/email/phone).
REVOKE SELECT ON public.reservations FROM anon, authenticated;

GRANT SELECT (property_name, check_in, check_out, status)
  ON public.reservations TO anon;

-- RLS: allow anon to read non-cancelled, non-past reservations for availability.
-- Combined with the column-level grant above, the REST API returns only
-- property_name, check_in, check_out, status — guest PII remains inaccessible.
CREATE POLICY "anon_read_reservation_availability"
  ON public.reservations FOR SELECT
  TO anon
  USING (status <> 'cancelled' AND check_out >= CURRENT_DATE);

-- Keep full access for service_role (admin edge functions use this).
-- service_role bypasses RLS entirely so no policy change needed there.

-- ── Step 2: Switch check_property_availability to SECURITY INVOKER ─────────────
DROP FUNCTION IF EXISTS public.check_property_availability(date, date);

CREATE FUNCTION public.check_property_availability(
  p_check_in  date,
  p_check_out date
)
RETURNS TABLE (property_name text, is_booked boolean)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
  SELECT
    p.name AS property_name,
    (
      EXISTS (
        SELECT 1
        FROM reservations r
        WHERE r.property_name = p.name
          AND r.status <> 'cancelled'
          AND daterange(r.check_in, r.check_out, '[)') &&
              daterange(p_check_in, p_check_out, '[)')
      )
      OR
      EXISTS (
        SELECT 1
        FROM blackout_dates b
        WHERE (b.property_name = p.name OR b.property_name = 'All Properties')
          AND daterange(b.start_date::date, b.end_date::date, '[]') &&
              daterange(p_check_in, p_check_out, '[)')
      )
    ) AS is_booked
  FROM properties p
  WHERE p.is_active = true;
$$;

GRANT EXECUTE ON FUNCTION public.check_property_availability(date, date) TO anon, authenticated;

-- ── Step 3: Switch get_property_booked_ranges to SECURITY INVOKER ─────────────
CREATE OR REPLACE FUNCTION public.get_property_booked_ranges(p_property_name text)
RETURNS TABLE(start_date date, end_date date)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
  SELECT r.check_in  AS start_date,
         r.check_out AS end_date
  FROM reservations r
  WHERE r.property_name = p_property_name
    AND r.status <> 'cancelled'
    AND r.check_out >= CURRENT_DATE

  UNION ALL

  SELECT b.start_date::date            AS start_date,
         (b.end_date::date + 1)::date  AS end_date
  FROM blackout_dates b
  WHERE (b.property_name = p_property_name OR b.property_name = 'All Properties')
    AND b.end_date::date >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION public.get_property_booked_ranges(text) TO anon, authenticated;
