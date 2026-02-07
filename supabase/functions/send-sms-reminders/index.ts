import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// City details: address, Google Maps link, supervisor phone
const CITY_DETAILS: Record<string, { address: string; mapLink: string; phone: string }> = {
  Jeddah: {
    address: "جدة - حي الروابي",
    mapLink: "https://maps.app.goo.gl/4XnMD3Dkhh1UE3o2A?g_st=iw",
    phone: "966573551003",
  },
  Riyadh: {
    address: "الرياض - حي السلي",
    mapLink: "https://maps.app.goo.gl/TVFqRWki8nfnmuaw8?g_st=iw",
    phone: "966558551076",
  },
  Dammam: {
    address: "الدمام - حي المنار",
    mapLink: "https://maps.app.goo.gl/6mKFg6fVpLcxJgkP9?g_st=iw",
    phone: "966510029651",
  },
  Makkah: {
    address: "مكة المكرمة - حي البحيرات",
    mapLink: "https://maps.app.goo.gl/GtV4TMEqfRGyhQfi8?g_st=iw",
    phone: "966573542070",
  },
};

// Time slots per city (Saudi time, UTC+3)
const CITY_TIME_SLOTS: Record<string, string> = {
  Jeddah: "12:00",
  Riyadh: "14:00",
  Dammam: "17:00",
  Makkah: "17:00",
};

// 5 hours before each slot (in Saudi time HH:MM)
const REMINDER_WINDOWS: Record<string, string> = {
  "12:00": "07:00",
  "14:00": "09:00",
  "17:00": "12:00",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const moraApiKey = Deno.env.get("MORA_API_KEY")!;
    const moraUsername = Deno.env.get("MORA_USERNAME")!;
    const moraSender = Deno.env.get("MORA_SENDER")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current time in Saudi Arabia (UTC+3)
    const now = new Date();
    const saudiOffset = 3 * 60; // minutes
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const saudiNow = new Date(utcMs + saudiOffset * 60000);

    const saudiHour = saudiNow.getHours();
    const saudiMinute = saudiNow.getMinutes();
    const saudiTimeStr = `${saudiHour.toString().padStart(2, "0")}:${saudiMinute.toString().padStart(2, "0")}`;

    // Today's date in Saudi timezone (YYYY-MM-DD)
    const saudiYear = saudiNow.getFullYear();
    const saudiMonth = (saudiNow.getMonth() + 1).toString().padStart(2, "0");
    const saudiDay = saudiNow.getDate().toString().padStart(2, "0");
    const todaySaudi = `${saudiYear}-${saudiMonth}-${saudiDay}`;

    console.log(`[SMS Reminders] Saudi time now: ${saudiTimeStr}, Date: ${todaySaudi}`);

    // Find which time slots need reminders right now
    // We check if Saudi time is within 15 minutes of the reminder time
    const slotsToRemind: string[] = [];
    for (const [timeSlot, reminderTime] of Object.entries(REMINDER_WINDOWS)) {
      const [reminderHour, reminderMinute] = reminderTime.split(":").map(Number);
      const diffMinutes = (saudiHour * 60 + saudiMinute) - (reminderHour * 60 + reminderMinute);

      // Trigger if we're within 0-14 minutes past the reminder time (covers the 15-min cron window)
      if (diffMinutes >= 0 && diffMinutes < 15) {
        slotsToRemind.push(timeSlot);
        console.log(`[SMS Reminders] Time slot ${timeSlot} is due for reminders (reminder time: ${reminderTime})`);
      }
    }

    if (slotsToRemind.length === 0) {
      console.log("[SMS Reminders] No time slots due for reminders right now.");
      return new Response(
        JSON.stringify({ message: "No reminders due", time: saudiTimeStr }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Query bookings that need SMS reminders
    const { data: bookings, error: fetchError } = await supabase
      .from("bookings")
      .select("id, full_name, mobile, city, booking_date, time_slot")
      .eq("booking_date", todaySaudi)
      .in("time_slot", slotsToRemind)
      .eq("sms_sent", false);

    if (fetchError) {
      console.error("[SMS Reminders] Error fetching bookings:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch bookings", details: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!bookings || bookings.length === 0) {
      console.log("[SMS Reminders] No unsent reminders found for due slots.");
      return new Response(
        JSON.stringify({ message: "No pending reminders", slots: slotsToRemind }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[SMS Reminders] Found ${bookings.length} bookings to remind.`);

    let sentCount = 0;
    let failCount = 0;

    for (const booking of bookings) {
      // Build Arabic SMS message with city-specific details
      const cityInfo = CITY_DETAILS[booking.city] || {
        address: booking.city,
        mapLink: "",
        phone: "",
      };

      const message = `اهلا ${booking.full_name}\n\nنود تذكيركم بجلسة التدريب اليوم في باي شيب PIESHIP\nاليوم: ${booking.booking_date}\nالوقت: ${booking.time_slot}\nالموقع: ${cityInfo.address}\n${cityInfo.mapLink}\nللاستفسارات: ${cityInfo.phone}`;

      // Clean phone number - ensure it starts with 966
      let phoneNumber = booking.mobile.replace(/\s+/g, "").replace(/^0+/, "");
      if (!phoneNumber.startsWith("966")) {
        phoneNumber = "966" + phoneNumber;
      }

      try {
        // Send SMS via Mora API
        const smsData = new URLSearchParams({
          api_key: moraApiKey,
          username: moraUsername,
          message: message,
          sender: moraSender,
          numbers: phoneNumber,
          return: "json",
        });

        console.log(`[SMS Reminders] Sending SMS to ${phoneNumber} for ${booking.city} at ${booking.time_slot}`);

        const smsResponse = await fetch("https://mora-sa.com/api/v1/sendsms", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: smsData,
        });

        const smsResult = await smsResponse.json();
        console.log(`[SMS Reminders] Mora API response for ${phoneNumber}:`, JSON.stringify(smsResult));

        // Mark as sent regardless of API response to avoid re-sending
        // (You can refine this to only mark on success if needed)
        const { error: updateError } = await supabase
          .from("bookings")
          .update({ sms_sent: true })
          .eq("id", booking.id);

        if (updateError) {
          console.error(`[SMS Reminders] Failed to update sms_sent for booking ${booking.id}:`, updateError);
          failCount++;
        } else {
          sentCount++;
          console.log(`[SMS Reminders] Successfully sent and marked booking ${booking.id}`);
        }
      } catch (smsError) {
        console.error(`[SMS Reminders] Error sending SMS to ${phoneNumber}:`, smsError);
        failCount++;
      }
    }

    const summary = {
      message: "SMS reminders processed",
      date: todaySaudi,
      saudiTime: saudiTimeStr,
      totalBookings: bookings.length,
      sent: sentCount,
      failed: failCount,
    };

    console.log("[SMS Reminders] Summary:", JSON.stringify(summary));

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[SMS Reminders] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
