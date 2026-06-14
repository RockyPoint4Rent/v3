/*
  # Fix SECURITY DEFINER function exposure

  ## Problem
  Two functions are publicly callable via the REST API (/rest/v1/rpc/...) by both
  anon and authenticated roles, which is a security risk:
  - public.is_admin()
  - public.sync_guest_name()

  ## Fix
  Revoke EXECUTE on both functions from anon and authenticated roles.
  These functions are only meant to be called internally by triggers and RLS
  policies, not directly via the API.
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_guest_name() FROM anon, authenticated;
