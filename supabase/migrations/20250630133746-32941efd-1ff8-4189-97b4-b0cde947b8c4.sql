
-- Enable Row Level Security on the ideas table
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for the ideas table
-- Allow authenticated users to view all ideas
CREATE POLICY "Authenticated users can view ideas" 
  ON public.ideas 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow authenticated users to insert their own ideas
CREATE POLICY "Authenticated users can create ideas" 
  ON public.ideas 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow authenticated users to update ideas (for status changes and upvotes)
CREATE POLICY "Authenticated users can update ideas" 
  ON public.ideas 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Allow authenticated users to delete ideas (for admin purposes)
CREATE POLICY "Authenticated users can delete ideas" 
  ON public.ideas 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create a profiles table to store user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email));
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the ideas table to use user_id instead of name for better security
ALTER TABLE public.ideas ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create an index for better performance
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
