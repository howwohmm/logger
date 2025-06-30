
-- Create a table for storing ideas
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea TEXT NOT NULL,
  name TEXT NULL, -- For "Claim It" entries
  category TEXT NULL, -- For "Claim It" entries  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on created_at for better query performance
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);

-- Create an index on category for filtering
CREATE INDEX idx_ideas_category ON public.ideas(category) WHERE category IS NOT NULL;

-- Enable Row Level Security (RLS) - making it public for now since this is a simple idea logger
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read and write ideas
-- This makes it publicly accessible which fits your simple use case
CREATE POLICY "Anyone can view ideas" 
  ON public.ideas 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create ideas" 
  ON public.ideas 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update ideas" 
  ON public.ideas 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete ideas" 
  ON public.ideas 
  FOR DELETE 
  USING (true);
