
-- Fix 1: Change check_property_availability to SECURITY DEFINER so anon callers
-- can check against reservations (which has no anon SELECT RLS policy).
-- search_path = '' prevents privilege escalation while SECURITY DEFINER allows
-- reading the reservations table regardless of calling user's RLS context.
CREATE OR REPLACE FUNCTION public.check_property_availability(
  p_check_in date,
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
    (
      EXISTS (
        SELECT 1
        FROM public.reservations r
        WHERE r.property_name = p.name
          AND r.status <> 'cancelled'
          AND daterange(r.check_in, r.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
      )
      OR
      EXISTS (
        SELECT 1
        FROM public.blackout_dates b
        WHERE b.property_name = p.name
          AND daterange(b.start_date::date, b.end_date::date, '[]') && daterange(p_check_in, p_check_out, '[)')
      )
    ) AS is_booked
  FROM public.properties p
  WHERE p.is_active = true;
$$;

-- Grant execute to anon and authenticated so the Supabase client can call it
GRANT EXECUTE ON FUNCTION public.check_property_availability(date, date) TO anon, authenticated;

-- Fix 2: New function that returns all booked date ranges for a single property
-- (used by the calendar UI to disable unavailable dates)
CREATE OR REPLACE FUNCTION public.get_property_booked_ranges(
  p_property_name text
)
RETURNS TABLE (start_date date, end_date date, source text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    r.check_in  AS start_date,
    r.check_out AS end_date,
    'reservation'::text AS source
  FROM public.reservations r
  WHERE r.property_name = p_property_name
    AND r.status <> 'cancelled'
    AND r.check_out >= CURRENT_DATE

  UNION ALL

  SELECT
    b.start_date::date AS start_date,
    b.end_date::date   AS end_date,
    'blackout'::text   AS source
  FROM public.blackout_dates b
  WHERE b.property_name = p_property_name
    AND b.end_date::date >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION public.get_property_booked_ranges(text) TO anon, authenticated;
