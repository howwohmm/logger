import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SummaryStats {
  monthlySpend: number;
  contributorTotals: { [key: string]: number };
  subscriptionsBurn: number;
  categoryBreakdown: { [key: string]: number };
}

const SummaryTab = () => {
  const [stats, setStats] = useState<SummaryStats>({
    monthlySpend: 0,
    contributorTotals: {},
    subscriptionsBurn: 0,
    categoryBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSummaryStats();
  }, []);

  const fetchSummaryStats = async () => {
    try {
      // Get monthly spend
      const { data: monthlySpend } = await supabase.rpc('this_month_spend');

      // Get contributor totals
      const { data: transactions } = await supabase
        .from('transactions')
        .select('contributor, amount, category');

      // Get subscriptions for burn calculation
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('cost, frequency');

      // Calculate contributor totals
      const contributorTotals: { [key: string]: number } = {};
      const categoryBreakdown: { [key: string]: number } = {};

      transactions?.forEach(transaction => {
        contributorTotals[transaction.contributor] = 
          (contributorTotals[transaction.contributor] || 0) + Number(transaction.amount);
        
        if (transaction.category) {
          categoryBreakdown[transaction.category] = 
            (categoryBreakdown[transaction.category] || 0) + Number(transaction.amount);
        }
      });

      // Calculate subscription burn (monthly equivalent)
      let subscriptionsBurn = 0;
      subscriptions?.forEach(sub => {
        const cost = Number(sub.cost);
        if (sub.frequency === 'monthly') {
          subscriptionsBurn += cost;
        } else if (sub.frequency === 'yearly') {
          subscriptionsBurn += cost / 12;
        }
      });

      setStats({
        monthlySpend: Number(monthlySpend) || 0,
        contributorTotals,
        subscriptionsBurn,
        categoryBreakdown
      });
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      toast({
        title: "Error",
        description: "Failed to load summary statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      // Create CSV content
      let csvContent = "Type,Date,Name/Description,Amount,Contributor,Category,Notes\n";
      
      transactions?.forEach(t => {
        csvContent += `Transaction,${t.created_at},${t.description},${t.amount},${t.contributor},${t.category || ''},${t.notes || ''}\n`;
      });

      subscriptions?.forEach(s => {
        csvContent += `Subscription,${s.created_at},${s.name},${s.cost},,${s.frequency},${s.notes || ''}\n`;
      });

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: "Finance data exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export finance data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading summary...</div>
      </div>
    );
  }

  const maxCategoryAmount = Math.max(...Object.values(stats.categoryBreakdown));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Summary</h2>
        <Button onClick={exportCSV} variant="outline">
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-border rounded-lg">
          <div className="text-sm text-muted-foreground">This Month</div>
          <div className="text-2xl font-medium">₹{stats.monthlySpend.toLocaleString()}</div>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <div className="text-sm text-muted-foreground">Monthly Burn</div>
          <div className="text-2xl font-medium">₹{Math.round(stats.subscriptionsBurn).toLocaleString()}</div>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <div className="text-sm text-muted-foreground">Active Subscriptions</div>
          <div className="text-2xl font-medium">{Object.keys(stats.subscriptionsBurn).length}</div>
        </div>
      </div>

      {/* Contributor Breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Spending by Contributor</h3>
        <div className="space-y-2">
          {Object.entries(stats.contributorTotals)
            .sort(([,a], [,b]) => b - a)
            .map(([contributor, amount]) => (
              <div key={contributor} className="flex justify-between items-center p-3 border border-border rounded">
                <span className="font-medium">{contributor}</span>
                <span className="text-muted-foreground">₹{amount.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Category Breakdown Chart */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Spending by Category</h3>
          <div className="space-y-2">
            {Object.entries(stats.categoryBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{category}</span>
                    <span className="text-muted-foreground">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-foreground h-2 rounded-full" 
                      style={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;