

## Add 30-Seat Limit Per Time Slot with Supabase

### Overview
Set up a Supabase database to track bookings and enforce a maximum of **30 seats per time slot** (per city, per date, per time). Users will see remaining seat counts when selecting a time slot, and fully booked slots will be disabled.

### Step 1: Connect Supabase (Lovable Cloud)
- Enable Lovable Cloud to spin up a Supabase backend automatically (no external account needed)

### Step 2: Create Database Table
Create a `bookings` table to store each confirmed booking:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| city | text | City key (riyadh, jeddah, etc.) |
| booking_date | date | The date of the training session |
| time_slot | text | Time slot (e.g., "14:00", "17:00") |
| full_name | text | Driver's full name |
| mobile | text | Driver's mobile number |
| created_at | timestamptz | Auto-generated timestamp |

- Add a unique constraint on `(mobile, booking_date)` to prevent duplicate bookings on the same day
- Enable Row Level Security (RLS) with public insert and select policies (no auth system in this app)

### Step 3: Update Booking Service (`src/services/bookingService.ts`)
Replace the current stub functions with real Supabase queries:
- `getSlotBookingCount(city, date, time)` -- count bookings for a specific slot
- `isSlotFull(city, date, time)` -- check if count >= 30
- `getRemainingSlots(city, date, time)` -- return 30 minus current count
- `createBooking(city, date, time, fullName, mobile)` -- insert a booking record
- Define `MAX_SLOTS_PER_SESSION = 30` as a constant for easy future adjustment

### Step 4: Update BookingCity Component (`src/components/BookingCity.tsx`)
- Fetch booking counts when a date is selected
- Show remaining seats next to each time slot (e.g., "5:00 PM - 25 seats remaining")
- Disable time slots that have reached 30 bookings
- Show a "full" badge on sold-out slots ("مكتمل" in Arabic / "Full" in English)

### Step 5: Update BookingForm Component (`src/components/BookingForm.tsx`)
- On form submission, insert the booking into the Supabase `bookings` table (in addition to existing Netlify Forms submission)
- Re-check slot availability before inserting to handle race conditions (show error if slot filled up)
- Update the `timeSlots` object to match current slots (14:00 for Riyadh, 17:00 for others)

### Technical Details

**Supabase Setup:**
- Use Lovable Cloud to provision the backend
- Create the bookings table via migration
- RLS policies: allow anonymous inserts and selects

**Booking Count Queries:**
- Use Supabase client to count bookings matching city + date + time_slot
- Use React Query for caching and automatic refetching when date changes

**Race Condition Handling:**
- Before inserting a booking in the form, re-check the count
- If the slot became full, show an error and redirect back to date selection

**BookingForm timeSlots Fix:**
- The `timeSlots` object in BookingForm still has old values; will be updated to 14:00 and 17:00 only

