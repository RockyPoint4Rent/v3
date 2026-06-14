/*
  # Fix sync_guest_name trigger function

  ## Problem
  The `sync_guest_name` BEFORE INSERT trigger has an incorrect function body
  in the database. Instead of combining `guest_first_name` and `guest_last_name`,
  it attempts to look up `auth.users` by a non-existent `user_id` column.
  
  This causes inserts to fail with a relation-not-found error after the
  `search_path` was locked down to `''` in the previous migration.

  ## Fix
  Recreate `sync_guest_name` with:
  - Correct logic: concat guest_first_name + guest_last_name
  - Fully-qualified `search_path = ''` (no unqualified schema references)
*/

CREATE OR REPLACE FUNCTION public.sync_guest_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.guest_name IS NULL OR NEW.guest_name = '' THEN
    NEW.guest_name := trim(NEW.guest_first_name || ' ' || NEW.guest_last_name);
  END IF;
  RETURN NEW;
END;
$$;
