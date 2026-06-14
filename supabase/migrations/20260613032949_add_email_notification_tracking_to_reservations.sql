
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS notification_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS notification_email_error    text;
