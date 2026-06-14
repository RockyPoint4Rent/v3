/*
  # Move pgcrypto extension to public schema

  GoTrue connects as supabase_auth_admin with search_path = auth only.
  It calls crypt() and gen_salt() unqualified. These functions are in the
  extensions schema which is NOT in supabase_auth_admin's search_path.

  Moving pgcrypto to public schema fixes this because public is always
  reachable and supabase_auth_admin has USAGE on public.
*/

ALTER EXTENSION pgcrypto SET SCHEMA public;
