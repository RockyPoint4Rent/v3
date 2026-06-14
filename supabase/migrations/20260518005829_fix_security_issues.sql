/*
  # Fix Security Issues

  1. check_property_availability function
     - Switch from SECURITY DEFINER to SECURITY INVOKER so it executes with the
       caller's permissions rather than the owner's elevated permissions.
     - Revoke EXECUTE from anon and authenticated roles as an extra safeguard.

  2. app_config table RLS
     - Adds a policy to satisfy the "RLS enabled but no policies" warning.
     - Authenticated users are explicitly denied access; service role (used by
       edge functions) bypasses RLS and retains full access.
*/

-- 1. Replace function with SECURITY INVOKER (must drop first due to return type)
DROP FUNCTION IF EXISTS public.check_property_availability(date, date);

CREATE OR REPLACE FUNCTION public.check_property_availability(
  p_check_in date,
  p_check_out date
)
RETURNS TABLE (property_name text, is_booked boolean)
LANGUAGE sql
STABLE
SECURITY INVOKER
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

REVOKE EXECUTE ON FUNCTION public.check_property_availability(date, date) FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_property_availability(date, date) FROM authenticated;

-- 2. app_config RLS: deny all direct access from non-service roles
CREATE POLICY "No direct user access to app_config"
  ON public.app_config
  FOR SELECT
  TO authenticated
  USING (false);
