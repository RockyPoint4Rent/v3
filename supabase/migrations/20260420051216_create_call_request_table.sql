/*
  # Create call_request table

  ## Summary
  Creates a table to store contact/call requests submitted by users from the FAQ section.

  ## New Tables
  - `call_request`
    - `id` (uuid, primary key)
    - `first_name` (text, required)
    - `last_name` (text, required)
    - `phone` (text, required)
    - `email` (text, required)
    - `consent` (boolean, required) - user consent to be contacted via automated means
    - `created_at` (timestamptz, auto)

  ## Security
  - RLS enabled
  - Public insert policy (unauthenticated users can submit requests)
  - Authenticated admin read policy
*/

CREATE TABLE IF NOT EXISTS call_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE call_request ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a call request"
  ON call_request
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent = true);

CREATE POLICY "Authenticated users can read call requests"
  ON call_request
  FOR SELECT
  TO authenticated
  USING (true);
