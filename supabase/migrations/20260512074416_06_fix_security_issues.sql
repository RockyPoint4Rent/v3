/*
  # Fix security issues flagged by Supabase Security Advisor

  ## Issues addressed

  1. **btree_gist in public schema** — Move to the `extensions` schema where
     all other extensions live.

  2. **PUBLIC EXECUTE on SECURITY DEFINER functions** — Supabase auto-grants
     EXECUTE to PUBLIC on new functions. Revoke from PUBLIC and re-grant only
     the minimum necessary:
     - `is_admin()` — internal RLS helper, no direct API access needed
     - `sync_guest_name()` — trigger function, no direct API access needed
     - `check_property_availability()` — callable by anon/authenticated only
       (explicit grant replaces the blanket PUBLIC grant)

  ## Security result
  - `is_admin()` and `sync_guest_name()`: no longer callable via REST API
  - `check_property_availability()`: callable only by anon and authenticated
  - btree_gist lives in the extensions schema
*/

-- ============================================================
-- 1. Move btree_gist to extensions schema
-- ============================================================
ALTER EXTENSION btree_gist SET SCHEMA extensions;

-- ============================================================
-- 2. Fix function permissions
-- ============================================================

-- is_admin: internal RLS helper — revoke all external access
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;

-- sync_guest_name: trigger only — revoke all external access
REVOKE EXECUTE ON FUNCTION public.sync_guest_name() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_guest_name() FROM anon, authenticated;

-- check_property_availability: replace blanket PUBLIC grant with explicit role grants
REVOKE EXECUTE ON FUNCTION public.check_property_availability(date, date) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_property_availability(date, date) FROM anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.check_property_availability(date, date) TO anon, authenticated;
