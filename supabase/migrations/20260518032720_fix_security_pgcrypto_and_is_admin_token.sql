/*
  # Fix security issues

  1. Move pgcrypto from public schema to extensions schema
  2. Replace is_admin_token() SECURITY DEFINER with SECURITY INVOKER.
     The function is an RLS helper — it only needs to read admin_sessions
     using the caller's context. SECURITY INVOKER is sufficient and safer.
     Revoke direct RPC access from anon and authenticated so it cannot be
     called directly via /rest/v1/rpc/is_admin_token.
*/

-- 1. Move pgcrypto back to extensions schema
ALTER EXTENSION pgcrypto SET SCHEMA extensions;

-- 2. Replace SECURITY DEFINER with SECURITY INVOKER (CREATE OR REPLACE preserves deps)
CREATE OR REPLACE FUNCTION public.is_admin_token()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_sessions
    WHERE token = (current_setting('request.headers', true)::json->>'x-admin-token')
      AND expires_at > now()
  );
$$;

-- Revoke direct RPC execution — it is only needed as an inline RLS helper.
-- PostgreSQL evaluates RLS policies in the role context of the query, so
-- the policies referencing this function still work without an explicit grant.
REVOKE EXECUTE ON FUNCTION public.is_admin_token() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_token() FROM anon, authenticated;
