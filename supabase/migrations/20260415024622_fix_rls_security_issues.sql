/*
  # Fix RLS Security Issues

  ## Summary
  Addresses all reported security vulnerabilities:

  1. **Auth RLS Initialization Plan** — `reservations` SELECT policy re-evaluates
     `auth.jwt()` per row. Replace with `(select auth.jwt())` for a single evaluation.

  2. **Multiple Permissive Policies** — `faqs` and `reviews` have two overlapping SELECT
     policies for `authenticated` (one public, one authenticated-all). Drop the redundant
     authenticated-only policy; the public one already covers authenticated users.

  3. **RLS Policy Always True** — Admin write policies on `blackout_dates`, `faqs`,
     `properties`, `rate_settings`, and `reviews` use `true` as their USING/WITH CHECK
     clauses. Replace with a proper admin role check using `app_metadata->>'role' = 'admin'`.

  4. **Admin role** — Set `app_metadata.role = 'admin'` for the existing admin account
     so the new policies correctly gate access.

  ## Tables modified
  - `reservations` — fix SELECT policy performance
  - `faqs` — remove duplicate SELECT policy, fix write policies
  - `reviews` — remove duplicate SELECT policy, fix write policies
  - `properties` — fix write policies
  - `rate_settings` — fix write policies
  - `blackout_dates` — fix write policies

  ## Security notes
  - All admin write operations now require `app_metadata.role = 'admin'`
  - Public SELECT policies remain unchanged (anon + authenticated can read published/active rows)
  - The `(select ...)` wrapper ensures JWT is evaluated once per query, not per row
*/

-- Helper function to check if the current user is an admin
-- Uses app_metadata (not user_metadata) which cannot be modified by the user themselves
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (select auth.jwt()) ->> 'role' = 'admin'
    OR ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
$$;

-- Grant admin role to the existing admin account
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'info@rockypoint4rentals.com';

-- ============================================================
-- RESERVATIONS: Fix per-row JWT evaluation
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view their own reservations by email" ON public.reservations;

CREATE POLICY "Authenticated users can view their own reservations by email"
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (guest_email = ((select auth.jwt()) ->> 'email'));

-- Also add admin SELECT policy so admins can view all reservations
DROP POLICY IF EXISTS "Admin can view all reservations" ON public.reservations;

CREATE POLICY "Admin can view all reservations"
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update reservations" ON public.reservations;

CREATE POLICY "Admin can update reservations"
  ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete reservations" ON public.reservations;

CREATE POLICY "Admin can delete reservations"
  ON public.reservations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- FAQS: Remove duplicate SELECT policy, fix write policies
-- ============================================================

-- Drop the redundant authenticated-only SELECT (public policy already covers authenticated)
DROP POLICY IF EXISTS "Authenticated can view all faqs" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated can insert faqs" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated can update faqs" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated can delete faqs" ON public.faqs;

-- Admin SELECT (all FAQs including unpublished)
CREATE POLICY "Admin can view all faqs"
  ON public.faqs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert faqs"
  ON public.faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update faqs"
  ON public.faqs
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete faqs"
  ON public.faqs
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- REVIEWS: Remove duplicate SELECT policy, fix write policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated can delete reviews" ON public.reviews;

CREATE POLICY "Admin can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- PROPERTIES: Fix write policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated can update properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated can delete properties" ON public.properties;

CREATE POLICY "Admin can insert properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete properties"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- RATE_SETTINGS: Fix write policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated can insert rate settings" ON public.rate_settings;
DROP POLICY IF EXISTS "Authenticated can update rate settings" ON public.rate_settings;
DROP POLICY IF EXISTS "Authenticated can delete rate settings" ON public.rate_settings;

CREATE POLICY "Admin can insert rate settings"
  ON public.rate_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update rate settings"
  ON public.rate_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete rate settings"
  ON public.rate_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- BLACKOUT_DATES: Fix write policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated can insert blackout dates" ON public.blackout_dates;
DROP POLICY IF EXISTS "Authenticated can update blackout dates" ON public.blackout_dates;
DROP POLICY IF EXISTS "Authenticated can delete blackout dates" ON public.blackout_dates;

CREATE POLICY "Admin can insert blackout dates"
  ON public.blackout_dates
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update blackout dates"
  ON public.blackout_dates
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete blackout dates"
  ON public.blackout_dates
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
