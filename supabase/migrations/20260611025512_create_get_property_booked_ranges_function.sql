
CREATE OR REPLACE FUNCTION public.get_property_booked_ranges(p_property_name text)
RETURNS TABLE(start_date date, end_date date)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Non-cancelled reservations for this property
  RETURN QUERY
  SELECT r.check_in  AS start_date,
         r.check_out AS end_date
  FROM reservations r
  WHERE r.property_name = p_property_name
    AND r.status <> 'cancelled';

  -- Blackout dates for this property or all properties
  RETURN QUERY
  SELECT b.start_date,
         b.end_date
  FROM blackout_dates b
  WHERE b.property_name = p_property_name
     OR b.property_name = 'All Properties';
END;
$$;

-- Allow anon/authenticated to call it (calendar is public)
GRANT EXECUTE ON FUNCTION public.get_property_booked_ranges(text) TO anon, authenticated;
