import { useState } from 'react';

const DivinationForm = ({ onDivinate, isLoading }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    
    onDivinate(question);
    setQuestion('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          <div className="absolute -top-3 left-6 px-4 bg-paper-100">
            <span className="text-ink-600 font-song text-sm">心中所问</span>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="请输入您想占卜的问题..."
            className="w-full h-32 px-6 py-4 bg-paper-50 border-2 border-ink-300 rounded-lg resize-none
                       font-song text-lg text-ink-800 placeholder-ink-400
                       focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                       transition-all duration-300"
            maxLength={200}
          />
          <div className="absolute bottom-3 right-3 text-ink-400 text-sm">
            {question.length}/200
          </div>
        </div>

        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className={`w-full py-4 px-8 font-kai text-xl rounded-lg transition-all duration-300 ink-button
                     ${!question.trim() || isLoading
                       ? 'bg-ink-200 text-ink-400 cursor-not-allowed'
                       : 'bg-ink-900 text-paper-50 hover:bg-ink-800'
                     }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>卜算中...</span>
            </span>
          ) : (
            <span>开始占卜</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default DivinationForm;
