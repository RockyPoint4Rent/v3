import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const twilioSid   = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom  = Deno.env.get("TWILIO_FROM_NUMBER");
    const ownerPhone  = Deno.env.get("OWNER_PHONE_NUMBER");

    if (!twilioSid || !twilioToken || !twilioFrom || !ownerPhone) {
      const missing = ["TWILIO_ACCOUNT_SID","TWILIO_AUTH_TOKEN","TWILIO_FROM_NUMBER","OWNER_PHONE_NUMBER"]
        .filter(k => !Deno.env.get(k));
      console.error("SMS: missing env vars:", missing.join(", "));
      return json({ error: "SMS not configured", missing }, 500);
    }

    const body = await req.json();
    const { reservationId } = body;
    if (!reservationId) return json({ error: "reservationId required" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the reservation
    const { data: res, error: resErr } = await supabase
      .from("reservations")
      .select("property_name,guest_first_name,guest_last_name,guest_phone,guest_email,check_in,check_out,total_amount,amount_paid,payment_option")
      .eq("id", reservationId)
      .maybeSingle();

    if (resErr) {
      console.error("SMS: reservation fetch error:", resErr.message, "id:", reservationId);
      return json({ error: "DB error", detail: resErr.message }, 500);
    }
    if (!res) {
      console.error("SMS: reservation not found, id:", reservationId);
      return json({ error: "Reservation not found", id: reservationId }, 404);
    }

    // Fetch active additional recipients
    const { data: recipients, error: recipErr } = await supabase
      .from("sms_notification_recipients")
      .select("phone_number, name")
      .eq("is_active", true);

    if (recipErr) {
      console.warn("SMS: could not fetch recipients:", recipErr.message);
    }

    // Build deduplicated recipient list — owner always first
    const phones = new Set<string>();
    phones.add(normalizePhone(ownerPhone));
    for (const r of recipients ?? []) {
      if (r.phone_number) phones.add(normalizePhone(r.phone_number));
    }

    const guestName = `${res.guest_first_name} ${res.guest_last_name}`.trim();
    const amountPaid = Number(res.amount_paid).toLocaleString();
    const message = [
      "NEW BOOKING REQUEST — Rocky Point 4 Rent",
      `Property: ${res.property_name}`,
      `Guest: ${guestName}`,
      `Phone: ${res.guest_phone}`,
      `Email: ${res.guest_email}`,
      `Dates: ${res.check_in} → ${res.check_out}`,
      `Total: $${Number(res.total_amount).toLocaleString()} | Paid: $${amountPaid} (${res.payment_option})`,
      "Admin: https://rockypoint4rent.com/admin",
    ].join("\n");

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
    const authHeader = "Basic " + btoa(`${twilioSid}:${twilioToken}`);
    const from = normalizePhone(twilioFrom);

    console.log(`SMS: sending to ${phones.size} recipient(s) for reservation ${reservationId}`);

    const results: { phone: string; ok: boolean; sid?: string; error?: string }[] = [];

    for (const phone of phones) {
      try {
        const formBody = new URLSearchParams({ To: phone, From: from, Body: message });
        const resp = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody.toString(),
        });

        const respData = await resp.json();

        if (!resp.ok) {
          const errMsg = `Twilio ${resp.status}: code=${respData.code} msg="${respData.message}"`;
          console.error(`SMS: FAILED to ${phone} —`, errMsg);
          results.push({ phone, ok: false, error: errMsg });
        } else {
          console.log(`SMS: sent to ${phone}, sid=${respData.sid}`);
          results.push({ phone, ok: true, sid: respData.sid });
        }
      } catch (err) {
        console.error(`SMS: network error for ${phone}:`, String(err));
        results.push({ phone, ok: false, error: String(err) });
      }
    }

    const sent = results.filter(r => r.ok).length;
    console.log(`SMS: ${sent}/${results.length} sent for reservation ${reservationId}`);

    return json({
      success: sent > 0,
      sent,
      total: results.length,
      results,
    });

  } catch (err) {
    console.error("SMS: unhandled error:", String(err));
    return json({ error: "Internal server error", detail: String(err) }, 500);
  }
});
