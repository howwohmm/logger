
-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('ideas', 'codewords', 'user_sessions');

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can read codewords" ON public.codewords;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ideas;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.ideas;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.ideas;
DROP POLICY IF EXISTS "Authenticated users can update ideas" ON public.ideas;
DROP POLICY IF EXISTS "Anyone can read ideas" ON public.ideas;
DROP POLICY IF EXISTS "Authenticated users can insert ideas" ON public.ideas;
DROP POLICY IF EXISTS "Only admins can delete ideas" ON public.ideas;

-- Add a role column to track user permissions (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ideas' 
                   AND column_name = 'contributor_role') THEN
        ALTER TABLE public.ideas ADD COLUMN contributor_role TEXT;
    END IF;
END $$;

-- Update existing ideas to set contributor role based on name
UPDATE public.ideas 
SET contributor_role = CASE 
  WHEN LOWER(name) = 'varsha' OR LOWER(original_name) = 'varsha' THEN 'admin'
  WHEN LOWER(name) = 'ohm' OR LOWER(original_name) = 'ohm' THEN 'admin'
  ELSE 'contributor'
END
WHERE contributor_role IS NULL;

-- Create proper RLS policy for codewords (read-only for authentication)
CREATE POLICY "Allow reading codewords for authentication" 
  ON public.codewords 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create proper RLS policies for ideas
CREATE POLICY "Anyone can read ideas" 
  ON public.ideas 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ideas" 
  ON public.ideas 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ideas" 
  ON public.ideas 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Only Varsha and Ohm can delete ideas
CREATE POLICY "Only admins can delete ideas" 
  ON public.ideas 
  FOR DELETE 
  TO authenticated
  USING (contributor_role = 'admin');

-- Create session tracking table for activity monitoring
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_sessions' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policy for user sessions
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;
CREATE POLICY "Users can manage their own sessions" 
  ON public.user_sessions 
  FOR ALL 
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
