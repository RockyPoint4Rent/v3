/*
  # Create admin_sessions table for custom admin auth

  Since Supabase Auth (GoTrue) has a platform-level failure querying its schema,
  we implement a custom admin authentication system:
  - admin_credentials: stores the hashed admin password
  - admin_sessions: stores short-lived session tokens

  Security:
  - Passwords hashed with pgcrypto crypt/bcrypt
  - Sessions expire after 24 hours
  - RLS disabled — access only via service role through edge function
*/

CREATE TABLE IF NOT EXISTS admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  email text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  created_at timestamptz DEFAULT now()
);

-- No RLS — only accessible via service role key in edge function
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Deny all direct access; edge function uses service role which bypasses RLS
CREATE POLICY "No direct access to admin_credentials"
  ON admin_credentials FOR SELECT TO authenticated USING (false);

CREATE POLICY "No direct access to admin_sessions"
  ON admin_sessions FOR SELECT TO authenticated USING (false);

-- Seed the admin credential (password: WonderlandAdmin2024!)
INSERT INTO admin_credentials (email, password_hash)
VALUES (
  'info@rockypoint4rentals.com',
  public.crypt('WonderlandAdmin2024!', public.gen_salt('bf'))
)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
