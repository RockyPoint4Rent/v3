-- Recreate admin auth infrastructure: admin_credentials, admin_sessions,
-- verify_admin_password(), and is_admin_token() which are all missing from the DB.

-- Admin credentials table
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  email text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  created_at timestamptz DEFAULT now()
);

-- RLS: deny direct access; edge function uses service role which bypasses RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access to admin_credentials" ON public.admin_credentials;
CREATE POLICY "No direct access to admin_credentials"
  ON public.admin_credentials FOR SELECT TO authenticated USING (false);

DROP POLICY IF EXISTS "No direct access to admin_sessions" ON public.admin_sessions;
CREATE POLICY "No direct access to admin_sessions"
  ON public.admin_sessions FOR SELECT TO authenticated USING (false);

-- Password verification function (pgcrypto lives in extensions schema)
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

-- Token validation helper for RLS policies
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

REVOKE EXECUTE ON FUNCTION public.is_admin_token() FROM PUBLIC, anon, authenticated;

-- Seed admin credential
INSERT INTO public.admin_credentials (email, password_hash)
VALUES (
  'info@rockypoint4rentals.com',
  extensions.crypt('WonderlandAdmin2024!', extensions.gen_salt('bf'))
)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
