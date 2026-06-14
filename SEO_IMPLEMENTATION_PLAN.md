# Rocky Point Wonderland Rentals — SEO Implementation Plan

**Production Domain:** rockypoint4rent.com  
**Current Dev Domain:** rockypoint-rentals-upgrade.bolt.host  
**Analysis Date:** May 24, 2026

---

## 1. CURRENT ROUTES & INDEXABILITY

| Route | Component | Status | Indexable | Issues |
|-------|-----------|--------|-----------|--------|
| `/` | HomePage | ✓ Active | YES | SEO metadata set via useSeo hook |
| `/casa-margaritas` | CasaMargaritasPage | ✓ Active | YES | SEO metadata set via useSeo hook |
| `/casa-tropical-mango` | CasaTropicalMangoPage | ✓ Active | YES | SEO metadata set via useSeo hook |
| `/casa-delphine` | CasaDelphinePage | ✓ Active | YES | SEO metadata set via useSeo hook |
| `/search` | SearchResultsPage | ✓ Active | **NO** | robots.txt disallows; missing SEO metadata |
| `/book` | BookingPage | ✓ Active | **NO** | robots.txt disallows; missing SEO metadata |
| `/admin/*` | AdminApp | ✓ Active | **NO** | robots.txt disallows; correct security practice |

---

## 2. PROPERTY DETAIL PAGE ROUTES

### Current Structure
- **Slug Format:** `/casa-[property-slug]`
  - `/casa-margaritas` → Casa Margaritas (5-bed)
  - `/casa-tropical-mango` → Casa Tropical Mango (7-bed)
  - `/casa-delphine` → Casa Delphine (6-bed)

### SEO Coverage
- ✓ **Title Tags:** Property-specific titles with keyword targeting (bedroom count, location)
- ✓ **Meta Descriptions:** 155-160 chars; include bedrooms, bathrooms, amenities, key selling points
- ✓ **Canonical Tags:** Set correctly via useSeo hook
- ✓ **Structured Data:** Schema.org House/LodgingBusiness schema defined in index.html
  - Casa Margaritas: 5 rooms, 25 max occupancy
  - Casa Tropical Mango: 7 rooms, 25 max occupancy, beach access highlighted
  - Casa Delphine: 6 rooms, 25 max occupancy, waterfall feature highlighted
- ✓ **Sitemap:** All three properties included with weekly changefreq, 0.9 priority

### Issues
1. **No images in property schema:** Schema lists House/@id but no Image objects
2. **No rental pricing schema:** Missing Offer, PriceSpecification for rate transparency
3. **No review/rating schema:** No AggregateRating or Review schema (no reviews currently)
4. **Limited internal linking:** Properties not cross-linked (no "compare" or "similar properties" sections)

---

## 3. BOOKING FLOW ROUTES & COMPONENTS

### Routes Involved
| Path | Component | Client-Side | Prerender | Issue |
|------|-----------|-------------|-----------|-------|
| `/book` | BookingPage | ✓ Yes | ✗ No | Blocked by robots.txt; pricing calculated client-side |
| (sub-components) | BookingModal | ✓ Yes | ✗ No | Step-by-step form; no SSR data |

### Booking Data Flow
1. **Guest selects property** → calls `onBook(propertyName, maxGuests)`
2. **Sets BookingTarget state** → navigates to `/book`
3. **BookingPage renders BookingModal** with property context
4. **User enters dates** → `getBookingPricing()` calculates fees (client-side)
5. **User enters guest details** → Form validation (client-side)
6. **Submits reservation** → POST to Supabase `reservations` table

### SEO Implications
- ✓ **Correct robots.txt:** `/book` is correctly disallowed (not intended for search results)
- ✗ **No metadata:** BookingPage has no useSeo hook; no SEO tags if ever crawled
- ✗ **No structured data:** No Reservation or Order schema
- ✗ **No confirmation page SEO:** Post-booking confirmation (/book → confirm) has no meta tags

### Pricing Calculation (Client-Side Only)
```
subtotal = sum of nightly rates (day-of-week dependent)
total = subtotal + $189 (cleaning) + $85 (property) + $75 (linen) + petFee
deposit = $200
dueOnArrival = total - $200
```
**Risk:** If search engines ever access `/book` directly (robots.txt violation), pricing data appears only in JavaScript; no SEO value.

---

## 4. MISSING SEO METADATA

### Missing on Current Pages
| Page | Missing Element | Impact | Priority |
|------|-----------------|--------|----------|
| HomePage, All Property Pages | Schema: PropertyImages | Moderate | Medium |
| HomePage, All Property Pages | Schema: PriceSpecification/Offer | Moderate | Medium |
| HomePage, All Property Pages | Schema: AggregateRating | Low | Low (no reviews yet) |
| All Pages | Open Graph: Images with actual property photos | High | High |
| All Pages | Twitter Card: Optimized for sharing | Moderate | Medium |
| Property Pages | Hreflang (multi-language variants) | Low | Low (English-only) |
| SearchResults, BookingPage | Any SEO tags whatsoever | N/A | N/A (intentionally excluded) |

