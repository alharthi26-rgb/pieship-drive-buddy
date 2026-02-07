

## Update Supervisor Details, Mobile Numbers, Addresses, and Time Slots

Based on the table you provided, here are all the changes that need to be made across **two files** (`BookingCity.tsx` and `BookingConfirmation.tsx`):

### Changes Summary

| City | Field | Current Value | New Value |
|------|-------|--------------|-----------|
| Riyadh | Supervisor Name | Abdulrahman | عبدالرحمن |
| Riyadh | Mobile | 0558551076 | 966558551076 |
| Riyadh | Time Slots | 4:00 PM, 7:00 PM | **2:00 PM only** |
| Jeddah | Mobile | +966573551003 | 966573551003 |
| Jeddah | Time Slots | 5:00 PM, 6:00 PM | **5:00 PM only** |
| Dammam | Mobile | 0510029651 | 966510029651 |
| Dammam | Time Slots | 4:00 PM, 5:00 PM, 6:00 PM | **5:00 PM only** |
| Makkah | Mobile | +966573542070 | 966573542070 |
| Makkah | Address | مكة المكرمة | **مكة المكرمة - حي البحيرات** |
| Makkah | Time Slots | 4:00 PM, 5:00 PM, 6:00 PM | **5:00 PM only** |

Additionally, the **Riyadh Maps URL** in the confirmation page still has the old link and will be updated to match the new one.

### Files to Update

1. **`src/components/BookingCity.tsx`** - Update cityData (supervisor names, mobiles, Makkah address) and timeSlots (reduce to single slot per city)
2. **`src/components/BookingConfirmation.tsx`** - Update the same cityData and timeSlots to stay in sync

### Technical Details

- **BookingCity.tsx**: Update the `cityData` object (supervisor details, Makkah address) and the `timeSlots` object (Riyadh gets 2:00 PM, all others get 5:00 PM only)
- **BookingConfirmation.tsx**: Update the matching `cityData` object and `timeSlots` lookup (add 14:00 for 2:00 PM display)
- All mobile numbers will use the international format without the `+` prefix (e.g., `966558551076`)
- The WhatsApp link logic in the confirmation page will also be updated since mobile numbers are now already in international format

