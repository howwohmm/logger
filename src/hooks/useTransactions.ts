import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  contributor: string;
  category?: string;
  description?: string;
  amount: number;
  split_with?: string[];
  tags?: string[];
  notes?: string;
  receipt_url?: string;
  created_at: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    
    setTransactions(prev => [data, ...prev]);
    return data;
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};