
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: one booking per mobile per date
ALTER TABLE public.bookings ADD CONSTRAINT bookings_mobile_date_unique UNIQUE (mobile, booking_date);

-- Index for fast slot count queries
CREATE INDEX idx_bookings_slot_lookup ON public.bookings (city, booking_date, time_slot);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth in this app)
CREATE POLICY "Allow public inserts"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous reads (for counting slots)
CREATE POLICY "Allow public reads"
  ON public.bookings
  FOR SELECT
  USING (true);
