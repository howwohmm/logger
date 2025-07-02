import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/ProtectedRoute';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import TransactionsTab from '@/components/finance/TransactionsTab';
import SubscriptionsTab from '@/components/finance/SubscriptionsTab';
import SummaryTab from '@/components/finance/SummaryTab';

const Finance = () => {
  const { user, signOut, updateActivity } = useAuth();
  const [activeTab, setActiveTab] = useState('transactions');

  const handleUserInteraction = () => {
    updateActivity();
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col" onClick={handleUserInteraction}>
        {/* Header */}
        <header className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/hub"
                className="p-2 hover:bg-muted rounded transition-all duration-150 ease-in-out"
                title="Back to Hub"
              >
                <ArrowLeft size={16} strokeWidth={1} />
              </Link>
              <h1 className="text-lg font-medium">Finance Tracker</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {user?.user_metadata?.name && (
                <span className="text-sm text-muted-foreground font-light">
                  {user.user_metadata.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-muted rounded transition-all duration-150 ease-in-out"
                title="Logout"
              >
                <LogOut size={16} strokeWidth={1} />
              </button>
              <DarkModeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions">
                <TransactionsTab />
              </TabsContent>
              
              <TabsContent value="subscriptions">
                <SubscriptionsTab />
              </TabsContent>
              
              <TabsContent value="summary">
                <SummaryTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Finance;