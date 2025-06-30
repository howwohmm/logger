
import { useState } from 'react';
import { Plus, BarChart3, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import IdeaModal from '../components/IdeaModal';
import DarkModeToggle from '../components/DarkModeToggle';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header with user info and controls */}
        <header className="absolute top-4 right-4 flex items-center gap-3">
          {user?.user_metadata?.name && (
            <span className="text-sm text-gray-500 font-light">
              Welcome, {user.user_metadata.name}
            </span>
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
          <div className="text-center animate-fade-slide-in">
            <h1 className="text-2xl font-light mb-8 text-gray-700 dark:text-gray-500">Artgonic</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="btn-primary inline-flex items-center gap-2 text-lg"
              >
                <Plus size={20} strokeWidth={1} />
                Log Idea
              </button>
              
              <Link 
                to="/dashboard"
                className="inline-flex items-center gap-2 text-lg px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150 ease-in-out font-light"
              >
                <BarChart3 size={20} strokeWidth={1} />
                View Dashboard
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center p-4 text-sm text-gray-500 font-light">
          Creator Idea Logger
        </footer>

        {/* Modal */}
        <IdeaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </ProtectedRoute>
  );
};

export default Index;
