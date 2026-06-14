/*
  # Fix Function Search Path Mutable Security Issues

  1. Changes
    - Alter `public.sync_guest_name` to set a fixed `search_path`
    - Alter `public.is_admin` to set a fixed `search_path`

  2. Security
    - Setting `search_path = ''` (empty) prevents search path injection attacks
    - Functions will use fully-qualified names to reference objects
*/

ALTER FUNCTION public.sync_guest_name() SET search_path = '';
ALTER FUNCTION public.is_admin() SET search_path = '';
