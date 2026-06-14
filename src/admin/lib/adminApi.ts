const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const BASE = `${SUPABASE_URL}/functions/v1/admin-api`;

let _token: string | null = null;

export function setAdminToken(token: string | null) {
  _token = token;
}

function headers() {
  return {
    "Content-Type": "application/json",
    "x-admin-token": _token ?? "",
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers as Record<string, string> ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export const adminApi = {
  reservations: {
    list: () => request<Reservation[]>("reservations"),
    update: (id: string, data: Partial<Reservation>) =>
      request<{ success: boolean }>("reservations/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>("reservations/" + id, { method: "DELETE" }),
    sendConfirmation: (reservationId: string, forceStatus?: string) =>
      request<{ success: boolean; status: string }>("send-confirmation", {
        method: "POST",
        body: JSON.stringify({ reservationId, forceStatus }),
      }),
    sendOwnerNotification: (reservationId: string) =>
      request<{ success: boolean; id?: string; to?: string[] }>("send-owner-notification", {
        method: "POST",
        body: JSON.stringify({ reservationId }),
      }),
  },
  reviews: {
    list: () => request<Review[]>("reviews"),
    create: (data: Omit<Review, "id" | "created_at">) =>
      request<Review>("reviews", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Review>) =>
      request<{ success: boolean }>("reviews/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>("reviews/" + id, { method: "DELETE" }),
  },
  properties: {
    list: () => request<Property[]>("properties"),
    create: (data: Omit<Property, "id">) =>
      request<Property>("properties", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Omit<Property, "id">>) =>
      request<{ success: boolean }>("properties/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>("properties/" + id, { method: "DELETE" }),
  },
  rateSettings: {
    get: () => request<RateSetting | null>("rate-settings"),
    create: (data: Omit<RateSetting, "id">) =>
      request<RateSetting>("rate-settings", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Omit<RateSetting, "id">>) =>
      request<{ success: boolean }>("rate-settings/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  blackoutDates: {
    list: () => request<BlackoutDate[]>("blackout-dates"),
    create: (data: Omit<BlackoutDate, "id" | "created_at">) =>
      request<BlackoutDate>("blackout-dates", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>("blackout-dates/" + id, { method: "DELETE" }),
  },
  faqs: {
    list: () => request<Faq[]>("faqs"),
    create: (data: Omit<Faq, "id" | "created_at">) =>
      request<Faq>("faqs", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Omit<Faq, "id" | "created_at">>) =>
      request<{ success: boolean }>("faqs/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>("faqs/" + id, { method: "DELETE" }),
  },
  smsRecipients: {
    list: () => request<SmsRecipient[]>("sms-recipients"),
    create: (data: Omit<SmsRecipient, "id" | "created_at" | "updated_at">) =>
      request<SmsRecipient>("sms-recipients", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Omit<SmsRecipient, "id" | "created_at" | "updated_at">>) =>
      request<{ success: boolean }>("sms-recipients/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>("sms-recipients/" + id, { method: "DELETE" }),
  },
  emailRecipients: {
    list: () => request<EmailRecipient[]>("email-recipients"),
    create: (data: Omit<EmailRecipient, "id" | "created_at" | "updated_at">) =>
      request<EmailRecipient>("email-recipients", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Omit<EmailRecipient, "id" | "created_at" | "updated_at">>) =>
      request<{ success: boolean }>("email-recipients/" + id, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>("email-recipients/" + id, { method: "DELETE" }),
  },
};

export type BookingStatus =
  | "pending"
  | "deposit_paid"
  | "confirmed"
  | "balance_due"
  | "fully_paid"
  | "cancelled";

export type Reservation = {
  id: string;
  property_name: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  pet_addon: boolean;
  pet_fee: number;
  subtotal: number;
  cleaning_fee: number;
  linen_fee: number;
  property_fee: number;
  total_amount: number;
  deposit_amount: number;
  payment_option: string;
  amount_paid: number;
  balance_due: number;
  status: BookingStatus;
  created_at: string;
  notification_email_sent_at?: string | null;
  notification_email_error?: string | null;
};

export type Review = {
  id: string;
  guest_name: string;
  guest_location: string;
  property_name: string;
  rating: number;
  content: string;
  is_published: boolean;
  created_at: string;
};

export type Property = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  badge: string;
  amenities: string[];
  image_url: string;
  is_active: boolean;
  display_order: number;
};

export type RateSetting = {
  id: string;
  property_name: string;
  fri_sat_rate: number;
  sun_wed_rate: number;
  thu_rate: number;
  cleaning_fee: number;
  property_fee: number;
  deposit_amount: number;
};

export type BlackoutDate = {
  id: string;
  property_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export type SmsRecipient = {
  id: string;
  name: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EmailRecipient = {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
