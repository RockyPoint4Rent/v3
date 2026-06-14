/*
  # Add admin token validation for custom auth

  Creates a function that checks if the current request has a valid
  admin session token. The token is passed as a custom claim in the
  Supabase client's session header.

  Also adds RLS policies that accept requests authenticated via the
  custom admin session system.
*/

-- Function to check if an admin session token (passed as app.admin_token GUC) is valid
CREATE OR REPLACE FUNCTION public.is_admin_token()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_sessions
    WHERE token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin_token() FROM PUBLIC, anon, authenticated;

-- Update existing admin RLS policies to also accept the custom token
-- Reservations
DROP POLICY IF EXISTS "Admin can view all reservations" ON public.reservations;
CREATE POLICY "Admin can view all reservations"
  ON public.reservations FOR SELECT
  TO anon, authenticated
  USING (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can update reservations" ON public.reservations;
CREATE POLICY "Admin can update reservations"
  ON public.reservations FOR UPDATE
  TO anon, authenticated
  USING (public.is_admin_token())
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can delete reservations" ON public.reservations;
CREATE POLICY "Admin can delete reservations"
  ON public.reservations FOR DELETE
  TO anon, authenticated
  USING (public.is_admin_token());

-- Properties
DROP POLICY IF EXISTS "Admin can insert properties" ON public.properties;
CREATE POLICY "Admin can insert properties"
  ON public.properties FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can update properties" ON public.properties;
CREATE POLICY "Admin can update properties"
  ON public.properties FOR UPDATE
  TO anon, authenticated
  USING (public.is_admin_token())
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can delete properties" ON public.properties;
CREATE POLICY "Admin can delete properties"
  ON public.properties FOR DELETE
  TO anon, authenticated
  USING (public.is_admin_token());

-- Rate settings
DROP POLICY IF EXISTS "Admin can insert rate settings" ON public.rate_settings;
CREATE POLICY "Admin can insert rate settings"
  ON public.rate_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can update rate settings" ON public.rate_settings;
CREATE POLICY "Admin can update rate settings"
  ON public.rate_settings FOR UPDATE
  TO anon, authenticated
  USING (public.is_admin_token())
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can delete rate settings" ON public.rate_settings;
CREATE POLICY "Admin can delete rate settings"
  ON public.rate_settings FOR DELETE
  TO anon, authenticated
  USING (public.is_admin_token());

-- Blackout dates
DROP POLICY IF EXISTS "Admin can insert blackout dates" ON public.blackout_dates;
CREATE POLICY "Admin can insert blackout dates"
  ON public.blackout_dates FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can update blackout dates" ON public.blackout_dates;
CREATE POLICY "Admin can update blackout dates"
  ON public.blackout_dates FOR UPDATE
  TO anon, authenticated
  USING (public.is_admin_token())
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can delete blackout dates" ON public.blackout_dates;
CREATE POLICY "Admin can delete blackout dates"
  ON public.blackout_dates FOR DELETE
  TO anon, authenticated
  USING (public.is_admin_token());

-- Reviews
DROP POLICY IF EXISTS "Admin can view all reviews" ON public.reviews;
CREATE POLICY "Admin can view all reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can insert reviews" ON public.reviews;
CREATE POLICY "Admin can insert reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can update reviews" ON public.reviews;
CREATE POLICY "Admin can update reviews"
  ON public.reviews FOR UPDATE
  TO anon, authenticated
  USING (public.is_admin_token())
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can delete reviews" ON public.reviews;
CREATE POLICY "Admin can delete reviews"
  ON public.reviews FOR DELETE
  TO anon, authenticated
  USING (public.is_admin_token());

-- FAQs
DROP POLICY IF EXISTS "Admin can view all faqs" ON public.faqs;
CREATE POLICY "Admin can view all faqs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can insert faqs" ON public.faqs;
CREATE POLICY "Admin can insert faqs"
  ON public.faqs FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can update faqs" ON public.faqs;
CREATE POLICY "Admin can update faqs"
  ON public.faqs FOR UPDATE
  TO anon, authenticated
  USING (public.is_admin_token())
  WITH CHECK (public.is_admin_token());

DROP POLICY IF EXISTS "Admin can delete faqs" ON public.faqs;
CREATE POLICY "Admin can delete faqs"
  ON public.faqs FOR DELETE
  TO anon, authenticated
  USING (public.is_admin_token());

-- Call requests
DROP POLICY IF EXISTS "Admin can view call requests" ON public.call_request;
CREATE POLICY "Admin can view call requests"
  ON public.call_request FOR SELECT
  TO anon, authenticated
  USING (public.is_admin_token());
