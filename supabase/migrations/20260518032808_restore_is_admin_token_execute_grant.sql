/*
  # Restore EXECUTE grant on is_admin_token for RLS

  is_admin_token() is SECURITY INVOKER — when called directly via RPC by
  anon/authenticated, it runs as their role and cannot read admin_sessions
  (no SELECT policy exists for those roles), so it safely returns false.

  The EXECUTE grant is required for PostgreSQL to invoke the function inline
  during RLS policy evaluation. Without it, all admin table queries fail.
*/

GRANT EXECUTE ON FUNCTION public.is_admin_token() TO anon, authenticated;
