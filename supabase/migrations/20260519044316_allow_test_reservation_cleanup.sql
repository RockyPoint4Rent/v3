/*
  # Allow anon to delete test reservations

  Adds a DELETE policy for anon/authenticated users to clean up
  their own test reservations identified by the booking.local email domain.
  This is intentionally scoped to test emails only so real reservations
  cannot be deleted by anonymous users.
*/

CREATE POLICY "Anon can delete own test reservations"
  ON reservations
  FOR DELETE
  TO anon, authenticated
  USING (guest_email LIKE '%@booking.local');
