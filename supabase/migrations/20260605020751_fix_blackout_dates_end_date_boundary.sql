-- Fix get_property_booked_ranges: blackout end_date is stored inclusive,
-- but the frontend isBooked() check uses half-open [start, end) logic.
-- Add 1 day to blackout end_date so both reservations and blackouts
-- use the same exclusive-end convention the calendar expects.
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
    b.start_date::date            AS start_date,
    (b.end_date::date + 1)        AS end_date,
    'blackout'::text              AS source
  FROM public.blackout_dates b
  WHERE b.property_name = p_property_name
    AND b.end_date::date >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION public.get_property_booked_ranges(text) TO anon, authenticated;
