# Rocky Point 4 Rent — Pre-Launch Checklist

**Site:** https://rockypoint4rent.com  
**Updated:** 2026-06-05

---

## Deployment

- [ ] Deploy to production host (Netlify / Vercel / etc.)
- [ ] Confirm custom domain `rockypoint4rent.com` is pointed to host
- [ ] Confirm HTTPS is active (SSL certificate issued)
- [ ] Confirm `www.rockypoint4rent.com` redirects to `rockypoint4rent.com` (or vice versa — pick one canonical form and redirect the other)
- [ ] Confirm old domain `rockypoint4rentals.com` (with trailing "s") has a 301 redirect to `rockypoint4rent.com`

---

## Environment Variables (Supabase)

- [ ] `SUPABASE_URL` is set in production environment
- [ ] `SUPABASE_ANON_KEY` is set in production environment
- [ ] Confirm bookings submit successfully in production (test booking with real dates)
- [ ] Confirm availability search returns correct results in production

---

## Technical SEO — Verify After Deploy

- [ ] Visit `https://rockypoint4rent.com/robots.txt` — confirm disallow rules for `/admin`, `/book`, `/search`
- [ ] Visit `https://rockypoint4rent.com/sitemap.xml` — confirm all 8 URLs render with correct domain
- [ ] Open browser DevTools → Elements → `<head>` on homepage: confirm `<link rel="canonical">` = `https://rockypoint4rent.com/`
- [ ] Open browser DevTools on `/casa-margaritas`: confirm canonical = `https://rockypoint4rent.com/casa-margaritas`
- [ ] Open browser DevTools on `/search`: confirm `<meta name="robots" content="noindex, nofollow">` is present
- [ ] Open browser DevTools on `/book`: confirm `<meta name="robots" content="noindex, nofollow">` is present
- [ ] Check OG tags on homepage using https://www.opengraph.xyz (enter URL after deploy)
- [ ] Check Twitter card on homepage using https://cards-dev.twitter.com/validator (or https://www.opengraph.xyz)
- [ ] Test all 3 property pages for unique OG images in social preview tools

---

## Google Search Console

- [ ] Add property for `https://rockypoint4rent.com`
- [ ] Verify ownership (HTML tag method — add to `index.html` if needed)
- [ ] Submit sitemap: `https://rockypoint4rent.com/sitemap.xml`
- [ ] Request indexing for homepage manually
- [ ] Check Coverage report 48 hours after sitemap submission (watch for errors on `/search` and `/book`)

---

## Google Analytics / Tracking

- [ ] Decide on analytics provider (GA4 recommended)
- [ ] Create GA4 property for `rockypoint4rent.com`
- [ ] Add GA4 Measurement ID to `src/lib/analytics.ts` (uncomment `window.gtag` lines, add script tag to `index.html`)
- [ ] Verify events fire in GA4 DebugView:
  - `availability_search_started`
  - `availability_search_completed`
  - `property_viewed`
  - `booking_started`
  - `booking_step_completed`
  - `booking_submitted`
  - `contact_clicked`
  - `cta_clicked`

---

## Meta Pixel (Optional)

- [ ] Create Meta Pixel on Facebook Business Manager
- [ ] Add Pixel ID to `src/lib/analytics.ts` (uncomment `window.fbq` lines, add Pixel base code to `index.html`)
- [ ] Verify PageView fires on page load in Meta Events Manager

---

## Structured Data Validation

- [ ] Run homepage through Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Run `/casa-margaritas` through Rich Results Test — confirm VacationRental detected
- [ ] Run `/rocky-point-rentals` through Rich Results Test — confirm FAQPage detected
- [ ] No validation errors or warnings in Rich Results Test results

---

## Page Speed / Core Web Vitals

- [ ] Run homepage through PageSpeed Insights: https://pagespeed.web.dev (use production URL)
- [ ] LCP (Largest Contentful Paint) under 2.5 seconds on mobile
- [ ] No layout shift (CLS) errors from images without explicit width/height
- [ ] Review PageSpeed recommendations and address any critical issues

---

## Functional QA — Golden Path

- [ ] Homepage loads, hero visible, properties grid loads
- [ ] Click "Check Availability" — availability search opens, dates selectable
- [ ] Enter dates + guests, submit — lands on `/search` with correct results
- [ ] Click "Start Booking" on a search result — lands on `/book` with property name pre-filled
- [ ] Complete booking form (test: use fake data), submit — confirm reservation stored in Supabase
- [ ] Click "View Details" on a search result — navigates to property page
- [ ] All 3 property pages load: gallery, tabs (overview/amenities/rules/pricing), sticky booking card
- [ ] Property page breadcrumb: `Home > Rocky Point Rentals > [Property Name]` visible
- [ ] Lightbox opens on gallery click
- [ ] "Contact Us" button opens contact modal / navigates to `#contact`
- [ ] Footer all links functional (no 404s)
- [ ] Navbar dropdowns functional on desktop, accordions on mobile

---

## Breadcrumbs QA

- [ ] `/rocky-point-rentals` — `Home > Rocky Point Rentals`
- [ ] `/puerto-penasco-vacation-rentals` — `Home > Puerto Peñasco Vacation Rentals`
- [ ] `/rocky-point-rentals-from-arizona` — `Home > Rocky Point Rentals > Arizona Travelers`
- [ ] `/rocky-point-rentals-from-texas` — `Home > Rocky Point Rentals > Texas Travelers`
- [ ] `/casa-margaritas` — `Home > Rocky Point Rentals > Casa Margaritas`
- [ ] `/casa-tropical-mango` — `Home > Rocky Point Rentals > Casa Tropical Mango`
- [ ] `/casa-delphine` — `Home > Rocky Point Rentals > Casa Delphine`

---

## Mobile QA

- [ ] Homepage renders correctly on iPhone 12 / 375px viewport
- [ ] Navbar hamburger menu opens/closes
- [ ] Sticky mobile CTA appears after scrolling past hero (≥ 400px)
- [ ] All buttons are ≥ 44px tap target
- [ ] No horizontal scroll on any page
- [ ] Images not cropped awkwardly on mobile

---

## Content Checks

- [ ] All 3 property names spelled correctly throughout (Casa Margaritas, Casa Tropical Mango, Casa Delphine)
- [ ] Contact email correct: `reservations@rockypoint4rent.com`
- [ ] Phone number correct: `+1-480-207-0114`
- [ ] No placeholder/lorem ipsum text on any public page
- [ ] No "Wonderland" brand references remaining anywhere
- [ ] Property max guests accurate (all 3 sleep 25)
- [ ] Pricing section accurate on each property page

---

## Post-Launch (Week 1)

- [ ] Monitor Google Search Console for crawl errors
- [ ] Check that all 8 sitemap URLs have been discovered
- [ ] Watch for any 404s in server logs (broken links from old domain)
- [ ] Check Core Web Vitals in GSC after initial data collection (28 days)
- [ ] Set up Google Alerts for "Rocky Point 4 Rent" brand mentions

---

**Owner:** Tom & Lidia  
**Technical contact:** [Your developer's name / contact]
