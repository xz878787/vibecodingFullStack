import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { getDivinationRecords, deleteDivinationRecord } from '../services/divinationService';
import { getLuckConfig } from '../data/divinations';

// 主题关键词映射（用于自动分类）
const TOPIC_KEYWORDS = {
  '事业': ['事业', '工作', '职场', '升职', '加薪', '跳槽', '创业', '项目', '公司', '老板', '同事'],
  '感情': ['感情', '爱情', '恋爱', '婚姻', '结婚', '伴侣', '男友', '女友', '爱人', '表白', '分手', '复合'],
  '学业': ['学业', '学习', '考试', '考研', '高考', '成绩', '学校', '专业', '毕业', '论文'],
  '健康': ['健康', '身体', '疾病', '医院', '体检', '康复', '养生', '疲劳', '睡眠', '饮食'],
  '财运': ['财运', '赚钱', '投资', '理财', '股票', '生意', '收入', '财富', '发财'],
  '人际': ['人际关系', '朋友', '社交', '人脉', '沟通', '相处', '矛盾'],
  '家庭': ['家庭', '父母', '孩子', '亲情', '家人', '婆媳', '亲子'],
  '出行': ['出行', '旅行', '出差', '旅游', '远方', '回家']
};

// 吉凶关键词映射
const LUCK_KEYWORDS = {
  '吉': ['好', '吉', '喜', '顺', '成', '胜', '佳', '利', '兴', '旺', '福', '禄', '贵', '祥', '瑞', '泰', '亨', '通', '达', '盈', '丰', '裕', '乐', '安', '宁', '康', '寿', '美', '良', '优', '强', '进', '升', '高', '荣', '华', '誉', '名', '功', '成', '得', '获', '益', '增', '长'],
  '凶': ['凶', '祸', '灾', '难', '病', '死', '败', '失', '损', '亏', '悲', '伤', '痛', '苦', '忧', '愁', '烦', '恼', '惊', '恐', '危', '险', '困', '厄', '穷', '贫', '贱', '辱', '耻', '羞', '惭', '愧', '悔', '憾', '忧', '患', '乱', '争', '战', '杀', '亡', '破', '碎', '断', '绝', '离', '散', '孤', '独', '弃', '厌', '憎', '恨', '怒', '怨', '仇'],
  '中': ['平', '常', '稳', '静', '缓', '和', '淡', '平', '凡', '普', '通', '一', '般', '适', '可', '宜', '应', '顺', '随', '自', '然', '安', '守', '持', '保', '维', '续']
};

