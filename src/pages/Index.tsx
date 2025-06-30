import { useState } from 'react';
import { Plus } from 'lucide-react';
import IdeaModal from '../components/IdeaModal';
import DarkModeToggle from '../components/DarkModeToggle';
const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with dark mode toggle */}
      <header className="absolute top-4 right-4">
        <DarkModeToggle />
      </header>

      {/* Main content - centered */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center animate-fade-slide-in">
          <h1 className="text-2xl font-light mb-8 text-gray-700 dark:text-gray-500">Artgonic</h1>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary inline-flex items-center gap-2 text-lg">
            <Plus size={20} strokeWidth={1} />
            Log Idea
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-sm text-gray-500 font-light">
        Creator Idea Logger
      </footer>

      {/* Modal */}
      <IdeaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>;
};
export default Index;