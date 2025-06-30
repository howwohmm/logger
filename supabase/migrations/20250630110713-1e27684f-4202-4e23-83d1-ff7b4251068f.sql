
-- Add original_name column to store the user's original input
ALTER TABLE public.ideas 
ADD COLUMN original_name TEXT;

-- Update existing rows to copy current name to original_name where applicable
UPDATE public.ideas 
SET original_name = name 
WHERE name IS NOT NULL;
