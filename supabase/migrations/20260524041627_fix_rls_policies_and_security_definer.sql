/*
  # Fix RLS policies and security issues

  ## Summary
  Locks down write access on admin-managed tables so only the service role
  (used by the admin-api edge function) can mutate data. Public users retain
  read-only access where needed. Also fixes the SECURITY DEFINER function and
  tightens the contact_inquiries insert policy.

  ## Changes

  ### 1. blackout_dates / faqs / properties / rate_settings / reviews
  - Drop overly-permissive INSERT/UPDATE/DELETE policies that allowed anyone
  - Re-create restricted to service_role only

  ### 2. contact_inquiries
  - Tighten INSERT policy to anon and authenticated roles only

  ### 3. check_property_availability function
  - Drop and recreate as SECURITY INVOKER so it runs with caller's privileges
  - Retain EXECUTE grant for anon and authenticated
*/

-- ── blackout_dates ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert blackout_dates" ON blackout_dates;
DROP POLICY IF EXISTS "Anyone can update blackout_dates" ON blackout_dates;
DROP POLICY IF EXISTS "Anyone can delete blackout_dates" ON blackout_dates;

CREATE POLICY "Service role can insert blackout_dates"
  ON blackout_dates FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update blackout_dates"
  ON blackout_dates FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete blackout_dates"
  ON blackout_dates FOR DELETE TO service_role USING (true);

-- ── faqs ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert faqs" ON faqs;
DROP POLICY IF EXISTS "Anyone can update faqs" ON faqs;
DROP POLICY IF EXISTS "Anyone can delete faqs" ON faqs;

CREATE POLICY "Service role can insert faqs"
  ON faqs FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update faqs"
  ON faqs FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete faqs"
  ON faqs FOR DELETE TO service_role USING (true);

-- ── properties ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert properties" ON properties;
DROP POLICY IF EXISTS "Anyone can update properties" ON properties;
DROP POLICY IF EXISTS "Anyone can delete properties" ON properties;

CREATE POLICY "Service role can insert properties"
  ON properties FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update properties"
  ON properties FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete properties"
  ON properties FOR DELETE TO service_role USING (true);

-- ── rate_settings ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert rate_settings" ON rate_settings;
DROP POLICY IF EXISTS "Anyone can update rate_settings" ON rate_settings;
DROP POLICY IF EXISTS "Anyone can delete rate_settings" ON rate_settings;

CREATE POLICY "Service role can insert rate_settings"
  ON rate_settings FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update rate_settings"
  ON rate_settings FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete rate_settings"
  ON rate_settings FOR DELETE TO service_role USING (true);

-- ── reviews ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can update reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can delete reviews" ON reviews;

CREATE POLICY "Service role can insert reviews"
  ON reviews FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update reviews"
  ON reviews FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete reviews"
  ON reviews FOR DELETE TO service_role USING (true);

-- ── contact_inquiries ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can submit a contact inquiry" ON contact_inquiries;

CREATE POLICY "Public can submit contact inquiries"
  ON contact_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ── check_property_availability: switch to SECURITY INVOKER ──────────────────
DROP FUNCTION IF EXISTS public.check_property_availability(date, date);

CREATE FUNCTION public.check_property_availability(
  p_check_in  date,
  p_check_out date
)
RETURNS TABLE(
  property_name text,
  is_available  boolean
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.name AS property_name,
    NOT EXISTS (
      SELECT 1 FROM reservations r
      WHERE r.property_name = p.name
        AND r.status NOT IN ('cancelled')
        AND r.check_in  < p_check_out
        AND r.check_out > p_check_in
    ) AND NOT EXISTS (
      SELECT 1 FROM blackout_dates b
      WHERE (b.property_name = p.name OR b.property_name = 'All Properties')
        AND b.start_date < p_check_out
        AND b.end_date   > p_check_in
    ) AS is_available
  FROM properties p
  WHERE p.is_active = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_property_availability(date, date) TO anon, authenticated;
