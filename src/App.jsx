import { useState } from 'react';
import Navbar from './components/Navbar';
import DivinationForm from './components/DivinationForm';
import DivinationResult from './components/DivinationResult';

function App() {
  const [question, setQuestion] = useState('');
  const [hasResult, setHasResult] = useState(false);

  const handleDivinate = (userQuestion) => {
    setQuestion(userQuestion);
    setHasResult(true);
  };

  const handleReset = () => {
    setQuestion('');
    setHasResult(false);
  };

  return (
    <div className="min-h-screen paper-bg">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-kai text-ink-900 mb-4 ink-text-shadow">
              墨韵占卜
            </h2>
            <p className="text-ink-500 font-song text-lg">
              心有所问，卜以解惑
            </p>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto mt-6" />
          </div>

          {!hasResult ? (
            <DivinationForm onDivinate={handleDivinate} />
          ) : (
            <DivinationResult question={question} onReset={handleReset} />
          )}

          <footer className="mt-16 text-center text-ink-400 font-song text-sm">
            <p>《周易》有云：君子以自强不息</p>
            <p className="mt-2 opacity-60">© 2024 墨韵占卜 · 古韵新声</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
