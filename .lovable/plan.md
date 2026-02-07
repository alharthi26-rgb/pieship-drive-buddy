

## SMS Reminder System -- 5 Hours Before Booking

### Overview
Send an automated SMS reminder to each booked driver 5 hours before their scheduled time slot. Since bookings are in Saudi time (UTC+3), the reminder trigger times will be calculated accordingly.

### Reminder Timing
Based on the existing time slots:

| City     | Time Slot | Saudi Time | Reminder at (Saudi) | Reminder at (UTC) |
|----------|-----------|------------|---------------------|---------------------|
| Jeddah   | 12:00     | 12:00 PM   | 7:00 AM             | 04:00 UTC           |
| Riyadh   | 14:00     | 2:00 PM    | 9:00 AM             | 06:00 UTC           |
| Dammam   | 17:00     | 5:00 PM    | 12:00 PM            | 09:00 UTC           |
| Makkah   | 17:00     | 5:00 PM    | 12:00 PM            | 09:00 UTC           |

### Architecture

The system needs three parts:

**1. Database changes**
- Add an `sms_sent` boolean column (default `false`) to the `bookings` table to track which reminders have been sent, avoiding duplicates.

**2. Backend function: `send-sms-reminders`**
- Runs on a schedule (cron job every 15 minutes)
- Queries bookings where:
  - `booking_date` is today (in Saudi timezone)
  - `time_slot` minus 5 hours is within the current window
  - `sms_sent` is `false`
- Sends an SMS to each matching booking's mobile number via your SMS provider (more-sa)
- Marks `sms_sent = true` after successful send
- Includes logging for debugging

**3. SMS Provider Integration (more-sa)**
- Requires API credentials stored as secrets
- The edge function calls the more-sa API to deliver messages
- Message content: reminder with city, date, and time details (bilingual Arabic/English)

### Blocker: SMS Provider Details Needed

Before implementation, I need:
- The **API documentation URL** or details for more-sa (endpoint, auth method, request format)
- Your **API credentials** (API key, token, etc.) which will be stored securely as backend secrets

Once you provide the API details, I can build and deploy the full solution.

### Files to Create/Edit
- **Database migration**: Add `sms_sent` column to bookings
- **`supabase/functions/send-sms-reminders/index.ts`**: The scheduled function
- **`supabase/config.toml`**: Register the new function
- **Cron job SQL**: Schedule the function to run every 15 minutes

