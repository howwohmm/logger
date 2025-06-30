
-- Create a table to store the codewords for the 7 contributors
CREATE TABLE public.codewords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codeword TEXT NOT NULL UNIQUE,
  contributor_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the 7 contributors with their codewords
INSERT INTO public.codewords (codeword, contributor_name) VALUES
  ('zen', 'Om'),
  ('tears', 'Keerthi'),
  ('ex', 'Shan'),
  ('rainbow', 'Varsha'),
  ('niggendra', 'Vishal'),
  ('coffee', 'Harrison'),
  ('sunday', 'Sharika');

-- Enable RLS on codewords table (though it will be publicly readable for authentication)
ALTER TABLE public.codewords ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read codewords for authentication
CREATE POLICY "Anyone can read codewords" 
  ON public.codewords 
  FOR SELECT 
  TO anon, authenticated
  USING (true);