### Metadata Issues in HTML Head
- **Canonical URL mismatch:** index.html has canonical `https://rockypoint4rentals.com/` but production will be `rockypoint4rent.com`
  - useSeo hook uses `BASE_URL = 'https://rockypoint4rentals.com'` (hardcoded)
  - **FIX:** Use environment variable for domain

- **OG:Image mismatch:** Homepage OG image is Pexels generic beach photo, not actual property photos
  - Property pages default to Pexels image (DEFAULT_IMAGE in useSeo.ts)
  - **FIX:** Set property-specific og:image values

- **Twitter Card:** Missing twitter:site, twitter:creator

---

## 5. MISSING STRUCTURED DATA

### Current Schema Coverage
- ✓ LodgingBusiness (business-level)
- ✓ House (property-level, 3 properties)
- ✗ **PropertyImages:** No Image schema linked to House
- ✗ **Offer:** No PriceSpecification or rental pricing info
- ✗ **Review/AggregateRating:** No review data
- ✗ **FAQPage:** FAQ section exists but no FAQ schema
- ✗ **VideoObject:** No video schema (if videos exist)
- ✗ **LocalBusiness:** Could strengthen local SEO for Puerto Peñasco
- ✗ **ContactPoint:** Business contact info is in schema but not rich-snippeted

### Quick Wins for Structured Data
1. Add Image schema to each House (@type: House)
   - Link to primary property image from Cloudinary
   - Include thumbnail image for carousel

2. Add Offer + PriceSpecification
   - Nightly rate by day-of-week
   - Cleaning fee, property fee, linen fee
   - Min/max stay requirements

3. Add FAQPage schema for FAQ section
   - Questions already on page; just need JSON-LD

4. Add LocalBusiness schema variant
   - Service area: Puerto Peñasco, Rocky Point, Sonora, Mexico
   - Location: Puerto Peñasco

---

## 6. MISSING SITEMAP & ROBOTS SETUP

### Current Sitemap (public/sitemap.xml)
- ✓ **Homepage:** `/` (priority 1.0, weekly)
- ✓ **Property pages:** 3 properties (priority 0.9, monthly)
- ✓ **Image sitemaps:** Each property includes primary image
- ✗ **No search results:** Intentionally excluded (good; marked noindex)
- ✗ **No booking pages:** Intentionally excluded (good; marked noindex)
- ✗ **No FAQ subpage:** If FAQ moves to dedicated route, should be indexed

**Issues:**
1. **Hardcoded domain:** Sitemap uses `https://rockypoint4rentals.com/`; must update to `rockypoint4rent.com` for production
2. **lastmod dates:** Manually set to 2026-05-18; no automated update mechanism
3. **Image sitemap:** Primary image only; carousel images not included
4. **No priority guidance:** All property pages have 0.9 priority; consider adjusting Casa Tropical Mango (largest, most featured) to 0.95

