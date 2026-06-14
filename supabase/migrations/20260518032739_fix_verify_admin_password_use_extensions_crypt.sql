/*
  # Fix verify_admin_password to use extensions.crypt

  pgcrypto was moved back to the extensions schema, so crypt() and gen_salt()
  are now at extensions.crypt / extensions.gen_salt. Update the function
  and the seeded password hash accordingly.
*/

CREATE OR REPLACE FUNCTION public.verify_admin_password(p_email text, p_password text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = extensions, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_credentials
    WHERE email = p_email
      AND password_hash = extensions.crypt(p_password, password_hash)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.verify_admin_password(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password(text, text) TO service_role;

-- Re-hash the admin password using extensions.crypt now that pgcrypto is in extensions
UPDATE public.admin_credentials
SET password_hash = extensions.crypt('WonderlandAdmin2024!', extensions.gen_salt('bf'))
WHERE email = 'info@rockypoint4rentals.com';
