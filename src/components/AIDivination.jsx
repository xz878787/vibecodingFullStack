import { useState } from 'react';
import { divinateWithAI } from '../services/aiService';
import { saveDivinationRecord } from '../services/divinationService';

const AIDivination = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDivinate = async () => {
    if (!question.trim()) {
      setError('请输入您要占卜的问题');
      return;
    }

    setError('');
    setResult(null);
    setSaveSuccess(false);
    setIsLoading(true);

    try {
      // 调用AI占卜
      const response = await divinateWithAI(question);
      if (response.success) {
        setResult(response.result);
        
        // 保存到数据库（占卜类型标记为 "ai"）
        try {
          await saveDivinationRecord({
            question: question.trim(),
            result: response.result,
            type: 'ai'
          });
          setSaveSuccess(true);
          console.log('AI占卜记录已保存');
        } catch (saveErr) {
          console.warn('保存记录失败:', saveErr);
          // 保存失败不影响占卜结果展示
        }
      } else {
        setError(response.error || '卦象紊乱，请稍后再试');
      }
    } catch (err) {
      console.error('AI 占卜错误:', err);
      setError('卦象紊乱，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setResult(null);
    setError('');
    setSaveSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 输入区域 */}
      <div className="paper-bg rounded-lg border-2 border-ink-300 p-6 shadow-lg">
        <h3 className="text-xl font-kai text-ink-900 text-center mb-6">
          问道 AI
        </h3>
        
        <div className="mb-4">
          <label className="block text-ink-600 font-song text-sm mb-2">
            心中所问
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="请输入您想要占卜的问题..."
            className="w-full px-4 py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                     font-song text-ink-800 placeholder-ink-400 resize-none
                     focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                     transition-all duration-300"
            rows={4}
            maxLength={200}
          />
          <div className="text-right text-ink-400 text-xs mt-1">
            {question.length}/200
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm font-song">
            {error}
          </div>
        )}

        <button
          onClick={handleDivinate}
          disabled={isLoading}
          className={`w-full py-3 font-kai text-lg rounded-lg transition-all duration-300 ink-button
                     ${isLoading 
                       ? 'bg-ink-200 text-ink-400 cursor-not-allowed' 
                       : 'bg-vermilion-600 text-paper-50 hover:bg-vermilion-500'
                     }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>卜算中...</span>
            </span>
          ) : (
            '起卦问卜'
          )}
        </button>
      </div>

      {/* 结果展示区域 */}
      {result && (
        <div className="mt-8 paper-bg rounded-lg border-2 border-vermilion-300 p-6 shadow-lg fade-in-text">
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-vermilion-400 flex items-center justify-center mx-auto mb-4">
              <span className="text-vermilion-500 font-kai text-2xl">卦</span>
            </div>
            <h3 className="text-xl font-kai text-ink-900">卦象所示</h3>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto mt-2" />
          </div>

          <div className="text-center">
            <p className="text-ink-700 font-song text-lg leading-relaxed whitespace-pre-line">
              {result}
            </p>
          </div>

          {/* 保存成功提示 */}
          {saveSuccess && (
            <div className="mt-4 text-center">
              <span className="text-green-500 font-song text-xs">✓ 记录已保存</span>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-ink-100 text-ink-700 font-song rounded-lg
                       hover:bg-ink-200 transition-all duration-300"
            >
              再占一卦
            </button>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <div className="mt-6 text-center">
        <p className="text-ink-400 font-song text-xs">
          📡 AI 占卜结果仅供参考，命运掌握在自己手中
        </p>
      </div>
    </div>
  );
};

export default AIDivination;
