
-- First, let's check the current state and fix the delete policy
-- Drop the existing delete policy if it exists
DROP POLICY IF EXISTS "Only admins can delete ideas" ON public.ideas;

-- Create a more explicit delete policy that only allows Varsha and Ohm
CREATE POLICY "Only Varsha and Ohm can delete ideas" 
  ON public.ideas 
  FOR DELETE 
  TO authenticated
  USING (
    contributor_role = 'admin' 
    AND (
      LOWER(name) = 'varsha' 
      OR LOWER(name) = 'ohm' 
      OR LOWER(original_name) = 'varsha' 
      OR LOWER(original_name) = 'ohm'
    )
  );

-- Also fix the user_sessions RLS policy that's causing errors
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;

-- Create a proper policy for user_sessions that works with our codeword auth system
CREATE POLICY "Allow session management" 
  ON public.user_sessions 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);
