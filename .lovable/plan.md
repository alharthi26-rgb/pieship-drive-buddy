

## Change Summary View from 10 Days to 30 Days

### Overview
Extend the booking summary grid from 10 days to 30 days so you can see a full month of upcoming bookings at a glance.

### Changes

**File: `src/pages/Admin.tsx`** -- 6 small text/number updates:

1. **Line 104**: Change comment from `// 10-day summary query` to `// 30-day summary query`
2. **Line 107**: Change `addDays(today, 9)` to `addDays(today, 29)` (end date calculation)
3. **Line 124**: Change comment from `// Build the 10-day date list` to `// Build the 30-day date list`
4. **Line 127**: Change loop `i < 10` to `i < 30` (date list generation)
5. **Line 222**: Change tab label from `"10-Day Summary"` to `"30-Day Summary"`
6. **Lines 379-384**: Update heading text from `"10-Day Booking Summary"` to `"30-Day Booking Summary"`

No other files or database changes needed.
