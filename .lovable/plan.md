

## Add 10-Day Booking Summary View

### Overview
Add a new tab/view to the existing admin dashboard at `/admindrivers` that shows a summary grid of total bookings per date per city for the next 10 days. This gives a quick at-a-glance overview of upcoming capacity usage.

### Layout
The admin page will get **two tabs** at the top:
1. **Registrations** (existing table view, default)
2. **10-Day Summary** (new summary grid)

### Summary View Design

A table/grid with:
- **Rows**: The next 10 days (dates)
- **Columns**: Riyadh, Jeddah, Dammam, Makkah, and a Total column
- Each cell shows the booking count for that city on that date
- Color-coded cells: green for low, yellow for medium, red for near-full/full (based on the 30-seat max)
- A row total at the end of each row

### Technical Details

**File: `src/pages/Admin.tsx`**

1. **Add Tabs component** wrapping the existing content:
   - Use the existing `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`
   - Tab 1: "Registrations" -- contains the current filters and table (unchanged)
   - Tab 2: "10-Day Summary" -- contains the new summary grid

2. **New data query for summary view**:
   - Compute the next 10 days using `addDays` from `date-fns`
   - Query all bookings where `booking_date` is within those 10 days (using `.gte()` and `.lte()`)
   - Group results client-side by date and city to produce counts
   - Auto-refresh every 15 seconds (same as existing query)

3. **Summary grid rendering**:
   - Table with date rows and city columns
   - Each cell: `count / 30` format showing bookings vs capacity
   - Conditional background color based on fill percentage:
     - 0 bookings: neutral/gray
     - 1-15: green tint
     - 16-25: yellow/amber tint  
     - 26-30: red tint
   - Total column summing all cities for each date
   - Footer row summing each city across all 10 days

4. **Imports to add**: `Tabs, TabsList, TabsTrigger, TabsContent` from tabs component, `addDays` already imported in other files

### No Other Changes Needed
- No new files, routes, or database changes
- All within the existing `Admin.tsx` page
- Uses existing UI components and Supabase queries

