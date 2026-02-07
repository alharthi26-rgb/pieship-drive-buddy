-- Add sms_sent column to track which reminders have been sent
ALTER TABLE public.bookings ADD COLUMN sms_sent boolean NOT NULL DEFAULT false;