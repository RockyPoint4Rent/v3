
-- Fix trigger to use correct net schema (not extensions)
CREATE OR REPLACE FUNCTION public.trigger_sms_on_new_reservation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_url      text;
  v_anon_key text;
BEGIN
  SELECT value INTO v_url      FROM app_config WHERE key = 'SUPABASE_URL';
  SELECT value INTO v_anon_key FROM app_config WHERE key = 'SUPABASE_ANON_KEY';

  IF v_url IS NULL THEN
    RAISE WARNING 'sms_trigger: SUPABASE_URL missing from app_config';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url     := v_url || '/functions/v1/send-reservation-sms',
    body    := jsonb_build_object('reservationId', NEW.id::text),
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || coalesce(v_anon_key, '')
    ),
    timeout_milliseconds := 10000
  );

  RETURN NEW;
END;
$$;
