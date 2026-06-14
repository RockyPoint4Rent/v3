/*
  # Create Admin Dashboard Tables: properties, rate_settings, blackout_dates, reviews, faqs
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  bedrooms numeric(4,1) NOT NULL DEFAULT 0,
  bathrooms numeric(4,1) NOT NULL DEFAULT 0,
  max_guests integer NOT NULL DEFAULT 2,
  badge text NOT NULL DEFAULT '',
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE TABLE IF NOT EXISTS rate_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name text NOT NULL DEFAULT 'global',
  fri_sat_rate numeric(10,2) NOT NULL DEFAULT 350.00,
  sun_wed_rate numeric(10,2) NOT NULL DEFAULT 225.00,
  thu_rate numeric(10,2) NOT NULL DEFAULT 325.00,
  cleaning_fee numeric(10,2) NOT NULL DEFAULT 189.00,
  property_fee numeric(10,2) NOT NULL DEFAULT 85.00,
  deposit_amount numeric(10,2) NOT NULL DEFAULT 200.00,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rate_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view rate settings"
  ON rate_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS blackout_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view blackout dates"
  ON blackout_dates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  guest_location text NOT NULL DEFAULT '',
  property_name text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  content text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published faqs"
  ON faqs FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

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
  ON call_request FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent = true);
