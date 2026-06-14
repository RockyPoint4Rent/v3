/*
  # Fix extensions schema grants for auth

  The supabase_auth_admin and authenticator roles are missing USAGE
  on the extensions schema. GoTrue requires access to pgcrypto functions
  (crypt, gen_salt) in the extensions schema to hash and verify passwords.
  Without this, every auth request fails with "Database error querying schema".
*/

GRANT USAGE ON SCHEMA extensions TO supabase_auth_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO supabase_auth_admin;

GRANT USAGE ON SCHEMA extensions TO authenticator;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO authenticator;

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
