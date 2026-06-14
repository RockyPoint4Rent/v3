import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const folder = url.searchParams.get("folder");

    if (!folder) {
      return new Response(JSON.stringify({ error: "folder param required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read Cloudinary credentials from app_config table via service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: configRows, error: configError } = await supabase
      .from("app_config")
      .select("key, value")
      .in("key", ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]);

    if (configError || !configRows || configRows.length < 3) {
      return new Response(JSON.stringify({ error: "Cloudinary credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config: Record<string, string> = {};
    for (const row of configRows) config[row.key] = row.value;

    const cloudName = config["CLOUDINARY_CLOUD_NAME"];
    const apiKey = config["CLOUDINARY_API_KEY"];
    const apiSecret = config["CLOUDINARY_API_SECRET"];

    const credentials = btoa(`${apiKey}:${apiSecret}`);

    // Use the search API to filter by asset_folder (Cloudinary "folder" in the UI)
    const searchPayload = {
      expression: `asset_folder="${folder}"`,
      max_results: 500,
    };

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: `Cloudinary API error: ${text}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    const images = (data.resources ?? []).map((r: { public_id: string; format: string; secure_url: string }) => ({
      url: `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/${r.public_id}.${r.format}`,
      publicId: r.public_id,
    }));

    return new Response(JSON.stringify({ images }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
