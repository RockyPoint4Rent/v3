
-- ── Enable pg_net for outbound HTTP requests from triggers ────────────────────
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- ── Store Supabase connectivity config so the trigger can reach edge functions ─
INSERT INTO app_config (key, value) VALUES
  ('SUPABASE_URL',      'https://lpzctpwwacctalnonjnw.supabase.co'),
  ('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwemN0cHd3YWNjdGFsbm9uam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTE0MzEsImV4cCI6MjA5NDEyNzQzMX0.MliN3cPkEidSg18i1iXnhBktY5LMWeQXvo16N7tks7s')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ── Trigger function: fires send-reservation-sms edge function via pg_net ─────
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

  PERFORM extensions.http_post(
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

-- Only fire for real bookings (not test/cancelled rows created directly)
CREATE TRIGGER on_reservation_created_send_sms
  AFTER INSERT ON public.reservations
  FOR EACH ROW
  WHEN (NEW.status <> 'cancelled')
  EXECUTE FUNCTION public.trigger_sms_on_new_reservation();
