import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth.jsx';
import Navbar from './components/Navbar';
import DivinationForm from './components/DivinationForm';
import DivinationResult from './components/DivinationResult';
import History from './components/History';
import AuthModal from './components/AuthModal';
import { useDivination } from './hooks/useDivination';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { question, result, isDivinating, hasResult, saveStatus, divinate, reset } = useDivination();

  const renderContent = () => {
    switch (currentPage) {
      case 'history':
        return <History />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-3xl font-kai text-ink-900 mb-4">设置</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto mb-8" />
            <p className="text-ink-500 font-song">功能开发中...</p>
          </div>
        );
      default:
        return (
          <>
            <div className="text-center mb-12 mt-4 sm:mt-0">
              <h2 className="text-4xl font-kai text-ink-900 mb-4 ink-text-shadow">
                墨韵占卜
              </h2>
              <p className="text-ink-500 font-song text-lg">
                心有所问，卜以解惑
              </p>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto mt-6" />
            </div>

            {!hasResult ? (
              <DivinationForm onDivinate={divinate} isLoading={isDivinating} />
            ) : (
              <DivinationResult 
                question={question} 
                result={result} 
                saveStatus={saveStatus}
                onReset={reset} 
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen paper-bg">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onOpenAuth={() => setShowAuthModal(true)}
      />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {renderContent()}

          <footer className="mt-16 text-center text-ink-400 font-song text-sm">
            <p>《周易》有云：君子以自强不息</p>
            <p className="mt-2 opacity-60">© 2024 墨韵占卜 · 古韵新声</p>
          </footer>
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
