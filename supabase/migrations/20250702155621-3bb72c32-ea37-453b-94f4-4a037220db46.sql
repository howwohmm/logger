-- Create transactions table
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contributor text NOT NULL,
  category text,
  description text,
  amount numeric NOT NULL,
  split_with text[],
  tags text[],
  notes text,
  receipt_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  cost numeric NOT NULL,
  frequency text CHECK (frequency IN ('monthly', 'yearly')),
  used_by text[],
  next_due date,
  receipt_url text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions (all users can view/manage all data)
CREATE POLICY "Anyone can view transactions" 
ON public.transactions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update transactions" 
ON public.transactions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete transactions" 
ON public.transactions 
FOR DELETE 
USING (true);

-- Create policies for subscriptions (all users can view/manage all data)
CREATE POLICY "Anyone can view subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete subscriptions" 
ON public.subscriptions 
FOR DELETE 
USING (true);

-- Create RPC function for this month's spending
CREATE OR REPLACE FUNCTION public.this_month_spend()
RETURNS numeric AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());
$$ LANGUAGE SQL STABLE;