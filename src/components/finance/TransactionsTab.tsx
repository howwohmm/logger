import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionModal from './TransactionModal';
import { formatDate } from '@/lib/utils';

const TransactionsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { transactions, loading, deleteTransaction } = useTransactions();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteTransaction(id);
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Transactions</h2>
        <Button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} className="mr-2" />
          New Transaction
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Who</th>
                <th className="text-left p-4 font-medium">Description</th>
                <th className="text-right p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Tags</th>
                <th className="text-center p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    No transactions yet. Create your first one!
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-sm">{formatDate(transaction.created_at)}</td>
                    <td className="p-4 text-sm">{transaction.contributor}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.category && (
                          <div className="text-sm text-muted-foreground">{transaction.category}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">₹{Number(transaction.amount).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {transaction.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} strokeWidth={1} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TransactionsTab;