
import { useState } from 'react';
import { validateCodeword, setCurrentUser } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import DarkModeToggle from '@/components/DarkModeToggle';

const Login = () => {
  const [codeword, setCodeword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userName = validateCodeword(codeword);
    
    if (userName) {
      setCurrentUser(userName);
      toast({
        title: `Welcome back, ${userName}!`,
        description: "You're now logged in to Art Gonic",
      });
      window.location.href = '/';
    } else {
      toast({
        title: "Invalid codeword",
        description: "Please check your codeword and try again",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
            <h1 className="text-2xl font-light mb-2 text-gray-700 dark:text-gray-500">Art Gonic</h1>
            <p className="text-sm text-gray-500 font-light">Enter your codeword to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={codeword}
              onChange={(e) => setCodeword(e.target.value)}
              placeholder="Enter codeword"
              className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
              disabled={isLoading}
              autoFocus
            />
            
            <button
              type="submit"
              disabled={isLoading || !codeword.trim()}
              className="w-full btn-primary"
            >
              {isLoading ? 'Verifying...' : 'Enter'}
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

export default Login;
