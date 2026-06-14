/*
  # Create admin auth user

  Creates the admin user account for the owner dashboard with:
  - Email: info@rockypoint4rentals.com
  - Password: WonderlandAdmin2024!
  - app_metadata.role = 'admin' so RLS policies grant full access
*/

DO $$
DECLARE
  admin_uid uuid;
BEGIN
  -- Only create if not exists
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'info@rockypoint4rentals.com';

  IF admin_uid IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'info@rockypoint4rentals.com',
      crypt('WonderlandAdmin2024!', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  ELSE
    -- User exists, ensure admin role is set
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
    WHERE id = admin_uid;
  END IF;
END $$;
