

## Add Refresh Button to Admin Dashboard

### Overview
Add a manual "Refresh" button to the admin dashboard header area so you can instantly reload the data without waiting for the 15-second auto-refresh cycle.

### Changes

**File: `src/pages/Admin.tsx`**

1. Import `RefreshCw` icon from `lucide-react`
2. Get the `refetch` functions from both `useQuery` hooks (bookings and summary)
3. Add a "Refresh" button next to the page title ("Registrations Dashboard") that:
   - Shows a `RefreshCw` icon with "Refresh" text
   - Calls both `refetch` functions when clicked
   - Spins the icon briefly while data is loading (using `isFetching` state)
4. Style it as a subtle outline button aligned to the right of the header

### Result
A refresh button in the top-right area of the dashboard that manually triggers a data reload for whichever tab you're on, with a spinning animation while loading.
