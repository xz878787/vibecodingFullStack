import { useState, useCallback } from 'react';
import { getRandomDivination } from '../data/divinations';
import { saveDivinationRecord } from '../services/divinationService';
import { useAuth } from './useAuth.jsx';

export const useDivination = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [isDivinating, setIsDivinating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { isAuthenticated } = useAuth();

  const divinate = useCallback(async (userQuestion) => {
    if (!userQuestion.trim()) return;
    
    setQuestion(userQuestion);
    setIsDivinating(true);
    setSaveStatus(null);
    
    setTimeout(async () => {
      const divinationResult = getRandomDivination();
      setResult(divinationResult);
      setIsDivinating(false);
      setHasResult(true);

      if (isAuthenticated) {
        try {
          await saveDivinationRecord({
            question: userQuestion,
            result: JSON.stringify(divinationResult)
          });
          setSaveStatus('saved');
        } catch (error) {
          console.error('保存记录失败:', error);
          setSaveStatus('error');
        }
      }
    }, 1500);
  }, [isAuthenticated]);

  const reset = useCallback(() => {
    setQuestion('');
    setResult(null);
    setHasResult(false);
    setSaveStatus(null);
  }, []);

  return {
    question,
    result,
    isDivinating,
    hasResult,
    saveStatus,
    divinate,
    reset
  };
};
