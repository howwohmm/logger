
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '@/components/DarkModeToggle';

const Auth = () => {
  const [authMode, setAuthMode] = useState<'codeword' | 'email'>('codeword');
  const [isSignUp, setIsSignUp] = useState(false);
  const [codeword, setCodeword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithCodeword, signIn, signUp } = useAuth();
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
        navigate('/');
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        if (!name.trim()) {
          toast({
            title: "Error",
            description: "Name is required for sign up",
            variant: "destructive",
          });
          return;
        }
        result = await signUp(email, password, name.trim());
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: isSignUp ? "Sign up successful!" : "Welcome back!",
          description: isSignUp 
            ? "Please check your email to verify your account" 
            : "You're now logged in",
        });
        if (!isSignUp) {
          navigate('/');
        }
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
              Sign in with your codeword or email
            </p>
          </div>

          {/* Auth mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setAuthMode('codeword')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-light transition-all ${
                authMode === 'codeword'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Codeword
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-light transition-all ${
                authMode === 'email'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Email
            </button>
          </div>
          
          {authMode === 'codeword' ? (
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
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isSignUp && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
                  disabled={isLoading}
                  required
                />
              )}
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
                disabled={isLoading}
                required
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
                disabled={isLoading}
                required
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-light"
                  disabled={isLoading}
                  type="button"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          )}
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
