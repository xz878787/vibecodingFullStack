import { useEffect, useState } from 'react';

const divinationResults = [
  {
    title: '吉',
    titleColor: 'text-vermilion-500',
    content: '此签乃大吉之兆，所求之事，顺遂如意。君子自强不息，厚德载物，自有天助。凡事谨慎而行，必获善果。',
    interpretation: '天时地利人和，诸事皆宜。',
  },
  {
    title: '凶',
    titleColor: 'text-ink-700',
    content: '此签有警示之意，需谨慎行事。塞翁失马，焉知非福？困境之中，藏有机缘。静心自省，方能转危为安。',
    interpretation: '宜守不宜进，静待时机。',
  },
  {
    title: '平',
    titleColor: 'text-ink-600',
    content: '此签乃平和之象，无大喜大悲。中庸之道，实为上策。行稳致远，厚积薄发，自有收获之时。',
    interpretation: '稳步前行，顺其自然。',
  },
  {
    title: '吉',
    titleColor: 'text-vermilion-500',
    content: '上上之签，紫气东来。贵人相助，事半功倍。心存善念，广结良缘，福泽绵长。',
    interpretation: '把握良机，乘势而上。',
  },
  {
    title: '悔',
    titleColor: 'text-ink-600',
    content: '此签提醒反思过往。往者不可谏，来者犹可追。知错能改，善莫大焉。调整方向，重新出发。',
    interpretation: '反思自省，改过迁善。',
  },
  {
    title: '利',
    titleColor: 'text-vermilion-500',
    content: '此签主财利亨通。君子爱财，取之有道。诚信为本，和气生财，财富自会滚滚而来。',
    interpretation: '财源广进，把握商机。',
  },
];

const DivinationResult = ({ question, onReset }) => {
  const [result, setResult] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * divinationResults.length);
    setResult(divinationResults[randomIndex]);
    
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [question]);

  if (!result) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="scroll-decoration paper-bg rounded-lg p-8 border-2 border-ink-300 shadow-xl">
        <div className="text-center mb-8">
          <div className={`inline-block text-8xl font-kai ${result.titleColor} mb-4 animate-float`}>
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
            <div className="flex items-center justify-center space-x-3">
              <span className="text-ink-500 font-song text-sm">解曰：</span>
              <span className="text-vermilion-500 font-kai text-lg">{result.interpretation}</span>
            </div>
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
