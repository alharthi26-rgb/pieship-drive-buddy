import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const MAX_SLOTS_PER_SESSION = 30;

const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getSlotBookingCount = async (
  city: string,
  date: Date,
  time: string
): Promise<number> => {
  const { count, error } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('city', city)
    .eq('booking_date', formatDate(date))
    .eq('time_slot', time);

  if (error) {
    console.error('Error fetching booking count:', error);
    return 0;
  }

  return count ?? 0;
};

export const isSlotFull = async (
  city: string,
  date: Date,
  time: string
): Promise<boolean> => {
  const count = await getSlotBookingCount(city, date, time);
  return count >= MAX_SLOTS_PER_SESSION;
};

export const getRemainingSlots = async (
  city: string,
  date: Date,
  time: string
): Promise<number> => {
  const count = await getSlotBookingCount(city, date, time);
  return Math.max(0, MAX_SLOTS_PER_SESSION - count);
};

export const createBooking = async (
  city: string,
  date: Date,
  time: string,
  fullName: string,
  mobile: string
): Promise<{ success: boolean; error?: string }> => {
  // Re-check availability before inserting (race condition guard)
  const full = await isSlotFull(city, date, time);
  if (full) {
    return { success: false, error: 'slot_full' };
  }

  const { error } = await supabase.from('bookings').insert({
    city,
    booking_date: formatDate(date),
    time_slot: time,
    full_name: fullName,
    mobile,
  });

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation (duplicate mobile + date)
      return { success: false, error: 'duplicate_booking' };
    }
    console.error('Error creating booking:', error);
    return { success: false, error: 'unknown' };
  }

  return { success: true };
};
