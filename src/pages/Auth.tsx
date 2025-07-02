
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '@/components/DarkModeToggle';

const Auth = () => {
  const [codeword, setCodeword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithCodeword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCodewordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signInWithCodeword(codeword);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You're now logged in with your codeword",
        });
        navigate('/hub');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with dark mode toggle */}
      <header className="absolute top-4 right-4">
        <DarkModeToggle />
      </header>

      {/* Main content - centered */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-slide-in">
            <h1 className="text-2xl font-light mb-2 text-gray-700 dark:text-gray-500">
              Welcome to Artgonic
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Sign in with your codeword
            </p>
          </div>
          
          <form onSubmit={handleCodewordSubmit} className="space-y-4">
            <input
              type="text"
              value={codeword}
              onChange={(e) => setCodeword(e.target.value)}
              placeholder="Enter your codeword"
              className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
              disabled={isLoading}
              required
            />
            
            <button
              type="submit"
              disabled={isLoading || !codeword.trim()}
              className="w-full btn-primary"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-sm text-gray-500 font-light">
        Creator Idea Logger
      </footer>
    </div>
  );
};

export default Auth;
