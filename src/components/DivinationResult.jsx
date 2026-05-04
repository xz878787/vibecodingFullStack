import { useEffect, useState } from 'react';
import { getLuckConfig } from '../data/divinations';

const DivinationResult = ({ question, result, onReset }) => {
  const [showContent, setShowContent] = useState(false);
  const [showLuckBadge, setShowLuckBadge] = useState(false);

  useEffect(() => {
    setShowContent(false);
    setShowLuckBadge(false);
    
    const timer1 = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setShowLuckBadge(true);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [result]);

  if (!result) return null;

  const config = getLuckConfig(result.luckLevel);

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="scroll-decoration paper-bg rounded-lg p-8 md:p-12 border-2 border-ink-300 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-4xl md:text-5xl font-kai text-ink-600 mb-2 tracking-wider">
            {result.symbol}
          </div>
          <div className="text-lg font-song text-ink-500 mb-6">
            {result.hexagram}
          </div>
          
          <div className={`relative inline-block mb-6 ${showLuckBadge ? 'animate-bounce-in' : 'opacity-0 scale-50'}`}>
            <div className={`absolute inset-0 ${config.bg} rounded-full blur-xl opacity-50 scale-110`} />
            
            <div className={`relative px-8 py-4 rounded-full border-4 ${config.border} ${config.bg} shadow-lg ${config.glow}`}>
              <div className={`text-7xl md:text-8xl font-kai ${config.text} ink-text-shadow tracking-wider`}>
                {result.title}
              </div>
            </div>
            
            {config.stars && (
              <>
                <span className="absolute -top-2 -right-2 text-2xl animate-pulse">★</span>
                <span className="absolute -bottom-1 -left-3 text-xl animate-pulse" style={{ animationDelay: '0.3s' }}>☆</span>
                <span className="absolute top-1/2 -right-10 text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>★</span>
              </>
            )}
          </div>
          
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto" />
        </div>

        <div className={`space-y-6 ${showContent ? 'fade-in-text' : 'opacity-0'}`}>
          <div className="text-center text-ink-500 font-song text-sm mb-4">
            「 {question} 」
          </div>

          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-vermilion-400 via-vermilion-300 to-vermilion-200 rounded-full" />
            <div className="pl-6">
              <p className="text-ink-800 font-song text-lg md:text-xl leading-loose whitespace-pre-line">
                {result.content}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-200">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-ink-400 font-song text-sm">【解曰】</span>
              </div>
              <p className={`text-lg md:text-xl font-kai leading-relaxed px-4 ${config.text}`}>
                {result.interpretation}
              </p>
            </div>
          </div>

          <div className={`mt-6 text-center transition-all duration-700 ${showLuckBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className={`inline-block px-6 py-2 rounded-full text-base font-kai ${config.bg} ${config.border} ${config.text} border-2 shadow-md`}>
              {result.luckLevel}之卦
            </span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onReset}
            className="group relative px-10 py-4 font-song text-lg rounded-lg overflow-hidden
                       bg-gradient-to-r from-ink-800 to-ink-900 text-paper-50
                       hover:from-ink-700 hover:to-ink-800
                       transition-all duration-300 shadow-lg hover:shadow-xl
                       border border-ink-600"
          >
            <span className="relative z-10">再卜一卦</span>
            <div className="absolute inset-0 bg-gradient-to-r from-vermilion-500/20 to-vermilion-600/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivinationResult;
