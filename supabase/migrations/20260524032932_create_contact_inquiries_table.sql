/*
  # Create contact_inquiries table

  Stores contact form submissions from the website.

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `property` (text)
      - `dates` (text, optional)
      - `message` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Anon can INSERT (public form submission)
    - No SELECT for anon (admin reads via service role)
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  phone      text NOT NULL DEFAULT '',
  property   text NOT NULL DEFAULT '',
  dates      text NOT NULL DEFAULT '',
  message    text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact inquiry"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
