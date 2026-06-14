/*
  # RLS policies, admin function, trigger, and seed data
*/

-- Admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (select auth.jwt()) ->> 'role' = 'admin'
    OR ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
$$;

-- sync_guest_name trigger function
CREATE OR REPLACE FUNCTION public.sync_guest_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.guest_name IS NULL OR NEW.guest_name = '' THEN
    NEW.guest_name := trim(NEW.guest_first_name || ' ' || NEW.guest_last_name);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_guest_name ON public.reservations;
CREATE TRIGGER trg_sync_guest_name
  BEFORE INSERT ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.sync_guest_name();

-- Revoke public execute on security-sensitive functions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_guest_name() FROM anon, authenticated;

-- ============================================================
-- RESERVATIONS policies
-- ============================================================
CREATE POLICY "Anyone can insert a reservation request"
  ON public.reservations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    guest_first_name <> '' AND
    guest_last_name <> '' AND
    guest_email <> '' AND
    check_in < check_out AND
    guests > 0
  );

CREATE POLICY "Authenticated users can view their own reservations by email"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (guest_email = ((select auth.jwt()) ->> 'email'));

CREATE POLICY "Admin can view all reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can update reservations"
  ON public.reservations FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete reservations"
  ON public.reservations FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- PROPERTIES admin policies
-- ============================================================
CREATE POLICY "Admin can insert properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- RATE_SETTINGS admin policies
-- ============================================================
CREATE POLICY "Admin can insert rate settings"
  ON public.rate_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update rate settings"
  ON public.rate_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete rate settings"
  ON public.rate_settings FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- BLACKOUT_DATES admin policies
-- ============================================================
CREATE POLICY "Admin can insert blackout dates"
  ON public.blackout_dates FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update blackout dates"
  ON public.blackout_dates FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete blackout dates"
  ON public.blackout_dates FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- REVIEWS admin policies
-- ============================================================
CREATE POLICY "Admin can view all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- FAQS admin policies
-- ============================================================
CREATE POLICY "Admin can view all faqs"
  ON public.faqs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert faqs"
  ON public.faqs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update faqs"
  ON public.faqs FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete faqs"
  ON public.faqs FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- CALL_REQUEST admin policy
-- ============================================================
CREATE POLICY "Admin can view call requests"
  ON public.call_request FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO properties (name, tagline, description, bedrooms, bathrooms, max_guests, badge, amenities, image_url, is_active, display_order)
VALUES
  ('Casa Margaritas', 'Comfortable Heart of Rocky Point',
   'A cozy, fully equipped central getaway with modern comforts and easy access to Rocky Point attractions. Perfect for groups seeking a vibrant local experience.',
   5, 2.5, 10, 'Most Popular',
   '["A/C", "WiFi", "Full Kitchen", "Parking"]'::jsonb,
   'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg',
   true, 1),
  ('Casa Tropical Mango', 'Tropical Comfort Near the Beach',
   'A bright tropical retreat near the beach, offering comfort, convenience, and all essential amenities. Ideal for large family gatherings.',
   7, 4, 14, 'Largest Property',
   '["A/C", "WiFi", "BBQ Grill", "Beach Access"]'::jsonb,
   'https://res.cloudinary.com/dq9mbqfct/image/upload/v1778347793/mango_jcbjpi.png',
   true, 2),
  ('Casa Delphine', 'Charming Coastal Home for Families',
   'A cozy, fully equipped coastal retreat with A/C, WiFi, and a central location close to the beach. The ideal family sanctuary.',
   6, 4, 12, 'Family Favorite',
   '["A/C", "WiFi", "Patio", "Near Beach"]'::jsonb,
   'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.30.52_PM_uncyqm.jpg',
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
