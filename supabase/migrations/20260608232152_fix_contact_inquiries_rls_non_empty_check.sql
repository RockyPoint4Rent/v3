
-- Tighten contact_inquiries INSERT policy: require non-empty name, email, message
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON contact_inquiries;

CREATE POLICY "Public can submit contact inquiries"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name    IS NOT NULL AND length(trim(name))    > 0 AND
    email   IS NOT NULL AND length(trim(email))   > 0 AND
    message IS NOT NULL AND length(trim(message)) > 0
  );
