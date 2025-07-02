import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  frequency: string;
  used_by?: string[];
  next_due?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select()
      .single();

    if (error) throw error;
    
    setSubscriptions(prev => [data, ...prev]);
    return data;
  };

  const deleteSubscription = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    addSubscription,
    deleteSubscription,
    refetch: fetchSubscriptions
  };
};