/**
 * Analytics helper for Rocky Point 4 Rent.
 *
 * All functions are safe no-ops if analytics is not connected.
 * Ready to wire to GA4 (window.gtag) or Meta Pixel (window.fbq).
 *
 * Do NOT pass personal information (names, emails, phone numbers)
 * or payment details to any tracking function.
 */

const IS_DEV = import.meta.env.DEV;

type EventPayload = Record<string, string | number | boolean>;

function track(event: string, payload: EventPayload = {}): void {
  if (IS_DEV) {
    console.debug(`[analytics] ${event}`, payload);
  }
  // GA4 — uncomment to connect:
  // (window as any).gtag?.('event', event, payload);
  // Meta Pixel — uncomment to connect:
  // (window as any).fbq?.('trackCustom', event, payload);
}

export const analytics = {
  availabilitySearchStarted: (params: { source: string }) =>
    track('availability_search_started', params),

  availabilitySearchCompleted: (params: { source: string; nights: number; guests: number }) =>
    track('availability_search_completed', params),

  propertyViewed: (params: { property_name: string; source: string }) =>
    track('property_viewed', params),

  bookingStarted: (params: { property_name: string; source: string }) =>
    track('booking_started', params),

  bookingStepCompleted: (params: { property_name: string; step: string }) =>
    track('booking_step_completed', params),

  bookingSubmitted: (params: { property_name: string; nights: number }) =>
    track('booking_submitted', params),

  contactClicked: (params: { source: string }) =>
    track('contact_clicked', params),

  ctaClicked: (params: { label: string; source: string }) =>
    track('cta_clicked', params),
};
