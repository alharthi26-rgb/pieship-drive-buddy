
// No appointment limits - all slots are open
export const getSlotBookingCount = (city: string, date: Date, time: string): number => {
  return 0; // Always return 0 since there are no limits
};

export const isSlotFull = (city: string, date: Date, time: string): boolean => {
  return false; // Never full since there are no limits
};

export const getRemainingSlots = (city: string, date: Date, time: string): number => {
  return Infinity; // Unlimited slots available
};
