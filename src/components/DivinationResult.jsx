import { useEffect, useState } from 'react';
import { getLuckColor } from '../data/divinations';

const DivinationResult = ({ question, result, onReset }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [result]);

  if (!result) return null;

  const luckColor = getLuckColor(result.luckLevel);

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="scroll-decoration paper-bg rounded-lg p-8 border-2 border-ink-300 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-4xl font-kai text-ink-600 mb-2">
            {result.symbol}
          </div>
          <div className="text-lg font-song text-ink-500 mb-4">
            {result.hexagram}
          </div>
          <div className={`inline-block text-6xl font-kai ${luckColor} mb-4 animate-float`}>
            {result.title}
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-ink-400 to-transparent mx-auto" />
        </div>

        <div className={`space-y-6 ${showContent ? 'fade-in-text' : 'opacity-0'}`}>
          <div className="text-center text-ink-500 font-song text-sm mb-4">
            「 {question} 」
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-vermilion-300 rounded-full" />
            <div className="pl-6">
              <p className="text-ink-800 font-song text-lg leading-relaxed whitespace-pre-line">
                {result.content}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-200">
            <div className="flex items-start justify-center space-x-3">
              <span className="text-ink-500 font-song text-sm mt-1">解曰：</span>
              <p className="text-vermilion-500 font-kai text-lg leading-relaxed">
                {result.interpretation}
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-song ${
              luckColor === 'text-vermilion-500' || luckColor === 'text-red-600' 
                ? 'bg-vermilion-50' 
                : 'bg-ink-50'
            }`}>
              {result.luckLevel}
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 border-2 border-ink-300 text-ink-600 font-song rounded-lg
                       hover:bg-ink-50 hover:border-ink-400 transition-all duration-300"
          >
            再卜一卦
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivinationResult;
