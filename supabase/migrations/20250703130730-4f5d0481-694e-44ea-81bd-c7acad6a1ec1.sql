
-- Create comments table for ideas
CREATE TABLE public.idea_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  commenter_name text NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create comments table for transactions
CREATE TABLE public.transaction_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  commenter_name text NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create comments table for subscriptions
CREATE TABLE public.subscription_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  commenter_name text NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for idea comments (all users can view/manage all comments)
CREATE POLICY "Anyone can view idea comments" 
ON public.idea_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create idea comments" 
ON public.idea_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update idea comments" 
ON public.idea_comments 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete idea comments" 
ON public.idea_comments 
FOR DELETE 
USING (true);

-- Create policies for transaction comments (all users can view/manage all comments)
CREATE POLICY "Anyone can view transaction comments" 
ON public.transaction_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create transaction comments" 
ON public.transaction_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update transaction comments" 
ON public.transaction_comments 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete transaction comments" 
ON public.transaction_comments 
FOR DELETE 
USING (true);

-- Create policies for subscription comments (all users can view/manage all comments)
CREATE POLICY "Anyone can view subscription comments" 
ON public.subscription_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create subscription comments" 
ON public.subscription_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update subscription comments" 
ON public.subscription_comments 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete subscription comments" 
ON public.subscription_comments 
FOR DELETE 
USING (true);
