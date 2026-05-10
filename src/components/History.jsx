import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { getDivinationRecords, deleteDivinationRecord } from '../services/divinationService';
import { getLuckConfig } from '../data/divinations';

const History = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadRecords();
    }
  }, [user]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getDivinationRecords();
      
      const parsedRecords = data.map(record => {
        try {
          const result = typeof record.result === 'string' ? JSON.parse(record.result) : record.result;
          return {
            ...record,
            ...result
          };
        } catch (e) {
          console.error('解析记录失败:', e);
          return record;
        }
      });
      
      setRecords(parsedRecords || []);
    } catch (err) {
      setError('加载记录失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    try {
      await deleteDivinationRecord(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      alert('删除失败');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-500 font-song text-lg">请先登录查看历史记录</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-ink-300 border-t-vermilion-500 rounded-full mx-auto" />
        <p className="text-ink-500 font-song mt-4">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-song">{error}</p>
        <button
          onClick={loadRecords}
          className="mt-4 px-6 py-2 bg-ink-800 text-paper-50 rounded-lg font-song hover:bg-ink-700"
        >
          重试
        </button>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📜</div>
        <p className="text-ink-500 font-song text-lg">暂无占卜记录</p>
        <p className="text-ink-400 font-song text-sm mt-2">开始你的第一次占卜吧！</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-kai text-ink-900 mb-2">占卜记录</h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto" />
      </div>

      <div className="space-y-4">
        {records.map((record) => {
          const luckLevel = record.luckLevel || record.luck_level || '平';
          const config = getLuckConfig(luckLevel);
          
          return (
            <div
              key={record.id}
              className="paper-bg rounded-lg border-2 border-ink-200 p-6 hover:border-ink-300 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{record.symbol || '☰'}</span>
                  <div>
                    <h3 className="font-kai text-lg text-ink-800">{record.hexagram || '未命名'}</h3>
                    <p className="font-song text-sm text-ink-500">{formatDate(record.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-song ${config.bg} ${config.border} ${config.text} border`}>
                    {luckLevel}
                  </span>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-ink-400 hover:text-red-500 transition-colors p-1"
                    title="删除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-ink-500 font-song text-sm mb-2">
                「 {record.question} 」
              </div>

              <p className={`font-kai text-lg ${config.text}`}>
                {record.title || '无标题'}：{record.interpretation || '暂无解释'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