### Current Robots.txt (public/robots.txt)
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /book
Disallow: /search
Sitemap: https://rockypoint4rentals.com/sitemap.xml
```
- ✓ **Correct:** Blocks booking flow and admin
- ✓ **Correct:** Allows indexable pages
- ✗ **Hardcoded domain:** Must update for production

### Canonical Tags
- ✓ Set per-page via useSeo hook
- ✗ Hardcoded to `rockypoint4rentals.com` (BASE_URL in useSeo.ts)

---

## 7. CLIENT-SIDE RENDERING RISKS

### Risk Assessment

| Component | Risk Level | Issue | Mitigation |
|-----------|-----------|-------|-----------|
| **HomePage** | LOW | All content (Hero, Properties, About, Testimonials) renders on initial load | No action needed; Google can crawl |
| **Property Pages** | LOW | All content static (description, amenities, images, testimonials) | No action needed; Google can crawl |
| **SearchResults** | MODERATE | Results loaded via checkAvailability() after mount | Blocked by robots.txt; not crawled anyway |
| **BookingModal** | MODERATE | Pricing calculated client-side via JavaScript | Blocked by robots.txt; not crawled anyway |
| **Images** | MODERATE | Cloudinary + Pexels images; loading via img src tags | No lazy loading; images discoverable by Googlebot |
| **Navigation** | LOW | Custom history API instead of anchor tags | useSeo hook updates meta tags on navigation |

### Google Crawlability
- ✓ **Homepage:** Fully crawlable; all critical content server-rendered or in HTML
- ✓ **Property Pages:** Fully crawlable; static content in JSX
- ✓ **SearchResults:** Blocked by robots.txt; intentional
- ✓ **BookingFlow:** Blocked by robots.txt; intentional

### JavaScript Bundle Size
- **Current:** 539.94 kB (130.61 kB gzip) — likely hits Lighthouse issues
- **Risk:** Large JS bundle may slow crawl budget consumption
- **Recommendation:** Code-split at route level (not critical for this analysis)

---

## 8. RECOMMENDED ROUTE STRUCTURE FOR SEO WIN

### Fastest SEO Wins (Priority Order)

#### 1. **Fix Domain References** (1-2 hours)
- [ ] Replace hardcoded `rockypoint4rentals.com` with `rockypoint4rent.com`
  - Update `BASE_URL` in useSeo.ts
  - Update sitemap.xml domain
  - Update robots.txt domain
  - Update index.html canonical, og:url, schema @id URLs
- [ ] Use environment variable for domain (future-proof)

#### 2. **Add Property-Specific OpenGraph Images** (1-2 hours)
- [ ] Set `ogImage` prop in useSeo() calls for each property page
  - Casa Margaritas: Use Cloudinary image
  - Casa Tropical Mango: Use Cloudinary image (beach-focused)
  - Casa Delphine: Use Cloudinary image (waterfall-focused)
- [ ] Better social sharing preview = more click-through from Twitter/Facebook

#### 3. **Add Image Schema to House Schema** (1 hour)
```json
{
  "@type": "House",
  "@id": "https://rockypoint4rent.com/casa-margaritas#property",
  "image": [
    {
      "@type": "ImageObject",
      "url": "https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg",
      "name": "Casa Margaritas exterior with pool"
    },
    // ... carousel images
  ]
}
```
- [ ] Update House schema in index.html for all 3 properties
- Enables Google Images indexing, Image Search rich results

#### 4. **Add PriceSpecification to House Schema** (1-2 hours)
```json
"offers": {
  "@type": "Offer",
  "priceCurrency": "USD",
  "price": "225-350", // nightly rate range
  "priceSpecification": [
    {
      "@type": "PriceSpecification",
      "priceType": "SundayToWednesdayPrice",
      "price": "225"
    },
    {
      "@type": "PriceSpecification",
      "priceType": "ThursdayPrice",
      "price": "325"
    },
    {
      "@type": "PriceSpecification",
      "priceType": "FridaySaturdayPrice",
      "price": "350"
    }
  ],
  "availabilityStarts": "2026-01-01",
  "duration": "P1N", // 1 night minimum? Check policy
  "url": "https://rockypoint4rent.com/casa-margaritas"
}
```
- Rich snippet eligibility for hotel/rental pricing

#### 5. **Add FAQPage Schema** (30 mins)
- [ ] Audit FAQ component for questions/answers
- [ ] Add FAQPage schema to index.html or as separate inline script on pages with FAQ
- Enables FAQ rich snippets in search results

#### 6. **Update Sitemap Dynamic Dates** (optional, 1 hour)
- [ ] Implement automated lastmod date updates (build-time or deploy-time script)
- [ ] Update image sitemaps to include carousel images
- Current manual approach is acceptable; automation is "nice-to-have"

#### 7. **Twitter Card Enhancements** (30 mins)
- [ ] Add twitter:site and twitter:creator meta tags
- [ ] Set property-specific twitter:image values
- Better sharing on Twitter/X

### Routes NOT Needing SEO Changes
- ✓ `/book` — Correctly disallowed in robots.txt; no changes needed
- ✓ `/search` — Correctly disallowed in robots.txt; no changes needed
- ✓ `/admin/*` — Correctly disallowed in robots.txt; no changes needed

---

## 9. IMPLEMENTATION SUMMARY

### What's Working Well
1. ✓ Three property pages properly indexed
2. ✓ Basic schema.org markup in place (LodgingBusiness + House)
3. ✓ Correct robots.txt blocking non-indexable pages
4. ✓ Sitemap with proper priorities
5. ✓ Per-page meta tags via useSeo hook
6. ✓ Canonical tags correctly set
7. ✓ No significant client-side rendering risks for indexable pages

### What Needs Fixing
1. ✗ **Domain hardcoding** (critical for production launch)
2. ✗ **Missing PropertyImages schema** (moderate SEO boost)
3. ✗ **Missing PriceSpecification** (rich snippet eligibility)
4. ✗ **Missing OG image customization** (social sharing)
5. ✗ **Missing FAQPage schema** (rich snippet eligibility)

### Recommended Action Plan
1. **Phase 1 (Critical):** Fix domain references before production launch
2. **Phase 2 (Quick Wins):** Add Image + Price schema + OG images (3-4 hours total)
3. **Phase 3 (Polish):** FAQ schema, Twitter enhancements, carousel image sitemap (optional)

---

## 10. DOMAIN MIGRATION NOTES

### Before Launch to rockypoint4rent.com
- [ ] Update BASE_URL in src/lib/useSeo.ts
- [ ] Update canonical URL in index.html
- [ ] Update og:url in index.html
- [ ] Update all schema @id/@url references in index.html
- [ ] Update sitemap.xml domain
- [ ] Update robots.txt sitemap URL
- [ ] Set up 301 redirects from rockypoint4rentals.com → rockypoint4rent.com (via Netlify _redirects or .htaccess)
- [ ] Verify robots.txt is accessible at rockypoint4rent.com/robots.txt
- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor crawl stats and indexation in GSC 30 days post-launch

---

**End of SEO Implementation Plan**
