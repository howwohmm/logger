import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contributors = ['ohm', 'niggendra', 'rainbow', 'tears', 'coffee', 'sunday', 'ex'];
const categories = ['food', 'travel', 'gear', 'subscription', 'other'];

const TransactionModal = ({ isOpen, onClose }: TransactionModalProps) => {
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    split_with: [] as string[],
    notes: '',
    receipt_url: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await addTransaction({
        contributor: user?.user_metadata?.name || 'Unknown',
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category || undefined,
        split_with: formData.split_with.length > 0 ? formData.split_with : undefined,
        notes: formData.notes || undefined,
        receipt_url: formData.receipt_url || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined
      });

      toast({
        title: "Transaction added",
        description: "Your transaction has been recorded",
      });

      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: '',
        split_with: [],
        notes: '',
        receipt_url: '',
        tags: ''
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSplitWith = (contributor: string) => {
    setFormData(prev => ({
      ...prev,
      split_with: prev.split_with.includes(contributor)
        ? prev.split_with.filter(c => c !== contributor)
        : [...prev.split_with, contributor]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What was this for?"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Split With</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {contributors.map(contributor => (
                <button
                  key={contributor}
                  type="button"
                  onClick={() => toggleSplitWith(contributor)}
                  className={`px-3 py-1 text-sm rounded border transition-colors ${
                    formData.split_with.includes(contributor)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {contributor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="shared, client, big"
            />
          </div>

          <div>
            <Label htmlFor="receipt_url">Receipt URL</Label>
            <Input
              id="receipt_url"
              type="url"
              value={formData.receipt_url}
              onChange={(e) => setFormData(prev => ({ ...prev, receipt_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;