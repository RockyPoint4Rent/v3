/*
  # Create Admin Dashboard Tables

  ## Summary
  Creates all tables needed for the owner's admin dashboard:
  properties, rate_settings, blackout_dates, reviews, and faqs.

  ## New Tables

  ### `properties`
  Stores the three rental homes with their details, amenities, and metadata.
  - `id` (uuid) — primary key
  - `name` (text) — property display name
  - `tagline` (text) — short marketing line
  - `description` (text) — full description
  - `bedrooms` (numeric) — number of bedrooms
  - `bathrooms` (numeric) — number of bathrooms
  - `max_guests` (integer) — maximum occupancy
  - `badge` (text) — label shown on the card
  - `amenities` (jsonb) — array of amenity strings
  - `image_url` (text) — cover photo URL
  - `is_active` (boolean) — whether shown on public site
  - `display_order` (integer) — sort order

  ### `rate_settings`
  Per-property (or global) nightly rates and fees, configurable by the owner.
  - `id` (uuid) — primary key
  - `property_name` (text) — links to a property name, or 'global'
  - `fri_sat_rate` (numeric) — Friday & Saturday nightly rate
  - `sun_wed_rate` (numeric) — Sunday–Wednesday nightly rate
  - `thu_rate` (numeric) — Thursday nightly rate
  - `cleaning_fee` (numeric)
  - `property_fee` (numeric)
  - `deposit_amount` (numeric)

  ### `blackout_dates`
  Date ranges when a property is unavailable.
  - `id` (uuid) — primary key
  - `property_name` (text) — which property is blocked
  - `start_date` (date) — first blocked day
  - `end_date` (date) — last blocked day (inclusive)
  - `reason` (text) — optional internal note

  ### `reviews`
  Guest reviews submitted or imported, with publish approval workflow.
  - `id` (uuid) — primary key
  - `guest_name` (text)
  - `guest_location` (text)
  - `property_name` (text)
  - `rating` (integer 1–5)
  - `content` (text)
  - `is_published` (boolean) — show on public site
  - `created_at` (timestamptz)

  ### `faqs`
  Frequently asked questions displayed on the public site.
  - `id` (uuid) — primary key
  - `question` (text)
  - `answer` (text)
  - `display_order` (integer)
  - `is_published` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public site reads: SELECT allowed for anon on published reviews and faqs, and on active properties
  - Admin writes: all operations require authenticated user (owner login)

  ## Seed Data
  Inserts initial data for properties, rate settings, seed reviews, and common FAQs.
*/

-- ============================================================
-- PROPERTIES
-- ============================================================
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

CREATE POLICY "Authenticated can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- RATE SETTINGS
-- ============================================================
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

CREATE POLICY "Authenticated can insert rate settings"
  ON rate_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update rate settings"
  ON rate_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete rate settings"
  ON rate_settings FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- BLACKOUT DATES
-- ============================================================
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

CREATE POLICY "Authenticated can insert blackout dates"
  ON blackout_dates FOR INSERT
  TO authenticated
  WITH CHECK (start_date <= end_date);

CREATE POLICY "Authenticated can update blackout dates"
  ON blackout_dates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete blackout dates"
  ON blackout_dates FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- REVIEWS
-- ============================================================
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

CREATE POLICY "Authenticated can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- FAQS
-- ============================================================
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

CREATE POLICY "Authenticated can view all faqs"
  ON faqs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert faqs"
  ON faqs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update faqs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete faqs"
  ON faqs FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO properties (name, tagline, description, bedrooms, bathrooms, max_guests, badge, amenities, image_url, is_active, display_order)
VALUES
  ('Casa Margaritas', 'Comfortable Heart of Rocky Point',
   'A cozy, fully equipped central getaway with modern comforts and easy access to Rocky Point attractions. Perfect for groups seeking a vibrant local experience.',
   5, 2.5, 10, 'Most Popular',
   '["A/C", "WiFi", "Full Kitchen", "Parking"]'::jsonb,
   'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=900',
   true, 1),
  ('Casa Tropical Mango', 'Tropical Comfort Near the Beach',
   'A bright tropical retreat near the beach, offering comfort, convenience, and all essential amenities. Ideal for large family gatherings.',
   7, 4, 14, 'Largest Property',
   '["A/C", "WiFi", "BBQ Grill", "Beach Access"]'::jsonb,
   'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=900',
   true, 2),
  ('Casa Delphine', 'Charming Coastal Home for Families',
   'A cozy, fully equipped coastal retreat with A/C, WiFi, and a central location close to the beach. The ideal family sanctuary.',
   6, 4, 12, 'Family Favorite',
   '["A/C", "WiFi", "Patio", "Near Beach"]'::jsonb,
   'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=900',
   true, 3)
ON CONFLICT DO NOTHING;

INSERT INTO rate_settings (property_name, fri_sat_rate, sun_wed_rate, thu_rate, cleaning_fee, property_fee, deposit_amount)
VALUES ('global', 350.00, 225.00, 325.00, 189.00, 85.00, 200.00)
ON CONFLICT DO NOTHING;

INSERT INTO reviews (guest_name, guest_location, property_name, rating, content, is_published)
VALUES
  ('Miguel', 'Phoenix, Arizona', 'Casa Margaritas', 5,
   'Wow experience from the time I booked to check out. I will definitely refer this to anyone looking for a place in Rocky Point. 6 minutes from the beach! Great place.',
   true),
  ('Sarah & David', 'Tucson, Arizona', 'Casa Tropical Mango', 5,
   'The house was absolutely stunning and so clean. Tom and Lidia were incredibly responsive and helpful. Our kids had the time of their lives. We will be back every year!',
   true),
  ('The Hernandez Family', 'Scottsdale, Arizona', 'Casa Delphine', 5,
   'Perfect location, beautiful home, amazing hosts. Everything we needed was provided and then some. Rocky Point is a gem and Casa Delphine is the perfect base.',
   true)
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer, display_order, is_published)
VALUES
  ('How close are the properties to the beach?', 'All three properties are located within 6 minutes of the beach. Rocky Point has beautiful sandy beaches along the Gulf of California.', 1, true),
  ('What is included in the rental?', 'All properties include A/C, high-speed WiFi, a fully equipped kitchen, linens, towels, and all the essentials for a comfortable stay.', 2, true),
  ('How does the booking process work?', 'Select your dates, choose a property, fill in your details, and choose a payment option. A $200 deposit secures your reservation, with the balance due on arrival. We accept Zelle.', 3, true),
  ('Can I book last minute?', 'Yes! We welcome last-minute bookings subject to availability. Contact us directly via phone or email for the fastest response.', 4, true),
  ('What is the cancellation policy?', 'Cancellations made 14+ days before check-in receive a full refund of the deposit. Within 14 days, the deposit is non-refundable. Contact us to discuss any special circumstances.', 5, true),
  ('Are pets allowed?', 'We love animals! Please contact us before booking to discuss your pet. We may accommodate pets with prior approval and an additional pet fee.', 6, true),
  ('How many guests can each property accommodate?', 'Casa Margaritas sleeps up to 10, Casa Tropical Mango sleeps up to 14, and Casa Delphine sleeps up to 12.', 7, true)
ON CONFLICT DO NOTHING;
