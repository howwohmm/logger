import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionModal from './SubscriptionModal';
import { formatDate } from '@/lib/utils';

const SubscriptionsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subscriptions, loading, deleteSubscription } = useSubscriptions();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      await deleteSubscription(id);
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Subscriptions</h2>
        <Button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} className="mr-2" />
          New Subscription
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-right p-4 font-medium">Cost</th>
                <th className="text-left p-4 font-medium">Cycle</th>
                <th className="text-left p-4 font-medium">Users</th>
                <th className="text-left p-4 font-medium">Next Due</th>
                <th className="text-center p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    No subscriptions yet. Create your first one!
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{subscription.name}</td>
                    <td className="p-4 text-right font-medium">₹{Number(subscription.cost).toLocaleString()}</td>
                    <td className="p-4 capitalize">{subscription.frequency}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {subscription.used_by?.map((user, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {subscription.next_due ? formatDate(subscription.next_due) : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                        title="Delete subscription"
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

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SubscriptionsTab;