

## Change Jeddah Time Slot to 12:00 PM

### Overview
Update the Jeddah time slot from **5:00 PM (17:00)** to **12:00 PM (12:00)** across all three files that reference it.

### Files to Update

**1. `src/components/BookingCity.tsx`** (line 57)
- Change Jeddah's time slot from `{ time: '17:00', displayAr: '5:00 م', displayEn: '5:00 PM' }` to `{ time: '12:00', displayAr: '12:00 م', displayEn: '12:00 PM' }`

**2. `src/components/BookingForm.tsx`** (lines 37-40)
- Add the new `'12:00'` entry to the `timeSlots` lookup: `{ displayAr: '12:00 م', displayEn: '12:00 PM' }`

**3. `src/components/BookingConfirmation.tsx`** (lines 64-67)
- Add the new `'12:00'` entry to the `timeSlots` lookup: `{ displayAr: '12:00 م', displayEn: '12:00 PM' }`

### Notes
- The `17:00` entry remains in BookingForm and BookingConfirmation since Dammam and Makkah still use it
- Only Jeddah's slot assignment in BookingCity changes from 17:00 to 12:00
- No database changes needed -- the `time_slot` column stores free text so `'12:00'` works automatically

