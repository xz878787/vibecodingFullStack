import { useState, useCallback } from 'react';
import { getRandomDivination } from '../data/divinations';

export const useDivination = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [isDivinating, setIsDivinating] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const divinate = useCallback((userQuestion) => {
    if (!userQuestion.trim()) return;
    
    setQuestion(userQuestion);
    setIsDivinating(true);
    
    setTimeout(() => {
      const divinationResult = getRandomDivination();
      setResult(divinationResult);
      setIsDivinating(false);
      setHasResult(true);
    }, 1500);
  }, []);

  const reset = useCallback(() => {
    setQuestion('');
    setResult(null);
    setHasResult(false);
  }, []);

  return {
    question,
    result,
    isDivinating,
    hasResult,
    divinate,
    reset
  };
};
