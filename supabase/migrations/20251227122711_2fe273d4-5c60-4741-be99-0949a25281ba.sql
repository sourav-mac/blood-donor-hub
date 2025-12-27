-- Create donors table for Blood Bank Management System
CREATE TABLE public.donors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now - no auth required)
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read donors
CREATE POLICY "Anyone can view donors" 
ON public.donors 
FOR SELECT 
USING (true);

-- Allow anyone to insert donors
CREATE POLICY "Anyone can add donors" 
ON public.donors 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update donors
CREATE POLICY "Anyone can update donors" 
ON public.donors 
FOR UPDATE 
USING (true);

-- Allow anyone to delete donors
CREATE POLICY "Anyone can delete donors" 
ON public.donors 
FOR DELETE 
USING (true);