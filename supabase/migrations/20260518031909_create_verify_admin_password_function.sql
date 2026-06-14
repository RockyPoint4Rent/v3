/*
  # Create verify_admin_password RPC function

  Used by the admin-auth edge function to check credentials.
  Runs as SECURITY DEFINER so the edge function (service role) can call it.
  Returns true if email+password match, false otherwise.
*/

CREATE OR REPLACE FUNCTION public.verify_admin_password(p_email text, p_password text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_credentials
    WHERE email = p_email
      AND password_hash = public.crypt(p_password, password_hash)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.verify_admin_password(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password(text, text) TO service_role;
