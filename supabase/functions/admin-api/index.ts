import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, x-admin-token",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: session } = await supabase
      .from("admin_sessions")
      .select("email")
      .eq("token", adminToken)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (!session) return json({ error: "Unauthorized" }, 401);

    const url = new URL(req.url);
    const parts = url.pathname.replace(/^\/admin-api\/?/, "").split("/").filter(Boolean);
    const resource = parts[0];
    const resourceId = parts[1];

    // ── RESERVATIONS ─────────────────────────────────────────────
    if (req.method === "GET" && resource === "reservations") {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "PATCH" && resource === "reservations" && resourceId) {
      const body = await req.json();
      const { error } = await supabase.from("reservations").update(body).eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (req.method === "DELETE" && resource === "reservations" && resourceId) {
      const { error } = await supabase.from("reservations").delete().eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── REVIEWS ──────────────────────────────────────────────────
    if (req.method === "GET" && resource === "reviews") {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "reviews") {
      const body = await req.json();
      const { data, error } = await supabase.from("reviews").insert(body).select().single();
      if (error) return json({ error: error.message }, 500);
      return json(data, 201);
    }

    if (req.method === "PATCH" && resource === "reviews" && resourceId) {
      const body = await req.json();
      const { error } = await supabase.from("reviews").update(body).eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (req.method === "DELETE" && resource === "reviews" && resourceId) {
      const { error } = await supabase.from("reviews").delete().eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── PROPERTIES ───────────────────────────────────────────────
    if (req.method === "GET" && resource === "properties") {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("display_order");
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "properties") {
      const body = await req.json();
      const { data, error } = await supabase.from("properties").insert(body).select().single();
      if (error) return json({ error: error.message }, 500);
      return json(data, 201);
    }

    if (req.method === "PATCH" && resource === "properties" && resourceId) {
      const body = await req.json();
      const { error } = await supabase.from("properties").update(body).eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (req.method === "DELETE" && resource === "properties" && resourceId) {
      const { error } = await supabase.from("properties").delete().eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── RATE SETTINGS ────────────────────────────────────────────
    if (req.method === "GET" && resource === "rate-settings") {
      const { data, error } = await supabase
        .from("rate_settings")
        .select("*")
        .eq("property_name", "global")
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "rate-settings") {
      const body = await req.json();
      const { data, error } = await supabase.from("rate_settings").insert(body).select().single();
      if (error) return json({ error: error.message }, 500);
      return json(data, 201);
    }

    if (req.method === "PATCH" && resource === "rate-settings" && resourceId) {
      const body = await req.json();
      const { error } = await supabase
        .from("rate_settings")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── BLACKOUT DATES ───────────────────────────────────────────
    if (req.method === "GET" && resource === "blackout-dates") {
      const { data, error } = await supabase
        .from("blackout_dates")
        .select("*")
        .order("start_date");
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "blackout-dates") {
      const body = await req.json();
      const ALL_PROPERTY_NAMES = ["Casa Margaritas", "Casa Tropical Mango", "Casa Delphine"];
      const rows = body.property_name === "All Properties"
        ? ALL_PROPERTY_NAMES.map((name) => ({ ...body, property_name: name }))
        : [body];
      const { data, error } = await supabase.from("blackout_dates").insert(rows).select();
      if (error) return json({ error: error.message }, 500);
      return json(rows.length === 1 ? data![0] : data, 201);
    }

    if (req.method === "DELETE" && resource === "blackout-dates" && resourceId) {
      const { error } = await supabase.from("blackout_dates").delete().eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── FAQS ─────────────────────────────────────────────────────
    if (req.method === "GET" && resource === "faqs") {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order")
        .order("created_at");
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "faqs") {
      const body = await req.json();
      const { data, error } = await supabase.from("faqs").insert(body).select().single();
      if (error) return json({ error: error.message }, 500);
      return json(data, 201);
    }

    if (req.method === "PATCH" && resource === "faqs" && resourceId) {
      const body = await req.json();
      const { error } = await supabase.from("faqs").update(body).eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (req.method === "DELETE" && resource === "faqs" && resourceId) {
      const { error } = await supabase.from("faqs").delete().eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── SMS NOTIFICATION RECIPIENTS ──────────────────────────────
    if (req.method === "GET" && resource === "sms-recipients") {
      const { data, error } = await supabase
        .from("sms_notification_recipients")
        .select("*")
        .order("created_at");
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "sms-recipients") {
      const body = await req.json();
      // Enforce max 5 active recipients
      if (body.is_active !== false) {
        const { count } = await supabase
          .from("sms_notification_recipients")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true);
        if ((count ?? 0) >= 5) {
          return json({ error: "Maximum of 5 active recipients allowed" }, 422);
        }
      }
      const { data, error } = await supabase
        .from("sms_notification_recipients")
        .insert(body)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json(data, 201);
    }

    if (req.method === "PATCH" && resource === "sms-recipients" && resourceId) {
      const body = await req.json();
      // Enforce max 5 active when activating
      if (body.is_active === true) {
        const { count } = await supabase
          .from("sms_notification_recipients")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true)
          .neq("id", resourceId);
        if ((count ?? 0) >= 5) {
          return json({ error: "Maximum of 5 active recipients allowed" }, 422);
        }
      }
      const { error } = await supabase
        .from("sms_notification_recipients")
        .update(body)
        .eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (req.method === "DELETE" && resource === "sms-recipients" && resourceId) {
      const { error } = await supabase
        .from("sms_notification_recipients")
        .delete()
        .eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── EMAIL NOTIFICATION RECIPIENTS ────────────────────────────
    if (req.method === "GET" && resource === "email-recipients") {
      const { data, error } = await supabase
        .from("email_notification_recipients")
        .select("*")
        .order("created_at");
      if (error) return json({ error: error.message }, 500);
      return json(data);
    }

    if (req.method === "POST" && resource === "email-recipients") {
      const body = await req.json();
      if (body.is_active !== false) {
        const { count } = await supabase
          .from("email_notification_recipients")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true);
        if ((count ?? 0) >= 3) {
          return json({ error: "Maximum of 3 active email recipients allowed" }, 422);
        }
      }
      const { data, error } = await supabase
        .from("email_notification_recipients")
        .insert(body)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json(data, 201);
    }

    if (req.method === "PATCH" && resource === "email-recipients" && resourceId) {
      const body = await req.json();
      if (body.is_active === true) {
        const { count } = await supabase
          .from("email_notification_recipients")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true)
          .neq("id", resourceId);
        if ((count ?? 0) >= 3) {
          return json({ error: "Maximum of 3 active email recipients allowed" }, 422);
        }
      }
      const { error } = await supabase
        .from("email_notification_recipients")
        .update(body)
        .eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (req.method === "DELETE" && resource === "email-recipients" && resourceId) {
      const { error } = await supabase
        .from("email_notification_recipients")
        .delete()
        .eq("id", resourceId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // ── SEND OWNER NOTIFICATION EMAIL ────────────────────────────
    if (req.method === "POST" && resource === "send-owner-notification") {
      const { reservationId } = await req.json();
      if (!reservationId) return json({ error: "reservationId required" }, 400);

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      const resp = await fetch(`${supabaseUrl}/functions/v1/notify`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ type: "new_reservation", reservationId }),
      });

      const data = await resp.json();
      if (!resp.ok) return json({ error: data.error ?? "Failed to send", detail: data }, 500);
      return json(data);
    }

    // ── SEND CONFIRMATION EMAIL ───────────────────────────────────
    if (req.method === "POST" && resource === "send-confirmation") {
      const { reservationId, forceStatus } = await req.json();
      if (!reservationId) return json({ error: "reservationId required" }, 400);

      const { data: res } = await supabase
        .from("reservations")
        .select("*")
        .eq("id", reservationId)
        .maybeSingle();

      if (!res) return json({ error: "Reservation not found" }, 404);

      const newStatus = forceStatus ?? "confirmed";
      await supabase.from("reservations").update({ status: newStatus }).eq("id", reservationId);

      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        const checkIn = new Date(res.check_in + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        const checkOut = new Date(res.check_out + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        const emailHtml = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="background: #0d3d3a; padding: 32px; text-align: center;">
              <h1 style="color: #fff; font-weight: 300; font-size: 28px; margin: 0;">Booking Confirmed</h1>
              <p style="color: rgba(255,255,255,0.6); font-family: sans-serif; font-size: 13px; margin: 8px 0 0;">Rocky Point 4 Rentals</p>
            </div>
            <div style="padding: 32px; background: #fff;">
              <p style="font-family: sans-serif; font-size: 15px; color: #475569;">Dear ${res.guest_first_name},</p>
              <p style="font-family: sans-serif; font-size: 15px; color: #475569; line-height: 1.6;">
                Great news! Your reservation at <strong>${res.property_name}</strong> has been confirmed. We look forward to hosting you!
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; margin: 24px 0;">
                <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin: 0 0 16px; font-family: sans-serif;">Reservation Details</h2>
                <table style="width: 100%; font-family: sans-serif; font-size: 14px; border-collapse: collapse;">
                  <tr><td style="color: #94a3b8; padding: 4px 0;">Property</td><td style="color: #1e293b; font-weight: 600; text-align: right;">${res.property_name}</td></tr>
                  <tr><td style="color: #94a3b8; padding: 4px 0;">Check-in</td><td style="color: #1e293b; font-weight: 600; text-align: right;">${checkIn}</td></tr>
                  <tr><td style="color: #94a3b8; padding: 4px 0;">Check-out</td><td style="color: #1e293b; font-weight: 600; text-align: right;">${checkOut}</td></tr>
                  <tr><td style="color: #94a3b8; padding: 4px 0;">Guests</td><td style="color: #1e293b; font-weight: 600; text-align: right;">${res.guests}</td></tr>
                  <tr><td style="color: #94a3b8; padding: 4px 0; border-top: 1px solid #e2e8f0; padding-top: 12px;">Total</td><td style="color: #0d3d3a; font-weight: 700; font-size: 16px; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 12px;">$${Number(res.total_amount).toLocaleString()}</td></tr>
                </table>
              </div>
              <div style="background: #1e293b; padding: 20px;">
                <p style="font-family: sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin: 0 0 8px;">Balance Due on Arrival</p>
                <p style="font-family: Georgia, serif; font-size: 24px; color: #fff; margin: 0;">$${Number(res.balance_due).toLocaleString()}</p>
              </div>
              <p style="font-family: sans-serif; font-size: 14px; color: #64748b; margin-top: 24px; line-height: 1.6;">
                Questions? Call or text us at <a href="tel:+14802070114" style="color: #0d3d3a;">+1 (480) 207-0114</a> or reply to this email.
              </p>
              <p style="font-family: sans-serif; font-size: 13px; color: #94a3b8;">
                Ref: #${res.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>`;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Rocky Point 4 Rentals <onboarding@resend.dev>",
            to: [res.guest_email],
            subject: `Booking Confirmed — ${res.property_name}`,
            html: emailHtml,
          }),
        });
      }

      return json({ success: true, status: "confirmed" });
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: "Internal server error" }, 500);
  }
});