// 从文本中提取关键词
const extractKeywords = (text, count = 5) => {
  const words = text.replace(/[，。！？、；：""''（）《》【】]/g, ' ').split(/\s+/);
  const wordCount = {};
  
  // 过滤短词和常见词
  const commonWords = ['的', '是', '在', '有', '和', '了', '他', '她', '它', '我', '你', '他', '这', '那', '能', '会', '可以', '要', '不要', '想', '说', '做', '看', '听', '去', '来', '上', '下', '大', '小', '多', '少', '好', '坏', '中', '不', '也', '都', '很', '更', '最', '又', '再', '还', '比', '被', '把', '让', '给', '对', '对于', '关于', '因为', '所以', '但是', '然而', '如果', '要是', '只要', '只有', '才', '就', '却', '而', '而且', '并且', '或者', '还是', '不是', '就是', '虽然', '尽管', '即使', '假如', '倘若', '万一', '一旦', '既然', '要是'];
  
  words.forEach(word => {
    if (word.length >= 2 && !commonWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(item => item[0]);
};

// 判断主题分类
const detectTopic = (text) => {
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return topic;
    }
  }
  return '其他';
};

// 判断吉凶倾向
const detectLuckLevel = (text) => {
  let goodCount = 0;
  let badCount = 0;
  
  LUCK_KEYWORDS['吉'].forEach(keyword => {
    if (text.includes(keyword)) goodCount++;
  });
  
  LUCK_KEYWORDS['凶'].forEach(keyword => {
    if (text.includes(keyword)) badCount++;
  });
  
  if (goodCount > badCount + 1) return '吉';
  if (badCount > goodCount + 1) return '凶';
  return '平';
};

// 判断是否为AI占卜记录
const isAIRecord = (record) => {
  // AI记录的result是纯文本字符串，不是JSON
  // 或者有type字段为'ai'
  if (record.type === 'ai') return true;
  if (record.type === 'traditional') return false;
  
  // 根据result字段判断
  try {
    JSON.parse(record.result);
    return false; // 传统占卜，result是JSON
  } catch {
    return true; // AI占卜，result是纯文本
  }
};

const History = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null); // 展开全文弹窗
  const [showFullContent, setShowFullContent] = useState(false);

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
          // AI占卜记录，result是纯文本
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

  // 打开全文弹窗
  const openFullContent = (record) => {
    setSelectedRecord(record);
    setShowFullContent(true);
  };

  // 关闭全文弹窗
  const closeFullContent = () => {
    setSelectedRecord(null);
    setShowFullContent(false);
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
          const isAI = isAIRecord(record);
          const luckLevel = record.luckLevel || record.luck_level || (isAI ? detectLuckLevel(record.result || '') : '平');
          const config = getLuckConfig(luckLevel);
          
          // AI记录的额外处理
          const topic = isAI ? detectTopic(record.question + (record.result || '')) : null;
          const keywords = isAI ? extractKeywords(record.result || '', 5) : [];
          const aiResult = isAI ? (record.result || '') : '';
          const isTruncated = isAI && aiResult.length > 200;
          const displayResult = isTruncated ? aiResult.substring(0, 200) + '...' : aiResult;

          return (
            <div
              key={record.id}
              className={`paper-bg rounded-lg border-2 border-ink-200 p-6 transition-all duration-300 hover:border-ink-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${isAI ? 'hover:border-vermilion-300' : ''}`}
              onClick={() => isTruncated && openFullContent(record)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{isAI ? '🔮' : (record.symbol || '☰')}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-kai text-lg text-ink-800">
                        {isAI ? '问道 AI' : (record.hexagram || '未命名')}
                      </h3>
                      {/* AI记录显示主题标签 */}
                      {topic && (
                        <span className="px-2 py-0.5 bg-vermilion-100 text-vermilion-600 text-xs font-song rounded">
                          {topic}
                        </span>
                      )}
                    </div>
                    <p className="font-song text-sm text-ink-500">{formatDate(record.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-song ${config.bg} ${config.border} ${config.text} border`}>
                    {luckLevel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record.id);
                    }}
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

              {isAI ? (
                <div>
                  <p className={`font-song text-lg leading-relaxed ${config.text}`}>
                    {displayResult}
                  </p>
                  {isTruncated && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openFullContent(record);
                      }}
                      className="mt-3 text-vermilion-500 font-song text-sm hover:text-vermilion-600 transition-colors flex items-center"
                    >
                      <span>展开查看全文</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                  {/* 关键词标签 */}
                  {keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-ink-100 text-ink-600 text-xs font-song rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className={`font-kai text-lg ${config.text}`}>
                  {record.title || '无标题'}：{record.interpretation || '暂无解释'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 展开全文弹窗 */}
      {showFullContent && selectedRecord && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm p-4"
          onClick={closeFullContent}
        >
          <div 
            className="paper-bg rounded-lg border-2 border-ink-300 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-kai text-xl text-ink-900">卦象详情</h3>
              <button
                onClick={closeFullContent}
                className="text-ink-400 hover:text-ink-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mb-4" />
            
            <div className="mb-4">
              <p className="text-ink-500 font-song text-sm">问：</p>
              <p className="text-ink-800 font-song">{selectedRecord.question}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-ink-500 font-song text-sm mb-2">答：</p>
              <p className="text-ink-800 font-kai text-lg leading-relaxed whitespace-pre-line">
                {selectedRecord.result}
              </p>
            </div>
            
            {/* AI记录显示额外信息 */}
            {isAIRecord(selectedRecord) && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-ink-200">
                <div>
                  <span className="text-ink-500 font-song text-xs">主题：</span>
                  <span className="text-ink-700 font-song">
                    {detectTopic(selectedRecord.question + (selectedRecord.result || ''))}
                  </span>
                </div>
                <div>
                  <span className="text-ink-500 font-song text-xs">吉凶：</span>
                  <span className={`font-song ${getLuckConfig(detectLuckLevel(selectedRecord.result || '')).text}`}>
                    {detectLuckLevel(selectedRecord.result || '')}
                  </span>
                </div>
                <div>
                  <span className="text-ink-500 font-song text-xs">关键词：</span>
                  <span className="text-ink-700 font-song">
                    {extractKeywords(selectedRecord.result || '', 5).join('、')}
                  </span>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={closeFullContent}
                className="px-6 py-2 bg-ink-800 text-paper-50 rounded-lg font-song hover:bg-ink-700 transition-colors"
              >
                收起
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
