import { useState, useEffect } from 'react';
import { PenLine, CreditCard, LogOut, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import DarkModeToggle from '@/components/DarkModeToggle';

interface ToolStats {
  ideasCount: number;
  monthlyTotal: number;
}

const Hub = () => {
  const [stats, setStats] = useState<ToolStats>({ ideasCount: 0, monthlyTotal: 0 });
  const [loading, setLoading] = useState(true);
  const { user, signOut, updateActivity } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch ideas count
        const { count: ideasCount } = await supabase
          .from('ideas')
          .select('*', { count: 'exact', head: true });

        // Fetch monthly spending from finance tracker
        const { data: monthlySpend } = await supabase.rpc('this_month_spend');

        setStats({
          ideasCount: ideasCount || 0,
          monthlyTotal: Number(monthlySpend) || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleUserInteraction = () => {
    updateActivity();
  };

  const tools = [
    {
      id: 'ideas',
      name: 'Idea Logger',
      icon: PenLine,
      path: '/',
      stat: loading ? 'Loading...' : `${stats.ideasCount} ideas logged`,
      description: 'Capture brainstorms, reels, sketches'
    },
    {
      id: 'finance',
      name: 'Finance Tracker',
      icon: CreditCard,
      path: '/finance',
      stat: loading ? 'Loading...' : `₹${stats.monthlyTotal.toLocaleString()} spent this month`,
      description: 'Track expenses & subscriptions'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col" onClick={handleUserInteraction}>
        {/* Header with user info and controls */}
        <header className="absolute top-4 right-4 flex items-center gap-3">
          {user?.user_metadata?.name && (
            <div className="flex items-center gap-2">
              <Clock size={14} strokeWidth={1} className="text-gray-500" />
              <span className="text-sm text-gray-500 font-light">
                Welcome, {user.user_metadata.name}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-all duration-150 ease-in-out"
            title="Logout"
          >
            <LogOut size={16} strokeWidth={1} />
          </button>
          <DarkModeToggle />
        </header>

        {/* Main content - centered */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl animate-fade-slide-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2 text-gray-700 dark:text-gray-500">
                Art Gonic
              </h1>
              <p className="text-sm text-gray-500 font-light">
                Internal Tools Ecosystem
              </p>
            </div>
            
            {/* Tool Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="group p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-500 dark:hover:border-gray-500 transition-all duration-150 ease-in-out bg-card hover:bg-accent/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-muted group-hover:bg-background transition-colors">
                        <IconComponent size={20} strokeWidth={1} className="text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 font-light">
                          {tool.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-light">
                          {tool.stat}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center p-4 text-sm text-gray-500 font-light">
          Creator Tools • Auto-logout after 5min inactivity
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default Hub;