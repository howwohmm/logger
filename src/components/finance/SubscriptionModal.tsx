import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contributors = ['ohm', 'niggendra', 'rainbow', 'tears', 'coffee', 'sunday', 'ex'];

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { addSubscription } = useSubscriptions();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    frequency: 'monthly',
    used_by: [] as string[],
    next_due: '',
    notes: '',
    receipt_url: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addSubscription({
        name: formData.name,
        cost: Number(formData.cost),
        frequency: formData.frequency,
        used_by: formData.used_by.length > 0 ? formData.used_by : undefined,
        next_due: formData.next_due || undefined,
        notes: formData.notes || undefined,
        receipt_url: formData.receipt_url || undefined
      });

      toast({
        title: "Subscription added",
        description: "Your subscription has been recorded",
      });

      // Reset form
      setFormData({
        name: '',
        cost: '',
        frequency: 'monthly',
        used_by: [],
        next_due: '',
        notes: '',
        receipt_url: ''
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUsedBy = (contributor: string) => {
    setFormData(prev => ({
      ...prev,
      used_by: prev.used_by.includes(contributor)
        ? prev.used_by.filter(c => c !== contributor)
        : [...prev.used_by, contributor]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Subscription</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Netflix, Adobe, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="cost">Cost (₹)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Used By</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {contributors.map(contributor => (
                <button
                  key={contributor}
                  type="button"
                  onClick={() => toggleUsedBy(contributor)}
                  className={`px-3 py-1 text-sm rounded border transition-colors ${
                    formData.used_by.includes(contributor)
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
            <Label htmlFor="next_due">Next Due Date</Label>
            <Input
              id="next_due"
              type="date"
              value={formData.next_due}
              onChange={(e) => setFormData(prev => ({ ...prev, next_due: e.target.value }))}
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
              {loading ? 'Adding...' : 'Add Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;