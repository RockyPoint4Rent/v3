CREATE TABLE IF NOT EXISTS sms_notification_recipients (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL DEFAULT '',
  phone_number text NOT NULL DEFAULT '',
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sms_notification_recipients ENABLE ROW LEVEL SECURITY;

-- Only service_role (admin-api edge function) can read/write
CREATE POLICY "Service role can select sms_recipients"
  ON sms_notification_recipients FOR SELECT TO service_role USING (true);

CREATE POLICY "Service role can insert sms_recipients"
  ON sms_notification_recipients FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update sms_recipients"
  ON sms_notification_recipients FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete sms_recipients"
  ON sms_notification_recipients FOR DELETE TO service_role USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_sms_recipients_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sms_recipients_updated_at
  BEFORE UPDATE ON sms_notification_recipients
  FOR EACH ROW EXECUTE FUNCTION update_sms_recipients_updated_at();
