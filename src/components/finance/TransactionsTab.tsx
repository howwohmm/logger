
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MessageCircle, Trash2, Edit, Calendar, User, DollarSign, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { formatDate } from '@/lib/utils';
import TransactionModal from './TransactionModal';
import TransactionCommentsModal from './TransactionCommentsModal';
import type { Transaction } from '@/hooks/useTransactions';

const TransactionsTab = () => {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentsTransaction, setCommentsTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.contributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-light mb-2">Transactions</h2>
          <p className="text-muted-foreground">Track your expenses and income</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} strokeWidth={1} />
          Add Transaction
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Transactions List */}
      <div className="grid gap-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign size={48} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first transaction'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus size={16} strokeWidth={1} className="mr-2" />
                  Add Transaction
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <DollarSign size={18} strokeWidth={1} />
                      ${transaction.amount.toFixed(2)}
                    </CardTitle>
                    {transaction.description && (
                      <p className="text-muted-foreground mt-1">{transaction.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommentsTransaction(transaction)}
                      className="text-muted-foreground hover:text-blue-600"
                      title="View Comments"
                    >
                      <MessageCircle size={16} strokeWidth={1} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-muted-foreground hover:text-red-600"
                      title="Delete Transaction"
                    >
                      <Trash2 size={16} strokeWidth={1} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={14} strokeWidth={1} className="text-muted-foreground" />
                    <span className="font-medium">{transaction.contributor}</span>
                  </div>
                  
                  {transaction.category && (
                    <div className="flex items-center gap-2">
                      <Tag size={14} strokeWidth={1} className="text-muted-foreground" />
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={14} strokeWidth={1} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{formatDate(transaction.created_at)}</span>
                  </div>
                </div>

                {transaction.split_with && transaction.split_with.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Split with:</div>
                    <div className="flex flex-wrap gap-1">
                      {transaction.split_with.map((person, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {transaction.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-1">Notes:</div>
                    <div className="text-sm">{transaction.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <TransactionCommentsModal
        transaction={commentsTransaction}
        isOpen={!!commentsTransaction}
        onClose={() => setCommentsTransaction(null)}
      />
    </div>
  );
};

export default TransactionsTab;
