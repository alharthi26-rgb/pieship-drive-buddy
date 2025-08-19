
// Mock booking data - in a real app, this would come from a database
const mockBookings: Record<string, number> = {
  'riyadh-2024-12-20-16:00': 18,
  'riyadh-2024-12-20-19:00': 5,
  'jeddah-2024-12-21-16:00': 20,
  'jeddah-2024-12-21-17:00': 15,
  'dammam-2024-12-22-18:00': 3,
  'makkah-2024-12-23-16:00': 20,
};

export const MAX_APPOINTMENTS_PER_SLOT = 20;

export const getSlotBookingCount = (city: string, date: Date, time: string): number => {
  const dateStr = date.toISOString().split('T')[0];
  const key = `${city}-${dateStr}-${time}`;
  return mockBookings[key] || 0;
};

export const isSlotFull = (city: string, date: Date, time: string): boolean => {
  return getSlotBookingCount(city, date, time) >= MAX_APPOINTMENTS_PER_SLOT;
};

export const getRemainingSlots = (city: string, date: Date, time: string): number => {
  return MAX_APPOINTMENTS_PER_SLOT - getSlotBookingCount(city, date, time);
};
