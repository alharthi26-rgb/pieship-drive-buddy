

## Add Admin Dashboard at /admindrivers

### Overview
Create an admin page to view all registered bookings, accessible at `/admindrivers`.

### Implementation

**1. Create Admin Page (`src/pages/Admin.tsx`)**
- Table showing all bookings: Name, Mobile, City, Date, Time Slot, Registration Time
- Dropdown filter for city (Riyadh, Jeddah, Dammam, Makkah)
- Date picker filter
- Total count of registrations displayed
- Sorted by newest first

**2. Add Route in `src/App.tsx`**
- Add `/admindrivers` route pointing to the Admin page
- Not linked from the main booking site -- only accessible if you know the URL

**3. Features**
- Filter by city and date
- Show booking counts per slot
- Responsive table layout
- Auto-refreshing data using React Query

### How to Access
Once built, go to: **yoursite.com/admindrivers**

### Technical Details
- Queries the existing `bookings` table using the Supabase client
- Read-only page (uses the existing public SELECT RLS policy)
- Built with existing UI components (Table, Card, Select)
- No database changes needed

