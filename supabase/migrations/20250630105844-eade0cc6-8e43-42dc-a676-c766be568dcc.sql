
-- Add status column to ideas table with default value
ALTER TABLE public.ideas 
ADD COLUMN status TEXT DEFAULT 'proposed';

-- Create an index on status for better filtering performance
CREATE INDEX idx_ideas_status ON public.ideas(status);

-- Update existing rows to have the default status
UPDATE public.ideas 
SET status = 'proposed' 
WHERE status IS NULL;
