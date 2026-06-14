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

const PERMANENT_RECIPIENTS = [
  "reservations@rockypoint4rent.com",
];
const FROM = "Rocky Point 4 Rentals <reservations@rockypoint4rent.com>";

type ReservationRow = {
  id: string;
  property_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  pet_addon: boolean;
  pet_fee: number;
  linen_fee: number;
  subtotal: number;
  cleaning_fee: number;
  property_fee: number;
  total_amount: number;
  deposit_amount: number;
  payment_option: string;
  amount_paid: number;
  balance_due: number;
};

function fmtDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function fmtMoney(n: number) {
  return Number(n).toLocaleString("en-US");
}

function buildReservationEmail(r: ReservationRow): { subject: string; html: string } {
  const checkIn = fmtDate(r.check_in);
  const checkOut = fmtDate(r.check_out);
  const guestName = `${r.guest_first_name} ${r.guest_last_name}`.trim();
  const paymentLabel = r.payment_option === "deposit"
    ? `Deposit — $${fmtMoney(r.amount_paid)} now, $${fmtMoney(r.balance_due)} on arrival`
    : `Full payment — $${fmtMoney(r.total_amount)}`;

  const subject = `New Booking Request - ${r.property_name}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <div style="background: #0d3d3a; padding: 24px 32px;">
        <h1 style="color: #fff; font-size: 22px; margin: 0; font-weight: 400;">New Reservation Request</h1>
        <p style="color: rgba(255,255,255,0.55); font-size: 13px; margin: 6px 0 0;">Rocky Point 4 Rentals — Admin Notification</p>
      </div>
      <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none;">

        <div style="margin-bottom: 20px;">
          <span style="background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">Pending — awaiting your confirmation</span>
        </div>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Property</td>
            <td style="font-weight: 600; text-align: right;">${r.property_name}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Check-in</td>
            <td style="font-weight: 600; text-align: right;">${checkIn}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Check-out</td>
            <td style="font-weight: 600; text-align: right;">${checkOut}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Nights</td>
            <td style="font-weight: 600; text-align: right;">${r.nights}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Guests</td>
            <td style="font-weight: 600; text-align: right;">${r.guests}</td>
          </tr>
          ${r.pet_addon ? `<tr style="border-top: 1px solid #e2e8f0;"><td style="color: #64748b; padding: 8px 0;">Pet</td><td style="font-weight: 600; text-align: right;">Yes (+$${fmtMoney(r.pet_fee)})</td></tr>` : ""}
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Subtotal</td>
            <td style="text-align: right;">$${fmtMoney(r.subtotal)}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Cleaning fee</td>
            <td style="text-align: right;">$${fmtMoney(r.cleaning_fee)}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Linen fee</td>
            <td style="text-align: right;">$${fmtMoney(r.linen_fee)}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Property fee</td>
            <td style="text-align: right;">$${fmtMoney(r.property_fee)}</td>
          </tr>
          <tr style="border-top: 2px solid #0d3d3a;">
            <td style="color: #0d3d3a; padding: 10px 0; font-weight: 700; font-size: 16px;">Total</td>
            <td style="color: #0d3d3a; font-weight: 700; font-size: 16px; text-align: right;">$${fmtMoney(r.total_amount)}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="color: #64748b; padding: 8px 0;">Payment plan</td>
            <td style="font-weight: 500; text-align: right;">${paymentLabel}</td>
          </tr>
        </table>

        <div style="padding: 20px; background: #fff; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin: 0 0 12px;">Guest Information</p>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="color: #64748b; padding: 4px 0;">Name</td><td style="text-align: right; font-weight: 500;">${guestName}</td></tr>
            <tr><td style="color: #64748b; padding: 4px 0;">Email</td><td style="text-align: right;"><a href="mailto:${r.guest_email}" style="color: #0d3d3a;">${r.guest_email}</a></td></tr>
            <tr><td style="color: #64748b; padding: 4px 0;">Phone</td><td style="text-align: right;"><a href="tel:${r.guest_phone}" style="color: #0d3d3a;">${r.guest_phone}</a></td></tr>
          </table>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://rockypoint4rent.com/admin" style="display: inline-block; background: #0d3d3a; color: #fff; font-size: 14px; font-weight: 600; padding: 12px 32px; text-decoration: none; letter-spacing: 0.03em;">
            Review in Admin Dashboard
          </a>
        </div>

        <p style="font-size: 13px; color: #94a3b8; margin: 0;">Ref: #${r.id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>`;

  return { subject, html };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("notify: RESEND_API_KEY not configured");
      return json({ error: "Email not configured: RESEND_API_KEY missing" }, 500);
    }

    const body = await req.json();
    const { type } = body;

    if (type === "debug_account") {
      // Test: send a minimal email to verify the API key and FROM address work
      const testResp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: ["reservations@rockypoint4rent.com"],
          subject: "Rocky Point 4 Rent — Email System Test",
          html: "<p>This is a test email confirming the notification system is working correctly.</p>",
        }),
      });
      const testData = await testResp.json();
      return json({ httpStatus: testResp.status, resend: testData });
    }

    if (type === "new_reservation") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      let reservation: ReservationRow;
      let reservationId: string | null = null;

      if (body.reservationId) {
        reservationId = body.reservationId as string;
        const { data, error } = await supabase
          .from("reservations")
          .select("id,property_name,check_in,check_out,nights,guests,guest_first_name,guest_last_name,guest_email,guest_phone,pet_addon,pet_fee,linen_fee,subtotal,cleaning_fee,property_fee,total_amount,deposit_amount,payment_option,amount_paid,balance_due")
          .eq("id", reservationId)
          .maybeSingle();
        if (error || !data) {
          console.error("notify: reservation fetch error:", error?.message, "id:", reservationId);
          return json({ error: "Reservation not found", id: reservationId }, 404);
        }
        reservation = data as ReservationRow;
      } else if (body.reservation) {
        reservation = body.reservation as ReservationRow;
        reservationId = reservation.id ?? null;
      } else {
        return json({ error: "reservationId or reservation required" }, 400);
      }

      // Fetch up to 3 active additional email recipients
      const { data: extraRows } = await supabase
        .from("email_notification_recipients")
        .select("email")
        .eq("is_active", true)
        .limit(3);

      const extraEmails = (extraRows ?? []).map((r: { email: string }) => r.email).filter(Boolean);
      const toList = [...new Set([...PERMANENT_RECIPIENTS, ...extraEmails])];

      const { subject, html } = buildReservationEmail(reservation);

      console.log(`notify: sending to ${toList.length} recipient(s) for reservation ${reservationId}`);

      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: toList,
          reply_to: reservation.guest_email,
          subject,
          html,
        }),
      });

      const resendData = await resp.json();

      if (!resp.ok) {
        const errDetail = JSON.stringify(resendData);
        console.error(`notify: Resend error ${resp.status}:`, errDetail);

        // Stamp the error on the reservation for visibility in admin
        if (reservationId) {
          await supabase.from("reservations").update({
            notification_email_error: `${new Date().toISOString()} — Resend ${resp.status}: ${resendData.message ?? errDetail}`,
          }).eq("id", reservationId);
        }

        return json({ error: "Failed to send email", status: resp.status, detail: resendData }, 500);
      }

      console.log(`notify: email sent, id=${resendData.id}, to=${toList.join(", ")}`);

      // Stamp success on the reservation — visible in admin as proof
      if (reservationId) {
        await supabase.from("reservations").update({
          notification_email_sent_at: new Date().toISOString(),
          notification_email_error: null,
        }).eq("id", reservationId);
      }

      return json({ success: true, id: resendData.id, to: toList });
    }

    if (type === "contact_inquiry") {
      const { inquiry } = body as {
        inquiry: {
          name: string;
          email: string;
          phone?: string;
          property: string;
          dates?: string;
          message: string;
        };
      };

      const propertyLabel: Record<string, string> = {
        margaritas: "Casa Margaritas",
        mango: "Casa Tropical Mango",
        delphine: "Casa Delphine",
      };

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="background: #0d3d3a; padding: 24px 32px;">
            <h1 style="color: #fff; font-size: 22px; margin: 0; font-weight: 400;">New Contact Inquiry</h1>
            <p style="color: rgba(255,255,255,0.55); font-size: 13px; margin: 6px 0 0;">Rocky Point 4 Rentals</p>
          </div>
          <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="color: #64748b; padding: 8px 0;">From</td>
                <td style="font-weight: 600; text-align: right;">${inquiry.name}</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="color: #64748b; padding: 8px 0;">Email</td>
                <td style="text-align: right;"><a href="mailto:${inquiry.email}" style="color: #0d3d3a;">${inquiry.email}</a></td>
              </tr>
              ${inquiry.phone ? `<tr style="border-top: 1px solid #e2e8f0;"><td style="color: #64748b; padding: 8px 0;">Phone</td><td style="text-align: right;"><a href="tel:${inquiry.phone}" style="color: #0d3d3a;">${inquiry.phone}</a></td></tr>` : ""}
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="color: #64748b; padding: 8px 0;">Property</td>
                <td style="font-weight: 600; text-align: right;">${propertyLabel[inquiry.property] ?? inquiry.property}</td>
              </tr>
              ${inquiry.dates ? `<tr style="border-top: 1px solid #e2e8f0;"><td style="color: #64748b; padding: 8px 0;">Preferred Dates</td><td style="font-weight: 600; text-align: right;">${inquiry.dates}</td></tr>` : ""}
            </table>
            ${inquiry.message ? `
            <div style="margin-top: 24px; padding: 20px; background: #fff; border: 1px solid #e2e8f0;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin: 0 0 10px;">Message</p>
              <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0;">${inquiry.message.replace(/\n/g, "<br>")}</p>
            </div>` : ""}
            <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">Reply directly to this email to respond to ${inquiry.name}.</p>
          </div>
        </div>`;

      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: PERMANENT_RECIPIENTS,
          reply_to: inquiry.email,
          subject: `New Inquiry — ${propertyLabel[inquiry.property] ?? inquiry.property} from ${inquiry.name}`,
          html,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        console.error("notify: Resend contact error:", JSON.stringify(err));
        return json({ error: "Failed to send email", status: resp.status, detail: err }, 500);
      }

      return json({ success: true });
    }

    return json({ error: "Unknown notification type" }, 400);
  } catch (err) {
    console.error("notify: unhandled error:", String(err));
    return json({ error: "Internal server error", detail: String(err) }, 500);
  }
});
