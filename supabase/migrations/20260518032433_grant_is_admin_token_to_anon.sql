/*
  # Grant anon execute on is_admin_token for custom admin auth RLS

  The RLS policies on admin tables call is_admin_token(), but the anon
  role needs EXECUTE permission on that function for the policies to work.
*/

GRANT EXECUTE ON FUNCTION public.is_admin_token() TO anon, authenticated;
