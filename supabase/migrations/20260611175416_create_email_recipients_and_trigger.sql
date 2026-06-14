
-- ── email_notification_recipients table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_notification_recipients (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL DEFAULT '',
  email      text        NOT NULL DEFAULT '',
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE email_notification_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select email_recipients"
  ON email_notification_recipients FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert email_recipients"
  ON email_notification_recipients FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update email_recipients"
  ON email_notification_recipients FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can delete email_recipients"
  ON email_notification_recipients FOR DELETE TO service_role USING (true);

CREATE OR REPLACE FUNCTION update_email_recipients_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER email_recipients_updated_at
  BEFORE UPDATE ON email_notification_recipients
  FOR EACH ROW EXECUTE FUNCTION update_email_recipients_updated_at();

-- ── DB trigger: fire notify (email) on every new reservation ──────────────────
CREATE OR REPLACE FUNCTION public.trigger_email_on_new_reservation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  v_url      text;
  v_anon_key text;
BEGIN
  SELECT value INTO v_url      FROM app_config WHERE key = 'SUPABASE_URL';
  SELECT value INTO v_anon_key FROM app_config WHERE key = 'SUPABASE_ANON_KEY';

  IF v_url IS NULL THEN
    RAISE WARNING 'email_trigger: SUPABASE_URL missing from app_config';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url     := v_url || '/functions/v1/notify',
    body    := jsonb_build_object('type', 'new_reservation', 'reservationId', NEW.id::text),
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || coalesce(v_anon_key, '')
    ),
    timeout_milliseconds := 15000
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_reservation_created_send_email
  AFTER INSERT ON public.reservations
  FOR EACH ROW
  WHEN (NEW.status <> 'cancelled')
  EXECUTE FUNCTION public.trigger_email_on_new_reservation();
