
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MessageCircle, Trash2, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatDate } from '@/lib/utils';
import SubscriptionModal from './SubscriptionModal';
import SubscriptionCommentsModal from './SubscriptionCommentsModal';
import type { Subscription } from '@/hooks/useSubscriptions';

const SubscriptionsTab = () => {
  const { subscriptions, loading, addSubscription, deleteSubscription } = useSubscriptions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentsSubscription, setCommentsSubscription] = useState<Subscription | null>(null);

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.frequency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSubscription = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(id);
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const handleAddSubscription = async (data: any) => {
    await addSubscription(data);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-light mb-2">Subscriptions</h2>
          <p className="text-muted-foreground">Manage your recurring payments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} strokeWidth={1} />
          Add Subscription
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subscriptions List */}
      <div className="grid gap-4">
        {filteredSubscriptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock size={48} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No subscriptions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first subscription'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus size={16} strokeWidth={1} className="mr-2" />
                  Add Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredSubscriptions.map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Clock size={18} strokeWidth={1} />
                      {subscription.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} strokeWidth={1} className="text-muted-foreground" />
                        <span className="font-medium">${subscription.cost.toFixed(2)}</span>
                      </div>
                      {subscription.frequency && (
                        <Badge variant="secondary">{subscription.frequency}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommentsSubscription(subscription)}
                      className="text-muted-foreground hover:text-blue-600"
                      title="View Comments"
                    >
                      <MessageCircle size={16} strokeWidth={1} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                      className="text-muted-foreground hover:text-red-600"
                      title="Delete Subscription"
                    >
                      <Trash2 size={16} strokeWidth={1} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {subscription.next_due && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} strokeWidth={1} className="text-muted-foreground" />
                      <span>Next due: {formatDate(subscription.next_due)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={14} strokeWidth={1} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Added: {formatDate(subscription.created_at)}</span>
                  </div>
                </div>

                {subscription.used_by && subscription.used_by.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Users size={14} strokeWidth={1} />
                      Used by:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {subscription.used_by.map((person, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {subscription.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-1">Notes:</div>
                    <div className="text-sm">{subscription.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubscription}
      />

      <SubscriptionCommentsModal
        subscription={commentsSubscription}
        isOpen={!!commentsSubscription}
        onClose={() => setCommentsSubscription(null)}
      />
    </div>
  );
};

export default SubscriptionsTab;
