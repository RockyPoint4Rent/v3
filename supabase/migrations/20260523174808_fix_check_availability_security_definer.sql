/*
  # Fix check_property_availability to bypass RLS

  The function queries the reservations table internally. Because anon users
  have no SELECT policy on reservations, the inner query returns empty rows
  and every property appears available regardless of real bookings.

  Fix: recreate the function as SECURITY DEFINER so it executes with the
  privileges of the owning role (postgres), bypassing RLS on reservations.
  The function only exposes a boolean is_booked per property — no guest data.

  Also tighten the blocked statuses: only reservations with status in
  (pending, deposit_paid, confirmed, balance_due, fully_paid) block dates.
  Cancelled reservations remain open for rebooking.
*/

CREATE OR REPLACE FUNCTION public.check_property_availability(
  p_check_in  date,
  p_check_out date
)
RETURNS TABLE(property_name text, is_booked boolean)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
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

-- Ensure anon and authenticated can call it
GRANT EXECUTE ON FUNCTION public.check_property_availability(date, date) TO anon, authenticated;
