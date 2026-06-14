
-- Drop and recreate with correct return type (is_booked)
DROP FUNCTION IF EXISTS public.check_property_availability(date, date);

CREATE FUNCTION public.check_property_availability(
  p_check_in  date,
  p_check_out date
)
RETURNS TABLE (property_name text, is_booked boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
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
          AND daterange(r.check_in,  r.check_out,  '[)') &&
              daterange(p_check_in,  p_check_out,  '[)')
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

-- Fix get_property_booked_ranges to include 'All Properties' blackouts
CREATE OR REPLACE FUNCTION public.get_property_booked_ranges(p_property_name text)
RETURNS TABLE(start_date date, end_date date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT r.check_in  AS start_date,
         r.check_out AS end_date
  FROM reservations r
  WHERE r.property_name = p_property_name
    AND r.status <> 'cancelled'
    AND r.check_out >= CURRENT_DATE

  UNION ALL

  SELECT b.start_date::date,
         b.end_date::date
  FROM blackout_dates b
  WHERE (b.property_name = p_property_name OR b.property_name = 'All Properties')
    AND b.end_date::date >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION public.get_property_booked_ranges(text) TO anon, authenticated;
